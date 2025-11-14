import { prisma } from "@/lib/prisma";
import type { RouteHandler } from "next/dist/server/future/route-modules/types";

  const orderId = params.id;
  const result = await prisma.order.update({
    where: { id: orderId },
    data: { status: "fulfilled" },
  }).catch(() => null);
  return result
    ? new Response("Comanda marcată ca finalizată", { status: 200 })
    : new Response("Eroare la finalizare", { status: 500 });
}
  const orderId = params.id;
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "fulfilled" },
    });
    return new Response("Comanda marcată ca finalizată", { status: 200 });
  } catch (e) {
    return new Response("Eroare la finalizare", { status: 500 });
  }
}
