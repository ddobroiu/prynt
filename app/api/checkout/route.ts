import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY!;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const currency = (process.env.NEXT_PUBLIC_CURRENCY || "EUR").toLowerCase();

const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    // Stripe așteaptă sume în cea mai mică unitate (ex. EUR -> cents)
    const line_items = items.map((it: any) => ({
      quantity: it.quantity,
      price_data: {
        currency,
        unit_amount: Math.round(Number(it.unitAmount) * 100),
        product_data: {
          name: it.name || "Produs",
          description: it.description?.slice(0, 500),
          // poți trimite și imagini aici dacă ai hosted URLs
        },
      },
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${baseUrl}/checkout/success`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: ["RO"] },
      allow_promotion_codes: true,
      // client_reference_id etc. se pot adăuga pentru mapare comenzi
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}
