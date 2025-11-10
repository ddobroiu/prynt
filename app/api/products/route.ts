import { NextResponse } from "next/server";

const MOCK_PRODUCTS = [
  {
    id: "banner-90x200-01",
    slug: "banner-90x200-01",
    title: "Banner 90x200 PVC",
    description: "Banner standard 90x200 cm, PVC 440g, print full color.",
    price: 120.0,
    stock: 12,
    category: "bannere",
    images: ["/products/banners/banner-90x200-01.jpg"],
    attributes: { dimensiuni: "90x200", material: "PVC 440g" },
  },
  {
    id: "banner-60x160-01",
    slug: "banner-60x160-01",
    title: "Banner 60x160",
    description: "Banner compact 60x160 cm.",
    price: 90.0,
    stock: 5,
    category: "bannere",
    images: ["/products/banners/banner-60x160-01.jpg"],
    attributes: { dimensiuni: "60x160", material: "PVC 440g" },
  },
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");

  let results = MOCK_PRODUCTS;
  if (category) {
    results = MOCK_PRODUCTS.filter((p) => p.category === category);
  }

  // Returnăm direct array ca răspuns JSON
  return NextResponse.json(results);
}