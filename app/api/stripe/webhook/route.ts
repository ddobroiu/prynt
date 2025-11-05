import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { fulfillOrder } from '../../../lib/orderService'; // CALEA CORECTATĂ

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (!session.metadata) {
            console.error("Metadata Stripe lipsă! Nu se poate procesa comanda.");
            return NextResponse.json({ error: "Metadata lipsă" }, { status: 400 });
        }

        const orderData = {
            cart: JSON.parse(session.metadata.cart),
            address: JSON.parse(session.metadata.address),
            billing: JSON.parse(session.metadata.billing),
        };

        try {
            await fulfillOrder(orderData, 'Card');
        } catch (err: any) {
            console.error("[Webhook] EROARE la procesarea comenzii după plată:", err.message);
            return NextResponse.json({ error: "Eroare la procesarea internă a comenzii." }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}