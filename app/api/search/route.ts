import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/products";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.toLowerCase() || "";
  const category = url.searchParams.get("category")?.toLowerCase();
  const limit = parseInt(url.searchParams.get("limit") || "20");

  if (!q || q.length < 2) {
    return NextResponse.json({ 
      results: [], 
      message: "Query prea scurt (minimum 2 caractere)" 
    });
  }

  // Filtrare și scoring
  const results = PRODUCTS
    .map(product => {
      let score = 0;
      const title = (product.title || "").toLowerCase();
      const description = (product.description || "").toLowerCase();
      const tags = (product.tags || []).join(" ").toLowerCase();
      const productCategory = String(product.metadata?.category || "").toLowerCase();
      
      // Scoring algorithm
      if (title.includes(q)) score += 10;
      if (title.startsWith(q)) score += 5;
      if (description.includes(q)) score += 3;
      if (tags.includes(q)) score += 2;
      
      // Bonus pentru match exact
      if (title === q) score += 20;
      
      // Fuzzy matching simplu pentru greșeli de scriere
      const words = q.split(" ");
      words.forEach(word => {
        if (word.length > 3) {
          // Match parțial pentru cuvinte mai lungi
          if (title.includes(word.slice(0, -1))) score += 1;
          if (description.includes(word.slice(0, -1))) score += 0.5;
        }
      });

      // Filtrare după categorie dacă e specificată
      if (category && productCategory !== category) {
        return null;
      }

      return score > 0 ? {
        id: product.id,
        slug: product.routeSlug || product.slug,
        title: product.title,
        description: product.description,
        images: product.images,
        category: productCategory,
        tags: product.tags,
        priceBase: product.priceBase,
        score
      } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score)
    .slice(0, limit);

  return NextResponse.json({
    results,
    total: results.length,
    query: q,
    category: category || "toate"
  });
}