// app/api/orders/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createOrderSchema } from '@/lib/validation';
import { Decimal } from '@prisma/client/runtime/library';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parse = createOrderSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: 'Invalid payload', issues: parse.error.flatten() }, { status: 400 });
    }
    const { items, customer, currency, shippingMethod, shippingCost, discountTotal } = parse.data;

    // calcule
    const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
    const vatTotal = items.reduce((s, it) => s + (it.unitPrice * it.quantity * it.vatRate) / 100, 0);
    const totalWeightGr = items.reduce((s, it) => s + it.weightGr * it.quantity, 0);
    const total = subtotal + vatTotal + shippingCost - discountTotal;

    // adrese
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
        currency,
        subtotal: new Decimal(subtotal.toFixed(2)),
        shippingCost: new Decimal(shippingCost.toFixed(2)),
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
          create: {
            provider: 'dpd',
            status: 'PENDING',
          },
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ orderId: order.id, total, currency, shippingMethod }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
