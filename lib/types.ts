// lib/types.ts
export type CartItem = {
  id: string;               // ex: "banner-300x100-frontlit_440-wind-false-hem-false"
  name: string;             // ex: "Banner personalizat"
  description?: string;
  quantity: number;
  unitAmount: number;       // preț unitar (fără TVA) în moneda contului (ex. EUR)
  totalAmount: number;      // unitAmount * quantity
  meta: {
    width_cm: number;
    height_cm: number;
    material: "frontlit_440" | "frontlit_510";
    wind: boolean;
    hem_grommets: boolean;
    sqm: number;
    pricePerSqm: number;
  };
};
