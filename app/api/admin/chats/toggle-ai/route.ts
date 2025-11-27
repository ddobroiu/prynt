import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { conversationId, paused } = await req.json();

    if (!conversationId) {
      return NextResponse.json({ error: "ID lipsă" }, { status: 400 });
    }

    const updated = await prisma.aiConversation.update({
      where: { id: conversationId },
      data: { aiPaused: paused },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}