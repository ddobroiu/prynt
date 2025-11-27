// app/api/admin/chats/update/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conversationId, updates } = body; 
    // updates poate contine: { aiPaused: true }, { status: 'archived' }, { customTag: 'text' }

    if (!conversationId || !updates) {
      return NextResponse.json({ error: "Date lipsă" }, { status: 400 });
    }

    const updatedConv = await prisma.aiConversation.update({
      where: { id: conversationId },
      data: updates,
    });

    return NextResponse.json(updatedConv);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}