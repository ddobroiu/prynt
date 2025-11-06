import { NextRequest, NextResponse } from 'next/server';
import { fulfillOrder } from '../../../../lib/orderService';

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();

    if (!orderData?.address || !orderData?.billing || !orderData?.cart) {
      return NextResponse.json({ success: false, message: 'Date de comandă invalide.' }, { status: 400 });
    }

    // NON‑BLOCANT față de Oblio
    const { invoiceLink } = await fulfillOrder(orderData, 'Ramburs');

    return NextResponse.json({
      success: true,
      message: 'Comanda a fost procesată!',
      invoiceLink: invoiceLink ?? null,
    });
  } catch (error: any) {
    console.error('[API /order/create] EROARE:', error?.message || error);
    // Întotdeauna JSON, ca front-end-ul să nu mai vadă “Unexpected token '<'...”
    return NextResponse.json({ success: false, message: 'Eroare internă.' }, { status: 500 });
  }
}