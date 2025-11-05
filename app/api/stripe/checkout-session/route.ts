import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    // 1. Primește TOATE datele comenzii, nu doar coșul
    const { cart, address, billing } = await req.json();
    const costLivrare = 19.99;
    const totalComanda = cart.reduce((acc: number, item: any) => acc + item.totalAmount, 0) + costLivrare;

    if (!cart || cart.length === 0) {
        return NextResponse.json({ error: "Coșul este gol." }, { status: 400 });
    }

    try {
        const session = await stripe.checkout.sessions.create({
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
            // 2. Adaugă datele comenzii în metadata pentru a le recupera după plată
            metadata: {
                cart: JSON.stringify(cart),
                address: JSON.stringify(address),
                billing: JSON.stringify(billing),
            },
            return_url: `${req.headers.get('origin')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        });

        return NextResponse.json({ clientSecret: session.client_secret });

    } catch (err: any) {
        console.error("Eroare creare sesiune Stripe:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}