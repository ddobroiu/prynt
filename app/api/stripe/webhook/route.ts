// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { createOblioInvoice, ensureOblioCustomer } from '@/lib/oblio';
import { createDpdShipment } from '@/lib/dpd';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  const raw = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return NextResponse.json({ error: `Invalid signature: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as any;
        const orderId = pi.metadata?.orderId as string | undefined;
        if (!orderId) break;

        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            customer: { include: { billingAddress: true, shippingAddress: true } },
            items: true,
            payment: true,
            shipment: true,
          },
        });
        if (!order) break;

        // 1) marchează plata
        await prisma.payment.update({
          where: { orderId: order.id },
          data: { status: 'SUCCEEDED' },
        });
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'PAID' },
        });

        // 2) OBLIO: asigură client + creează factură
        const oblioCustomer = await ensureOblioCustomer({
          isCompany: order.customer?.isCompany ?? false,
          fullName: order.customer?.fullName ?? undefined,
          email: order.customer?.email ?? '',
          phone: order.customer?.phone ?? undefined,
          companyName: order.customer?.companyName ?? undefined,
          cui: order.customer?.cui ?? undefined,
          regCom: order.customer?.regCom ?? undefined,
          address: {
            street: order.customer?.billingAddress?.street ?? '',
            city: order.customer?.billingAddress?.city ?? '',
            state: order.customer?.billingAddress?.state ?? undefined,
            postalCode: order.customer?.billingAddress?.postalCode ?? '',
            country: order.customer?.billingAddress?.country ?? 'RO',
          },
        });

        const invoice = await createOblioInvoice({
          customerId: oblioCustomer.id,
          currency: order.currency,
          lines: order.items.map((it) => ({
            name: it.name,
            code: it.sku,
            qty: it.quantity,
            unitPrice: Number(it.unitPrice),
            vatRate: Number(it.vatRate),
          })),
        });

        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'INVOICED', oblioInvoiceId: invoice.invoiceId, oblioInvoiceUrl: invoice.invoiceUrl },
        });

        // 3) DPD: creează expediere
        const shipment = await createDpdShipment({
          recipient: {
            name:
              order.shippingAddress?.name ??
              order.customer?.fullName ??
              order.customer?.companyName ??
              'Client',
            phone: order.customer?.phone ?? undefined,
            street: order.shippingAddress?.street ?? '',
            city: order.shippingAddress?.city ?? '',
            state: order.shippingAddress?.state ?? undefined,
            postalCode: order.shippingAddress?.postalCode ?? '',
            country: order.shippingAddress?.country ?? 'RO',
          },
          weightGr: order.totalWeightGr,
        });

        await prisma.shipment.update({
          where: { orderId: order.id },
          data: { status: 'READY', awb: shipment.awb, labelUrl: shipment.labelUrl, trackingUrl: shipment.trackingUrl },
        });

        // 4) marchează pregătire livrare
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'FULFILLMENT' },
        });

        break;
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as any;
        const orderId = pi.metadata?.orderId as string | undefined;
        if (!orderId) break;

        await prisma.payment.updateMany({
          where: { orderId },
          data: { status: 'FAILED' },
        });
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'FAILED' },
        });
        break;
      }

      default:
        // alte evenimente neinteresante acum
        break;
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
