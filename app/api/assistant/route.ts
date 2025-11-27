import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { tools, SYSTEM_PROMPT } from '@/lib/ai-shared';
import { executeTool } from '@/lib/ai-tool-runner';
import { getAuthSession } from '@/lib/auth'; 
import { prisma } from "@/lib/prisma";

export const runtime = 'nodejs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const WEB_SYSTEM_PROMPT = SYSTEM_PROMPT + `
INSTRUCȚIUNI SPECIFICE WEB:
- Când întrebi detalii tehnice, NU scrie variantele în text. Folosește tag-ul ||OPTIONS: [...]||.
- Pentru Județ folosește tag-ul: ||REQUEST: JUDET||
- Pentru Localitate folosește tag-ul: ||REQUEST: LOCALITATE||
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { messages, pageContext } = body; // ADĂUGAT: pageContext

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ message: "Format invalid." }, { status: 400 });
    }

    const session = await getAuthSession();
    let systemContent = WEB_SYSTEM_PROMPT;
    let identifier = 'web-guest';

    // 1. INJECTARE CONTEXT PAGINĂ CURENTĂ
    if (pageContext) {
        systemContent += `\n\nCONTEXT NAVIGARE CLIENT:
        Clientul se află acum pe pagina: "${pageContext.title || 'Necunoscut'}" (URL: ${pageContext.url || '-'}).
        Dacă clientul întreabă "cât costă" sau cere detalii, referă-te implicit la produsul de pe această pagină.`;
    }

    if (session?.user) {
        identifier = (session.user as any).id || session.user.email || 'web-user';
        
        try {
            // Extragem datele userului + ISTORIC COMENZI (Ultimele 5)
            const user = await prisma.user.findUnique({
                where: { email: session.user.email! },
                include: {
                    addresses: {
                        take: 1,
                        orderBy: { createdAt: 'desc' }
                    },
                    orders: { 
                        take: 5, // ADĂUGAT: Luăm ultimele 5 comenzi pentru istoric
                        orderBy: { createdAt: 'desc' },
                        select: { 
                            orderNo: true, 
                            createdAt: true, 
                            total: true, 
                            status: true,
                            billing: true, // Pentru date facturare
                            items: {
                                select: { name: true, qty: true }
                            }
                        }
                    }
                }
            });

            let contextName = user?.name || session.user.name || "";
            let contextEmail = user?.email || "";
            let contextPhone = user?.phone || ""; 
            let contextAddress = "";
            let contextBilling = "";
            let orderHistoryText = "";

            // Adresa fizică
            if (user?.addresses && user.addresses.length > 0) {
                const a = user.addresses[0];
                contextAddress = `${a.strada_nr}, ${a.localitate}, ${a.judet}`;
            }

            // Procesare comenzi pentru context
            if (user?.orders && user.orders.length > 0) {
                // 1. Date Facturare din ultima comandă
                const lastBill: any = user.orders[0].billing;
                if (lastBill) {
                    if (lastBill.cui) {
                        contextBilling = `Firmă: ${lastBill.name || lastBill.company || lastBill.denumire_companie}, CUI: ${lastBill.cui}`;
                    } else {
                        contextBilling = `Persoană Fizică: ${lastBill.name || contextName}`;
                    }
                }

                // 2. Construire rezumat istoric
                orderHistoryText = user.orders.map(o => {
                    const itemsSummary = o.items.map(i => `${i.qty}x ${i.name}`).join(', ');
                    return `- Comanda #${o.orderNo} din ${new Date(o.createdAt).toLocaleDateString('ro-RO')}: ${itemsSummary} (Total: ${o.total} RON) - Status: ${o.status}`;
                }).join('\n');
            }

            systemContent += `\n\nDATE CLIENT CONECTAT:
            - Nume: ${contextName}
            - Email: ${contextEmail}
            - Telefon: ${contextPhone}`;
            
            if (contextAddress) systemContent += `\n- Adresă Livrare Salvată: ${contextAddress}`;
            if (contextBilling) systemContent += `\n- Date Facturare Salvate: ${contextBilling}`;
            
            if (orderHistoryText) {
                systemContent += `\n\nISTORIC RECENT COMENZI:\n${orderHistoryText}\n(Dacă clientul întreabă de o comandă anterioară, folosește aceste informații)`;
            }

            systemContent += `\n\nINSTRUCȚIUNE:
            Dacă clientul dorește să plaseze o comandă sau o ofertă, întreabă-l politicos dacă dorește să folosească datele salvate de mai sus.
            Nu cere din nou numărul de telefon sau adresa dacă le ai deja aici, doar cere confirmarea lor.`;

        } catch (e) {
            console.warn("Eroare date user:", e);
        }
    }

    const messagesPayload = [
      { role: "system", content: systemContent },
      ...messages
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messagesPayload as any,
      tools: tools,
      tool_choice: "auto",
      temperature: 0.2, 
    });

    const responseMessage = completion.choices[0].message;

    if (responseMessage.tool_calls) {
      messagesPayload.push(responseMessage as any);

      for (const toolCall of responseMessage.tool_calls) {
        const fnName = (toolCall as any).function.name;
        let args = {};
        try { args = JSON.parse((toolCall as any).function.arguments); } catch (e) {}

        const result = await executeTool(fnName, args, { 
            source: 'web', 
            identifier: identifier 
        });

        messagesPayload.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: fnName,
            content: JSON.stringify(result)
        });
      }

      const finalRes = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messagesPayload as any,
      });

      return NextResponse.json({ message: finalRes.choices[0].message.content });
    }

    return NextResponse.json({ message: responseMessage.content });

  } catch (error: any) {
    console.error("Eroare API Assistant:", error);
    return NextResponse.json({ message: "Eroare server." }, { status: 500 });
  }
}