import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { fulfillOrder } from '../../../../lib/orderService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Do not create Stripe client at module load; build may not provide env

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[Stripe Webhook] Missing STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Missing webhook secret' }, { status: 500 });
  }
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    console.error('[Stripe Webhook] Missing STRIPE_SECRET_KEY');
    return NextResponse.json({ error: 'Missing Stripe secret key' }, { status: 500 });
  }
  const stripe = new Stripe(secret);

  let event: Stripe.Event;
  try {
    const buf = Buffer.from(await req.arrayBuffer());
    event = stripe.webhooks.constructEvent(buf, signature, webhookSecret);
  } catch (err: any) {
    console.error('[Stripe Webhook] Signature verify failed:', err?.message || err);
    return NextResponse.json({ error: `Webhook Error: ${err?.message || 'invalid signature'}` }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.metadata) {
        console.error('[Stripe Webhook] Metadata lipsă pe session');
        return NextResponse.json({ received: true, warning: 'metadata-missing' });
      }

      const orderData = {
        cart: JSON.parse(session.metadata.cart),
        address: JSON.parse(session.metadata.address),
        billing: JSON.parse(session.metadata.billing),
      };

      // NU aruncăm dacă Oblio pică – comanda merge oricum
      await fulfillOrder(orderData, 'Card');
    }
  } catch (err: any) {
    console.error('[Stripe Webhook] Handler error:', err?.message || err);
  }

  return NextResponse.json({ received: true });
}