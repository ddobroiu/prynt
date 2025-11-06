import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { fulfillOrder } from '../../../../lib/orderService';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const signature = req.headers.get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[Stripe Webhook] Missing STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Missing webhook secret' }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    // IMPORTANT: Stripe vrea raw body ca Buffer
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
        return NextResponse.json({ error: 'Metadata lipsă' }, { status: 400 });
      }

      const orderData = {
        cart: JSON.parse(session.metadata.cart),
        address: JSON.parse(session.metadata.address),
        billing: JSON.parse(session.metadata.billing),
      };

      await fulfillOrder(orderData, 'Card');
    }
  } catch (err: any) {
    console.error('[Stripe Webhook] Handler error:', err?.message || err);
    return NextResponse.json({ error: 'Eroare la procesarea internă a comenzii.' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}