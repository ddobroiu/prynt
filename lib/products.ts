// lib/products.ts
// Central product registry + helpers for route/slug resolution.
// Updated: exports MaterialOption + MATERIAL_OPTIONS and Product.materials (optional)
// so components that read product.materials compile correctly.

export type MaterialOption = {
  key: string;
  label: string;
  description?: string;
  // priceModifier can be interpreted by UI: either percent (0.1 = +10%) or absolute RON addition
  priceModifier?: number;
  recommendedFor?: string[]; // e.g. ["bannere", "afise", "pliante"]
};

export const MATERIAL_OPTIONS: MaterialOption[] = [
  { key: "frontlit-440", label: "Frontlit 440 g/mp (standard)", description: "Material rezistent pentru exterior", priceModifier: 0, recommendedFor: ["bannere"] },
  { key: "frontlit-510", label: "Frontlit 510 g/mp (durabil)", description: "Mai gros, pentru expuneri îndelungate", priceModifier: 0.1, recommendedFor: ["bannere"] },
  { key: "couche-150", label: "Hârtie couché 150 g/mp", description: "Hârtie pentru afișe/interior și pliante", priceModifier: 0, recommendedFor: ["afise", "pliante"] },
  { key: "couche-170", label: "Hârtie couché 170 g/mp", description: "Hârtie premium pentru pliante/catalog", priceModifier: 0.12, recommendedFor: ["pliante"] },
  { key: "pp-5mm", label: "PVC 5mm", description: "Material rigid pentru indoor/outdoor", priceModifier: 0.15, recommendedFor: ["decor", "materiale-rigide"] },
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
    // provide recommended paper options for pliante
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
 * 2) suffix match (requests like "banner-300x100" match routeSlug "300x100")
 * 3) tag exact match
 * 4) title contains (low priority)
 */
export function getProductBySlug(slug: string | undefined): Product | undefined {
  if (!slug) return undefined;
  const s = String(slug).toLowerCase().trim();

  // 1) exact match
  for (const p of PRODUCTS) {
    const id = String(p.id ?? "").toLowerCase();
    const sl = String(p.slug ?? "").toLowerCase();
    const rs = String(p.routeSlug ?? "").toLowerCase();
    if (s === id || s === sl || s === rs) return p;
  }

  // 2) suffix match
  for (const p of PRODUCTS) {
    const sl = String(p.slug ?? "").toLowerCase();
    const rs = String(p.routeSlug ?? "").toLowerCase();
    if (rs && s.endsWith(rs)) return p;
    if (sl && s.endsWith(sl)) return p;
  }

  // 3) tag exact match (global)
  for (const p of PRODUCTS) {
    const tags = (p.tags ?? []).map((t) => String(t).toLowerCase());
    if (tags.includes(s)) return p;
  }

  // 4) title contains (low priority)
  for (const p of PRODUCTS) {
    const title = String(p.title ?? "").toLowerCase();
    if (title.includes(s)) return p;
  }

  return undefined;
}

export async function resolveProductForRequestedSlug(requestedSlug: string, category?: string) {
  const slug = String(requestedSlug || "").toLowerCase().trim();

  // 1) category scoped lookup (prefer products in the specified category)
  if (category) {
    const candidates = PRODUCTS.filter((p) => String(p.metadata?.category ?? "").toLowerCase() === String(category).toLowerCase());

    // 1a) exact id/slug/routeSlug or suffix among candidates
    for (const p of candidates) {
      const ids = [String(p.id ?? ""), String(p.slug ?? ""), String(p.routeSlug ?? "")].map((x) => x.toLowerCase());
      if (ids.includes(slug) || ids.some((id) => id && slug.endsWith(id))) {
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
      if (tags.includes(slug)) {
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
      if (title.includes(slug)) {
        return {
          product: p,
          initialWidth: p.width_cm ?? p.minWidthCm ?? null,
          initialHeight: p.height_cm ?? p.minHeightCm ?? null,
          isFallback: false,
        };
      }
    }
  }

  // 2) global lookup
  const product = getProductBySlug(slug);
  if (product) {
    return {
      product,
      initialWidth: product.width_cm ?? product.minWidthCm ?? null,
      initialHeight: product.height_cm ?? product.minHeightCm ?? null,
      isFallback: false,
    };
  }

  // 3) parse dimensions ex: 120x80
  const m = slug.match(/(\d{2,4})[x×-](\d{2,4})/);
  if (m) {
    const width = Number(m[1]);
    const height = Number(m[2]);
    const fallback: Product = {
      id: `fallback-${width}x${height}`,
      slug: `fallback-${width}x${height}`,
      routeSlug: `${width}x${height}`,
      title: `Produs ${width}x${height} cm`,
      description: `Produs personalizat ${width}x${height} cm — configurează dimensiuni și finisaje.`,
      images: ["/images/generic-banner.jpg"],
      priceBase: 0,
      currency: "RON",
      tags: ["fallback", "personalizat"],
      metadata: { category: category ?? "bannere" },
    };
    return { product: fallback, initialWidth: width, initialHeight: height, isFallback: true };
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
      routeSlug: slug || info.defaultSlug,
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