// app/api/checkout/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.status !== 'PENDING_PAYMENT') {
      return NextResponse.json({ error: 'Order not payable in current status' }, { status: 400 });
    }

    const amountInMinor = Math.round(Number(order.total) * 100); // RON → bani

    // creează PaymentIntent (sau re-folosește unul existent)
    let clientSecret: string | undefined;
    let piId: string | undefined;

    if (order.payment?.stripePaymentIntentId) {
      const existing = await stripe.paymentIntents.retrieve(order.payment.stripePaymentIntentId);
      clientSecret = existing.client_secret ?? undefined;
      piId = existing.id;
    } else {
      const pi = await stripe.paymentIntents.create({
        amount: amountInMinor,
        currency: order.currency.toLowerCase(), // "ron"
        automatic_payment_methods: { enabled: true },
        metadata: { orderId: order.id },
      });

      await prisma.payment.create({
        data: {
          orderId: order.id,
          provider: 'stripe',
          status: 'PENDING',
          amount: order.total,
          currency: order.currency,
          stripePaymentIntentId: pi.id,
          stripeClientSecret: pi.client_secret ?? undefined,
        },
      });

      clientSecret = pi.client_secret ?? undefined;
      piId = pi.id;
    }

    return NextResponse.json({ clientSecret, paymentIntentId: piId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
