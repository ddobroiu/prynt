// app/api/whatsapp/webhook/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from "@/lib/email";
import { tools, SYSTEM_PROMPT } from "@/lib/ai-shared";
import {
  calculateBannerPrice,
  calculateBannerVersoPrice,
  calculateFlyerPrice,
  // adaugă aici și alte funcții de pricing dacă le folosești
} from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ============================
//  CONFIG WHATSAPP / META
// ============================

// ⚠️ IMPORTANT:
// - În .env pune META_VERIFY_TOKEN cu EXACT același text ca în Meta → Verify token
//   ex: META_VERIFY_TOKEN=whatsapp_prynt_123
// - În dashboard Meta la Verify token scrii: whatsapp_prynt_123
const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "whatsapp_prynt_123";

// Token-ul permanent pentru API WhatsApp (din Meta → API Setup)
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// ============================
//  OPENAI
// ============================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Stocare temporară conversații (în memorie)
const conversations = new Map<string, any[]>();

// ============================
//  HELPER: Trimite mesaj pe WhatsApp
// ============================
async function sendWhatsAppMessage(to: string, text: string) {
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.error("WHATSAPP_TOKEN sau PHONE_NUMBER_ID lipsă din .env");
    return;
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: "text",
          text: { preview_url: false, body: text },
        }),
      }
    );
    const data = await res.json();
    if (!res.ok) console.error("WhatsApp Send Error:", data);
    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

// ============================
//  1. GET – Verificare Webhook (Meta)
// ============================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    console.log(
      "[WEBHOOK GET] mode=",
      mode,
      " token=",
      token,
      " challenge=",
      challenge
    );

    if (!mode || !token) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    // Meta trimite mode=subscribe și verify_token trebuie să fie IDENTIC cu VERIFY_TOKEN
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ WEBHOOK_VERIFIED cu succes");
      return new NextResponse(challenge ?? "", {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    }

    console.warn("❌ WEBHOOK_VERIFY_FAILED: token sau mode greșit");
    return new NextResponse("Forbidden", { status: 403 });
  } catch (e) {
    console.error("GET Webhook error:", e);
    return new NextResponse("Server Error", { status: 500 });
  }
}

// ============================
//  2. POST – Mesaje primite de la WhatsApp
// ============================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[WEBHOOK POST] BODY:", JSON.stringify(body, null, 2));

    // Verificăm dacă e un eveniment de la whatsapp_business_account
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (messages && messages[0]) {
        const messageObj = messages[0];
        const from = messageObj.from; // numărul clientului
        const textBody = messageObj.text?.body;

        if (!textBody) {
          console.log("Mesaj fără text, ignor.");
          return NextResponse.json({ status: "ignored_no_text" });
        }

        console.log(`📩 Mesaj de la ${from}: ${textBody}`);

        // -------------------------
        // 1. Gestionare istoric
        // -------------------------
        let history = conversations.get(from) || [];
        if (history.length > 10) history = history.slice(-10);

        const messagesPayload = [
          {
            role: "system",
            content:
              SYSTEM_PROMPT +
              "\nIMPORTANT: Clientul este pe WhatsApp. Fii concis. Nu folosi tag-uri speciale de Web.",
          },
          ...history,
          { role: "user", content: textBody },
        ];

        // -------------------------
        // 2. Apel OpenAI (prima rundă, cu tools)
        // -------------------------
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: messagesPayload as any,
          tools: tools,
          tool_choice: "auto",
          temperature: 0.2,
        });

        const responseMessage: any = completion.choices[0].message;
        let finalReply: string | null = responseMessage.content ?? null;

        // -------------------------
        // 3. Tool calls (calcule / comenzi)
// -------------------------
        if (responseMessage.tool_calls) {
          messagesPayload.push(responseMessage);

          for (const toolCall of responseMessage.tool_calls) {
            const rawName =
              (toolCall as any).name ?? (toolCall as any).function?.name;
            const rawArgs =
              (toolCall as any).arguments ??
              (toolCall as any).function?.arguments ??
              "{}";
            const fnName = String(rawName ?? "unknown_tool");

            let args: any = {};
            try {
              args =
                typeof rawArgs === "string" ? JSON.parse(rawArgs) : rawArgs;
            } catch (e) {
              console.warn(
                "Failed to parse toolCall arguments",
                rawArgs,
                e
              );
              args = {};
            }

            let result: any = { error: "Eroare execuție tool." };
            console.log(`🔧 Executare tool: ${fnName}`, args);

            try {
              // --- CALCUL BANNER ---
              if (fnName === "calculate_banner_price") {
                const hem = args.want_hem_and_grommets !== false;
                const mat = args.material?.includes("510")
                  ? "frontlit_510"
                  : "frontlit_440";

                if (args.type === "verso") {
                  const res = calculateBannerVersoPrice({
                    width_cm: args.width_cm,
                    height_cm: args.height_cm,
                    quantity: args.quantity,
                    want_wind_holes: args.want_wind_holes || false,
                    same_graphic: args.same_graphic ?? true,
                    designOption: "upload",
                  });
                  result = {
                    pret_total: res.finalPrice,
                    info: "Banner față-verso",
                  };
                } else {
                  const res = calculateBannerPrice({
                    width_cm: args.width_cm,
                    height_cm: args.height_cm,
                    quantity: args.quantity,
                    material: mat,
                    want_wind_holes: args.want_wind_holes || false,
                    want_hem_and_grommets: hem,
                    designOption: "upload",
                  });
                  result = {
                    pret_total: res.finalPrice,
                    info: `Banner ${mat}, ${
                      hem ? "cu finisaje" : "fără finisaje"
                    }`,
                  };
                }
              }

              // --- CALCUL FLYER / PRINT STANDARD ---
              else if (fnName === "calculate_standard_print_price") {
                const res = calculateFlyerPrice({
                  sizeKey: args.size || "A6",
                  quantity: args.quantity,
                  twoSided: args.two_sided ?? true,
                  paperWeightKey: "135",
                  designOption: "upload",
                });
                result = { pret_total: res.finalPrice };
              }

              // --- ALTE CALCULE (fallback simplu) ---
              else if (
                fnName === "calculate_rigid_price" ||
                fnName === "calculate_roll_print_price"
              ) {
                result = {
                  pret_total: 100,
                  info: "Preț estimativ (funcție neimplementată complet în codul partajat)",
                };
              }

              // --- CREARE COMANDĂ ---
              else if (fnName === "create_order") {
                const { customer_details, items } = args;
                const totalAmount = items.reduce(
                  (acc: number, item: any) =>
                    acc + item.price * item.quantity,
                  0
                );

                const lastOrder = await prisma.order.findFirst({
                  orderBy: { orderNo: "desc" },
                  select: { orderNo: true },
                });
                const nextOrderNo = (lastOrder?.orderNo ?? 1000) + 1;

                // Căutăm user după email sau telefon
                let existingUser = await prisma.user.findFirst({
                  where: {
                    OR: [
                      { email: customer_details.email },
                      { phone: customer_details.phone },
                    ],
                  },
                });

                const orderData: any = {
                  orderNo: nextOrderNo,
                  status: "pending_verification",
                  paymentStatus: "pending",
                  paymentMethod: "ramburs",
                  currency: "RON",
                  total: totalAmount,
                  userEmail:
                    customer_details.email ||
                    `whatsapp_${from}@prynt.ro`,
                  shippingAddress: {
                    name: customer_details.name,
                    phone: customer_details.phone || from,
                    street: customer_details.address,
                    city: customer_details.city,
                    county: customer_details.county,
                    country: "Romania",
                  },
                  billingAddress: {
                    name: customer_details.name,
                    phone: customer_details.phone || from,
                    street: customer_details.address,
                    city: customer_details.city,
                    county: customer_details.county,
                    country: "Romania",
                  },
                  items: {
                    create: items.map((item: any) => ({
                      name: item.title,
                      qty: Number(item.quantity) || 1,
                      unit: Number(item.price) || 0,
                      total:
                        (Number(item.price) || 0) *
                        (Number(item.quantity) || 1),
                      artworkUrl: null,
                      metadata: {
                        details: item.details,
                        source: "WhatsApp Assistant",
                      },
                    })),
                  },
                };

                if (existingUser) {
                  orderData.user = {
                    connect: { id: existingUser.id },
                  };
                }

                const order = await prisma.order.create({
                  data: orderData,
                });

                // Emailuri
                try {
                  if (
                    order &&
                    typeof sendOrderConfirmationEmail === "function"
                  ) {
                    await sendOrderConfirmationEmail(order);
                  }
                  if (
                    order &&
                    typeof sendNewOrderAdminEmail === "function"
                  ) {
                    await sendNewOrderAdminEmail(order);
                  }
                } catch (e) {
                  console.error("Email fail", e);
                }

                result = {
                  success: true,
                  orderId: order.id,
                  orderNo: order.orderNo,
                };
              }
            } catch (e: any) {
              console.error("Tool Error:", e);
              result = { error: e.message ?? "Eroare necunoscută în tool." };
            }

            messagesPayload.push({
              tool_call_id: toolCall.id,
              role: "tool",
              name: fnName,
              content: JSON.stringify(result),
            });
          }

          // A doua rundă – AI formulează răspunsul final către client
          const finalCompletion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messagesPayload as any,
          });

          finalReply = finalCompletion.choices[0].message.content ?? "";
        }

        // -------------------------
        // 4. Trimitem răspunsul pe WhatsApp
        // -------------------------
        if (finalReply && finalReply.trim().length > 0) {
          await sendWhatsAppMessage(from, finalReply);

          history.push({ role: "user", content: textBody });
          history.push({ role: "assistant", content: finalReply });
          conversations.set(from, history);
        }

        return NextResponse.json({ status: "success" });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
