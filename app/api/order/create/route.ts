import { NextRequest, NextResponse } from 'next/server';
import { fulfillOrder } from '../../../../lib/orderService';
import { getAuthSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    const session = await getAuthSession();
    const userId = session?.user ? (session.user as any).id : null;
    
    // Extragem metoda de plată din request (default Ramburs dacă nu e setat)
    const paymentMethod = orderData.paymentMethod || 'Ramburs';

    console.log(`[API /order/create] Placing order. User: ${userId || 'GUEST'}, Method: ${paymentMethod}`);

    if (!orderData?.address || !orderData?.billing || !orderData?.cart) {
      return NextResponse.json({ success: false, message: 'Date de comandă invalide.' }, { status: 400 });
    }

    // Trimitem paymentMethod corect către fulfillOrder
    const { invoiceLink, orderNo } = await fulfillOrder({ ...orderData, userId }, paymentMethod);

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