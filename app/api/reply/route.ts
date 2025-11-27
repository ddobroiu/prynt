// app/api/admin/chats/reply/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage } from "@/lib/whatsapp-utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conversationId, message } = body;

    if (!conversationId || !message) {
      return NextResponse.json({ error: "Date incomplete" }, { status: 400 });
    }

    // 1. Găsim conversația pentru a lua numărul de telefon (identifier)
    const conversation = await prisma.aiConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversația nu există" }, { status: 404 });
    }

    // 2. Trimitem mesajul pe WhatsApp (dacă sursa e whatsapp)
    if (conversation.source === 'whatsapp') {
      await sendWhatsAppMessage(conversation.identifier, message);
    } 
    // Aici am putea adăuga logică și pentru Web (via websockets/pusher), 
    // dar momentan ne concentrăm pe WhatsApp conform cerinței.

    // 3. Salvăm mesajul în baza de date cu rolul 'admin' pentru a-l distinge de bot
    const newMessage = await prisma.aiMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'admin', // Rol nou pentru a ști că a intervenit omul
        content: message,
      },
    });

    // 4. Actualizăm data ultimei activități
    await prisma.aiConversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date(), hasError: false }, // Resetăm eroarea dacă preluăm noi
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Eroare trimitere mesaj admin:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}