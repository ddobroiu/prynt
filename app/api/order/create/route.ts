import { NextRequest, NextResponse } from 'next/server';
import { fulfillOrder } from '../../../../lib/orderService'; // CORECTAT: 4 puncte-puncte

export async function POST(req: NextRequest) {
    const orderData = await req.json();

    if (!orderData.address || !orderData.billing || !orderData.cart) {
        return NextResponse.json({ message: 'Date de comandă invalide.' }, { status: 400 });
    }

    try {
        const { invoiceLink } = await fulfillOrder(orderData, 'Ramburs');
        
        return NextResponse.json({ success: true, message: 'Comanda a fost procesată!', invoiceLink: invoiceLink });

    } catch (error: any) {
        console.error('[API /order/create] - EROARE CRITICĂ:', error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}