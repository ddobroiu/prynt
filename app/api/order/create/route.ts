import { NextRequest, NextResponse } from 'next/server';
import { fulfillOrder } from '../../../../lib/orderService';
import { getAuthSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    const session = await getAuthSession();
    const userId = (session?.user as any)?.id || null;

    if (!orderData?.address || !orderData?.billing || !orderData?.cart) {
      return NextResponse.json({ success: false, message: 'Date de comandă invalide.' }, { status: 400 });
    }

  // NON‑BLOCANT față de Oblio
  const { invoiceLink, orderNo } = await fulfillOrder({ ...orderData, userId }, 'Ramburs');

    return NextResponse.json({
      success: true,
      message: 'Comanda a fost procesată!',
      invoiceLink: invoiceLink ?? null,
      orderNo: orderNo ?? null,
    });
  } catch (error: any) {
    console.error('[API /order/create] EROARE:', error?.message || error);
    return NextResponse.json({ success: false, message: 'Eroare internă.' }, { status: 500 });
  }
}