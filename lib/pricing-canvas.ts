// lib/pricing-canvas.ts

export type CanvasShape = "rect" | "square";

export type CanvasSize =
  | "30x40"
  | "40x60"
  | "60x90"
  | "30x30"
  | "40x40"
  | "60x60"
  | "90x90";

export type CanvasInput = {
  shape: CanvasShape;
  size: CanvasSize;
  quantity: number;
};

// 🔧 PREȚURI – modifică liber după tarifele tale reale (RON / bucată)
const PRICE_TABLE: Record<CanvasSize, number> = {
  "30x40": 79,
  "40x60": 129,
  "60x90": 199,

  "30x30": 69,
  "40x40": 99,
  "60x60": 159,
  "90x90": 279,
};

export function computeCanvasPrice(input: CanvasInput) {
  const qty = Math.max(1, Math.floor(input.quantity));
  const unit = PRICE_TABLE[input.size] ?? 0;
  const total = Math.round(unit * qty * 100) / 100;

  return {
    unitPrice: unit,
    total,
  };
}
