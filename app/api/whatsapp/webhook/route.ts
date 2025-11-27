import { NextResponse } from "next/server";
import OpenAI from "openai";
import { tools, SYSTEM_PROMPT } from "@/lib/ai-shared";
import { executeTool } from "@/lib/ai-tool-runner";
import { sendWhatsAppMessage } from "@/lib/whatsapp-utils";
import { prisma } from "@/lib/prisma";
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

const conversations = new Map<string, any[]>();
const conversationMeta = new Map<string, { name?: string }>();

// ... (păstrăm funcția processWhatsAppImage neschimbată) ...
async function processWhatsAppImage(imageId: string, fromNumber: string) {
  try {
    const token = process.env.META_API_TOKEN;
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

        // --- GESTIONARE IMAGINE ---
        if (msgType === "image") {
            const imageId = messageObj.image?.id;
            const uploadResult = await processWhatsAppImage(imageId, from);
            if (uploadResult) {
                await sendWhatsAppMessage(from, "Am primit imaginea ta! 📸 Am salvat-o în contul tău. Te pot ajuta cu o ofertă pentru ea?");
                let history = conversations.get(from) || [];
                history.push({ role: "user", content: `[SYSTEM: Userul a trimis o imagine. URL: ${uploadResult.url}]` });
                conversations.set(from, history);
            } else {
                await sendWhatsAppMessage(from, "Am întâmpinat o problemă la salvarea imaginii.");
            }
            return NextResponse.json({ status: "success_image" });
        }

        // --- GESTIONARE TEXT ---
        const textBody = messageObj.text?.body;
        if (!textBody) return NextResponse.json({ status: "ignored_no_text" });

        console.log(`📩 Mesaj de la ${from}: ${textBody}`);

        // 1. Identificare Client + ADRESĂ în DB
        let contextName = "";
        let contextEmail = "";
        let contextAddress = "";

        try {
            const localPhone = from.startsWith("40") ? "0" + from.slice(2) : from;
            
            // NOU: Include și adresele, luând-o pe ultima adăugată
            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { phone: from },
                        { phone: localPhone },
                        { phone: `+${from}` }
                    ]
                },
                select: { 
                    name: true, 
                    email: true,
                    addresses: {
                        take: 1,
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });

            if (user) {
                contextName = user.name || "";
                contextEmail = user.email || "";
                if (user.addresses && user.addresses.length > 0) {
                    const a = user.addresses[0];
                    contextAddress = `${a.strada_nr}, ${a.localitate}, ${a.judet}`;
                }
            }
        } catch (dbError) {
            console.error("Eroare identificare user DB:", dbError);
        }

        let history = conversations.get(from) || [];
        if (history.length > 10) history = history.slice(-10);

        // Fallback nume din regex dacă nu e în DB
        if (!contextName) {
            const nameRegex = /\b(?:ma numesc|m[ăa] numesc|numele meu este|numele meu|sunt)\s+([^\n\r,!?]+)/i;
            const nameMatch = (textBody || '').match(nameRegex);
            if (nameMatch) contextName = nameMatch[1].trim();
            else {
                const meta = conversationMeta.get(from);
                if (meta?.name) contextName = meta.name;
            }
        }
        if (contextName && !conversationMeta.has(from)) {
             conversationMeta.set(from, { name: contextName });
        }

        // 2. Construire Prompt cu datele salvate
        let systemContent = SYSTEM_PROMPT + "\nIMPORTANT: Clientul este pe WhatsApp. Fii concis.";
        
        if (contextName || contextEmail || contextAddress) {
            systemContent += `\n\nDATE IDENTIFICATE ÎN BAZA DE DATE:`;
            if (contextName) systemContent += `\n- Nume: ${contextName}`;
            if (contextEmail) systemContent += `\n- Email: ${contextEmail}`;
            if (contextAddress) systemContent += `\n- Adresă Livrare: ${contextAddress}`;
            
            systemContent += `\n\nINSTRUCȚIUNI DE INTERACȚIUNE:
            1. Salută clientul pe nume (dacă există).
            2. Dacă clientul dorește să plaseze o comandă sau o ofertă, ÎNTREABĂ-L dacă dorește să folosească datele de mai sus. 
               Exemplu: "Doriți să folosim adresa de livrare salvată (${contextAddress}) și emailul (${contextEmail})?"
            3. Doar dacă clientul spune că vrea să schimbe datele, atunci cere detaliile noi.`;
        }

        const messagesPayload = [
          { role: "system", content: systemContent },
          ...history,
          { role: "user", content: textBody },
        ];

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

        if (finalReply && finalReply.includes("||REQUEST: JUDET||")) {
          const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/dpd/judete`);
          const data = await res.json();
          const judete = Array.isArray(data.judete) ? data.judete : [];
          const options = judete.slice(0, 5).map((j: string, idx: number) => ({ id: `judet_${idx + 1}`, title: j }));
          options.push({ id: "search_judet", title: "Caută județul" });
          await sendWhatsAppMessage(from, finalReply.replace("||REQUEST: JUDET||", "").trim() || "Județ?", options);
        } else if (finalReply && finalReply.trim().length > 0) {
          let replyText = finalReply;
          if (contextName) replyText = replyText.replace(/{{\s*name\s*}}/gi, contextName);
          await sendWhatsAppMessage(from, replyText);
        }

        if (finalReply && finalReply.trim().length > 0) {
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