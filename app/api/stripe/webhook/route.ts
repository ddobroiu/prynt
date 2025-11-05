import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
// Importăm funcțiile de generare factură și trimitere email din celălalt fișier
// (sau le copiem aici, pentru a fi mai simplu)
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = headers().get('stripe-signature') as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Ascultăm evenimentul `checkout.session.completed`
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Extragem metadatele pe care le-am salvat
        const metadata = session.metadata;
        if (!metadata) {
            console.error("Metadata lipsă în sesiunea Stripe!");
            return NextResponse.json({ error: "Metadata lipsă" }, { status: 400 });
        }

        const cart = JSON.parse(metadata.cart);
        const address = JSON.parse(metadata.address);
        const billing = JSON.parse(metadata.billing);

        try {
            // Aici refolosim logica din /api/order/create
            // 1. Generare Factură Oblio
            // 2. Trimitere emailuri Resend
            console.log("Plată confirmată! Se generează factura și se trimit emailurile pentru:", address.email);
            
            // Puteți extrage logica Oblio și Resend în funcții separate pentru a nu repeta cod
            // Pentru simplitate, am omis codul Oblio/Resend, dar el trebuie adăugat aici.

            return NextResponse.json({ received: true });

        } catch (err: any) {
            console.error("Eroare la procesarea comenzii după plată:", err.message);
            return NextResponse.json({ error: "Eroare la procesarea comenzii." }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}