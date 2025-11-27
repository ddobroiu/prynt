import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { tools, SYSTEM_PROMPT } from '@/lib/ai-shared';
import { executeTool } from '@/lib/ai-tool-runner';

export const runtime = 'nodejs'; // Asigurăm compatibilitatea

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Definim prompt-ul specific pentru Web (păstrăm instrucțiunile de UI)
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

    // 1. Construim istoricul mesajelor cu prompt-ul de sistem specific Web
    const messagesPayload = [
      { role: "system", content: WEB_SYSTEM_PROMPT },
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

        // Aici apelăm logica centralizată din ai-tool-runner
        // Folosim identifier: 'web-guest' sau un session ID dacă e disponibil
        const result = await executeTool(fnName, args, { 
            source: 'web', 
            identifier: 'web-guest' 
        });

        messagesPayload.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: fnName,
            content: JSON.stringify(result)
        });
      }

      // 4. Obținem răspunsul final după executarea tool-urilor
      const finalRes = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messagesPayload as any,
      });

      return NextResponse.json({ message: finalRes.choices[0].message.content });
    }

    // Dacă nu a fost niciun tool call, returnăm mesajul simplu
    return NextResponse.json({ message: responseMessage.content });

  } catch (error: any) {
    console.error("Eroare API Assistant:", error);
    return NextResponse.json({ message: "Eroare server." }, { status: 500 });
  }
}