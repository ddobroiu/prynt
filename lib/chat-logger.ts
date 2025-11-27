import { prisma } from "@/lib/prisma";

// Cuvinte cheie care indică faptul că botul nu a putut ajuta automat
const FALLBACK_KEYWORDS = [
  "nu pot răspunde",
  "nu am informații",
  "contact@prynt.ro",
  "0750.473.111",
  "colegii mei",
  "intervenție umană"
];

export async function logConversation(
  source: 'web' | 'whatsapp',
  identifier: string,
  messages: { role: string; content: string }[],
  userId?: string
) {
  try {
    // 1. Găsim sau creăm conversația
    let conversation = await prisma.aiConversation.findFirst({
      where: { source, identifier }
    });

    if (!conversation) {
      conversation = await prisma.aiConversation.create({
        data: {
          source,
          identifier,
          userId: userId || null,
        }
      });
    } else if (userId && !conversation.userId) {
      // Dacă avem user acum dar nu aveam înainte, îl atașăm
      await prisma.aiConversation.update({
        where: { id: conversation.id },
        data: { userId }
      });
    }

    // 2. Verificăm dacă botul a "eșuat" în ultimele mesaje
    let hasError = false;
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    if (assistantMessages.length > 0) {
      const lastMsg = assistantMessages[assistantMessages.length - 1].content.toLowerCase();
      // Dacă mesajul conține datele de contact (fallback), considerăm că a eșuat
      if (FALLBACK_KEYWORDS.some(kw => lastMsg.includes(kw))) {
        hasError = true;
      }
    }

    // 3. Salvăm mesajele
    for (const msg of messages) {
       if (msg.role === 'system') continue; // Nu salvăm instrucțiunile sistemului

       await prisma.aiMessage.create({
         data: {
           conversationId: conversation.id,
           role: msg.role,
           content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
         }
       });
    }

    // 4. Actualizăm conversația (timestamp și status eroare)
    await prisma.aiConversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: new Date(),
        hasError: hasError ? true : conversation.hasError, // Păstrăm true dacă a fost marcat anterior
      }
    });

  } catch (e) {
    console.error("Eroare logare chat:", e);
  }
}