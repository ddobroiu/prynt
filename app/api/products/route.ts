import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "products.json");

async function readProducts() {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    // dacă nu există sau e corupt, returnăm array gol
    return [];
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");
  const slug = url.searchParams.get("slug");

  const products = await readProducts();

  if (slug) {
    const found = products.find((p: any) => p.slug === slug) ?? null;
    return NextResponse.json(found);
  }

  const results = category ? products.filter((p: any) => p.category === category) : products;
  return NextResponse.json(results);
}

// Optional: POST pentru a adăuga produse (folosește doar în dev)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body?.id || !body?.slug) {
      return NextResponse.json({ error: "invalid payload" }, { status: 400 });
    }
    const products = await readProducts();
    products.push(body);
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
    await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2), "utf-8");
    return NextResponse.json(body, { status: 201 });
  } catch (err) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}