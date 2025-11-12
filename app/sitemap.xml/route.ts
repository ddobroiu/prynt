import { getAllProductSlugs, getProductBySlug } from "@/lib/products";
import { NextResponse } from "next/server";
import { getAllBlogSlugs } from "@/lib/blogPosts";

export const runtime = "edge";

function formatDateISO(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const slugs = getAllProductSlugs();
  const blogSlugs = getAllBlogSlugs();

  const pages = [
    { url: `${base}/`, priority: 1.0, lastmod: formatDateISO(new Date()) },
    // Fonduri UE subpagini
    { url: `${base}/fonduri-pnrr`, priority: 0.9, lastmod: formatDateISO(new Date()) },
    { url: `${base}/fonduri-regio`, priority: 0.9, lastmod: formatDateISO(new Date()) },
    { url: `${base}/fonduri-nationale`, priority: 0.9, lastmod: formatDateISO(new Date()) },
    // Categorii principale
    { url: `${base}/banner`, priority: 0.9, lastmod: formatDateISO(new Date()) },
    { url: `${base}/banner-verso`, priority: 0.8, lastmod: formatDateISO(new Date()) },
    { url: `${base}/afise`, priority: 0.7, lastmod: formatDateISO(new Date()) },
    { url: `${base}/flayere`, priority: 0.7, lastmod: formatDateISO(new Date()) },
    { url: `${base}/pliante`, priority: 0.7, lastmod: formatDateISO(new Date()) },
    { url: `${base}/autocolante`, priority: 0.7, lastmod: formatDateISO(new Date()) },
    { url: `${base}/canvas`, priority: 0.7, lastmod: formatDateISO(new Date()) },
    { url: `${base}/tapet`, priority: 0.7, lastmod: formatDateISO(new Date()) },
    { url: `${base}/plexiglass`, priority: 0.6, lastmod: formatDateISO(new Date()) },
    { url: `${base}/alucobond`, priority: 0.6, lastmod: formatDateISO(new Date()) },
    { url: `${base}/carton`, priority: 0.6, lastmod: formatDateISO(new Date()) },
    { url: `${base}/polipropilena`, priority: 0.6, lastmod: formatDateISO(new Date()) },
    { url: `${base}/pvc-forex`, priority: 0.6, lastmod: formatDateISO(new Date()) },
    // Info
  { url: `${base}/shop`, priority: 0.6, lastmod: formatDateISO(new Date()) },
  { url: `${base}/blog`, priority: 0.6, lastmod: formatDateISO(new Date()) },
    { url: `${base}/contact`, priority: 0.5, lastmod: formatDateISO(new Date()) },
    { url: `${base}/confidentialitate`, priority: 0.3, lastmod: formatDateISO(new Date()) },
    { url: `${base}/politica-cookies`, priority: 0.3, lastmod: formatDateISO(new Date()) },
    { url: `${base}/termeni`, priority: 0.3, lastmod: formatDateISO(new Date()) },
  ];

  const productPages = slugs.map((s) => {
    const prod = getProductBySlug(s);
    let lastmod = undefined;
    if (prod?.metadata?.updatedAt) {
      try {
        lastmod = formatDateISO(new Date(prod.metadata.updatedAt));
      } catch {}
    }
    if (!lastmod) lastmod = formatDateISO(new Date());
    return { url: `${base}/banner/${s}`, priority: 0.8, lastmod };
  });

  const blogPages = blogSlugs.map((s) => ({ url: `${base}/blog/${s}`, priority: 0.5, lastmod: formatDateISO(new Date()) }));
  const urls = [...pages, ...productPages, ...blogPages];

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