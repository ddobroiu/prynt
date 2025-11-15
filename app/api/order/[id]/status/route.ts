import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const orderId = params.id;
  let body: any = {};
  try {
    body = await request.json();
  } catch {}
  const status = body?.status;
  if (!status || !["canceled", "fulfilled", "in_progress"].includes(status)) {
    return new Response("Invalid status", { status: 400 });
  }

  const data: any = { status };
  if (status === "canceled") data.canceledAt = new Date();
  if (status !== "canceled") data.canceledAt = null;

  const result = await prisma.order.update({ where: { id: orderId }, data }).catch(() => null);
  if (!result) return new Response("Eroare la actualizare", { status: 500 });
  return new Response(JSON.stringify({ id: result.id, status: result.status }), { status: 200 });
}
