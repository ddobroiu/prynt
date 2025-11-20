import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { orderId, orderItemId, fileUrl, fileName, publicId, fileSize, fileType } = body;

    // Validare simplă: ne asigurăm că această comandă aparține user-ului
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    // FIX: Folosim 'as any' pentru a accesa proprietatea 'id' care nu este în tipul default NextAuth
    if (!order || order.userId !== (session.user as any).id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Creare înregistrare în UserGraphic
    const graphic = await prisma.userGraphic.create({
      data: {
        userId: (session.user as any).id, // FIX
        orderId,
        orderItemId,
        fileUrl,
        fileName,
        publicId,
        fileSize: Number(fileSize || 0),
        fileType,
      },
    });

    return NextResponse.json(graphic);
  } catch (error) {
    console.error("[GRAPHICS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return new NextResponse("Missing ID", { status: 400 });

    // Verificăm proprietatea
    const graphic = await prisma.userGraphic.findUnique({
      where: { id },
    });

    // FIX: Folosim 'as any' pentru a accesa proprietatea 'id'
    if (!graphic || graphic.userId !== (session.user as any).id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Ștergem din DB (Opțional: Aici se poate apela și Cloudinary Admin API pentru a șterge fizic fișierul)
    await prisma.userGraphic.delete({
      where: { id },
    });

    return new NextResponse("OK");
  } catch (error) {
    console.error("[GRAPHICS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}