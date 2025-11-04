// app/api/orders/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createOrderSchema } from '@/lib/validation';
import { Decimal } from '@prisma/client/runtime/library';
import { createOblioInvoice } from '@/lib/oblio';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parse = createOrderSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: 'Invalid payload', issues: parse.error.flatten() }, { status: 400 });
    }
    const { items, customer, currency, discountTotal, paymentMethod } = parse.data;

    const SHIPPING_COST = 24;
    const shippingMethod = 'dpd_standard' as const;

    const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
    const vatTotal = items.reduce((s, it) => s + (it.unitPrice * it.quantity * it.vatRate) / 100, 0);
    const totalWeightGr = items.reduce((s, it) => s + it.weightGr * it.quantity, 0);
    const total = subtotal + vatTotal + SHIPPING_COST - discountTotal;

    const billing = await prisma.address.create({
      data: {
        name: customer.isCompany ? customer.companyName ?? undefined : customer.fullName ?? undefined,
        street: customer.billingAddress.street,
        city: customer.billingAddress.city,
        state: customer.billingAddress.state,
        postalCode: customer.billingAddress.postalCode,
        country: customer.billingAddress.country ?? 'RO',
        phone: customer.phone,
      },
    });

    const shippingAdrData = customer.shippingDifferent && customer.shippingAddress
      ? customer.shippingAddress
      : customer.billingAddress;

    const shipping = await prisma.address.create({
      data: {
        name: shippingAdrData.name ?? (customer.isCompany ? customer.companyName ?? undefined : customer.fullName ?? undefined),
        street: shippingAdrData.street,
        city: shippingAdrData.city,
        state: shippingAdrData.state,
        postalCode: shippingAdrData.postalCode,
        country: shippingAdrData.country ?? 'RO',
        phone: customer.phone,
      },
    });

    const cust = await prisma.customer.create({
      data: {
        isCompany: customer.isCompany,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        companyName: customer.companyName,
        cui: customer.cui,
        regCom: customer.regCom,
        billingAddressId: billing.id,
        shippingAddressId: shipping.id,
      },
    });

    const order = await prisma.order.create({
      data: {
        status: 'PENDING_PAYMENT',
        paymentMethod: paymentMethod ?? 'card',
        currency,
        subtotal: new Decimal(subtotal.toFixed(2)),
        shippingCost: new Decimal(SHIPPING_COST.toFixed(2)),
        vatTotal: new Decimal(vatTotal.toFixed(2)),
        discountTotal: new Decimal(discountTotal.toFixed(2)),
        total: new Decimal(total.toFixed(2)),
        totalWeightGr,
        customerId: cust.id,
        billingAddressId: billing.id,
        shippingAddressId: shipping.id,
        items: {
          create: items.map((it) => ({
            sku: it.sku,
            name: it.name,
            quantity: it.quantity,
            unitPrice: new Decimal(it.unitPrice.toFixed(2)),
            vatRate: new Decimal(it.vatRate.toFixed(2)),
            weightGr: it.weightGr ?? 0,
            lengthMm: it.lengthMm,
            widthMm: it.widthMm,
            heightMm: it.heightMm,
          })),
        },
        shipment: {
          create: { provider: 'dpd', status: 'PENDING' },
        },
      },
      include: { items: true, billingAddress: true, customer: true },
    });

    // 🟢 Dacă e plata la livrare — emitem factura imediat
    if (paymentMethod === 'cash_on_delivery') {
      const invoice = await createOblioInvoice({
        currency: order.currency,
        client: {
          cif: order.customer?.cui ?? undefined,
          name: order.customer?.isCompany ? order.customer?.companyName ?? '' : order.customer?.fullName ?? '',
          address: order.billingAddress?.street ?? '',
          state: order.billingAddress?.state ?? '',
          city: order.billingAddress?.city ?? '',
          country: order.billingAddress?.country ?? 'RO',
          email: order.customer?.email ?? '',
          phone: order.customer?.phone ?? '',
          vatPayer: !!order.customer?.isCompany,
        },
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
        data: {
          status: 'AWAITING_SHIPMENT',
          paymentMethod: 'cash_on_delivery',
          oblioInvoiceId: `${invoice.seriesName}-${invoice.number}`,
          oblioInvoiceUrl: invoice.link,
        },
      });

      return NextResponse.json({
        orderId: order.id,
        total,
        currency,
        paymentMethod: 'cash_on_delivery',
        message: 'Comandă plasată cu plată la livrare. Factura a fost emisă.',
      });
    }

    // 💳 Plata cu card — continuă către Stripe
    return NextResponse.json({
      orderId: order.id,
      total,
      currency,
      paymentMethod: 'card',
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
