/**
 * Central product model + resolver used by pages and sitemap generation.
 * Păstrează lista de produse (dimensiuni uzuale) aici; e sursa de adevăr
 * folosită de app/banner/[slug]/page.tsx și de sitemap.
 */

export type Product = {
  id: string;
  sku?: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  images: string[];
  priceBase?: number; // fallback price (RON)
  minWidthCm?: number;
  minHeightCm?: number;
  width_cm?: number;
  height_cm?: number;
  currency?: string;
  materials?: { id: string; name: string; surchargePercent?: number }[];
  tags?: string[];
  seo?: { title?: string; description?: string };
  metadata?: Record<string, any>;
};

export const PRODUCTS: Product[] = [
  {
    id: "banner-120x20",
    sku: "BNR-120x20",
    slug: "120x20",
    title: "Banner 120x20 cm",
    description: "Banner personalizat 120x20 cm — tiv și capse incluse. Ideal pentru promoții scurte și anunțuri.",
    longDescription:
      "<p>Banner 120x20 cm printat pe material frontlit. Tiv și capse incluse, opțiune găuri pentru vânt. Alege materialul și finisajele, încarcă grafică sau scrie textul — calculezi instant prețul.</p>",
    images: ["/products/banner/120x20-1.jpg", "/products/banner/120x20-2.jpg", "/products/banner/120x20-3.jpg", "/products/banner/120x20-4.jpg"],
    priceBase: 55.0,
    width_cm: 120,
    height_cm: 20,
    currency: "RON",
    materials: [
      { id: "frontlit_440", name: "Frontlit 440g/mp", surchargePercent: 0 },
      { id: "frontlit_510", name: "Frontlit 510g/mp", surchargePercent: 10 },
    ],
    tags: ["banner", "120x20", "promo", "tiv capse"],
    seo: {
      title: "Banner 120x20 cm — personalizat | Prynt",
      description: "Comandă banner 120x20 cm personalizat. Tiv și capse incluse. Preț instant, livrare rapidă.",
    },
    metadata: { category: "bannere" },
  },
  {
    id: "banner-120x60",
    sku: "BNR-120x60",
    slug: "120x60",
    title: "Banner 120x60 cm",
    description: "Banner 120x60 cm — ideal pentru exterior și evenimente, tiv și capse incluse.",
    images: ["/products/banner/120x60-1.jpg", "/products/banner/120x60-2.jpg"],
    priceBase: 120.0,
    width_cm: 120,
    height_cm: 60,
    currency: "RON",
    tags: ["banner", "120x60", "eveniment"],
    seo: {
      title: "Banner 120x60 cm — personalizat | Prynt",
      description: "Banner 120x60 cm personalizat — comandă online și livrare rapidă.",
    },
    metadata: { category: "bannere" },
  },
  {
    id: "banner-100x50",
    sku: "BNR-100x50",
    slug: "100x50",
    title: "Banner 100x50 cm",
    description: "Banner 100x50 cm — flexibil, utilizare indoor/outdoor.",
    images: ["/products/banner/100x50-1.jpg"],
    priceBase: 75.0,
    width_cm: 100,
    height_cm: 50,
    currency: "RON",
    tags: ["banner", "100x50"],
    seo: {
      title: "Banner 100x50 cm — personalizat | Prynt",
      description: "Banner 100x50 cm, configurație rapidă și livrare expres.",
    },
    metadata: { category: "bannere" },
  },
  {
    id: "banner-200x100",
    sku: "BNR-200x100",
    slug: "200x100",
    title: "Banner 200x100 cm",
    description: "Banner 200x100 cm — soluție vizibilă pentru fațade și evenimente mari.",
    images: ["/products/banner/200x100-1.jpg"],
    priceBase: 240.0,
    width_cm: 200,
    height_cm: 100,
    currency: "RON",
    tags: ["banner", "200x100", "faţadă"],
    seo: {
      title: "Banner 200x100 cm — personalizat | Prynt",
      description: "Banner 200x100 cm printat la calitate profesională — tiv & capse incluse.",
    },
    metadata: { category: "bannere" },
  },
  {
    id: "banner-300x100",
    sku: "BNR-300x100",
    slug: "300x100",
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
    metadata: { category: "bannere" },
  },
  {
    id: "banner-generic",
    sku: "BNR-GEN",
    slug: "generic-banner",
    title: "Banner personalizat",
    description: "Banner personalizat — alege dimensiuni, material și finisaje.",
    images: ["/images/generic-banner.jpg"],
    priceBase: 35.0,
    currency: "RON",
    tags: ["banner", "personalizat", "custom"],
    seo: {
      title: "Banner personalizat — configurează online | Prynt",
      description: "Configurează bannerul tău: dimensiuni, materiale, finisaje și grafică. Preț instant.",
    },
    metadata: { category: "bannere" },
  },
];

// Utilitare
export function getAllProductSlugs(): string[] {
  return PRODUCTS.map((p) => p.slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug || p.id === slug);
}

/**
 * Rezolvator folosit de pagina /banner/[slug]
 * - dacă există produs cu slug returnează product + initialWidth/Height
 * - altfel, încearcă să parseze dimensiuni din slug (ex: "120x20" sau "banner-120x20")
 *   și returnează fallback product (isFallback = true)
 */
export async function resolveProductForRequestedSlug(requestedSlug: string) {
  const slug = String(requestedSlug || "").toLowerCase();
  const product = getProductBySlug(slug);
  if (product) {
    return { product, initialWidth: product.width_cm ?? product.minWidthCm ?? null, initialHeight: product.height_cm ?? product.minHeightCm ?? null, isFallback: false };
  }

  // try parse dimensions pattern
  const m = slug.match(/(\d{2,4})[x×-](\d{2,4})/);
  if (m) {
    const width = Number(m[1]);
    const height = Number(m[2]);
    const fallback: Product = {
      id: `fallback-${width}x${height}`,
      slug: `fallback-${width}x${height}`,
      title: `Banner ${width}x${height} cm`,
      description: `Banner personalizat ${width}x${height} cm — configurează dimensiuni și finisaje.`,
      images: ["/images/generic-banner.jpg"],
      priceBase: 0,
      width_cm: width,
      height_cm: height,
      currency: "RON",
      tags: ["banner", `${width}x${height}`],
      seo: {
        title: `Banner ${width}x${height} cm — personalizat | Prynt`,
        description: `Configurează banner ${width}x${height} cm — tiv, capse, opțiuni materiale.`,
      },
      metadata: { generatedFallback: true },
    };
    return { product: fallback, initialWidth: width, initialHeight: height, isFallback: true };
  }

  // no product
  return { product: null, initialWidth: null, initialHeight: null, isFallback: false };
}