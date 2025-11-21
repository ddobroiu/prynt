import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/adminSession";
import { cookies } from "next/headers";

// Funcție pentru recalcularea totalului comenzii după modificare
async function recalculateOrderTotal(orderId: string) {
  // 1. Luăm toate produsele rămase
  const items = await prisma.orderItem.findMany({
    where: { orderId }
  });

  // 2. Calculăm subtotalul
  const subtotal = items.reduce((acc, item) => acc + (Number(item.total) || 0), 0);

  // 3. Luăm taxa de livrare curentă
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { shippingFee: true }
  });
  
  const shipping = Number(order?.shippingFee || 0);
  const newTotal = subtotal + shipping;

  // 4. Actualizăm totalul în baza de date
  await prisma.order.update({
    where: { id: orderId },
    data: { total: newTotal }
  });

  return newTotal;
}

// POST: Adaugă un produs nou
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_auth")?.value;
    if (!verifyAdminSession(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // ID-ul comenzii
    const body = await req.json();
    const { name, qty, price } = body;

    if (!name || !qty || price === undefined) {
      return NextResponse.json({ error: "Date incomplete" }, { status: 400 });
    }

    const quantity = parseInt(qty);
    const unitPrice = parseFloat(price);
    const total = quantity * unitPrice;

    await prisma.orderItem.create({
      data: {
        orderId: id,
        name: name,
        qty: quantity,
        unit: unitPrice,
        total: total,
        metadata: {
            designOption: "text_only", 
            textDesign: "Adăugat manual de Admin"
        }
      }
    });

    await recalculateOrderTotal(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Eroare adăugare produs:", error);
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}

// DELETE: Șterge un produs
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_auth")?.value;
    if (!verifyAdminSession(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // ID-ul comenzii
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json({ error: "Lipsă ID produs" }, { status: 400 });
    }

    // Ștergem produsul
    await prisma.orderItem.delete({
      where: { id: itemId }
    });

    // Recalculăm totalul comenzii
    await recalculateOrderTotal(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Eroare ștergere produs:", error);
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}