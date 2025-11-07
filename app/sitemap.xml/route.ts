import { getAllProductSlugs } from "@/lib/products";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://example.com";
  const slugs = getAllProductSlugs();

  const pages = [
    { url: `${base}/`, priority: 1.0 },
    { url: `${base}/banner`, priority: 0.9 },
    // add other category pages if needed
  ];

  const productPages = slugs.map((s) => ({ url: `${base}/banner/${s}`, priority: 0.8 }));

  const urls = [...pages, ...productPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (p) => `<url>
      <loc>${p.url}</loc>
      <changefreq>weekly</changefreq>
      <priority>${p.priority}</priority>
    </url>`
      )
      .join("\n")}
  </urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}