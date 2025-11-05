import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    const { cart } = await req.json();
    const costLivrare = 19.99;
    const totalComanda = cart.reduce((acc: number, item: any) => acc + item.totalAmount, 0) + costLivrare;

    try {
        const session = await stripe.checkout.sessions.create({
            // Noua integrare necesită 'embedded'
            ui_mode: 'embedded',
            line_items: [
                ...cart.map((item: any) => ({
                    price_data: {
                        currency: 'ron',
                        product_data: { name: item.name },
                        unit_amount: Math.round(item.unitAmount * 100),
                    },
                    quantity: item.quantity,
                })),
                {
                    price_data: {
                        currency: 'ron',
                        product_data: { name: 'Cost Livrare' },
                        unit_amount: Math.round(costLivrare * 100),
                    },
                    quantity: 1,
                }
            ],
            mode: 'payment',
            // Return URL este acum necesar pentru embedded checkout
            return_url: `${req.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        });

        // Returnează client_secret în loc de sessionId
        return NextResponse.json({ clientSecret: session.client_secret });

    } catch (err: any) {
        console.error("Eroare creare sesiune Stripe:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}