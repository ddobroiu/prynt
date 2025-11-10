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

//=== PRODUCTS ===============================================================
// Add or edit products here. Keep landing-specific tags (frizerie, vulcanizare, etc.)
// only on landing entries to avoid greedy matches.
export const PRODUCTS: Product[] = [
  // BANNERS (generic)
  {
    id: "banner-200x100",
    sku: "BNR-200x100",
    slug: "200x100",
    routeSlug: "200x100",
    title: "Banner 200x100 cm",
    description: "Banner 200x100 cm printat la calitate profesională — tiv & capse incluse.",
    images: ["/products/banner/200x100-1.jpg"],
    priceBase: 200.0,
    width_cm: 200,
    height_cm: 100,
    currency: "RON",
    tags: ["banner", "200x100"],
    seo: {
      title: "Banner 200x100 cm — personalizat | Prynt",
      description: "Banner 200x100 cm — print outdoor durabil, tiv și capse incluse.",
    },
    materials: MATERIAL_OPTIONS.filter((m) => (m.recommendedFor ?? []).includes("bannere")),
    metadata: { category: "bannere" },
  },
  {
    id: "banner-300x100",
    sku: "BNR-300x100",
    slug: "300x100",
    routeSlug: "300x100",
    title: "Banner 300x100 cm",
    description: "Banner 300x100 cm — ideal pentru evenimente și exterior.",
    images: ["/products/banner/300x100-1.jpg"],
    priceBase: 300.0,
    width_cm: 300,
    height_cm: 100,
    currency: "RON",
    tags: ["banner", "300x100"],
    seo: {
      title: "Banner 300x100 cm — personalizat | Prynt",
      description: "Banner 300x100 cm — print outdoor durabil, tiv și capse incluse.",
    },
    materials: MATERIAL_OPTIONS.filter((m) => (m.recommendedFor ?? []).includes("bannere")),
    metadata: { category: "bannere" },
  },

  // PLIANTE (generic)
  {
    id: "pliant-a5",
    sku: "PLT-A5",
    slug: "a5-pliante",
    routeSlug: "a5",
    title: "Pliante A5",
    description: "Pliante A5 tipărite față/verso — multiple finisaje.",
    images: ["/products/pliante/a5-1.jpg"],
    priceBase: 45.0,
    currency: "RON",
    tags: ["pliante", "a5"],
    materials: MATERIAL_OPTIONS.filter((m) => (m.recommendedFor ?? []).includes("pliante")),
    metadata: { category: "pliante" },
  },

  // CANVAS (generic)
  {
    id: "canvas-80x80",
    sku: "CAN-80x80",
    slug: "80x80-canvas",
    routeSlug: "80x80",
    title: "Canvas 80x80 cm",
    description: "Canvas Fine Art 80x80 cm cu șasiu din lemn.",
    images: ["/products/canvas/80x80-1.jpg"],
    priceBase: 350.0,
    width_cm: 80,
    height_cm: 80,
    currency: "RON",
    tags: ["canvas", "80x80"],
    metadata: { category: "canvas" },
  },

  // AUTOCOLANTE (generic)
  {
    id: "autocolante-foaie",
    sku: "AUT-FOAIE",
    slug: "autocolante-foaie",
    routeSlug: "autocolante",
    title: "Autocolante pe foaie",
    description: "Autocolante glossy sau matte, tăiate pe contur sau pe foaie.",
    images: ["/products/autocolante/foaie-1.jpg"],
    priceBase: 25.0,
    currency: "RON",
    tags: ["autocolante", "stickere"],
    metadata: { category: "autocolante" },
  },

  // MATERIALE RIGIDE - Polipropilena si Alucobond
  {
    id: "polipropilena-5mm",
    sku: "PP-5MM",
    slug: "polipropilena-5mm",
    routeSlug: "polipropilena",
    title: "Polipropilenă (PP) 5mm",
    description: "Placă din polipropilenă celulară 5mm — ideală pentru panouri expoziționale și semnalistică ușoară.",
    images: ["/products/materiale/polipropilena-5mm-1.jpg"],
    priceBase: 120.0,
    currency: "RON",
    tags: ["polipropilena", "pp", "materiale-rigide"],
    seo: {
      title: "Placă Polipropilenă (PP) 5mm | Prynt",
      description: "Placă din polipropilenă 5mm pentru indoor/outdoor — tăiere, perforare și montaj la cerere."
    },
    materials: MATERIAL_OPTIONS.filter((m) => (m.recommendedFor ?? []).includes("materiale-rigide")),
    metadata: { category: "materiale-rigide" },
  },

  {
    id: "alucobond-3mm",
    sku: "ALU-3MM",
    slug: "alucobond-3mm",
    routeSlug: "alucobond",
    title: "Alucobond / Aluminiu compozit 3mm",
    description: "Panou compozit Alucobond 3mm — finisaj mat/lucios, potrivit pentru fațade, panouri și semnalistică premium.",
    images: ["/products/materiale/alucobond-3mm-1.jpg"],
    priceBase: 250.0,
    currency: "RON",
    tags: ["alucobond", "aluminium-composite", "materiale-rigide"],
    seo: {
      title: "Alucobond 3mm — panou compozit | Prynt",
      description: "Alucobond 3mm — panouri compozite din aluminiu pentru aplicații exterioare și interior."
    },
    materials: MATERIAL_OPTIONS.filter((m) => (m.recommendedFor ?? []).includes("materiale-rigide")),
    metadata: { category: "materiale-rigide" },
  },

  // FLYER (generic)
  {
    id: "flyer-a6",
    sku: "FLY-A6",
    slug: "flyer-a6",
    routeSlug: "a6",
    title: "Flyer A6",
    description: "Flyer A6 — tiraj mic sau mare, față/verso.",
    images: ["/products/flyer/a6-1.jpg"],
    priceBase: 50.0,
    currency: "RON",
    tags: ["flyer", "a6"],
    metadata: { category: "flyer" },
  },

  // AFISE (generic)
  {
    id: "afis-a2",
    sku: "AFS-A2",
    slug: "afis-a2",
    routeSlug: "a2",
    title: "Afiș A2",
    description: "Afiș A2 imprimat pe hârtie couché 150g — exterior/interior.",
    images: ["/products/afise/a2-1.jpg"],
    priceBase: 40.0,
    width_cm: 42,
    height_cm: 59,
    currency: "RON",
    tags: ["afis", "a2"],
    materials: MATERIAL_OPTIONS.filter((m) => (m.recommendedFor ?? []).includes("afise")),
    metadata: { category: "afise" },
  },

  // --- LANDING PAGES (SEO) for many niches ---------------------
  // Keep niche tags only on these landing entries.

  // FRIZERIE landing pages
  {
    id: "pliant-frizerie-landing",
    sku: "PLT-FRZ",
    slug: "pliant-frizerie",
    routeSlug: "pliante-frizerie",
    title: "Pliante pentru frizerii — modele, prețuri și configurator",
    description: "Pliante special create pentru frizerii: design personalizat, hârtie, pliere și tiraj. Configurează online și vezi prețul instant.",
    images: ["/images/landing/pliante-frizerie-1.jpg"],
    priceBase: 0,
    currency: "RON",
    tags: ["pliante", "frizerie", "salon", "pliante-frizerie"],
    seo: {
      title: "Pliante pentru frizerii — comandă online | Prynt",
      description: "Pliante personalizate pentru saloane și frizerii. Alege dimensiuni, hârtie și finisaje. Configurator live.",
    },
    materials: MATERIAL_OPTIONS.filter((m) => (m.recommendedFor ?? []).includes("pliante")),
    metadata: { category: "pliante", landing: true },
  },
  {
    id: "afis-frizerie-landing",
    sku: "AFS-FRZ",
    slug: "afis-frizerie",
    routeSlug: "afise-frizerie",
    title: "Afișe pentru frizerii — modele și imprimare",
    description: "Afișe pentru frizerii: formate A2/A1, finisaje și laminare. Configurează direct online.",
    images: ["/images/landing/afise-frizerie-1.jpg"],
    priceBase: 0,
    currency: "RON",
    tags: ["afise", "frizerie", "afise-frizerie"],
    seo: {
      title: "Afișe frizerie — imprimare A2, A1 | Prynt",
      description: "Afișe personalizate pentru frizerii. Alege formatul, hârtia și trimite grafica. Configurator integrat.",
    },
    materials: MATERIAL_OPTIONS.filter((m) => (m.recommendedFor ?? []).includes("afise")),
    metadata: { category: "afise", landing: true },
  },
  {
    id: "canvas-frizerie-landing",
    sku: "CAN-FRZ",
    slug: "canvas-frizerie",
    routeSlug: "canvas-frizerie",
    title: "Canvas personalizat pentru frizerii",
    description: "Canvas-uri decorative pentru salon: pânză Fine Art pe șasiu, multiple dimensiuni și finisaje.",
    images: ["/images/landing/canvas-frizerie-1.jpg"],
    priceBase: 0,
    width_cm: 100,
    height_cm: 70,
    currency: "RON",
    tags: ["canvas", "frizerie", "canvas-frizerie"],
    seo: {
      title: "Canvas pentru frizerii — print pe pânză | Prynt",
      description: "Canvas-uri elegante pentru decorul salonului. Configurează dimensiunea și comanda online.",
    },
    metadata: { category: "canvas", landing: true },
  },
  {
    id: "banner-frizerie-landing",
    sku: "BNR-FRZ",
    slug: "banner-frizerie",
    routeSlug: "banner-frizerie",
    title: "Bannere pentru frizerii — vizibilitate pentru salon",
    description: "Bannere rezistente pentru exterior și interior. Alege dimensiunea, materialul și finisajele. Configurator inclus.",
    images: ["/images/landing/banner-frizerie-1.jpg"],
    priceBase: 0,
    currency: "RON",
    tags: ["banner", "frizerie", "banner-frizerie"],
    seo: {
      title: "Bannere frizerie — tiv & capse | Prynt",
      description: "Bannere personalizate pentru frizerii — configurator online pentru dimensiuni, material și finisaje.",
    },
    materials: MATERIAL_OPTIONS.filter((m) => (m.recommendedFor ?? []).includes("bannere")),
    metadata: { category: "bannere", landing: true },
  },

  // VULCANIZARE landing pages
  {
    id: "pliant-vulcanizare-landing",
    sku: "PLT-VUL",
    slug: "pliant-vulcanizare",
    routeSlug: "pliante-vulcanizare",
    title: "Pliante pentru vulcanizări — modele, prețuri și configurator",
    description: "Pliante concepute pentru service-uri auto și vulcanizări: oferte, pachete de service și promoții. Configurează tirajul și finisajele online.",
    images: ["/images/landing/pliante-vulcanizare-1.jpg"],
    priceBase: 0,
    currency: "RON",
    tags: ["pliante", "vulcanizare", "service-auto", "pliante-vulcanizare"],
    seo: {
      title: "Pliante pentru vulcanizări — tipărire rapidă | Prynt",
      description: "Pliante și flyere pentru vulcanizări: promovare oferte, reparații și schimb anvelope. Alege formatul și tirajul în configurator.",
    },
    materials: MATERIAL_OPTIONS.filter((m) => (m.recommendedFor ?? []).includes("pliante")),
    metadata: { category: "pliante", landing: true },
  },
  {
    id: "afis-vulcanizare-landing",
    sku: "AFS-VUL",
    slug: "afis-vulcanizare",
    routeSlug: "afise-vulcanizare",
    title: "Afișe pentru vulcanizări — vizibilitate locală",
    description: "Afișe A2/A1 pentru service-uri auto și vulcanizări. Materiale rezistente și opțiuni de laminare.",
    images: ["/images/landing/afise-vulcanizare-1.jpg"],
    priceBase: 0,
    currency: "RON",
    tags: ["afise", "vulcanizare", "afise-vulcanizare"],
    seo: {
      title: "Afișe vulcanizare — imprimare A2/A1 | Prynt",
      description: "Produse de semnalistică pentru service-uri auto: afișe, bannere și postere. Configurator integrat.",
    },
    materials: MATERIAL_OPTIONS.filter((m) => (m.recommendedFor ?? []).includes("afise")),
    metadata: { category: "afise", landing: true },
  },
  {
    id: "canvas-vulcanizare-landing",
    sku: "CAN-VUL",
    slug: "canvas-vulcanizare",
    routeSlug: "canvas-vulcanizare",
    title: "Canvas pentru service auto — decorați salonul sau sala de așteptare",
    description: "Canvas-uri decorative cu brandingul service-ului: portofolii, oferte, imagini cu echipamente sau brand.",
    images: ["/images/landing/canvas-vulcanizare-1.jpg"],
    priceBase: 0,
    width_cm: 100,
    height_cm: 70,
    currency: "RON",
    tags: ["canvas", "vulcanizare", "canvas-vulcanizare"],
    seo: {
      title: "Canvas pentru vulcanizări — print pe pânză | Prynt",
      description: "Canvas-uri personalizate pentru service-uri auto: decor, portofoliu și branding intern.",
    },
    metadata: { category: "canvas", landing: true },
  },
  {
    id: "banner-vulcanizare-landing",
    sku: "BNR-VUL",
    slug: "banner-vulcanizare",
    routeSlug: "banner-vulcanizare",
    title: "Bannere pentru vulcanizări — semnalistică și promoții",
    description: "Bannere rezistente pentru exterior cu focus pe vizibilitate: oferte sezonale și anunțuri de service.",
    images: ["/images/landing/banner-vulcanizare-1.jpg"],
    priceBase: 0,
    currency: "RON",
    tags: ["banner", "vulcanizare", "banner-vulcanizare"],
    seo: {
      title: "Bannere vulcanizare — tiv & capse | Prynt",
      description: "Bannere personalizate pentru vulcanizări — configurator online pentru dimensiuni, material și finisaje.",
    },
    materials: MATERIAL_OPTIONS.filter((m) => (m.recommendedFor ?? []).includes("bannere")),
    metadata: { category: "bannere", landing: true },
  },
];

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