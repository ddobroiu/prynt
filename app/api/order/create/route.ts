import { NextRequest, NextResponse } from 'next/server';
import { fulfillOrder } from '../../../../lib/orderService';

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    if (!orderData?.address || !orderData?.billing || !orderData?.cart) {
      return NextResponse.json({ success: false, message: 'Date de comandă invalide.' }, { status: 400 });
    }

    // IMPORTANT: nu mai blocăm comanda dacă Oblio pică
    const { invoiceLink, warnings } = await fulfillOrder(orderData, 'Ramburs');

    return NextResponse.json({
      success: true,
      message: warnings.length ? 'Comanda a fost procesată cu avertismente.' : 'Comanda a fost procesată!',
      invoiceLink: invoiceLink ?? null,
      warnings,
    });
  } catch (error: any) {
    console.error('[API /order/create] EROARE:', error?.message || error);
    // Răspundem JSON valid – evită “Unexpected token '<' ...”
    return NextResponse.json({ success: false, message: 'Eroare internă.' }, { status: 500 });
  }
}