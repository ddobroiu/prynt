import { getAllProductSlugs, getProductBySlug } from "@/lib/products";
import { NextResponse } from "next/server";
import { getAllBlogSlugs } from "@/lib/blogPosts";
import { getAllJudeteSlugs } from "@/lib/judeteData";
import { listAllLandingRoutes } from "@/lib/landingData";

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
    { url: `${base}/afise`, priority: 0.8, lastmod: formatDateISO(new Date()) },
    { url: `${base}/flayere`, priority: 0.8, lastmod: formatDateISO(new Date()) },
    { url: `${base}/pliante`, priority: 0.8, lastmod: formatDateISO(new Date()) },
    { url: `${base}/autocolante`, priority: 0.8, lastmod: formatDateISO(new Date()) },
    { url: `${base}/canvas`, priority: 0.7, lastmod: formatDateISO(new Date()) },
    { url: `${base}/tapet`, priority: 0.7, lastmod: formatDateISO(new Date()) },
    // Materiale rigide
    { url: `${base}/materiale`, priority: 0.7, lastmod: formatDateISO(new Date()) },
    { url: `${base}/materiale/plexiglass`, priority: 0.7, lastmod: formatDateISO(new Date()) },
    { url: `${base}/materiale/alucobond`, priority: 0.7, lastmod: formatDateISO(new Date()) },
    { url: `${base}/materiale/carton`, priority: 0.7, lastmod: formatDateISO(new Date()) },
    { url: `${base}/materiale/polipropilena`, priority: 0.7, lastmod: formatDateISO(new Date()) },
    { url: `${base}/materiale/pvc-forex`, priority: 0.7, lastmod: formatDateISO(new Date()) },
    // Shop și configuratoare
    { url: `${base}/shop`, priority: 0.7, lastmod: formatDateISO(new Date()) },
    { url: `${base}/configuratoare`, priority: 0.6, lastmod: formatDateISO(new Date()) },
    // Blog și info
    { url: `${base}/blog`, priority: 0.7, lastmod: formatDateISO(new Date()) },
    { url: `${base}/contact`, priority: 0.6, lastmod: formatDateISO(new Date()) },
    { url: `${base}/urmareste-comanda`, priority: 0.5, lastmod: formatDateISO(new Date()) },
    // Legal și utilitate
    { url: `${base}/confidentialitate`, priority: 0.3, lastmod: formatDateISO(new Date()) },
    { url: `${base}/politica-cookies`, priority: 0.3, lastmod: formatDateISO(new Date()) },
    { url: `${base}/termeni`, priority: 0.3, lastmod: formatDateISO(new Date()) },
    { url: `${base}/stergere-date`, priority: 0.2, lastmod: formatDateISO(new Date()) },
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
    const catRaw = String(prod?.metadata?.category ?? "").toLowerCase();
    const category = catRaw || "bannere";
    const pathCategory = category === "bannere" ? "banner" : category;
    const slugPart = String(s).replace(/^\/+/, "");
    return { url: `${base}/${pathCategory}/${slugPart}`.replace(/\/+$/, ""), priority: 0.8, lastmod };
  });

  const blogPages = blogSlugs.map((s) => ({ url: `${base}/blog/${s}`, priority: 0.5, lastmod: formatDateISO(new Date()) }));
  
  const judeteSlugs = getAllJudeteSlugs();
  const judetePages = judeteSlugs.map((slug) => ({ 
    url: `${base}/judet/${slug}`, 
    priority: 0.6, 
    lastmod: formatDateISO(new Date()) 
  }));

  // Landing pages SEO (bannere, afise, autocolante, etc.)
  const landingRoutes = listAllLandingRoutes();
  const landingPages = landingRoutes.map(({ category, slug }) => ({
    url: `${base}/${category}/${slug}`,
    priority: 0.7, // SEO landing pages au prioritate ridicată
    lastmod: formatDateISO(new Date())
  }));

  const urls = [...pages, ...productPages, ...blogPages, ...judetePages, ...landingPages];

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