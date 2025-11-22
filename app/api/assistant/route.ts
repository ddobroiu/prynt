import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from "@/lib/prisma"; // FIX: Am adăugat acoladele { }
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
  calculateFonduriEUPrice,
  // Tipuri
  type PriceInputBanner,
  type PriceInputBannerVerso,
  type PriceInputPolipropilena,
  type PriceInputPVCForex,
  type PriceInputAlucobond,
  type PriceInputPlexiglass,
  type PriceInputCarton,
  type PriceInputAutocolante,
  type PriceInputCanvas,
  type PriceInputAfise,
  type PriceInputFlyer,
  type PriceInputPliante,
  type PriceInputTapet,
  type PriceInputFonduriEU
} from '@/lib/pricing';
import { appendOrder } from '@/lib/orderStore';

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
      description: "Finalizează și salvează comanda în sistem DOAR după ce ai colectat toate datele de la client.",
      parameters: {
        type: "object",
        properties: {
          customer_details: {
            type: "object",
            properties: {
              name: { type: "string", description: "Nume și Prenume client" },
              phone: { type: "string", description: "Număr de telefon valid" },
              email: { type: "string", description: "Adresa de email" },
              address: { type: "string", description: "Strada și numărul" },
              city: { type: "string", description: "Localitatea" },
              county: { type: "string", description: "Județul" }
            },
            required: ["name", "phone", "email", "address", "city", "county"]
          },
          items: {
            type: "array",
            description: "Lista produselor pe care clientul vrea să le cumpere.",
            items: {
              type: "object",
              properties: {
                title: { type: "string", description: "Numele produsului (ex: Banner 200x100)" },
                quantity: { type: "number" },
                price: { type: "number", description: "Prețul per bucată calculat anterior" },
                details: { type: "string", description: "Detalii tehnice (material, finisaje, dimensiuni)" }
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
Ești asistentul virtual de vânzări al tipografiei Prynt.ro.
Ai capacitatea de a calcula prețuri și de a ÎNREGISTRA COMENZI reale.

PROCESUL DE VÂNZARE (URMEAZĂ ACEȘTI PAȘI):
1. **Configurare & Preț**: Află ce vrea clientul și calculează prețul folosind funcțiile de calcul.
   - Pentru Bannere: Implicit "Tiv și Capse" (hem=true).
   - Pentru Materiale: Dacă nu se specifică, folosește standardul.
2. **Confirmare**: Întreabă clientul dacă prețul e ok și dacă vrea să plaseze comanda.
3. **Colectare Date (Esențial)**: Dacă clientul zice "DA", cere datele de livrare:
   - Nume și Prenume
   - Telefon
   - Email (pentru factură)
   - Adresa completă (Stradă, Localitate, Județ)
4. **Finalizare**: După ce ai toate datele, apelează funcția **create_order**.

REGULI:
- NU inventa prețuri. Folosește funcțiile de calcul.
- NU plasa comanda până nu ai toate datele de livrare.
- Oferă butoane (OPTIONS) relevante la finalul mesajelor (ex: Da/Nu, Materiale). NU oferi butoane pentru dimensiuni custom.
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
      temperature: 0.3,
    });

    const responseMessage = completion.choices[0].message;
    if (responseMessage.tool_calls) {
      messagesPayload.push(responseMessage as any);

      for (const toolCall of (responseMessage as any).tool_calls) {
        const fnName = (toolCall as any).function.name;
        const args = JSON.parse((toolCall as any).function.arguments);
        let result = "Eroare execuție";

        try {
            if (fnName === "calculate_banner_price") {
                const hem = args.want_hem_and_grommets !== false; 
                const mat = (args.material && args.material.includes("510")) ? "frontlit_510" : "frontlit_440";
                if(args.type === 'verso') {
                   const res = calculateBannerVersoPrice({ width_cm: args.width_cm, height_cm: args.height_cm, quantity: args.quantity, want_wind_holes: args.want_wind_holes || false, same_graphic: args.same_graphic ?? true, designOption: "upload" });
                   result = JSON.stringify({ pret_total: res.finalPrice, info: "Banner Față-Verso" });
                } else {
                   const res = calculateBannerPrice({ width_cm: args.width_cm, height_cm: args.height_cm, quantity: args.quantity, material: mat, want_wind_holes: args.want_wind_holes || false, want_hem_and_grommets: hem, designOption: "upload" });
                   result = JSON.stringify({ pret_total: res.finalPrice, info: `Banner ${mat}, ${hem ? "cu finisaje" : "fără finisaje"}` });
                }
            }
            else if (fnName === "calculate_rigid_price") {
                let res: any = { finalPrice: 0 };
                const commonOpts = { designOption: "upload" as const };
                if (args.material_type === "plexiglass") res = calculatePlexiglassPrice({ width_cm: args.width_cm, height_cm: args.height_cm, quantity: args.quantity, material: (args.subtype === "transparent") ? "transparent" : "alb", thickness_mm: args.thickness_mm || 3, print_double: args.print_double || false, ...commonOpts });
                else if (args.material_type === "forex") res = calculatePVCForexPrice({ width_cm: args.width_cm, height_cm: args.height_cm, quantity: args.quantity, thickness_mm: args.thickness_mm || 3, ...commonOpts });
                else if (args.material_type === "alucobond") res = calculateAlucobondPrice({ width_cm: args.width_cm, height_cm: args.height_cm, quantity: args.quantity, thickness_mm: args.thickness_mm || 3, color: args.color || "Alb", ...commonOpts });
                else if (args.material_type === "polipropilena") res = calculatePolipropilenaPrice({ width_cm: args.width_cm, height_cm: args.height_cm, quantity: args.quantity, thickness_mm: args.thickness_mm || 3, ...commonOpts });
                else if (args.material_type === "carton") res = calculateCartonPrice({ width_cm: args.width_cm, height_cm: args.height_cm, quantity: args.quantity, material: (args.subtype === "ondulat") ? "ondulat" : "reciclat", ondula: args.subtype === "ondulat" ? "E" : undefined, reciclatBoard: args.subtype !== "ondulat" ? "board10" : undefined, ...commonOpts });
                result = JSON.stringify({ pret_total: res.finalPrice });
            }
            else if (fnName === "calculate_roll_print_price") {
                let res: any = { finalPrice: 0 };
                if (args.product_type === "autocolant") res = calculateAutocolantePrice({ width_cm: args.width_cm, height_cm: args.height_cm, quantity: args.quantity, material: args.material_subtype?.includes("vinyl") ? "vinyl" : "paper_matte", laminated: args.options?.laminated || false, shape_diecut: args.options?.diecut || false, designOption: "upload" });
                else if (args.product_type === "canvas") res = calculateCanvasPrice({ width_cm: args.width_cm, height_cm: args.height_cm, quantity: args.quantity, edge_type: args.canvas_edge || "wrap", designOption: "upload" });
                else if (args.product_type === "tapet") res = calculateTapetPrice({ width_cm: args.width_cm, height_cm: args.height_cm, quantity: args.quantity, want_adhesive: args.options?.adhesive || false, designOption: "upload" });
                result = JSON.stringify({ pret_total: res.finalPrice });
            }
            else if (fnName === "calculate_standard_print_price") {
                 const res = calculateFlyerPrice({ sizeKey: args.size || "A6", quantity: args.quantity, twoSided: args.two_sided ?? true, paperWeightKey: "135", designOption: "upload" });
                 result = JSON.stringify({ pret_total: res.finalPrice });
            }
            else if (fnName === "create_order") {
              const { customer_details, items } = args;
              const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

              const newOrder = {
                paymentType: 'Ramburs',
                address: {
                nume_prenume: customer_details.name,
                email: customer_details.email,
                telefon: customer_details.phone,
                judet: customer_details.county || '',
                localitate: customer_details.city || '',
                strada_nr: customer_details.address || '',
                },
                billing: { tip_factura: 'persoana_fizica', name: customer_details.name },
                items: (items || []).map((it: any) => ({
                name: it.title,
                qty: Number(it.quantity) || 1,
                unit: Number(it.price) || 0,
                total: Number(it.price) * Number(it.quantity) || 0,
                artworkUrl: null,
                metadata: { details: it.details, source: 'AI Assistant Chat' }
                })),
                shippingFee: 0,
                total: totalAmount,
              } as any;

              const created = await appendOrder(newOrder);

              result = JSON.stringify({ success: true, orderId: created.id, orderNo: created.orderNo, message: `Comanda #${created.orderNo} a fost înregistrată cu succes! Veți fi contactat pentru confirmare.` });
            }

        } catch (e: any) {
            console.error("Tool Error:", e);
            result = JSON.stringify({ error: "Eroare la procesare: " + e.message });
        }

        messagesPayload.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: fnName,
          content: result,
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
    console.error("API Error:", error);
    return NextResponse.json({ message: "Eroare server." }, { status: 500 });
  }
}