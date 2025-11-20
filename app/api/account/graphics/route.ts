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

    // Check for valid order ownership
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    // Use 'as any' for session.user.id if typescript complains
    if (!order || order.userId !== (session.user as any).id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Create record mapping variables to Schema fields
    const graphic = await prisma.userGraphic.create({
      data: {
        userId: (session.user as any).id,
        orderId,          // Now exists in schema
        orderItemId,      // Now exists in schema
        storagePath: fileUrl,     // Map fileUrl -> storagePath
        originalName: fileName,   // Map fileName -> originalName
        publicId,
        size: Number(fileSize || 0), // Map fileSize -> size
        mimeType: fileType,       // Map fileType -> mimeType
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

    const graphic = await prisma.userGraphic.findUnique({
      where: { id },
    });

    if (!graphic || graphic.userId !== (session.user as any).id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.userGraphic.delete({
      where: { id },
    });

    return new NextResponse("OK");
  } catch (error) {
    console.error("[GRAPHICS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}