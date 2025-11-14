
import type { Request } from "next/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const orderId = params.id;
  const result = await prisma.order.update({
    where: { id: orderId },
    data: { status: "canceled", canceledAt: new Date() },
  }).catch(() => null);
  if (result) {
    return new Response("Comanda anulată", { status: 200 });
  }
  return new Response("Eroare la anulare", { status: 500 });
}
