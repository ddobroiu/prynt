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

    // Diagnostic: log payload essentials without sensitive data
    const diag = {
      pm: paymentMethod,
      user: userId || 'GUEST',
      addressEmail: orderData?.address?.email,
      addressPhone: orderData?.address?.telefon,
      addressName: orderData?.address?.nume_prenume,
      billingEmail: orderData?.billing?.email,
      billingPhone: orderData?.billing?.telefon || orderData?.billing?.phone,
      billingType: orderData?.billing?.tip_factura,
      itemsCount: Array.isArray(orderData?.items) ? orderData.items.length : 0,
    };
    console.log('[API /checkout/create-order] diag', diag);

    if (!orderData?.address || !orderData?.billing || !orderData?.items) {
      return NextResponse.json({ error: 'Date de comandă invalide.' }, { status: 400 });
    }

    // Dacă plata este cu cardul, creăm Stripe session
    if (paymentMethod === 'card') {
      const { items, address, billing } = orderData;
      
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

        // Salvăm datele comenzii în metadata pentru webhook
        const metadata: Record<string, string> = {
          cart: JSON.stringify(items),
          address: JSON.stringify(address),
          billing: JSON.stringify(billing),
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
          customer_email: address?.email || undefined,
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
