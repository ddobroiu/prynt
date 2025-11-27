import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/whatsapp-utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conversationId, message } = body;

    // Validare simplă
    if (!conversationId || !message) {
      return NextResponse.json({ error: "Date incomplete" }, { status: 400 });
    }

    // 1. Găsim conversația pentru a lua numărul de telefon
    const conversation = await prisma.aiConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversația nu există" }, { status: 404 });
    }

    // 2. Trimitem mesajul pe WhatsApp (doar dacă sursa e whatsapp)
    if (conversation.source === 'whatsapp') {
      // Această funcție trimite mesajul efectiv către Meta/WhatsApp
      await sendWhatsAppMessage(conversation.identifier, message);
    } 

    // 3. Salvăm mesajul în baza de date cu rolul 'admin'
    // Astfel va apărea cu albastru în interfața ta
    const newMessage = await prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'admin', 
        content: message,
      },
    });

    // 4. Actualizăm data ultimei activități a conversației
    await prisma.aiConversation.update({
      where: { id: conversationId },
      data: { 
        lastMessageAt: new Date(), 
        hasError: false // Resetăm eroarea dacă operatorul a preluat discuția
      }, 
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Eroare trimitere mesaj admin:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}