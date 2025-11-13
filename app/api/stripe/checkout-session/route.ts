import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lazy-init inside handler to avoid build-time env requirements on platforms

export async function POST(req: NextRequest) {
  // 1. Primește TOATE datele comenzii
  const { cart, address, billing, marketing } = await req.json();

  if (!Array.isArray(cart) || cart.length === 0) {
    return NextResponse.json({ error: 'Coșul este gol.' }, { status: 400 });
  }

  const costLivrare = 19.99;

  try {
    const origin =
      req.headers.get('origin') ||
      process.env.PUBLIC_BASE_URL ||
      'http://localhost:3000';

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY nu este setat' }, { status: 500 });
    }
    const stripe = new Stripe(secret);
    const metadata: Record<string, string> = {
      cart: JSON.stringify(cart),
      address: JSON.stringify(address),
      billing: JSON.stringify(billing),
    };
    if (marketing) {
      try { metadata.marketing = JSON.stringify(marketing); } catch {}
    }

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
      metadata,
      // 3. Redirect după plată (Embedded Checkout)
      return_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err: any) {
    console.error('[Stripe] Eroare creare sesiune:', err?.message || err);
    return NextResponse.json({ error: err?.message || 'Eroare Stripe' }, { status: 500 });
  }
}