export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceBase: number; // preț fix de bază
  pricePerCm2: number; // preț pe cm^2
  currency: string;
  images: string[];
  sku?: string;
  inStock?: boolean;
  minWidthCm?: number;
  maxWidthCm?: number;
  minHeightCm?: number;
  maxHeightCm?: number;
};

const PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "banner-modern-120x60",
    title: "Banner modern 120x60 cm",
    description: "Banner PVC 510g, print UV, margini sudate. Potrivit pentru exterior.",
    priceBase: 40.0,
    pricePerCm2: 0.02,
    currency: "RON",
    images: [
      "https://res.cloudinary.com/your-cloud-name/image/upload/v000/banner-120x60.jpg"
    ],
    sku: "BANNER-120-60",
    inStock: true,
    minWidthCm: 10,
    maxWidthCm: 500,
    minHeightCm: 10,
    maxHeightCm: 300
  }
];

export async function getAllProducts(): Promise<Product[]> {
  return PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}