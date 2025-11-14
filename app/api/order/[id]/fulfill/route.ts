import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
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
