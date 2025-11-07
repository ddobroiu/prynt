import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/products";

export const runtime = "edge";

export async function GET() {
  try {
    const list = PRODUCTS.map((p) => ({
      slug: p.slug,
      title: p.title,
      price: p.priceBase ?? null,
      width_cm: p.width_cm ?? null,
      height_cm: p.height_cm ?? null,
    }));
    return NextResponse.json({ ok: true, count: list.length, products: list }, { status: 200 });
  } catch (err: any) {
    console.error("[API /products] error:", err?.message || err);
    return NextResponse.json({ ok: false, error: err?.message || "Unknown" }, { status: 500 });
  }
}