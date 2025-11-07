/**
 * lib/products.ts
 *
 * Central product model + resolver used by pages and API.
 */

export type MaterialOption = {
  id: string;
  name: string;
  priceModifierPerCm2?: number;
  fixedExtra?: number;
};

export type Product = {
  id: string;
  sku?: string; // optional stock-keeping unit (added to satisfy references to product.sku)
  slug: string; // canonical slug for the product (prefer base slug, no size)
  title: string;
  description: string;
  images: string[]; // urls or public/* paths
  priceBase: number;
  pricePerCm2: number;
  minWidthCm: number;
  maxWidthCm: number;
  minHeightCm: number;
  maxHeightCm: number;
  currency: string;
  materials?: MaterialOption[];
  bothSidesSupported?: boolean;
};

export const PRODUCTS: Product[] = [
  {
    id: "banner-1",
    sku: "BNR-MOD-120x60",
    // example with size included (still supported)
    slug: "banner-modern-120x60",
    title: "Banner modern 120x60 cm",
    description: "Banner PVC 510g, print UV, margini sudate. Potrivit pentru exterior.",
    images: ["https://res.cloudinary.com/your-cloud-name/image/upload/v000/banner-120x60.jpg"],
    priceBase: 40,
    pricePerCm2: 0.0025,
    minWidthCm: 20,
    maxWidthCm: 500,
    minHeightCm: 10,
    maxHeightCm: 300,
    currency: "RON",
    materials: [
      { id: "pvc-510", name: "PVC 510g", priceModifierPerCm2: 0 },
      { id: "mesh", name: "Mesh", priceModifierPerCm2: -0.0005 },
      { id: "backlit", name: "Backlit", priceModifierPerCm2: 0.001 },
    ],
    bothSidesSupported: true,
  },
  {
    id: "banner-frizerie",
    sku: "BNR-FRZ-STD",
    // preferred style: base slug without sizes
    slug: "frizerie",
    title: "Banner frizerie",
    description: "Banner pentru salon/frizerie, PVC 510g, print UV",
    images: ["https://res.cloudinary.com/your-cloud-name/image/upload/v000/frizerie-120x60.jpg"],
    priceBase: 35,
    pricePerCm2: 0.0028,
    minWidthCm: 20,
    maxWidthCm: 500,
    minHeightCm: 10,
    maxHeightCm: 300,
    currency: "RON",
    materials: [
      { id: "pvc-510", name: "PVC 510g", priceModifierPerCm2: 0 },
      { id: "mesh", name: "Mesh", priceModifierPerCm2: -0.0005 },
    ],
    bothSidesSupported: true,
  },
  // Add more products here...
];

/* Simple accessors (in a real app these would call a DB) */
export async function getAllProducts(): Promise<Product[]> {
  return PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

/* --- Helpers for resolving slugs with optional size suffix --- */
function stripSizeSuffix(slug: string): string {
  return slug.replace(/-\d{1,4}x\d{1,4}$/i, "");
}

function parseSizeFromSlug(slug: string): { base: string; width?: number; height?: number } {
  const m = slug.match(/^(.*)-(\d{1,4})x(\d{1,4})$/i);
  if (m) {
    return { base: m[1], width: Number(m[2]), height: Number(m[3]) };
  }
  return { base: slug };
}

export async function resolveProductForRequestedSlug(
  slugWithSize: string
): Promise<{ product: Product; initialWidth?: number; initialHeight?: number; isFallback?: boolean }> {
  const exact = await getProductBySlug(slugWithSize);
  if (exact) return { product: exact, isFallback: false };

  const parsed = parseSizeFromSlug(slugWithSize);
  const base = parsed.base;

  const baseExact = await getProductBySlug(base);
  if (baseExact) return { product: baseExact, initialWidth: parsed.width, initialHeight: parsed.height, isFallback: false };

  const all = await getAllProducts();
  const normalizedBase = base.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  let found = all.find((p) => stripSizeSuffix(p.slug).toLowerCase() === normalizedBase);
  if (!found) {
    found = all.find((p) => p.slug.toLowerCase().includes(normalizedBase) || p.title.toLowerCase().includes(normalizedBase));
  }
  if (found) return { product: found, initialWidth: parsed.width, initialHeight: parsed.height, isFallback: false };

  const cleanBase = base && base !== "undefined" ? base.replace(/[-_]+/g, " ") : "";
  const fallbackTitle = cleanBase ? `Banner ${cleanBase}` : "Banner";

  const fallback: Product = {
    id: `generic-${normalizedBase || "banner"}`,
    sku: `GEN-${normalizedBase || "banner"}`,
    slug: "generic-banner",
    title: fallbackTitle,
    description: "Configurare generică - alege material, dimensiuni și încarcă grafică.",
    images: ["/images/generic-banner.jpg"],
    priceBase: 35,
    pricePerCm2: 0.0025,
    minWidthCm: 20,
    maxWidthCm: 500,
    minHeightCm: 10,
    maxHeightCm: 300,
    currency: "RON",
    materials: [
      { id: "pvc-510", name: "PVC 510g", priceModifierPerCm2: 0 },
      { id: "mesh", name: "Mesh", priceModifierPerCm2: -0.0005 },
    ],
    bothSidesSupported: true,
  };

  return { product: fallback, initialWidth: parsed.width, initialHeight: parsed.height, isFallback: true };
}