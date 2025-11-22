import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signAdminAction } from "@/lib/adminAction"; // Asigură-te că importul e corect
import { getServerSession } from "next-auth"; // Sau mecanismul tău de admin session
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificare sesiune (admin sau user logat)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, user: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Comanda nu există" }, { status: 404 });
    }

    const address = order.address as any;

    // Construim payload-ul identic cu cel din email
    const paymentType: 'Ramburs' | 'Card' | undefined = order.paymentType === 'Ramburs' ? 'Ramburs' : order.paymentType === 'Card' ? 'Card' : undefined;

    const payload = {
      action: "validate", // Pornim cu validarea
      orderId: order.id,  // Trimitem ID-ul pentru a salva AWB-ul ulterior
      address: {
        nume_prenume: address.nume_prenume || address.nume || order.user?.name || "Client",
        email: address.email || order.user?.email || "",
        telefon: address.telefon || order.user?.phone || "",
        judet: address.judet || "",
        localitate: address.localitate || "",
        strada_nr: address.strada_nr || "",
        postCode: address.postCode || "",
      },
      paymentType,
      totalAmount: Number(order.total),
      items: order.items.map((i) => ({ name: i.name, qty: i.qty })),
    };

    // Semnăm token-ul
    const token = signAdminAction(payload);
    const serviceId = process.env.DPD_DEFAULT_SERVICE_ID || "2505"; // Fallback service ID
    const baseUrl = process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
    
    const url = `${baseUrl}/api/dpd/admin-action?token=${encodeURIComponent(token)}&sid=${serviceId}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Eroare generare link AWB:", error);
    return NextResponse.json({ error: "Eroare internă" }, { status: 500 });
  }
}