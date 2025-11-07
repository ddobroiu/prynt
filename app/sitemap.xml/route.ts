import { getAllProductSlugs, getProductBySlug } from "@/lib/products";
import { NextResponse } from "next/server";

export const runtime = "edge";

function formatDateISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const slugs = getAllProductSlugs();

  const pages = [
    { url: `${base}/`, priority: 1.0, lastmod: formatDateISO(new Date()) },
    { url: `${base}/banner`, priority: 0.9, lastmod: formatDateISO(new Date()) },
  ];

  const productPages = slugs.map((s) => {
    const prod = getProductBySlug(s);
    // încercăm să citim un lastUpdated din product.metadata.updatedAt (dacă există)
    let lastmod = undefined;
    if (prod?.metadata?.updatedAt) {
      try {
        lastmod = formatDateISO(new Date(prod.metadata.updatedAt));
      } catch {}
    }
    if (!lastmod) lastmod = formatDateISO(new Date()); // fallback = azi
    return { url: `${base}/banner/${s}`, priority: 0.8, lastmod };
  });

  const urls = [...pages, ...productPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (p) => `<url>
  <loc>${p.url}</loc>
  <lastmod>${p.lastmod}</lastmod>
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