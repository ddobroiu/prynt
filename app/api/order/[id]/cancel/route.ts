import { prisma } from "@/lib/prisma";
import type { RouteHandler } from "next/dist/server/future/route-modules/types";

export async function POST(request, { params }) {
  const orderId = params.id;
  let ok = false;
  let result = null;
  try {
    result = await prisma.order.update({
      where: { id: orderId },
      data: { status: "canceled", canceledAt: new Date() },
    });
    ok = true;
  } catch {}
  if (ok && result) {
    return new Response("Comanda anulată", { status: 200 });
  }
  return new Response("Eroare la anulare", { status: 500 });
}
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
