import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { orderNo, email } = await req.json();

    if (!orderNo || !email) {
      return NextResponse.json({ success: false, message: "Te rugăm să completezi toate câmpurile." }, { status: 400 });
    }

    // Căutăm comanda după număr
    const order = await prisma.order.findUnique({
      where: { orderNo: parseInt(orderNo) },
      select: {
        id: true,
        orderNo: true,
        status: true,
        total: true,
        createdAt: true,
        awbNumber: true,
        awbCarrier: true,
        address: true, // JSON care conține email-ul folosit la checkout
        items: {
            select: {
                name: true,
                qty: true,
                metadata: true
            }
        }
      }
    });

    if (!order) {
        return NextResponse.json({ success: false, message: "Nu am găsit o comandă cu acest număr." }, { status: 404 });
    }

    // Verificăm dacă email-ul introdus corespunde cu cel din comandă
    // (Adresa este stocată ca JSON, deci o tratăm ca 'any' sau facem type assertion)
    const orderAddress = order.address as any;
    const orderEmail = orderAddress?.email || "";

    if (orderEmail.toLowerCase().trim() !== email.toLowerCase().trim()) {
         // Mesaj generic pentru securitate, dar aici știm că nr e bun dar emailul nu
         return NextResponse.json({ success: false, message: "Nu am găsit o comandă cu acest număr și email." }, { status: 404 });
    }

    // Returnăm datele publice ale comenzii (fără date sensibile de user)
    return NextResponse.json({
      success: true,
      order: {
        orderNo: order.orderNo,
        status: order.status,
        total: order.total,
        date: order.createdAt,
        awb: order.awbNumber,
        carrier: order.awbCarrier,
        items: order.items
      }
    });

  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json({ success: false, message: "A apărut o eroare. Încearcă din nou." }, { status: 500 });
  }
}