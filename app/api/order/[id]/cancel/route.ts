
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const orderId = params.id;
  const result = await prisma
    .order.update({ where: { id: orderId }, data: { status: "canceled", canceledAt: new Date() } })
    .catch(() => null);
  if (result) {
    return new Response("Comanda anulată", { status: 200 });
  }
  return new Response("Eroare la anulare", { status: 500 });
}
