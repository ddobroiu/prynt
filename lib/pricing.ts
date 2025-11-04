// lib/pricing.ts
export type BannerMaterial = "frontlit_440" | "frontlit_510";

export type PriceInput = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: BannerMaterial;
  want_wind_holes: boolean;
  want_hem_and_grommets: boolean;
};

export function roundMoney(n: number) {
  return Math.round(n * 100) / 100;
}

export function computeSqm(width_cm: number, height_cm: number) {
  const w = Math.max(1, width_cm) / 100;
  const h = Math.max(1, height_cm) / 100;
  return w * h;
}

function tierPricePerSqm(sqm: number) {
  if (sqm < 1) return 100;
  if (sqm < 5) return 75;
  if (sqm < 20) return 50;
  return 30; // peste 20 mp
}

export function computeBannerPrice(input: PriceInput) {
  const sqm = computeSqm(input.width_cm, input.height_cm);
  const pricePerSqm = tierPricePerSqm(sqm);

  let multiplier = 1;

  // Material 510 = +10%
  if (input.material === "frontlit_510") multiplier += 0.10;
  // Găuri de vânt = +10%
  if (input.want_wind_holes) multiplier += 0.10;
  // Tiv + capse = +10%
  if (input.want_hem_and_grommets) multiplier += 0.10;

  const baseUnit = sqm * pricePerSqm;
  const unitPrice = baseUnit * multiplier;
  const total = unitPrice * Math.max(1, input.quantity);

  return {
    sqm: roundMoney(sqm),
    pricePerSqm,
    unitPrice: roundMoney(unitPrice),
    total: roundMoney(total),
  };
}
