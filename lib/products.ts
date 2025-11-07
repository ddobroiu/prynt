export type MaterialOption = {
  id: string;
  name: string;
  priceModifierPerCm2: number; // supliment per cm2 sau multiplicator
  fixedExtra?: number; // cost fix
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  images: string[];
  priceBase: number; // cost fix
  pricePerCm2: number; // baza per cm2
  minWidthCm: number;
  maxWidthCm: number;
  minHeightCm: number;
  maxHeightCm: number;
  currency: string;
  materials?: MaterialOption[]; // ex: PVC, Mesh, Backlit
  bothSidesSupported?: boolean; // true dacă pot fi printate față+verso
};

// Example data
export const PRODUCTS: Product[] = [
  {
    id: "banner-1",
    slug: "banner-modern-120x60",
    title: "Banner modern 120x60 cm",
    description: "Banner PVC 510g, print UV...",
    images: ["https://res.cloudinary.com/.../banner-120x60.jpg"],
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
  // other products...
];

export async function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getAllProducts() {
  return PRODUCTS;
}