import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { widthCm, heightCm, slug } = body ?? {};

    if (!widthCm || !heightCm) {
      return NextResponse.json({ message: "Lipsesc dimensiunile" }, { status: 400 });
    }

    const products = await getAllProducts();
    const product = slug ? products.find((p) => p.slug === slug) : products[0];
    if (!product) return NextResponse.json({ message: "Produs inexistent" }, { status: 404 });

    const minW = product.minWidthCm ?? 1;
    const maxW = product.maxWidthCm ?? 10000;
    const minH = product.minHeightCm ?? 1;
    const maxH = product.maxHeightCm ?? 10000;

    if (widthCm < minW || widthCm > maxW || heightCm < minH || heightCm > maxH) {
      return NextResponse.json({ message: "Dimensiuni în afara limitelor produsului" }, { status: 400 });
    }

    const area = widthCm * heightCm;
    const price = product.priceBase + area * product.pricePerCm2;

    return NextResponse.json({ price: Math.round(price * 100) / 100 });
  } catch (err) {
    return NextResponse.json({ message: "Eroare server" }, { status: 500 });
  }
}