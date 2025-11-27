import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { tools, SYSTEM_PROMPT } from '@/lib/ai-shared';
import { executeTool } from '@/lib/ai-tool-runner';
import { getAuthSession } from '@/lib/auth'; // Importăm sesiunea

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

    // --- NOU: Verificare Sesiune ---
    const session = await getAuthSession();
    let systemContent = WEB_SYSTEM_PROMPT;
    let identifier = 'web-guest';

    if (session?.user) {
        identifier = (session.user as any).id || session.user.email || 'web-user';
        const userName = session.user.name;
        if (userName) {
            systemContent += `\n\nDiscuți cu utilizatorul autentificat: ${userName}. Adresează-te pe nume.`;
        }
    }
    // -----------------------------

    // 1. Construim istoricul mesajelor
    const messagesPayload = [
      { role: "system", content: systemContent },
      ...messages
    ];

    // 2. Apelăm OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messagesPayload as any,
      tools: tools,
      tool_choice: "auto",
      temperature: 0.2, 
    });

    const responseMessage = completion.choices[0].message;

    // 3. Gestionăm apelurile de funcții (Tools)
    if (responseMessage.tool_calls) {
      messagesPayload.push(responseMessage as any);

      for (const toolCall of responseMessage.tool_calls) {
        const fnName = toolCall.function.name;
        let args = {};
        
        try {
            args = JSON.parse(toolCall.function.arguments);
        } catch (e) {
            console.warn("Eroare parsare argumente tool:", e);
        }

        const result = await executeTool(fnName, args, { 
            source: 'web', 
            identifier: identifier // Folosim ID-ul real dacă e logat
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