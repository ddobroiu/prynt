import type { NextApiRequest, NextApiResponse } from "next";
import { getAllProducts } from "../../lib/products";

// Exemplu simplu: primim widthCm, heightCm și optional sku/slug
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { widthCm, heightCm, slug } = req.body ?? {};

  if (!widthCm || !heightCm) {
    return res.status(400).json({ message: "Lipsesc dimensiunile" });
  }

  // Logica: pentru demo, luăm primul produs sau îl alegem după slug
  const products = await getAllProducts();
  const product = slug ? products.find((p) => p.slug === slug) : products[0];
  if (!product) {
    return res.status(404).json({ message: "Produs inexistent" });
  }

  const minW = product.minWidthCm ?? 1;
  const maxW = product.maxWidthCm ?? 10000;
  const minH = product.minHeightCm ?? 1;
  const maxH = product.maxHeightCm ?? 10000;

  if (widthCm < minW || widthCm > maxW || heightCm < minH || heightCm > maxH) {
    return res.status(400).json({ message: "Dimensiuni în afara limitelor produsului" });
  }

  const area = widthCm * heightCm; // cm^2
  const price = product.priceBase + area * product.pricePerCm2;

  return res.status(200).json({ price: Math.round(price * 100) / 100 });
}