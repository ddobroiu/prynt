import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { tools, SYSTEM_PROMPT } from '@/lib/ai-shared';
import { executeTool } from '@/lib/ai-tool-runner';
import { getAuthSession } from '@/lib/auth'; 
import { prisma } from "@/lib/prisma"; // Importăm prisma

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
    let { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ message: "Format invalid." }, { status: 400 });
    }

    const session = await getAuthSession();
    let systemContent = WEB_SYSTEM_PROMPT;
    let identifier = 'web-guest';

    // --- NOU: LOGICĂ DE PRELUARE DATE SALVATE ---
    if (session?.user) {
        identifier = (session.user as any).id || session.user.email || 'web-user';
        
        try {
            // Căutăm userul complet în DB pentru a lua adresa
            const user = await prisma.user.findUnique({
                where: { email: session.user.email! },
                include: {
                    addresses: {
                        take: 1,
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });

            let contextName = user?.name || session.user.name || "";
            let contextEmail = user?.email || "";
            let contextAddress = "";

            if (user?.addresses && user.addresses.length > 0) {
                const a = user.addresses[0];
                contextAddress = `${a.strada_nr}, ${a.localitate}, ${a.judet}`;
            }

            systemContent += `\n\nDATE CLIENT CONECTAT:
            - Nume: ${contextName}
            - Email: ${contextEmail}`;
            
            if (contextAddress) {
                systemContent += `\n- Adresă Livrare Salvată: ${contextAddress}`;
                systemContent += `\n\nINSTRUCȚIUNE: Când clientul vrea să finalizeze o comandă sau cere o ofertă, întreabă-l: "Păstrăm datele de livrare din cont (Email: ${contextEmail}, Adresă: ${contextAddress})?" înainte de a cere altele noi.`;
            } else {
                systemContent += `\n\nINSTRUCȚIUNE: Adresează-te clientului pe nume (${contextName}).`;
            }

        } catch (e) {
            console.warn("Eroare la preluarea datelor user din assistant:", e);
        }
    }
    // ---------------------------------------------

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