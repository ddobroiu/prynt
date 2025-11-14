import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const orderId = params.id;
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "canceled", canceledAt: new Date() },
    });
    return new Response("Comanda anulată", { status: 200 });
  } catch (e) {
    return new Response("Eroare la anulare", { status: 500 });
  }
}
