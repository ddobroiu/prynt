import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { widthCm, heightCm, slug, materialId, side } = body ?? {};

    if (!widthCm || !heightCm || !slug) {
      return NextResponse.json({ message: "Lipsesc parametrii" }, { status: 400 });
    }

    const product = await getProductBySlug(String(slug));
    if (!product) return NextResponse.json({ message: "Produs inexistent" }, { status: 404 });

    if (widthCm < product.minWidthCm || widthCm > product.maxWidthCm || heightCm < product.minHeightCm || heightCm > product.maxHeightCm) {
      return NextResponse.json({ message: "Dimensiuni în afara limitelor", ok: false }, { status: 400 });
    }

    const area = widthCm * heightCm;
    // base
    let price = product.priceBase + area * product.pricePerCm2;

    // material modifier
    if (materialId && product.materials && product.materials.length) {
      const mat = product.materials.find((m) => m.id === materialId);
      if (mat) {
        price += area * (mat.priceModifierPerCm2 ?? 0);
        price += mat.fixedExtra ?? 0;
      }
    }

    // side modifier (e.g., both sides -> x1.6 or add fixed)
    if (side === "double") {
      // exemplu: 1.6x pentru printing both sides
      price = price * 1.6;
    }

    // round
    price = Math.round(price * 100) / 100;

    return NextResponse.json({ price, ok: true });
  } catch (err) {
    console.error("calc-price error", err);
    return NextResponse.json({ message: "Eroare server" }, { status: 500 });
  }
}