import { prisma } from "@/lib/prisma";
import type { RouteHandler } from "next/dist/server/future/route-modules/types";

export const POST: RouteHandler = async (request, { params }) => {
  const orderId = params.id;
  let response;
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "canceled", canceledAt: new Date() },
    });
    response = new Response("Comanda anulată", { status: 200 });
  } catch (e) {
    response = new Response("Eroare la anulare", { status: 500 });
  }
  return response;
};
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
