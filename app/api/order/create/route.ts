import { NextRequest, NextResponse } from 'next/server';
import { fulfillOrder } from '../../../lib/orderService'; // Importăm funcția noastră centralizată

export async function POST(req: NextRequest) {
    // Extragem datele comenzii din request
    const orderData = await req.json();

    if (!orderData.address || !orderData.billing || !orderData.cart) {
        return NextResponse.json({ message: 'Date de comandă invalide.' }, { status: 400 });
    }

    try {
        // Apelăm funcția centralizată pentru a procesa comanda
        const { invoiceLink } = await fulfillOrder(orderData, 'Ramburs');
        
        // Returnăm un răspuns de succes
        return NextResponse.json({ success: true, message: 'Comanda a fost procesată!', invoiceLink: invoiceLink });

    } catch (error: any) {
        console.error('[API /order/create] - EROARE CRITICĂ:', error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}