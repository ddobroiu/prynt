// lib/products.ts
// Central product registry + helpers for route/slug resolution.
// Updated: MaterialOption includes `id`, `key`, `name` and `label` (aliases) so existing components
// that expect .id, .key, .label or .name all compile and work.

import { EXTRA_PRODUCTS_RAW } from "./extraProducts";
import { generateSeoForProduct } from "./seoTemplates";

export type MaterialOption = {
  id: string;            // canonical identifier (used by UI & components)
  key?: string;          // backwards compat
  name?: string;         // backwards compat: some components used .name
  label: string;         // human-readable label
  description?: string;
  // priceModifier can be interpreted by UI: either percent (0.1 = +10%) or absolute RON addition
  priceModifier?: number;
  recommendedFor?: string[]; // categories e.g. ["bannere", "afise", "pliante"]
};

export const MATERIAL_OPTIONS: MaterialOption[] = [
  { id: "frontlit-440", key: "frontlit-440", name: "Frontlit 440 g/mp (standard)", label: "Frontlit 440 g/mp (standard)", description: "Material rezistent pentru exterior", priceModifier: 0, recommendedFor: ["bannere"] },
  { id: "frontlit-510", key: "frontlit-510", name: "Frontlit 510 g/mp (durabil)", label: "Frontlit 510 g/mp (durabil)", description: "Mai gros, pentru expuneri îndelungate", priceModifier: 0.1, recommendedFor: ["bannere"] },
  { id: "couche-150", key: "couche-150", name: "Hârtie couché 150 g/mp", label: "Hârtie couché 150 g/mp", description: "Hârtie pentru afișe/interior și pliante", priceModifier: 0, recommendedFor: ["afise", "pliante"] },
  { id: "couche-170", key: "couche-170", name: "Hârtie couché 170 g/mp", label: "Hârtie couché 170 g/mp", description: "Hârtie premium pentru pliante/catalog", priceModifier: 0.12, recommendedFor: ["pliante"] },
  { id: "pp-5mm", key: "pp-5mm", name: "PVC 5mm", label: "PVC 5mm", description: "Material rigid pentru indoor/outdoor", priceModifier: 0.15, recommendedFor: ["decor", "materiale-rigide"] },
];

// Product type: add optional materials property so components can read available materials per product
export type Product = {
  id: string;
  sku?: string;
  slug?: string; // legacy/internal id
  routeSlug?: string; // optional: slug used in URL (ex: "pliante-vulcanizare")
  title: string;
  description?: string;
  images?: string[];
  priceBase?: number;
  width_cm?: number;
  height_cm?: number;
  minWidthCm?: number;
  minHeightCm?: number;
  currency?: string;
  tags?: string[];
  seo?: { title?: string; description?: string };
  metadata?: Record<string, any>;
  materials?: MaterialOption[]; // optional list of material options for this product
};

// Convert product image paths to .webp when they reference our `/products/` assets.
function toWebpPaths(imgs?: string[]): string[] | undefined {
  if (!imgs) return undefined;
  return imgs.map((src) => {
    try {
      const s = String(src);
      // Only rewrite assets under our products folder and with jpg/jpeg extension
      if (s.startsWith("/products/") && /\.(jpg|jpeg)$/i.test(s)) {
        return s.replace(/\.(jpg|jpeg)$/i, ".webp");
      }
      return s;
    } catch {
      return src as string;
    }
  });
}

export const PRODUCTS: Product[] = EXTRA_PRODUCTS_RAW.map((p) => {
  const slug = String(p.slug ?? p.routeSlug ?? p.id ?? "");
  const categoryRaw = String(p.metadata?.category ?? "bannere");
  const category = categoryRaw.toLowerCase();
  // Map category to public images directory name (bannere -> banner; others keep same, but ensure lowercase)
  const dir = (category === "bannere" ? "banner" : category).toLowerCase();
  return {
    id: p.id ?? `item-${slug}`,
    slug: p.slug ?? slug,
    routeSlug: p.routeSlug ?? p.slug ?? slug,
    title: p.title ?? slug,
    description: p.description ?? "",
    images: toWebpPaths(
      p.images ?? [`/products/${dir}/${slug}.webp`, `/products/${dir}/1.webp`, `/products/${dir}/2.webp`, `/products/${dir}/3.webp`]
    ),
    priceBase: p.priceBase ?? 250,
    currency: p.currency ?? "RON",
    tags: p.tags ?? [],
    seo: p.seo ?? generateSeoForProduct({ ...p, metadata: { ...(p.metadata ?? {}), category } }),
    materials: MATERIAL_OPTIONS.filter((m) => (m.recommendedFor ?? []).includes(category)),
    metadata: { ...(p.metadata ?? {}), category },
  } as Product;
});

// Ensure every product has an SEO title/description. Generated text is used only when
// an explicit `seo` field is not provided on the product object.
for (const _p of PRODUCTS) {
  if (!_p.seo) {
    // use the generator imported above
    // NOTE: mutate in-place so consuming code gets the enriched objects
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    _p.seo = generateSeoForProduct(_p as any);
  }
}


//=== UTILITARE =============================================================

export function getAllProductSlugs(): string[] {
  return PRODUCTS.map((p) => String(p.routeSlug ?? p.slug ?? p.id));
}

export function getAllProductSlugsByCategory(category: string): string[] {
  const cat = String(category || "").toLowerCase();
  return PRODUCTS.filter((p) => String(p.metadata?.category ?? "").toLowerCase() === cat).map((p) =>
    String(p.routeSlug ?? p.slug ?? p.id)
  );
}

/**
 * Matching ordered and tolerant to avoid collisions:
 * 1) exact match on id / slug / routeSlug
 * 2) last-segment match (requests like "/something/300x100" match last segment "300x100")
 * 3) tag exact match
 * 4) title contains (low priority)
 */
export function getProductBySlug(slug: string | undefined): Product | undefined {
  if (!slug) return undefined;
  const s = String(slug).toLowerCase().trim();

  // compute last segment to avoid greedy endsWith collisions
  const segments = s.split("/").map((x) => x.trim()).filter(Boolean);
  const lastSegment = segments.length ? segments[segments.length - 1] : s;

  // 1) exact match
  for (const p of PRODUCTS) {
    const id = String(p.id ?? "").toLowerCase();
    const sl = String(p.slug ?? "").toLowerCase();
    const rs = String(p.routeSlug ?? "").toLowerCase();
    if (s === id || s === sl || s === rs) return p;
    // also allow direct match on last segment (helps when raw path has multiple segments)
    if (lastSegment === id || lastSegment === sl || lastSegment === rs) return p;
  }

  // 2) last-segment match (safer than endsWith on the full path)
  for (const p of PRODUCTS) {
    const sl = String(p.slug ?? "").toLowerCase();
    const rs = String(p.routeSlug ?? "").toLowerCase();
    if (rs && lastSegment === rs) return p;
    if (sl && lastSegment === sl) return p;
  }

  // 3) tag exact match (global)
  for (const p of PRODUCTS) {
    const tags = (p.tags ?? []).map((t) => String(t).toLowerCase());
    if (tags.includes(lastSegment) || tags.includes(s)) return p;
  }

  // 4) title contains (low priority)
  for (const p of PRODUCTS) {
    const title = String(p.title ?? "").toLowerCase();
    if (title.includes(s) || title.includes(lastSegment)) return p;
  }

  return undefined;
}

/**
 * resolveProductForRequestedSlug
 *
 * Behavior improvements:
 * - Accepts complex slugs that may include dimension segments (ex: "300x200/banner-name" or "banner-300x200")
 * - Extracts first dimension occurrence and removes it from the slug used for lookup
 * - Tries lookups with the cleaned slug first (category-scoped then global), falls back to original slug
 * - If dimensions are detected but no product is found, returns a dimension fallback product
 * * NEXT.JS 16 UPDATE: This function is now cached.
 */
export async function resolveProductForRequestedSlug(requestedSlug: string, category?: string) {

  const raw = String(requestedSlug || "").toLowerCase().trim();

  // Normalize into segments
  const segments = raw.split("/").map((s) => s.trim()).filter(Boolean);

  // Regexes: allow 1-5 digits and separators x X × -
  const dimExactRegex = /^(\d{1,5})[xX×-](\d{1,5})$/;
  const dimAnywhereRegex = /(\d{1,5})[xX×-](\d{1,5})/;

  let width: number | undefined;
  let height: number | undefined;
  const remaining: string[] = [];

  for (const seg of segments) {
    const mExact = seg.match(dimExactRegex);
    if (mExact && width === undefined && height === undefined) {
      width = Number(mExact[1]);
      height = Number(mExact[2]);
      // skip adding this exact-dimension segment
      continue;
    }

    const mAny = seg.match(dimAnywhereRegex);
    if (mAny && width === undefined && height === undefined) {
      width = Number(mAny[1]);
      height = Number(mAny[2]);
      // remove the matched portion from the segment and keep the rest if present
      const cleaned = seg.replace(mAny[0], "").replace(/(^[-_]+|[-_]+$)/g, "").trim();
      if (cleaned) remaining.push(cleaned);
      continue;
    }

    remaining.push(seg);
  }

  const cleanedSlug = remaining.join("/") || raw;

  // Helper to attempt category-scoped lookup using a candidate slug
  function categoryLookup(candidate: string | undefined): { product?: Product; initialWidth?: number | null; initialHeight?: number | null; isFallback?: boolean } | null {
    if (!category || !candidate) return null;
    const slugCandidate = String(candidate).toLowerCase().trim();
    const candidates = PRODUCTS.filter((p) => String(p.metadata?.category ?? "").toLowerCase() === String(category).toLowerCase());

    // 1a) exact id/slug/routeSlug or last-segment match among candidates
    for (const p of candidates) {
      const ids = [String(p.id ?? ""), String(p.slug ?? ""), String(p.routeSlug ?? "")].map((x) => x.toLowerCase());
      if (ids.includes(slugCandidate) || ids.some((id) => id && slugCandidate.split("/").pop() === id)) {
        return {
          product: p,
          initialWidth: p.width_cm ?? p.minWidthCm ?? null,
          initialHeight: p.height_cm ?? p.minHeightCm ?? null,
          isFallback: false,
        };
      }
    }

    // 1b) tag exact match among candidates
    for (const p of candidates) {
      const tags = (p.tags ?? []).map((t) => String(t).toLowerCase());
      if (tags.includes(slugCandidate) || tags.includes(slugCandidate.split("/").pop() ?? "")) {
        return {
          product: p,
          initialWidth: p.width_cm ?? p.minWidthCm ?? null,
          initialHeight: p.height_cm ?? p.minHeightCm ?? null,
          isFallback: false,
        };
      }
    }

    // 1c) title contains (category restricted)
    for (const p of candidates) {
      const title = String(p.title ?? "").toLowerCase();
      if (title.includes(slugCandidate) || title.includes(slugCandidate.split("/").pop() ?? "")) {
        return {
          product: p,
          initialWidth: p.width_cm ?? p.minWidthCm ?? null,
          initialHeight: p.height_cm ?? p.minHeightCm ?? null,
          isFallback: false,
        };
      }
    }

    return null;
  }

  // 1) Try category scoped lookup with cleaned slug first, then raw
  if (category) {
    const catResClean = categoryLookup(cleanedSlug);
    if (catResClean) return catResClean;

    const catResRaw = categoryLookup(raw);
    if (catResRaw) return catResRaw;
  }

  // 2) global lookup: try cleanedSlug first, then raw
  const productClean = getProductBySlug(cleanedSlug);
  if (productClean) {
    return {
      product: productClean,
      initialWidth: productClean.width_cm ?? productClean.minWidthCm ?? null,
      initialHeight: productClean.height_cm ?? productClean.minHeightCm ?? null,
      isFallback: false,
    };
  }

  const productRaw = getProductBySlug(raw);
  if (productRaw) {
    return {
      product: productRaw,
      initialWidth: productRaw.width_cm ?? productRaw.minWidthCm ?? null,
      initialHeight: productRaw.height_cm ?? productRaw.minHeightCm ?? null,
      isFallback: false,
    };
  }

  // 3) If dimensions were detected, return a dimension fallback product
  if (typeof width === "number" && typeof height === "number") {
    const w = width;
    const h = height;
    const fallback: Product = {
      id: `fallback-${w}x${h}`,
      slug: `fallback-${w}x${h}`,
      routeSlug: `${w}x${h}`,
      title: `Produs ${w}x${h} cm`,
      description: `Produs personalizat ${w}x${h} cm — configurează dimensiuni și finisaje.`,
      images: ["/images/generic-banner.jpg"],
      priceBase: 0,
      currency: "RON",
      tags: ["fallback", "personalizat"],
      metadata: { category: category ?? "bannere" },
    };
    return { product: fallback, initialWidth: w, initialHeight: h, isFallback: true };
  }

  // 4) fallback generic per category (if category provided)
  if (category) {
    const CATEGORY_FALLBACK: Record<string, { title: string; image: string; defaultSlug: string }> = {
      pliante: { title: "Pliante personalizate", image: "/images/generic-pliante.jpg", defaultSlug: "pliante" },
      canvas: { title: "Canvas personalizat", image: "/images/generic-canvas.jpg", defaultSlug: "canvas" },
      autocolante: { title: "Autocolante personalizate", image: "/images/generic-autocolante.jpg", defaultSlug: "autocolante" },
      flyer: { title: "Flyere personalizate", image: "/images/generic-flyer.jpg", defaultSlug: "flyer" },
      flayere: { title: "Flyere personalizate", image: "/images/generic-flyer.jpg", defaultSlug: "flayere" },
      bannere: { title: "Banner personalizat", image: "/images/generic-banner.jpg", defaultSlug: "banner" },
      afise: { title: "Afișe personalizate", image: "/images/generic-afise.jpg", defaultSlug: "afise" },
      tapet: { title: "Tapet personalizat", image: "/images/generic-banner.jpg", defaultSlug: "tapet" },
      carton: { title: "Carton personalizat", image: "/images/generic-banner.jpg", defaultSlug: "carton" },
    };

    const catKey = String(category || "").toLowerCase();
    const info = CATEGORY_FALLBACK[catKey] ?? { title: `${category} - Produs personalizat`, image: "/images/generic-banner.jpg", defaultSlug: category ?? "product" };

    const fallback: Product = {
      id: `fallback-${catKey}`,
      slug: `fallback-${catKey}`,
      routeSlug: cleanedSlug || info.defaultSlug,
      title: info.title,
      description: `Configurați ${info.title.toLowerCase()} — completați dimensiunile și opțiunile.`,
      images: [info.image],
      priceBase: 0,
      currency: "RON",
      tags: [catKey],
      metadata: { category: catKey },
    };
    return { product: fallback, initialWidth: null, initialHeight: null, isFallback: true };
  }

  return { product: undefined, initialWidth: null, initialHeight: null, isFallback: false };
}