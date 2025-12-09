// Shared types for web and mobile

export type QA = {
  question: string;
  answer: string;
};

export type MaterialOption = {
  id: string;
  key?: string;
  name?: string;
  label: string;
  description?: string;
  priceModifier?: number;
  recommendedFor?: string[];
};

export type Product = {
  id: string;
  sku?: string;
  slug?: string;
  routeSlug?: string;
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
  metadata?: Record<string, unknown>;
  materials?: MaterialOption[];
  contentHtml?: string;
};

export type PriceInputBanner = {
  widthCm: number;
  heightCm: number;
  material: string;
  finishing: string;
  quantity: number;
  designOption: "upload" | "pro";
};

export type PriceInputAfise = { 
  size: string; 
  material: string; 
  quantity: number; 
  designOption: "upload" | "pro" 
};

export type PriceInputFlyer = { 
  sizeKey: string; 
  quantity: number; 
  twoSided: boolean; 
  paperWeightKey: string; 
  designOption: "upload" | "pro" 
};

export type PlianteFoldType = "simplu" | "fereastra" | "paralel" | "fluture";
export type PlianteWeightKey = "115" | "135" | "150" | "170" | "200" | "250";

export type PriceInputPliante = {
  foldType: PlianteFoldType;
  paperWeight: PlianteWeightKey;
  quantity: number;
  designOption: "upload" | "pro";
};

export type AutocolantesMaterialKey = "oracal_641" | "oracal_351" | "oracal_451" | "oracal_621" | "oracal_638m" | "oracal_651" | "oracal_970";

export type PriceInputAutocolante = {
  widthCm: number;
  heightCm: number;
  material: AutocolantesMaterialKey;
  finishing: string;
  quantity: number;
  designOption: "upload" | "pro";
};

export type PriceInputCanvas = {
  widthCm: number;
  heightCm: number;
  thickness: string;
  quantity: number;
  designOption: "upload" | "pro";
};

export type OrderItem = {
  id: string;
  productId: string;
  productTitle: string;
  quantity: number;
  price: number;
  options: Record<string, any>;
};

export type Order = {
  id: string;
  userId?: string;
  email: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
};
