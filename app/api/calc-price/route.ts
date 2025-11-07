import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products";

type Body = {
  widthCm?: number;
  heightCm?: number;
  slug?: string;
  materialId?: string;
  side?: "single" | "double";
  options?: Record<string, any>;
};

export async function POST(request: Request) {
  try {
    const body: Body = await request.json();
    const { widthCm, heightCm, slug, materialId, side } = body ?? {};

    if (!widthCm || !heightCm || !slug) {
      return NextResponse.json({ message: "Lipsesc parametrii: widthCm, heightCm sau slug" }, { status: 400 });
    }

    const product = await getProductBySlug(String(slug));
    if (!product) return NextResponse.json({ message: "Produs inexistent" }, { status: 404 });

    if (widthCm < product.minWidthCm || widthCm > product.maxWidthCm || heightCm < product.minHeightCm || heightCm > product.maxHeightCm) {
      return NextResponse.json({ message: "Dimensiuni în afara limitelor produsului" }, { status: 400 });
    }

    const area = widthCm * heightCm; // cm^2
    let price = product.priceBase + area * product.pricePerCm2;

    if (materialId && product.materials) {
      const mat = product.materials.find((m) => m.id === materialId);
      if (mat) {
        price += area * (mat.priceModifierPerCm2 ?? 0);
        price += mat.fixedExtra ?? 0;
      }
    }

    if (side === "double" && product.bothSidesSupported) {
      price = price * 1.6; // exemplu multiplicator
    }

    price = Math.round(price * 100) / 100;
    return NextResponse.json({ price, ok: true });
  } catch (err) {
    console.error("calc-price error:", err);
    return NextResponse.json({ message: "Eroare server" }, { status: 500 });
  }
}