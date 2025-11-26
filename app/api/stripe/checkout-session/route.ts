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

  // Shipping: free above threshold, otherwise standard fee
  const FREE_SHIPPING_THRESHOLD = 500;
  const SHIPPING_FEE = 19.99;
  const subtotal = (cart ?? []).reduce((s: number, it: any) => s + (Number(it.unitAmount ?? it.price ?? 0) * Number(it.quantity ?? 1)), 0);
  const costLivrare = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

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
    // Avoid sending large blobs to Stripe metadata (limit 500 chars per value).
    // Send a compact summary instead and include an address email for reference.
    const safeCartItems = JSON.stringify((cart ?? []).map((it: any) => ({ id: it.id, name: it.name, quantity: it.quantity })));
    const metadata: Record<string, string> = {
      cart_count: String((cart ?? []).length),
      subtotal: String(Math.round(subtotal * 100)),
      cart_items: safeCartItems.length > 450 ? safeCartItems.slice(0, 450) : safeCartItems,
      address_email: address?.email || '',
      billing_method: billing?.method || '',
    };
    if (marketing && typeof marketing === 'object') {
      try {
        const m = JSON.stringify(marketing);
        if (m.length <= 450) metadata.marketing = m;
      } catch {}
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