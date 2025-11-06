import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  // 1. Primește TOATE datele comenzii
  const { cart, address, billing } = await req.json();

  if (!Array.isArray(cart) || cart.length === 0) {
    return NextResponse.json({ error: 'Coșul este gol.' }, { status: 400 });
  }

  const costLivrare = 19.99;

  try {
    const origin =
      req.headers.get('origin') ||
      process.env.PUBLIC_BASE_URL ||
      'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: address?.email || undefined,
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
        },
      ],
      // 2. Datele comenzii în metadata (webhook le folosește la fulfillOrder)
      metadata: {
        cart: JSON.stringify(cart),
        address: JSON.stringify(address),
        billing: JSON.stringify(billing),
      },
      // 3. Redirect după plată (Embedded Checkout)
      return_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err: any) {
    console.error('[Stripe] Eroare creare sesiune:', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Eroare Stripe' }, { status: 500 });
  }
}