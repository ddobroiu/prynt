// Înlocuiește / completează lib/products.ts cu acest conținut (păstrează funcțiile tale deja existente)
export type MaterialOption = {
  id: string;
  name: string;
  priceModifierPerCm2?: number;
  fixedExtra?: number;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  images: string[];
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
  // ... păstrează / adaugă produsele tale reale aici ...
];

// Utility simple
export async function getAllProducts(): Promise<Product[]> {
  return PRODUCTS;
}
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

// ---- Noul helper: resolvăm produsul pentru un slug cerut ----
function stripSizeSuffix(slug: string): string {
  return slug.replace(/-\d+x\d+$/i, "");
}

function parseSizeFromSlug(slug: string): { width?: number; height?: number; base: string } {
  const m = slug.match(/^(.*)-(\d{1,4})x(\d{1,4})$/i);
  if (m) return { base: m[1], width: Number(m[2]), height: Number(m[3]) };
  return { base: slug };
}

/**
 * Găsește cel mai potrivit produs pentru slug-ul cerut.
 * Returnează:
 *  - product: Product (fie produs real, fie fallback generic)
 *  - initialWidth/initialHeight: dimensiuni extrase din slug (dacă există)
 *  - isFallback: true dacă am creat un produs generic (nu există matching real)
 */
export async function resolveProductForRequestedSlug(slugWithSize: string): Promise<{
  product: Product;
  initialWidth?: number;
  initialHeight?: number;
  isFallback?: boolean;
}> {
  // 1) try exact slug
  const exact = await getProductBySlug(slugWithSize);
  if (exact) return { product: exact, isFallback: false };

  // 2) try stripping size suffix and look for base slug
  const parsed = parseSizeFromSlug(slugWithSize);
  const base = parsed.base;

  const baseExact = await getProductBySlug(base);
  if (baseExact) return { product: baseExact, initialWidth: parsed.width, initialHeight: parsed.height, isFallback: false };

  // 3) fuzzy search: try compare product base slugs or title includes
  const all = await getAllProducts();
  const normalizedBase = base.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  let found = all.find((p) => stripSizeSuffix(p.slug).toLowerCase() === normalizedBase);
  if (!found) {
    found = all.find((p) => p.slug.toLowerCase().includes(normalizedBase) || p.title.toLowerCase().includes(normalizedBase));
  }
  if (found) return { product: found, initialWidth: parsed.width, initialHeight: parsed.height, isFallback: false };

  // 4) fallback generic product (returned when nothing else matches)
  const fallback: Product = {
    id: `generic-${normalizedBase || "banner"}`,
    slug: "generic-banner",
    title: `Banner ${base}`,
    description: "Configurare generică - alege material, dimensiuni și încarcă grafică.",
    images: ["/images/generic-banner.jpg"], // pune o imagine generică în public/images/
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