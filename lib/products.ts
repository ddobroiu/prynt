export type MaterialOption = {
  id: string;
  name: string;
  priceModifierPerCm2?: number; // add/sub per cm^2
  fixedExtra?: number; // fixed extra cost
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
  // adauga alte produse aici
];

export async function getAllProducts(): Promise<Product[]> {
  // în proiect real ai fetch DB; aici staticul
  return PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}