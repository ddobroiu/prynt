import { NextResponse } from "next/server";
import OpenAI from "openai";
import { tools, SYSTEM_PROMPT } from "@/lib/ai-shared";
import { executeTool } from "@/lib/ai-tool-runner";
import { sendWhatsAppMessage, sendInteractiveButtons, sendYesNoQuestion } from "@/lib/whatsapp-utils";
import { prisma } from "@/lib/prisma";
import { logConversation } from "@/lib/chat-logger";
import { v2 as cloudinary } from 'cloudinary';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "whatsapp_prynt_123";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// FIX: Memory leak prevention - TTL și limitare
const MAX_CONVERSATIONS = 1000;
const CONVERSATION_TTL = 30 * 60 * 1000; // 30 minute
const conversations = new Map<string, { messages: any[], lastAccess: number }>();
const conversationMeta = new Map<string, { name?: string, lastAccess: number }>();

// Cleanup function pentru conversații vechi
function cleanupOldConversations() {
  const now = Date.now();
  for (const [key, value] of conversations.entries()) {
    if (now - value.lastAccess > CONVERSATION_TTL) {
      conversations.delete(key);
    }
  }
  for (const [key, value] of conversationMeta.entries()) {
    if (now - value.lastAccess > CONVERSATION_TTL) {
      conversationMeta.delete(key);
    }
  }
  // Limitare număr maxim conversații
  if (conversations.size > MAX_CONVERSATIONS) {
    const sortedKeys = Array.from(conversations.entries())
      .sort((a, b) => a[1].lastAccess - b[1].lastAccess)
      .slice(0, conversations.size - MAX_CONVERSATIONS)
      .map(([key]) => key);
    sortedKeys.forEach(key => conversations.delete(key));
  }
}

async function processWhatsAppImage(imageId: string, fromNumber: string) {
  try {
    const token = process.env.META_API_TOKEN;
    if (!token) {
      console.error("❌ META_API_TOKEN lipsește din configurare");
      throw new Error("META_API_TOKEN nu este configurat");
    }
    const metaRes = await fetch(`https://graph.facebook.com/v18.0/${imageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const metaData = await metaRes.json();
    const imageUrl = metaData.url;
    if (!imageUrl) throw new Error("Nu s-a putut obține URL-ul imaginii de la Meta.");
    
    const imgRes = await fetch(imageUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const localPhone = fromNumber.startsWith("40") ? "0" + fromNumber.slice(2) : fromNumber;
    let user = await prisma.user.findFirst({
        where: { OR: [{ phone: fromNumber }, { phone: localPhone }] }
    });
    
    return new Promise<{ publicId: string; url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "whatsapp_uploads",
          tags: [fromNumber, "whatsapp_bot"],
          context: { phone: fromNumber, userName: user?.name || "unknown" }
        },
        async (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("Upload failed"));
          
          if (user) {
             await prisma.userGraphic.create({
                 data: {
                     userId: user.id,
                     originalName: `whatsapp_${imageId}.jpg`,
                     storagePath: result.secure_url,
                     publicId: result.public_id,
                     size: result.bytes,
                     mimeType: "image/jpeg",
                 }
             });
          }
          resolve({ publicId: result.public_id, url: result.secure_url });
        }
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Eroare procesare imagine WhatsApp:", error);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return new NextResponse(challenge ?? "", { status: 200, headers: { "Content-Type": "text/plain" } });
    }
    return new NextResponse("Forbidden", { status: 403 });
  } catch (e) {
    return new NextResponse("Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (messages && messages[0]) {
        const messageObj = messages[0];
        const from = messageObj.from;
        const msgType = messageObj.type;

        // 1. REACTIVARE AUTOMATĂ A CONVERSAȚIEI
        const existingConv = await prisma.aiConversation.findFirst({
            where: { source: 'whatsapp', identifier: from }
        });

        if (existingConv) {
            if (existingConv.status === 'archived') {
                await prisma.aiConversation.update({
                    where: { id: existingConv.id },
                    data: { status: 'active', lastMessageAt: new Date() }
                });
                console.log(`🔄 Conversație reactivată automat pentru ${from}`);
            }
        }

        // --- GESTIONARE IMAGINE ---
        if (msgType === "image") {
            const imageId = messageObj.image?.id;
            const uploadResult = await processWhatsAppImage(imageId, from);
            if (uploadResult) {
                // Întrebăm direct cu butoane Da/Nu după primirea imaginii
                const sendResult = await sendYesNoQuestion(from, "Am primit imaginea ta! 📸 Am salvat-o în contul tău. Dorești o ofertă pentru ea?");
                
                const now = Date.now();
                const convData = conversations.get(from) || { messages: [], lastAccess: now };
                convData.messages.push({ role: "user", content: `[SYSTEM: Userul a trimis o imagine. URL: ${uploadResult.url}]` });
                convData.lastAccess = now;
                conversations.set(from, convData);
                
                await logConversation('whatsapp', from, [{role: 'user', content: `[IMAGE: ${uploadResult.url}]`}, {role: 'assistant', content: 'Confirmare primire imagine.'}], undefined);
            } else {
                await sendWhatsAppMessage(from, "Am întâmpinat o problemă la salvarea imaginii.");
            }
            return NextResponse.json({ status: "success_image" });
        }

        // --- GESTIONARE TEXT SI BUTOANE INTERACTIVE ---
        let textBody = "";
        let buttonId = "";

        if (msgType === "text") {
            textBody = messageObj.text?.body;
        } else if (msgType === "interactive") {
            // Gestionăm răspunsul la butoane
            if (messageObj.interactive.type === "button_reply") {
                textBody = messageObj.interactive.button_reply.title; // Textul de pe buton (ex: "Da")
                buttonId = messageObj.interactive.button_reply.id;    // ID-ul intern (ex: "yes")
                console.log(`🔘 Button Clicked by ${from}: ${textBody} (ID: ${buttonId})`);
            } else if (messageObj.interactive.type === "list_reply") {
                 textBody = messageObj.interactive.list_reply.title;
                 buttonId = messageObj.interactive.list_reply.id;
            }
        }

        if (!textBody) return NextResponse.json({ status: "ignored_no_text" });

        console.log(`📩 Mesaj de la ${from}: ${textBody}`);

        // --- VERIFICARE DACA AI-UL ESTE PAUZAT ---
        if (existingConv && existingConv.aiPaused) {
            console.log(`⏸️ AI Pauzat pentru ${from}. Nu răspund.`);
            await prisma.aiMessage.create({
                data: {
                    conversationId: existingConv.id,
                    role: 'user',
                    content: textBody
                }
            });
            await prisma.aiConversation.update({
                where: { id: existingConv.id },
                data: { lastMessageAt: new Date() }
            });
            return NextResponse.json({ status: "paused" });
        }

        // ---------------------------------------------------------
        // LOGICA AI STANDARD
        // ---------------------------------------------------------

        // 2. Identificare Client
        let contextName = "";
        let contextEmail = "";
        let contextAddress = "";
        let contextBilling = "";
        let orderHistoryText = "";
        let userId: string | undefined = undefined;

        try {
            const localPhone = from.startsWith("40") ? "0" + from.slice(2) : from;
            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { phone: from },
                        { phone: localPhone },
                        { phone: `+${from}` }
                    ]
                },
                select: { 
                    id: true, name: true, email: true,
                    addresses: { take: 1, orderBy: { createdAt: 'desc' } },
                    orders: { 
                        take: 5, orderBy: { createdAt: 'desc' },
                        select: { orderNo: true, createdAt: true, total: true, status: true, billing: true, items: { select: { name: true, qty: true } } }
                    }
                }
            });

            if (user) {
                userId = user.id;
                contextName = user.name || "";
                contextEmail = user.email || "";
                if (user.addresses && user.addresses.length > 0) {
                    const a = user.addresses[0];
                    contextAddress = `${a.strada_nr}, ${a.localitate}, ${a.judet}`;
                }
                if (user.orders && user.orders.length > 0) {
                    const lastBill: any = user.orders[0].billing;
                    if (lastBill) {
                        contextBilling = lastBill.cui 
                            ? `Firmă: ${lastBill.name || lastBill.company}, CUI: ${lastBill.cui}` 
                            : `Persoană Fizică: ${lastBill.name || contextName}`;
                    }
                    orderHistoryText = user.orders.map(o => {
                        const itemsSummary = o.items.map(i => `${i.qty}x ${i.name}`).join(', ');
                        return `- #${o.orderNo} (${new Date(o.createdAt).toLocaleDateString('ro-RO')}): ${itemsSummary} - Status: ${o.status}`;
                    }).join('\n');
                }
            }
        } catch (dbError) {
            console.error("Eroare DB user:", dbError);
        }

        // Cleanup conversații vechi periodic
        if (Math.random() < 0.1) cleanupOldConversations(); // 10% șansă la fiecare mesaj

        const now = Date.now();
        const convData = conversations.get(from) || { messages: [], lastAccess: now };
        let history = convData.messages;
        if (history.length > 10) history = history.slice(-10);

        if (!contextName) {
            const nameMatch = (textBody || '').match(/\b(?:ma numesc|sunt)\s+([^\n\r,!?]+)/i);
            if (nameMatch) contextName = nameMatch[1].trim();
            else if (conversationMeta.has(from)) contextName = conversationMeta.get(from)?.name || "";
        }
        if (contextName) {
            conversationMeta.set(from, { name: contextName, lastAccess: now });
        }

        // 3. Prompt System
        let systemContent = SYSTEM_PROMPT + "\nIMPORTANT: Clientul este pe WhatsApp. Fii concis. Folosește liste scurte.";
        if (contextName || orderHistoryText) {
            systemContent += `\n\nDATE CLIENT: Nume: ${contextName || 'Necunoscut'}`;
            if (contextAddress) systemContent += `, Adresă: ${contextAddress}`;
            if (orderHistoryText) systemContent += `\nISTORIC COMENZI:\n${orderHistoryText}`;
        }

        const messagesPayload = [
          { role: "system", content: systemContent },
          ...history,
          { role: "user", content: textBody },
        ];

        // 4. OpenAI Call
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: messagesPayload as any,
          tools: tools,
          tool_choice: "auto",
          temperature: 0.2,
        });

        const responseMessage: any = completion.choices[0].message;
        let finalReply: string | null = responseMessage.content ?? null;

        if (responseMessage.tool_calls) {
          messagesPayload.push(responseMessage);
          for (const toolCall of responseMessage.tool_calls) {
            const fnName = (toolCall as any).function.name; 
            let args = {};
            try { args = JSON.parse((toolCall as any).function.arguments); } catch (e) {}
            const result = await executeTool(fnName, args, { source: 'whatsapp', identifier: from });
            messagesPayload.push({
              tool_call_id: toolCall.id,
              role: "tool",
              name: fnName,
              content: JSON.stringify(result),
            });
          }
          const finalCompletion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messagesPayload as any,
          });
          finalReply = finalCompletion.choices[0].message.content ?? "";
        }

        // 5. Trimitere & Salvare (CU VERIFICARE SUCCES)
        if (finalReply && finalReply.trim().length > 0) {
            let replyText = finalReply;
            if (contextName) replyText = replyText.replace(/{{\s*name\s*}}/gi, contextName);

            // LOGICA SPECIALA PENTRU INTERFAȚĂ (BUTOANE)
            const lowerReply = replyText.toLowerCase();
            let sendResult: any = null;

            // Caz 1: Cerere explicită de Județ
            if (replyText.includes("||REQUEST: JUDET||")) {
               const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/dpd/judete`);
               const data = await res.json();
               const options = data.judete?.slice(0, 5).map((j: string, idx: number) => ({ id: `judet_${idx + 1}`, title: j })) || [];
               options.push({ id: "search_judet", title: "Alt județ" });
               
               sendResult = await sendInteractiveButtons(from, replyText.replace("||REQUEST: JUDET||", "").trim(), options);
            }
            // Caz 1.5: Tag-ul ||OPTIONS: [...]||
            else if (replyText.includes("||OPTIONS:")) {
               const optionsMatch = replyText.match(/\|\|OPTIONS:\s*(\[.*?\])\|\|/);
               if (optionsMatch) {
                  try {
                     const optionsArray = JSON.parse(optionsMatch[1]);
                     const cleanText = replyText.replace(/\|\|OPTIONS:.*?\|\|/g, "").trim();
                     
                     // Limitează la primele 3 opțiuni (limită WhatsApp pentru butoane)
                     const buttons = optionsArray.slice(0, 3).map((opt: string, idx: number) => ({
                        id: `opt_${idx}`,
                        title: opt.length > 20 ? opt.substring(0, 20) : opt
                     }));
                     
                     // Dacă sunt mai mult de 3 opțiuni, adaugă buton "Mai multe"
                     if (optionsArray.length > 3) {
                        buttons.pop();
                        buttons.push({ id: 'more_options', title: 'Mai multe...' });
                        // Trimite lista completă în mesaj
                        const allOptions = optionsArray.join(", ");
                        sendResult = await sendInteractiveButtons(from, `${cleanText}\n\n📋 Toate: ${allOptions}`, buttons);
                     } else {
                        sendResult = await sendInteractiveButtons(from, cleanText, buttons);
                     }
                  } catch (e) {
                     console.error("Eroare parsare ||OPTIONS||:", e);
                     sendResult = await sendWhatsAppMessage(from, replyText.replace(/\|\|OPTIONS:.*?\|\|/g, "").trim());
                  }
               } else {
                  sendResult = await sendWhatsAppMessage(from, replyText);
               }
            }
            // Caz 1.6: Tag-ul ||BUTTON:text:url|| pentru download link
            else if (replyText.includes("||BUTTON:")) {
               const buttonMatch = replyText.match(/\|\|BUTTON:([^:]+):([^\|]+)\|\|/);
               if (buttonMatch) {
                  const buttonText = buttonMatch[1].trim();
                  const buttonUrl = buttonMatch[2].trim();
                  const cleanText = replyText.replace(/\|\|BUTTON:.*?\|\|/g, "").trim();
                  
                  // Trimite mesaj text + link clickabil
                  sendResult = await sendWhatsAppMessage(from, `${cleanText}\n\n🔗 ${buttonText}: ${buttonUrl}`);
               } else {
                  sendResult = await sendWhatsAppMessage(from, replyText);
               }
            }
            // Caz 2: Întrebări de tip "Da/Nu"
            else if (
                lowerReply.includes("?") && 
                (lowerReply.includes("dorești") || lowerReply.includes("vrei") || lowerReply.includes("confirm") || lowerReply.includes("da sau nu")) &&
                replyText.length < 150 
            ) {
                sendResult = await sendYesNoQuestion(from, replyText);
            }
            // Caz 3: Meniu Principal sau Opțiuni detectate
            else if (lowerReply.includes("alege o opțiune") || lowerReply.includes("cu ce te pot ajuta")) {
                sendResult = await sendInteractiveButtons(from, replyText, [
                    { id: 'check_status', title: 'Status Comandă' },
                    { id: 'offer', title: 'Cere Ofertă' },
                    { id: 'human', title: 'Agent Uman' }
                ]);
            }
            // Caz 4: Text simplu (Default)
            else {
               sendResult = await sendWhatsAppMessage(from, replyText);
            }

            // LOGARE ÎN ADMIN DOAR DACĂ S-A TRIMIS SAU LOGARE EROARE
            if (sendResult) {
                // Mesajul s-a trimis
                const msgsToLog = [
                    { role: 'user', content: textBody },
                    { role: 'assistant', content: finalReply }
                ];
                await logConversation('whatsapp', from, msgsToLog, userId);

                history.push({ role: "user", content: textBody });
                history.push({ role: "assistant", content: finalReply });
                conversations.set(from, { messages: history, lastAccess: Date.now() });
            } else {
                // EROARE LA TRIMITERE
                console.error(`❌ FAILED to send message to ${from}`);
                await logConversation('whatsapp', from, [
                    { role: 'user', content: textBody },
                    { role: 'assistant', content: `⚠️ EROARE SISTEM: Mesajul nu a ajuns la client. Verifică logurile serverului.\nConținut intenționat: ${finalReply}` }
                ], userId);
            }
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