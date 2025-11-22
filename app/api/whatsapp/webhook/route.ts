import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from "@/lib/email";
import { tools, SYSTEM_PROMPT } from '@/lib/ai-shared';
import { 
  calculateBannerPrice, 
  calculateBannerVersoPrice,
  calculateFlyerPrice,
  // Asigură-te că imporți și restul funcțiilor necesare din pricing
} from '@/lib/pricing';

// Setările WhatsApp din variabilele de mediu
const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Stocare temporară a conversațiilor (în memorie).
// NOTĂ: Pe Vercel/Serverless, aceasta se resetează. Pentru producție robustă, 
// ar trebui să salvezi mesajele în baza de date (model WhatsAppSession).
const conversations = new Map<string, any[]>();

// --- HELPER: Trimite mesaj pe WhatsApp ---
async function sendWhatsAppMessage(to: string, text: string) {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: "text",
          text: { preview_url: false, body: text }
        })
      }
    );
    const data = await res.json();
    if (!res.ok) console.error("WhatsApp Send Error:", data);
    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

// --- 1. GET: Verificarea Webhook-ului (Cerută de Meta) ---
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      return new NextResponse(challenge, { status: 200 });
    } else {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }
  return new NextResponse("Bad Request", { status: 400 });
}

// --- 2. POST: Primirea mesajelor ---
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verificăm dacă e un mesaj de la WhatsApp
    if (body.object === 'whatsapp_business_account') {
      if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
        
        const messageObj = body.entry[0].changes[0].value.messages[0];
        const from = messageObj.from; // Numărul de telefon al clientului
        const textBody = messageObj.text?.body;

        if (!textBody) return NextResponse.json({ status: 'ignored_no_text' });

        console.log(`Mesaj de la ${from}: ${textBody}`);

        // 1. Gestionare istoric conversație
        let history = conversations.get(from) || [];
        // Păstrăm ultimele 10 mesaje pentru context
        if (history.length > 10) history = history.slice(-10);
        
        const messagesPayload = [
          { role: "system", content: SYSTEM_PROMPT + "\nIMPORTANT: Clientul este pe WhatsApp. Fii concis. Nu folosi tag-uri speciale de Web." },
          ...history,
          { role: "user", content: textBody }
        ];

        // 2. Apel OpenAI
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: messagesPayload as any,
          tools: tools,
          tool_choice: "auto",
          temperature: 0.2,
        });

        const responseMessage = completion.choices[0].message;
        let finalReply = responseMessage.content;

        // 3. Gestionare Tool Calls (Calcule Preț / Creare Comandă)
        if (responseMessage.tool_calls) {
          messagesPayload.push(responseMessage as any); // Adăugăm intenția AI-ului în istoric

          for (const toolCall of responseMessage.tool_calls) {
            // New OpenAI SDK may provide tool call shape with top-level `name` and `arguments`.
            // Older shape (or other variants) used `function.name` and `function.arguments`.
            const rawName = (toolCall as any).name ?? (toolCall as any).function?.name;
            const rawArgs = (toolCall as any).arguments ?? (toolCall as any).function?.arguments ?? '{}';
            const fnName = String(rawName ?? 'unknown_tool');
            let args: any = {};
            try {
              args = typeof rawArgs === 'string' ? JSON.parse(rawArgs) : rawArgs;
            } catch (e) {
              console.warn('Failed to parse toolCall arguments', rawArgs, e);
              args = {};
            }
            let result = "Eroare execuție tool.";

            console.log(`Executare tool: ${fnName}`, args);

            try {
               // --- LOGICA DE CALCUL (Replicată din assistant route) ---
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
               // Fallback pentru restul
               else if (fnName === "calculate_rigid_price" || fnName === "calculate_roll_print_price") {
                   result = JSON.stringify({ pret_total: 100, info: "Preț estimativ (funcție neimplementată complet în codul partajat)" });
               }

               // --- CREARE COMANDĂ ---
               else if (fnName === "create_order") {
                 const { customer_details, items } = args;
                 const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

                 const lastOrder = await prisma.order.findFirst({ orderBy: { orderNo: 'desc' }, select: { orderNo: true } });
                 const nextOrderNo = (lastOrder?.orderNo ?? 1000) + 1;

                 // Încercăm să găsim userul după email SAU telefon
                 let existingUser = await prisma.user.findFirst({
                     where: { 
                        OR: [
                            { email: customer_details.email },
                            { phone: customer_details.phone } // Verificare și după telefon pe WhatsApp
                        ]
                     }
                 });

                 const orderData: any = {
                     orderNo: nextOrderNo,
                     status: "pending_verification",
                     paymentStatus: "pending",
                     paymentMethod: "ramburs",
                     currency: "RON",
                     total: totalAmount,
                     userEmail: customer_details.email || `whatsapp_${from}@prynt.ro`, // Email placeholder dacă lipsește
                     shippingAddress: {
                         name: customer_details.name,
                         phone: customer_details.phone || from,
                         street: customer_details.address,
                         city: customer_details.city,
                         county: customer_details.county,
                         country: "Romania"
                     },
                     billingAddress: {
                         name: customer_details.name,
                         phone: customer_details.phone || from,
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
                         metadata: { details: item.details, source: "WhatsApp Assistant" }
                       }))
                     }
                 };

                 if (existingUser) {
                     orderData.user = { connect: { id: existingUser.id } };
                 }

                 const order = await prisma.order.create({ data: orderData });
                 
                 // Trimite email-uri
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
                result = JSON.stringify({ error: e.message });
            }

            // Adăugăm rezultatul tool-ului în mesaje
            messagesPayload.push({
              tool_call_id: toolCall.id,
              role: "tool",
              name: fnName,
              content: result,
            });
          }

          // Chemăm AI-ul din nou pentru a formula răspunsul final către utilizator
          const finalCompletion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messagesPayload as any,
          });
          
          finalReply = finalCompletion.choices[0].message.content;
        }

        // 4. Trimite răspunsul pe WhatsApp
        if (finalReply) {
            await sendWhatsAppMessage(from, finalReply);
            
            // Actualizează istoricul
            history.push({ role: "user", content: textBody });
            history.push({ role: "assistant", content: finalReply });
            conversations.set(from, history);
        }

        return NextResponse.json({ status: 'success' });
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}