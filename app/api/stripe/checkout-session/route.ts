import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    const { address, billing, cart } = await req.json();
    const costLivrare = 19.99;
    const totalComanda = cart.reduce((acc: number, item: any) => acc + item.totalAmount, 0) + costLivrare;

    try {
        const line_items = cart.map((item: any) => ({
            price_data: {
                currency: 'ron',
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.unitAmount * 100), // Prețul în bani (ex: 10.50 RON -> 1050)
            },
            quantity: item.quantity,
        }));

        // Adaugă taxa de livrare ca un item separat
        line_items.push({
            price_data: {
                currency: 'ron',
                product_data: {
                    name: 'Cost Livrare',
                },
                unit_amount: Math.round(costLivrare * 100),
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/checkout`,
            // --- METADATE: Salvăm datele comenzii pentru a le folosi în webhook ---
            metadata: {
                cart: JSON.stringify(cart),
                address: JSON.stringify(address),
                billing: JSON.stringify(billing),
            }
        });

        return NextResponse.json({ sessionId: session.id });

    } catch (err: any) {
        console.error("Eroare creare sesiune Stripe:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}