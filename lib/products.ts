// lib/products.ts
// Central product registry + helpers for route/slug resolution.
// Updated: MaterialOption includes `id`, `key`, `name` and `label` (aliases) so existing components
// that expect .id, .key, .label or .name all compile and work.

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

// Extra products raw data (user-provided list). Mapped and appended into PRODUCTS below.
import { EXTRA_PRODUCTS_RAW } from "./extraProducts";
import { generateSeoForProduct } from "./seoTemplates";

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

const BASE_PRODUCTS: Product[] = [
    // Bannere — intrări generate pentru fiecare pagină din /app/banner
    {
      id: "banner-apartament-de-inchiriat",
      slug: "apartament-de-inchiriat",
      routeSlug: "apartament-de-inchiriat",
      title: "Banner - Apartament de închiriat",
      description: "Banner personalizat pentru promovarea apartamentelor de închiriat. Configurează dimensiuni, material și finisaje.",
      images: [
        "/products/banner/apartament-de-inchiriat.jpg",
        "/products/banner/1.jpg",
        "/products/banner/2.jpg",
        "/products/banner/3.jpg",
      ],
      priceBase: 250.0,
      currency: "RON",
      tags: ["banner", "apartament", "inchiriat"],
      seo: { title: "Banner Apartament de închiriat | Prynt", description: "Banner personalizat pentru apartamente de închiriat." },
      materials: MATERIAL_OPTIONS.filter((m) => (m.recommendedFor ?? []).includes("bannere")),
      metadata: { category: "bannere" },
    },
    {
      id: "banner-apartament-de-vanzare",
      slug: "apartament-de-vanzare",
      routeSlug: "apartament-de-vanzare",
    title: "Banner - Apartament de vânzare",
    description: 'Banner pentru anunţuri "vânzare" — personalizabil pe dimensiuni și material.',
    images: [
      "/products/banner/apartament-de-vanzare.jpg",
      "/products/banner/1.jpg",
      "/products/banner/2.jpg",
      "/products/banner/3.jpg",
    ],
      priceBase: 250.0,
      currency: "RON",
      tags: ["banner", "apartament", "vanzare"],
      seo: { title: "Banner Apartament de vânzare | Prynt", description: "Banner personalizat pentru apartamente de vânzare." },
      materials: MATERIAL_OPTIONS.filter((m) => (m.recommendedFor ?? []).includes("bannere")),
      metadata: { category: "bannere" },
    },
    { id: "banner-barbershop", slug: "barbershop", routeSlug: "barbershop", title: "Banner Barber Shop", description: "Banner pentru frizerii și barber-shop-uri.", images: [
      "/products/banner/barbershop.jpg",
      "/products/banner/1.jpg",
      "/products/banner/2.jpg",
      "/products/banner/3.jpg",
    ], priceBase: 250, currency: "RON", tags: ["barbershop", "banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-cabinet-stomatologic", slug: "cabinet-stomatologic", routeSlug: "cabinet-stomatologic", title: "Banner Cabinet Stomatologic", description: "Banner pentru cabinete stomatologice și anunțuri medicale.", images: [
      "/products/banner/cabinet-stomatologic.jpg",
      "/products/banner/1.jpg",
      "/products/banner/2.jpg",
      "/products/banner/3.jpg",
    ], priceBase: 250, currency: "RON", tags: ["stomatologie","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-casa-de-inchiriat", slug: "casa-de-inchiriat", routeSlug: "casa-de-inchiriat", title: "Banner - Casă de închiriat", description: "Banner pentru proprietăţi de închiriat.", images: ["/products/banner/casa-de-inchiriat.jpg","/products/banner/1.jpg","/products/banner/2.jpg","/products/banner/3.jpg"], priceBase: 250, currency: "RON", tags: ["casa","inchiriat","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-casa-de-vanzare", slug: "casa-de-vanzare", routeSlug: "casa-de-vanzare", title: "Banner - Casă de vânzare", description: "Banner pentru proprietăţi de vânzare.", images: ["/products/banner/casa-de-vanzare.jpg"], priceBase: 250, currency: "RON", tags: ["casa","vanzare","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-de-inchiriat", slug: "de-inchiriat", routeSlug: "de-inchiriat", title: "Banner - De închiriat", description: "Banner generic pentru anunţuri 'de închiriat'.", images: ["/products/banner/de-inchiriat.jpg"], priceBase: 250, currency: "RON", tags: ["inchiriere","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-fastfood", slug: "fastfood", routeSlug: "fastfood", title: "Banner Fast-Food", description: "Banner pentru restaurante de tip fast-food și livrări.", images: ["/products/banner/fastfood.jpg"], priceBase: 250, currency: "RON", tags: ["food","fastfood","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-fructe-si-legume", slug: "fructe-si-legume", routeSlug: "fructe-si-legume", title: "Banner Fructe și Legume", description: "Banner pentru pieţe, tarabe și magazine de fructe și legume.", images: ["/products/banner/fructe-si-legume.jpg"], priceBase: 250, currency: "RON", tags: ["fructe","legume","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-garsoniera-de-inchiriat", slug: "garsoniera-de-inchiriat", routeSlug: "garsoniera-de-inchiriat", title: "Banner Garsonieră de închiriat", description: "Banner pentru garsoniere de închiriat.", images: ["/products/banner/garsoniera-de-inchiriat.jpg"], priceBase: 250, currency: "RON", tags: ["garsoniera","inchiriat","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-garsoniera-de-vanzare", slug: "garsoniera-de-vanzare", routeSlug: "garsoniera-de-vanzare", title: "Banner Garsonieră de vânzare", description: "Banner pentru garsoniere de vânzare.", images: ["/products/banner/garsoniera-de-vanzare.jpg"], priceBase: 250, currency: "RON", tags: ["garsoniera","vanzare","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-la-multi-ani", slug: "la-multi-ani", routeSlug: "la-multi-ani", title: "Banner La mulți ani!", description: "Banner de felicitare pentru aniversări și evenimente.", images: ["/products/banner/la-multi-ani.jpg"], priceBase: 250, currency: "RON", tags: ["la-multi-ani","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-magazin-alimentar", slug: "magazin-alimentar", routeSlug: "magazin-alimentar", title: "Banner Magazin Alimentar", description: "Banner pentru magazine alimentare și promoții.", images: ["/products/banner/magazin-alimentar.jpg"], priceBase: 250, currency: "RON", tags: ["magazin","alimentar","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-nu-blocati", slug: "nu-blocati", routeSlug: "nu-blocati", title: "Banner Nu blocați", description: "Banner pentru avertismente — 'Nu blocați'.", images: ["/products/banner/nu-blocati.jpg"], priceBase: 250, currency: "RON", tags: ["semnalistica","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-produs-in-romania", slug: "produs-in-romania", routeSlug: "produs-in-romania", title: "Banner – Produs în România", description: "Banner care marchează originile produsului 'Produs în România'.", images: ["/products/banner/produs-in-romania.jpg"], priceBase: 250, currency: "RON", tags: ["produs","romania","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-rent-a-car", slug: "rent-a-car", routeSlug: "rent-a-car", title: "Banner Rent-a-Car", description: "Banner pentru servicii de închiriere auto.", images: ["/products/banner/rent-a-car.jpg"], priceBase: 250, currency: "RON", tags: ["auto","rent","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-service-auto", slug: "service-auto", routeSlug: "service-auto", title: "Banner Service Auto", description: "Banner pentru service-uri auto și anunţuri tehnice.", images: ["/products/banner/service-auto.jpg"], priceBase: 250, currency: "RON", tags: ["service","auto","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-servicii-medicale", slug: "servicii-medicale", routeSlug: "servicii-medicale", title: "Banner Servicii medicale", description: "Banner pentru clinici și servicii medicale.", images: ["/products/banner/servicii-medicale.jpg"], priceBase: 250, currency: "RON", tags: ["medical","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-spalatorie-haine", slug: "spalatorie-haine", routeSlug: "spalatorie-haine", title: "Banner Spălătorie haine", description: "Banner pentru spălătorii auto sau de haine.", images: ["/products/banner/spalatorie-haine.jpg"], priceBase: 250, currency: "RON", tags: ["spalatorie","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-spatiu-de-inchiriat", slug: "spatiu-de-inchiriat", routeSlug: "spatiu-de-inchiriat", title: "Banner Spaţiu de închiriat", description: "Banner pentru spaţii comerciale sau industriale de închiriat.", images: ["/products/banner/spatiu-de-inchiriat.jpg"], priceBase: 250, currency: "RON", tags: ["spatiu","inchiriat","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-spatiu-de-vanzare", slug: "spatiu-de-vanzare", routeSlug: "spatiu-de-vanzare", title: "Banner Spaţiu de vânzare", description: "Banner pentru spaţii de vânzare.", images: ["/products/banner/spatiu-de-vanzare.jpg"], priceBase: 250, currency: "RON", tags: ["spatiu","vanzare","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-teren-de-inchiriat", slug: "teren-de-inchiriat", routeSlug: "teren-de-inchiriat", title: "Banner Teren de închiriat", description: "Banner pentru terenuri de închiriat (teren, loturi).", images: ["/products/banner/teren-de-inchiriat.jpg"], priceBase: 250, currency: "RON", tags: ["teren","inchiriat","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-teren-de-vanzare", slug: "teren-de-vanzare", routeSlug: "teren-de-vanzare", title: "Banner Teren de vânzare", description: "Banner pentru terenuri de vânzare.", images: ["/products/banner/teren-de-vanzare.jpg"], priceBase: 250, currency: "RON", tags: ["teren","vanzare","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-vila-de-inchiriat", slug: "vila-de-inchiriat", routeSlug: "vila-de-inchiriat", title: "Banner Vilă de închiriat", description: "Banner pentru vile de închiriat.", images: ["/products/banner/vila-de-inchiriat.jpg"], priceBase: 250, currency: "RON", tags: ["vila","inchiriat","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-vila-de-vanzare", slug: "vila-de-vanzare", routeSlug: "vila-de-vanzare", title: "Banner Vilă de vânzare", description: "Banner pentru vile de vânzare.", images: ["/products/banner/vila-de-vanzare.jpg"], priceBase: 250, currency: "RON", tags: ["vila","vanzare","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } },
    { id: "banner-vulcanizare", slug: "vulcanizare", routeSlug: "vulcanizare", title: "Banner Vulcanizare", description: "Banner pentru service-uri de vulcanizare și anunţuri auto.", images: ["/products/banner/vulcanizare.jpg"], priceBase: 250, currency: "RON", tags: ["vulcanizare","auto","banner"], materials: MATERIAL_OPTIONS.filter((m)=> (m.recommendedFor ?? []).includes("bannere")), metadata: { category: "bannere" } }
  ];

  // Append user-provided extras, avoiding duplicates by routeSlug/slug/id
  const existingSlugs = new Set(BASE_PRODUCTS.map((p) => String(p.routeSlug ?? p.slug ?? p.id)));

  export const PRODUCTS: Product[] = BASE_PRODUCTS.concat(
    EXTRA_PRODUCTS_RAW.filter((p) => {
      const candidate = String(p.routeSlug ?? p.slug ?? p.id ?? "");
      return !existingSlugs.has(candidate);
    }).map((p) => {
      const slug = String(p.slug ?? p.routeSlug ?? p.id ?? "");
      return {
        id: p.id ?? `banner-${slug}`,
        slug: p.slug ?? slug,
        routeSlug: p.routeSlug ?? p.slug ?? slug,
        title: p.title ?? slug,
        description: p.description ?? "",
        images: p.images ?? [`/products/banner/${slug}.jpg`, "/products/banner/1.jpg", "/products/banner/2.jpg", "/products/banner/3.jpg"],
        priceBase: p.priceBase ?? 250,
        currency: p.currency ?? "RON",
        tags: p.tags ?? [],
    seo: p.seo ?? generateSeoForProduct(p),
        materials: MATERIAL_OPTIONS.filter((m) => (m.recommendedFor ?? []).includes("bannere")),
        metadata: { ...(p.metadata ?? {}), category: "bannere" },
      } as Product;
    })
  );

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
      bannere: { title: "Banner personalizat", image: "/images/generic-banner.jpg", defaultSlug: "banner" },
      afise: { title: "Afișe personalizate", image: "/images/generic-afise.jpg", defaultSlug: "afise" },
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