
import type { Request } from "next/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const orderId = params.id;
  const result = await prisma.order.update({
    where: { id: orderId },
    data: { status: "fulfilled" },
  }).catch(() => null);
  if (result) {
    return new Response("Comanda marcată ca finalizată", { status: 200 });
  }
  return new Response("Eroare la finalizare", { status: 500 });
}
