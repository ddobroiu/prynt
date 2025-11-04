// lib/pricing-sticker.ts

export type StickerInput = {
  width: number;  // cm
  height: number; // cm
  quantity: number;
  material: "lucios" | "mat";
  laminare: boolean;
};

// 🔧 Tarife pe m² (RON)
const BASE_PRICE = 80; // până la 1 m²
const MID_PRICE = 60;  // între 1–5 m²
const HIGH_PRICE = 45; // peste 5 m²

export function computeStickerPrice(input: StickerInput) {
  const area = (input.width / 100) * (input.height / 100); // în m²
  const qty = Math.max(1, Math.floor(input.quantity));
  const totalArea = area * qty;

  let unit = BASE_PRICE;
  if (totalArea > 5) unit = HIGH_PRICE;
  else if (totalArea > 1) unit = MID_PRICE;

  // Adaosuri invizibile
  if (input.material === "lucios") unit *= 1.05;
  if (input.laminare) unit *= 1.1;

  const total = unit * totalArea;

  return {
    area,
    totalArea,
    unitPrice: Math.round(unit * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}
