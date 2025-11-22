import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminSession } from "@/lib/adminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("admin_auth")?.value;
    const session = verifyAdminSession(token);
    if (!session) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const name = String(body.name || "").trim();
    const qty = Number.isFinite(Number(body.qty)) ? Number(body.qty) : 1;
    const unit = Number.isFinite(Number(body.price)) ? Number(body.price) : 0;

    if (!name) return NextResponse.json({ ok: false, message: "Missing name" }, { status: 400 });

    const total = Number((qty * unit).toFixed(2));

    const created = await prisma.orderItem.create({ data: { orderId: id, name, qty, unit, total } });

    // Recalculate order total (sum of items + shippingFee)
    try {
      const items = await prisma.orderItem.findMany({ where: { orderId: id }, select: { total: true } });
      const itemsTotal = items.reduce((s, it) => s + Number(it.total || 0), 0);
      const order = await prisma.order.findUnique({ where: { id }, select: { shippingFee: true } });
      const shipping = order?.shippingFee ? Number(order.shippingFee) : 0;
      const newTotal = Number((itemsTotal + shipping).toFixed(2));
      await prisma.order.update({ where: { id }, data: { total: newTotal } });
      try { const { revalidatePath } = await import('next/cache'); revalidatePath('/admin/orders'); revalidatePath('/admin/users'); } catch(e){}
    } catch (e) {
      console.warn('Failed to recalc order total after add', e);
    }

    return NextResponse.json({ ok: true, item: created });
  } catch (e: any) {
    console.error('[API admin items POST] Error:', e?.message || e);
    return NextResponse.json({ ok: false, message: 'Eroare internă' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("admin_auth")?.value;
    const session = verifyAdminSession(token);
    if (!session) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const url = new URL(req.url);
    const itemId = url.searchParams.get('itemId');
    if (!itemId) return NextResponse.json({ ok: false, message: 'Missing itemId' }, { status: 400 });

    // Verify item belongs to order
    const item = await prisma.orderItem.findUnique({ where: { id: itemId }, select: { orderId: true } });
    if (!item || item.orderId !== id) return NextResponse.json({ ok: false, message: 'Item not found on this order' }, { status: 404 });

    await prisma.orderItem.delete({ where: { id: itemId } });

    // Recalculate order total
    try {
      const items = await prisma.orderItem.findMany({ where: { orderId: id }, select: { total: true } });
      const itemsTotal = items.reduce((s, it) => s + Number(it.total || 0), 0);
      const order = await prisma.order.findUnique({ where: { id }, select: { shippingFee: true } });
      const shipping = order?.shippingFee ? Number(order.shippingFee) : 0;
      const newTotal = Number((itemsTotal + shipping).toFixed(2));
      await prisma.order.update({ where: { id }, data: { total: newTotal } });
      try { const { revalidatePath } = await import('next/cache'); revalidatePath('/admin/orders'); revalidatePath('/admin/users'); } catch(e){}
    } catch (e) {
      console.warn('Failed to recalc order total after delete', e);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[API admin items DELETE] Error:', e?.message || e);
    return NextResponse.json({ ok: false, message: 'Eroare internă' }, { status: 500 });
  }
}
