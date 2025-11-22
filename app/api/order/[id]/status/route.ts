import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";


async function handleStatusUpdate(request: NextRequest, orderId: string) {
  let body: any = {};
  try {
    body = await request.json();
  } catch {}
  const status = body?.status;
  if (!status || !["canceled", "fulfilled", "active"].includes(status)) {
    return new Response("Invalid status", { status: 400 });
  }
  const data: any = { status };
  if (status === "canceled") data.canceledAt = new Date();
  if (status !== "canceled") data.canceledAt = null;
  const result = await prisma.order.update({ where: { id: orderId }, data }).catch(() => null);
  if (!result) return new Response("Eroare la actualizare", { status: 500 });
  try {
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/admin/users');
    revalidatePath('/admin/orders');
  } catch (e) {
    console.warn('[revalidate] order status update failed', (e as any)?.message || e);
  }
  return new Response(JSON.stringify({ id: result.id, status: result.status }), { status: 200 });
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const orderId = params.id;
  return handleStatusUpdate(request, orderId);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const orderId = params.id;
  return handleStatusUpdate(request, orderId);
}
