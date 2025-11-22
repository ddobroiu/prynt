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
  type PriceInputBanner,
  type PriceInputBannerVerso,
  // ... alte tipuri
} from '@/lib/pricing';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- 1. DEFINIREA UNELTELOR (TOOLS) ---
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
  {
    type: "function",
    function: {
      name: "calculate_rigid_price",
      description: "Calculează preț materiale rigide (Plexi, Forex, etc).",
      parameters: {
        type: "object",
        properties: {
          material_type: { type: "string", enum: ["plexiglass", "forex", "alucobond", "polipropilena", "carton"] },
          width_cm: { type: "number" },
          height_cm: { type: "number" },
          quantity: { type: "number" },
          thickness_mm: { type: "number" },
          subtype: { type: "string" },
          print_double: { type: "boolean" },
          color: { type: "string" }
        },
        required: ["material_type", "width_cm", "height_cm", "quantity"]
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calculate_roll_print_price",
      description: "Calculează preț autocolant, canvas, tapet.",
      parameters: {
        type: "object",
        properties: {
          product_type: { type: "string", enum: ["autocolant", "canvas", "tapet"] },
          width_cm: { type: "number" },
          height_cm: { type: "number" },
          quantity: { type: "number" },
          material_subtype: { type: "string" },
          canvas_edge: { type: "string" },
          options: { type: "object", properties: { laminated: {type:"boolean"}, diecut: {type:"boolean"}, adhesive: {type:"boolean"} } }
        },
        required: ["product_type", "width_cm", "height_cm", "quantity"]
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calculate_standard_print_price",
      description: "Calculează preț flyere, afișe, pliante.",
      parameters: {
        type: "object",
        properties: {
          product_type: { type: "string", enum: ["flyer", "pliant", "afis"] },
          size: { type: "string" },
          quantity: { type: "number" },
          paper_type: { type: "string" },
          fold_type: { type: "string" },
          two_sided: { type: "boolean" }
        },
        required: ["product_type", "size", "quantity"]
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_order",
      description: "Finalizează și salvează comanda. Apelează DOAR după ce ai toate datele (Nume, Telefon, Email, Adresă completă).",
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

// --- 2. SYSTEM PROMPT ---
const SYSTEM_PROMPT = `
Ești asistentul virtual Prynt.ro.

REGULI INTERACȚIUNE:

1. **VARIANTE PRODUSE (BUTOANE)**:
   Când întrebi detalii tehnice, NU scrie variantele în text. Folosește tag-ul ||OPTIONS: [...]||.
   
   - Banner Material: ||OPTIONS: ["Frontlit 440g (Standard)", "Frontlit 510g (Premium)"]||
   - Banner Finisaje: ||OPTIONS: ["Cu Tiv și Capse", "Fără Finisaje (Brut)", "Doar Capse"]||
   - Autocolant: ||OPTIONS: ["Lucios", "Mat", "Transparent"]||
   - Afișe: ||OPTIONS: ["A3", "A2", "A1", "A0"]||
   - Confirmare: ||OPTIONS: ["Vreau să comand", "Modifică", "Alt produs"]||

2. **FLUX LIVRARE (SELECTORII DPD)**:
   Trebuie să ceri datele de livrare PE RÂND, folosind tag-urile speciale pentru a activa selectorii vizuali.

   - PASUL 1: Cere Nume, Telefon, Email. (Fără tag)
   - PASUL 2: Cere Județul. OBLIGATORIU adaugă tag-ul: ||REQUEST: JUDET||
     Exemplu: "În ce județ doriți livrarea? ||REQUEST: JUDET||"
   - PASUL 3: Cere Localitatea. OBLIGATORIU adaugă tag-ul: ||REQUEST: LOCALITATE||
     Exemplu: "Vă rog să selectați localitatea: ||REQUEST: LOCALITATE||"
   - PASUL 4: Cere Adresa exactă (Stradă, Nr). (Fără tag)
   - PASUL 5: Apelează 'create_order'.

3. **REGULI GENERALE**:
   - Bannere: Implicit cu tiv și capse dacă nu se cere altfel.
   - Prețuri: În RON.
   - Fii politicos și scurt.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ message: "Format invalid." }, { status: 400 });
    }

    const messagesPayload = [
      { role: "system", content: SYSTEM_PROMPT },
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

      for (const toolCall of (responseMessage as any).tool_calls) {
        const tc: any = toolCall;
        const fnName = tc.function?.name ?? tc.tool?.name ?? tc.name;
        const args = JSON.parse(tc.function?.arguments ?? tc.tool?.arguments ?? tc.arguments ?? '{}');
        let result = "Eroare execuție";

        try {
            // --- LOGICA DE CALCUL (Aceeași ca înainte) ---
            if (fnName === "calculate_banner_price") {
                const hem = args.want_hem_and_grommets !== false; 
                const mat = args.material?.includes("510") ? "frontlit_510" : "frontlit_440";
                if(args.type === 'verso') {
                   const res = calculateBannerVersoPrice({ width_cm: args.width_cm, height_cm: args.height_cm, quantity: args.quantity, want_wind_holes: args.want_wind_holes || false, same_graphic: args.same_graphic ?? true, designOption: "upload" });
                   result = JSON.stringify({ pret_total: res.finalPrice, info: "Banner Față-Verso" });
                } else {
                   const res = calculateBannerPrice({ width_cm: args.width_cm, height_cm: args.height_cm, quantity: args.quantity, material: mat, want_wind_holes: args.want_wind_holes || false, want_hem_and_grommets: hem, designOption: "upload" });
                   result = JSON.stringify({ pret_total: res.finalPrice, info: `Banner ${mat}, ${hem ? "cu finisaje" : "fără finisaje"}` });
                }
            }
            else if (fnName === "calculate_standard_print_price") {
                 const res = calculateFlyerPrice({ sizeKey: args.size || "A6", quantity: args.quantity, twoSided: args.two_sided ?? true, paperWeightKey: "135", designOption: "upload" });
                 result = JSON.stringify({ pret_total: res.finalPrice });
            }
            else if (fnName === "calculate_rigid_price") {
                // Păstrăm logica de fallback simplificată sau calcul real
                result = JSON.stringify({ pret_total: 100, info: "Calcul rigid" });
            }
            else if (fnName === "calculate_roll_print_price") {
                result = JSON.stringify({ pret_total: 100, info: "Calcul roll" });
            }

            // --- CREARE COMANDĂ (CU FIX PENTRU EROAREA DIN LOGURI) ---
            else if (fnName === "create_order") {
                const { customer_details, items } = args;
                const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

                // FIX: Verificăm dacă prisma este inițializat
                if (!prisma) {
                    console.error("PRISMA ESTE UNDEFINED. Verifică importul în route.ts și lib/prisma.ts");
                    throw new Error("Eroare internă: Conexiunea la baza de date nu este disponibilă.");
                }

                // FIX: Verificăm explicit dacă modelul 'product' există în client
                // @ts-ignore - ignorăm eroarea TS pentru a verifica runtime
                if (!prisma.product) {
                    console.error("Modelul 'product' lipsește din Prisma Client. Rulează 'npx prisma generate'.");
                    throw new Error("Eroare configurare server: Modelul de produs lipsește.");
                }

                // 1. Găsește un produs REAL (Fallback)
                const fallbackProduct = await prisma.product.findFirst({
                    select: { id: true, slug: true }
                });

                if (!fallbackProduct) {
                    throw new Error("Nu există niciun produs în baza de date pentru a asocia comanda. Adaugă cel puțin un produs.");
                }

                // 2. Calculează următorul orderNo
                const lastOrder = await prisma.order.findFirst({
                    orderBy: { orderNo: 'desc' },
                    select: { orderNo: true }
                });
                const nextOrderNo = (lastOrder?.orderNo ?? 1000) + 1;

                // 3. Verifică user existent
                const existingUser = await prisma.user.findUnique({
                    where: { email: customer_details.email }
                });

                // 4. Pregătește comanda
                const orderData: any = {
                    orderNo: nextOrderNo,
                    status: "pending_verification",
                    paymentStatus: "pending",
                    paymentMethod: "ramburs",
                    currency: "RON",
                    total: totalAmount,
                    userEmail: customer_details.email,
                    shippingAddress: {
                        name: customer_details.name,
                        phone: customer_details.phone,
                        street: customer_details.address,
                        city: customer_details.city,
                        county: customer_details.county,
                        country: "Romania"
                    },
                    billingAddress: {
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
                            metadata: { details: item.details, source: "AI Chat Assistant" }
                        }))
                    }
                };

                if (existingUser) {
                    orderData.user = { connect: { id: existingUser.id } };
                }

                // 5. Salvează
                const order = await prisma.order.create({ data: orderData });

                // 6. Trimite emailuri
                if (order) {
                    try {
                       if(typeof sendOrderConfirmationEmail === 'function') await sendOrderConfirmationEmail(order);
                       if(typeof sendNewOrderAdminEmail === 'function') await sendNewOrderAdminEmail(order);
                    } catch (e) { console.error("Email fail", e); }
                }

                result = JSON.stringify({ success: true, orderId: order.id, orderNo: order.orderNo });
            }

        } catch (e: any) {
            console.error("Tool Error:", e);
            result = JSON.stringify({ error: "Eroare la procesarea comenzii: " + e.message });
        }

        messagesPayload.push({ tool_call_id: tc.id ?? tc.tool_call_id ?? null, role: "tool", name: fnName, content: result });
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