import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
    }

    const { itemId, artworkUrl } = await req.json();

    if (!itemId || !artworkUrl) {
      return NextResponse.json({ error: "Date incomplete" }, { status: 400 });
    }

    // Verificăm dacă itemul aparține unei comenzi a utilizatorului curent
    const item = await prisma.orderItem.findUnique({
      where: { id: itemId },
      include: { order: { include: { user: true } } }
    });

    if (!item) {
      return NextResponse.json({ error: "Produsul nu a fost găsit" }, { status: 404 });
    }

    // Măsură de securitate: ne asigurăm că userul deține comanda
    if (item.order.user?.email !== session.user.email) {
      return NextResponse.json({ error: "Nu ai acces la această comandă" }, { status: 403 });
    }

    // Actualizăm câmpul artworkUrl
    const updatedItem = await prisma.orderItem.update({
      where: { id: itemId },
      data: { artworkUrl },
    });

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error("Eroare la salvare artwork:", error);
    return NextResponse.json({ error: "Eroare internă" }, { status: 500 });
  }
}