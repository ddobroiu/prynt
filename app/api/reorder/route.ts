import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Verificăm că comanda aparține utilizatorului
    const userId = (session.user as any).id;
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Extragem items cu configurațiile lor
    const cartItems = order.items.map((item) => {
      const metadata = item.metadata as any || {};
      
      // Calculăm prețul unitar corect
      // item.unit = preț unitar, item.total = preț total (unit * qty)
      const unitPrice = item.unit ? Number(item.unit) : 
                       (item.total && item.qty ? Number(item.total) / item.qty : 0);
      
      return {
        name: item.name,
        qty: item.qty,
        price: unitPrice, // Prețul UNITAR, nu total
        unit: Number(item.unit || 0),
        total: Number(item.total || 0),
        artworkUrl: item.artworkUrl,
        metadata: {
          ...metadata,
          // Asigurăm că avem width și height
          width: metadata.width || metadata.w,
          height: metadata.height || metadata.h,
          Material: metadata.Material || metadata.material,
        },
        // Extragem informații utile pentru identificare
        productSlug: metadata.productSlug || metadata.slug,
        category: metadata.category,
      };
    });

    return NextResponse.json({ 
      success: true, 
      items: cartItems,
      message: `${cartItems.length} ${cartItems.length === 1 ? 'produs a fost adăugat' : 'produse au fost adăugate'} în coș` 
    });
  } catch (error: any) {
    console.error("Error reordering:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reorder" },
      { status: 500 }
    );
  }
}
