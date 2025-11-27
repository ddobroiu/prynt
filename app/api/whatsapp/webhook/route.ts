import { NextResponse } from "next/server";
import OpenAI from "openai";
import { tools, SYSTEM_PROMPT } from "@/lib/ai-shared";
import { executeTool } from "@/lib/ai-tool-runner";
import { sendWhatsAppMessage } from "@/lib/whatsapp-utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "whatsapp_prynt_123";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Stocare temporară conversații (în memorie)
const conversations = new Map<string, any[]>();
// Metadate conversație (ex: numele clientului)
const conversationMeta = new Map<string, { name?: string }>();

// ============================
//  1. GET – Verificare Webhook (Meta)
// ============================
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

// ============================
//  2. POST – Mesaje primite de la WhatsApp
// ============================
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
        const from = messageObj.from; // numărul clientului
        const textBody = messageObj.text?.body;

        if (!textBody) return NextResponse.json({ status: "ignored_no_text" });

        console.log(`📩 Mesaj de la ${from}: ${textBody}`);

        // 1. Gestionare istoric
        let history = conversations.get(from) || [];
        if (history.length > 10) history = history.slice(-10);

        // Extragem automat numele dintr-un mesaj tipic (ex: "Mă numesc Ion Popescu" / "Numele meu este...")
        const nameRegex = /\b(?:ma numesc|m[ăa] numesc|numele meu este|numele meu|sunt)\s+([^\n\r,!?]+)/i;
        const nameMatch = (textBody || '').match(nameRegex);
        if (nameMatch) {
          const detected = nameMatch[1].trim();
          const existing = conversationMeta.get(from) || {};
          existing.name = detected;
          conversationMeta.set(from, existing);
          // Adăugăm în istoric un semnal scurt pentru AI
          history.push({ role: 'user', content: `NAME_DETECTED: ${detected}` });
        }

        const messagesPayload = [
          {
            role: "system",
            content: SYSTEM_PROMPT + "\nIMPORTANT: Clientul este pe WhatsApp. Fii concis. Oferă link-uri complete.",
          },
          ...history,
          { role: "user", content: textBody },
        ];

        // 2. Apel OpenAI
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: messagesPayload as any,
          tools: tools,
          tool_choice: "auto",
          temperature: 0.2,
        });

        const responseMessage: any = completion.choices[0].message;
        let finalReply: string | null = responseMessage.content ?? null;

        // 3. Executare Tools (dacă e cazul)
        if (responseMessage.tool_calls) {
          messagesPayload.push(responseMessage);

          for (const toolCall of responseMessage.tool_calls) {
            const fnName = toolCall.function.name;
            let args = {};
            try {
              args = JSON.parse(toolCall.function.arguments);
            } catch (e) {
              console.warn("Args parse error", e);
            }

            // Aici apelăm funcția externalizată din lib/ai-tool-runner.ts
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

        // 4. Trimitem răspunsul pe WhatsApp
        // Prioritate: JUDET (buttoane) -> REQUEST NAME -> mesaje obișnuite
        if (finalReply && finalReply.includes("||REQUEST: JUDET||")) {
          const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/dpd/judete`);
          const data = await res.json();
          const judete = Array.isArray(data.judete) ? data.judete : [];
          const options = judete.slice(0, 5).map((j: string, idx: number) => ({ id: `judet_${idx + 1}`, title: j }));
          options.push({ id: "search_judet", title: "Caută județul" });
          const textToSend = finalReply.replace("||REQUEST: JUDET||", "").trim();
          await sendWhatsAppMessage(from, textToSend || "În ce județ doriți livrarea?", options);
        } else if (finalReply && finalReply.includes("||REQUEST: NAME||")) {
          // Cerem explicit numele clientului
          const textToSend = finalReply.replace("||REQUEST: NAME||", "").trim() || "Cu ce nume să emitem oferta?";
          await sendWhatsAppMessage(from, textToSend);
        } else if (finalReply && finalReply.trim().length > 0) {
          // Înlocuim placeholder-ul {{name}} cu numele detectat (dacă există)
          const meta = conversationMeta.get(from) || {};
          let replyText = finalReply;
          if (meta.name) replyText = replyText.replace(/{{\s*name\s*}}/gi, meta.name);
          await sendWhatsAppMessage(from, replyText);
        }

        // Actualizăm istoricul
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