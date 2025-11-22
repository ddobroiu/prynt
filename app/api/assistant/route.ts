import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from "@/lib/email";
import { 
  calculateBannerPrice, 
  calculateBannerVersoPrice, 
  calculatePolipropilenaPrice, 
  calculatePVCForexPrice, 
  calculateAlucobondPrice, 
  calculatePlexiglassPrice, 
  calculateCartonPrice, 
  calculateAutocolantePrice, 
  calculateCanvasPrice, 
  calculatePosterPrice, 
  calculateFlyerPrice, 
  calculatePliantePrice, 
  calculateTapetPrice, 
  // Tipuri
  type PriceInputBanner, 
  type PriceInputBannerVerso, 
  // ... restul tipurilor
} from '@/lib/pricing';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- 1. TOOLS DEFINITION (Rămân neschimbate) ---
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "calculate_banner_price",
      description: "Calculează preț pentru Bannere.",
      parameters: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["frontlit", "verso"] },
          width_cm: { type: "number" },
          height_cm: { type: "number" },
          quantity: { type: "number" },
          material: { type: "string", enum: ["frontlit_440", "frontlit_510"] },
          want_wind_holes: { type: "boolean" },
          want_hem_and_grommets: { type: "boolean" },
          same_graphic: { type: "boolean" }
        },
        required: ["type", "width_cm", "height_cm", "quantity"]
      },
    },
  },
  // ... (Include aici și restul uneltelor: rigid, roll, standard, create_order - exact ca în versiunea anterioară)
  {
    type: "function",
    function: {
      name: "create_order",
      description: "Finalizează comanda. Apelează DOAR cu toate datele (Nume, Tel, Email, Adresă).",
      parameters: {
        type: "object",
        properties: {
          customer_details: {
            type: "object",
            properties: {
              name: { type: "string" },
              phone: { type: "string" },
              email: { type: "string" },
              address: { type: "string" },
              city: { type: "string" },
              county: { type: "string" }
            },
            required: ["name", "phone", "email", "address", "city", "county"]
          },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                quantity: { type: "number" },
                price: { type: "number" },
                details: { type: "string" }
              },
              required: ["title", "quantity", "price"]
            }
          }
        },
        required: ["customer_details", "items"]
      }
    }
  }
];

// --- 2. SYSTEM PROMPT (ACTUALIZAT STRICT) ---
const SYSTEM_PROMPT = `
Ești asistentul de vânzări Prynt.ro.

REGULI PENTRU INTERACȚIUNE (OBLIGATORII):

1. **CÂND CERI SPECIFICAȚII TEHNICE (VARIANTE FIXE)**:
   NU enumera opțiunile în text ("Vreți X sau Y?"). Pune doar întrebarea și generează butoane.
   Folosește tag-ul ||OPTIONS: [...]|| la final.

   HARTĂ OPȚIUNI PRODUSE:
   - **Banner Material**: ||OPTIONS: ["Frontlit 440g (Standard)", "Frontlit 510g (Premium)"]||
   - **Banner Finisaje**: ||OPTIONS: ["Cu Tiv și Capse", "Fără Finisaje (Brut)", "Doar Tiv", "Doar Capse"]||
   - **Banner Găuri Vânt**: ||OPTIONS: ["Da, cu găuri de vânt", "Nu, simplu"]||
   - **Autocolant**: ||OPTIONS: ["Lucios", "Mat", "Transparent"]||
   - **Afișe/Postere**: ||OPTIONS: ["A3", "A2", "A1", "A0", "50x70cm", "70x100cm"]||
   - **Flyere**: ||OPTIONS: ["A6", "A5", "1/3 din A4"]||
   - **Confimare Preț**: ||OPTIONS: ["Adaugă în comandă", "Modifică dimensiunile", "Alt produs"]||

2. **CÂND CERI DIMENSIUNI (INPUT LIBER)**:
   NU genera opțiuni. Clientul trebuie să scrie.
   Exemplu corect: "Ce dimensiuni doriți (lățime x înălțime)?" (Fără tag-uri)

3. **CÂND CERI DATE LIVRARE (STEP BY STEP)**:
   - Pas 1 (Nume/Tel/Email): Fără opțiuni.
   - Pas 2 (Județ): "În ce județ livrăm? ||REQUEST: JUDET||"
   - Pas 3 (Localitate): "Localitatea? ||REQUEST: LOCALITATE||"
   - Pas 4 (Adresa): Fără opțiuni.

REGULI CALCUL:
- Bannere: Implicit 'want_hem_and_grommets: true' dacă nu se specifică "Fără Finisaje".
- Prețurile sunt în RON.

Fii concis. Nu repeta informații inutile.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    const messagesPayload = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
    ];

    // 1. Request către OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messagesPayload as any,
      tools: tools,
      tool_choice: "auto",
      temperature: 0.2, // Temperatură mică pentru a respecta strict regulile
    });

    const responseMessage = completion.choices[0].message;

    // 2. Gestionare Tool Calls
    if (responseMessage.tool_calls) {
      messagesPayload.push(responseMessage as any);

      for (const toolCall of responseMessage.tool_calls) {
        const fnName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        let result = "Eroare";

        try {
            // --- LOGICA DE CALCUL (MAPPING ARGS -> FUNCTIONS) ---
            if (fnName === "calculate_banner_price") {
                // Mapping inteligent din textul butoanelor în valorile interne
                const mat = args.material?.includes("510") ? "frontlit_510" : "frontlit_440";
                
                // Detectare finisaje din text liber sau butoane
                let hem = true;
                if (args.want_hem_and_grommets === false || 
                    JSON.stringify(args).toLowerCase().includes("fără finisaje") || 
                    JSON.stringify(args).toLowerCase().includes("brut")) {
                    hem = false;
                }

                const wind = args.want_wind_holes === true || JSON.stringify(args).toLowerCase().includes("cu găuri");

                const res = calculateBannerPrice({ 
                    width_cm: args.width_cm, 
                    height_cm: args.height_cm, 
                    quantity: args.quantity, 
                    material: mat, 
                    want_wind_holes: wind, 
                    want_hem_and_grommets: hem, 
                    designOption: "upload" 
                });
                
                result = JSON.stringify({ 
                    pret_total: res.finalPrice, 
                    detalii: `Banner ${mat === 'frontlit_510' ? '510g (Premium)' : '440g (Standard)'}, ${args.width_cm}x${args.height_cm}cm` 
                });
            }
            
            // ... (Păstrează aici celelalte blocuri: calculate_rigid_price, create_order, etc. din codul anterior)
            // Asigură-te că incluzi blocul 'create_order' cu fix-ul pentru prisma.product și orderNo.
            
            else if (fnName === "create_order") {
                // LOGICA DE CREARE COMANDĂ (Reutilizată din pasul anterior)
                const { customer_details, items } = args;
                if (!prisma) throw new Error("DB Error");
                
                const fallbackProduct = await prisma.product.findFirst({ select: { id: true, slug: true } });
                if (!fallbackProduct) throw new Error("No products found");

                const lastOrder = await prisma.order.findFirst({ orderBy: { orderNo: 'desc' }, select: { orderNo: true } });
                const nextOrderNo = (lastOrder?.orderNo ?? 1000) + 1;

                const orderData: any = {
                    orderNo: nextOrderNo,
                    status: "pending_verification",
                    paymentStatus: "pending",
                    paymentMethod: "ramburs",
                    currency: "RON",
                    total: items.reduce((acc:any, i:any) => acc + i.price * i.quantity, 0),
                    userEmail: customer_details.email,
                    shippingAddress: {
                        name: customer_details.name,
                        phone: customer_details.phone,
                        street: customer_details.address,
                        city: customer_details.city,
                        county: customer_details.county,
                        country: "Romania"
                    },
                    billingAddress: { // Clone
                        name: customer_details.name,
                        phone: customer_details.phone,
                        street: customer_details.address,
                        city: customer_details.city,
                        county: customer_details.county,
                        country: "Romania"
                    },
                    items: {
                        create: items.map((item: any) => ({
                            productId: fallbackProduct.id,
                            productSlug: fallbackProduct.slug,
                            title: item.title,
                            quantity: item.quantity,
                            price: item.price,
                            width: 0, height: 0,
                            metadata: { details: item.details, source: "AI Chat" }
                        }))
                    }
                };

                const order = await prisma.order.create({ data: orderData });
                
                // Trimitere emailuri
                if (order) {
                    try {
                       if(typeof sendOrderConfirmationEmail === 'function') await sendOrderConfirmationEmail(order);
                       if(typeof sendNewOrderAdminEmail === 'function') await sendNewOrderAdminEmail(order);
                    } catch(e) { console.error(e); }
                }

                result = JSON.stringify({ success: true, orderId: order.id });
            }

        } catch (e: any) {
            console.error("Tool Error:", e);
            result = JSON.stringify({ error: e.message });
        }

        messagesPayload.push({ tool_call_id: toolCall.id, role: "tool", name: fnName, content: result });
      }

      const finalRes = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messagesPayload as any,
      });

      return NextResponse.json({ message: finalRes.choices[0].message.content });
    }

    return NextResponse.json({ message: responseMessage.content });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Eroare server." }, { status: 500 });
  }
}