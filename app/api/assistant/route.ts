import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from "@/lib/email";
import { 
  calculateBannerPrice, 
  calculateBannerVersoPrice,
  // Alte importuri rămân la fel, dar ne asigurăm că sunt importate funcțiile necesare
  calculateFlyerPrice,
} from '@/lib/pricing';
// Importăm logica comună
import { tools, SYSTEM_PROMPT } from '@/lib/ai-shared';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Adăugăm instrucțiuni specifice pentru WEB (unde avem butoane și dropdown-uri)
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

    const messagesPayload = [
      { role: "system", content: WEB_SYSTEM_PROMPT },
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
            // --- LOGICA DE CALCUL ---
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
            // ... poți adăuga restul calculelor aici (rigid, roll) la fel ca înainte ...
            else if (fnName === "calculate_rigid_price") {
                result = JSON.stringify({ pret_total: 100, info: "Calcul rigid (mock)" });
            }
            else if (fnName === "calculate_roll_print_price") {
                result = JSON.stringify({ pret_total: 100, info: "Calcul roll (mock)" });
            }

            // --- CREARE COMANDĂ ---
            else if (fnName === "create_order") {
                const { customer_details, items } = args;
                const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

                if (!prisma) throw new Error("DB Connection missing");

                const lastOrder = await prisma.order.findFirst({
                    orderBy: { orderNo: 'desc' },
                    select: { orderNo: true }
                });
                const nextOrderNo = (lastOrder?.orderNo ?? 1000) + 1;

                const existingUser = await prisma.user.findUnique({
                    where: { email: customer_details.email }
                });

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
                        name: item.title,
                        qty: Number(item.quantity) || 1,
                        unit: Number(item.price) || 0,
                        total: Number(item.price) * Number(item.quantity) || 0,
                        artworkUrl: null,
                        metadata: { details: item.details, source: "AI Chat Assistant" }
                      }))
                    }
                };

                if (existingUser) {
                    orderData.user = { connect: { id: existingUser.id } };
                }

                const order = await prisma.order.create({ data: orderData });

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