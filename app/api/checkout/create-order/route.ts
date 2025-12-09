import { NextRequest, NextResponse } from 'next/server';
import { fulfillOrder } from '@/lib/orderService';
import { getAuthSession } from '@/lib/auth';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    const session = await getAuthSession();
    const userId = session?.user ? (session.user as any).id : null;
    
    const paymentMethod = orderData.paymentMethod || 'cash_on_delivery';

    if (!orderData?.address || !orderData?.billing || !orderData?.items) {
      return NextResponse.json({ error: 'Date de comandă invalide.' }, { status: 400 });
    }

    // CRITICAL FIX: Transform payload address and billing from checkout shape to orderService shape
    // Checkout sends: firstName, lastName, phone, county, city, street, postalCode
    // orderService expects: nume_prenume, telefon, judet, localitate, strada_nr, postCode
    const transformedAddress = {
      nume_prenume: [orderData.address.firstName || '', orderData.address.lastName || ''].join(' ').trim() || orderData.address.nume_prenume || '',
      email: orderData.address.email || '',
      telefon: orderData.address.phone || orderData.address.telefon || '',
      judet: orderData.address.county || orderData.address.judet || '',
      localitate: orderData.address.city || orderData.address.localitate || '',
      strada_nr: orderData.address.street || orderData.address.strada_nr || '',
      postCode: orderData.address.postalCode || orderData.address.postCode || '',
      bloc: orderData.address.bloc || '',
      scara: orderData.address.scara || '',
      etaj: orderData.address.etaj || '',
      ap: orderData.address.ap || '',
      interfon: orderData.address.interfon || '',
    };

    const isBillingCompany = orderData.billing.type === 'company' || orderData.billing.tip_factura === 'persoana_juridica';
    const transformedBilling = {
      tip_factura: isBillingCompany ? ('persoana_juridica' as const) : ('persoana_fizica' as const),
      name: isBillingCompany ? undefined : [orderData.billing.firstName || '', orderData.billing.lastName || ''].join(' ').trim() || orderData.billing.name || '',
      email: orderData.billing.email || transformedAddress.email,
      telefon: orderData.billing.phone || orderData.billing.telefon || transformedAddress.telefon,
      denumire_companie: isBillingCompany ? (orderData.billing.companyName || orderData.billing.denumire_companie || '') : undefined,
      cui: isBillingCompany ? (orderData.billing.cui || '') : undefined,
      reg_com: isBillingCompany ? (orderData.billing.regCom || orderData.billing.reg_com || '') : undefined,
      judet: orderData.billing.county || orderData.billing.judet || transformedAddress.judet,
      localitate: orderData.billing.city || orderData.billing.localitate || transformedAddress.localitate,
      strada_nr: orderData.billing.street || orderData.billing.strada_nr || transformedAddress.strada_nr,
      postCode: orderData.billing.postalCode || orderData.billing.postCode || transformedAddress.postCode,
    };

    // Diagnostic: log transformed payload essentials
    const diag = {
      pm: paymentMethod,
      user: userId || 'GUEST',
      addressEmail: transformedAddress.email,
      addressPhone: transformedAddress.telefon,
      addressName: transformedAddress.nume_prenume,
      billingEmail: transformedBilling.email,
      billingPhone: transformedBilling.telefon,
      billingType: transformedBilling.tip_factura,
      itemsCount: Array.isArray(orderData?.items) ? orderData.items.length : 0,
    };
    console.log('[API /checkout/create-order] diag', diag);

    // Replace orderData.address and orderData.billing with transformed versions
    orderData.address = transformedAddress;
    orderData.billing = transformedBilling;

    // Dacă plata este cu cardul, creăm Stripe session
    if (paymentMethod === 'card') {
      const { items } = orderData;
      
      if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: 'Coșul este gol.' }, { status: 400 });
      }

      const FREE_SHIPPING_THRESHOLD = 500;
      const SHIPPING_FEE = 19.99;
      const subtotal = items.reduce((s: number, it: any) => s + (Number(it.unitAmount ?? it.price ?? 0) * Number(it.quantity ?? 1)), 0);
      const costLivrare = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

      try {
        const origin = req.headers.get('origin') || process.env.PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const secret = process.env.STRIPE_SECRET_KEY;
        
        if (!secret) {
          return NextResponse.json({ error: 'STRIPE_SECRET_KEY nu este setat' }, { status: 500 });
        }
        
        const stripe = new Stripe(secret);

        // Salvăm datele comenzii în metadata pentru webhook (FOLOSIM transformedAddress și transformedBilling)
        const metadata: Record<string, string> = {
          cart: JSON.stringify(items),
          address: JSON.stringify(transformedAddress),
          billing: JSON.stringify(transformedBilling),
          userId: userId || '',
          discountCode: orderData.discountCode || '',
          discountAmount: String(orderData.discountAmount || 0),
        };

        if (orderData.marketing) {
          metadata.marketing = JSON.stringify(orderData.marketing);
        }

        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          payment_method_types: ['card'],
          customer_email: transformedAddress.email || undefined,
          line_items: [
            ...items.map((item: any) => ({
              price_data: {
                currency: 'ron',
                product_data: { name: item.name },
                unit_amount: Math.round((item.unitAmount || item.price) * 100),
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
          metadata,
          success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/checkout`,
        });

        return NextResponse.json({ 
          sessionId: session.id,
          url: session.url // URL-ul pentru redirect către Stripe Checkout
        });
      } catch (err: any) {
        console.error('[Stripe] Eroare creare sesiune:', err?.message || err);
        return NextResponse.json({ error: err?.message || 'Eroare Stripe' }, { status: 500 });
      }
    } 
    
    // Pentru transfer bancar și ramburs, creăm comanda direct
    else {
      try {
        const { invoiceLink, orderNo, orderId } = await fulfillOrder(
          { 
            ...orderData, 
            userId,
            cart: orderData.items // orderService așteaptă cart, nu items
          }, 
          'Ramburs' // Pentru transfer bancar și cash on delivery folosim 'Ramburs'
        );

        return NextResponse.json({
          success: true,
          message: 'Comanda a fost procesată!',
          invoiceLink: invoiceLink ?? null,
          orderNo: orderNo ?? null,
          orderId: orderId ?? null,
        });
      } catch (error: any) {
        console.error('[API /checkout/create-order] EROARE la fulfillOrder:', error?.message || error);
        console.error('[API /checkout/create-order] ENV check:', {
          hasDB: Boolean(process.env.DATABASE_URL || process.env.DATABASE_INTERNAL_URL),
          hasResend: Boolean(process.env.RESEND_API_KEY),
          emailFromSet: Boolean(process.env.EMAIL_FROM),
          adminEmailSet: Boolean(process.env.ADMIN_EMAIL),
        });
        return NextResponse.json({ error: 'Eroare la procesarea comenzii.' }, { status: 500 });
      }
    }
  } catch (error: any) {
    console.error('[API /checkout/create-order] EROARE:', error?.message || error);
    return NextResponse.json({ error: 'Eroare internă.' }, { status: 500 });
  }
}
