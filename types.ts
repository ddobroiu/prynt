export type Address = {
  nume_prenume: string;
  email: string;
  telefon: string;
  judet: string;
  localitate: string;
  strada_nr: string;
};

export type Billing = {
  tip_factura: "persoana_fizica" | "persoana_juridica";
  denumire_companie?: string;
  cui?: string;
  reg_com?: string;
  judet?: string;
  localitate?: string;
  strada_nr?: string;
};

/* Product model cu configurare */
export type ProductConfigDimensions = {
  unit?: "cm" | "mm" | "m";
  minWidthCm: number;
  maxWidthCm: number;
  minHeightCm: number;
  maxHeightCm: number;
  stepCm?: number;
};

export type ProductConfig = {
  configurable?: boolean;
  dimensions?: ProductConfigDimensions;
  pricePerSqm?: number; // preț per m^2 pentru variante personalizate
  basePrice?: number;   // preț minim / cost fix (opțional)
};

export type ProductCategory = "bannere" | "postere" | "stickere" | string;

export type Product = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  price: number; // preț implicit (default) sau pentru variante predefinite
  currency?: string;
  stock: number;
  category: ProductCategory;
  images?: string[];
  attributes?: Record<string, string>;
  config?: ProductConfig;
  created_at?: string;
  updated_at?: string;
};