// Tipuri de date
export type BannerMaterial = "frontlit_440" | "frontlit_510";
export type PriceInput = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: BannerMaterial;
  want_wind_holes: boolean;
  want_hem_and_grommets: boolean;
};
export type PriceOutput = {
  sqm_per_unit: number;
  total_sqm_taxable: number;
  pricePerSqmBase: number;
  finalPrice: number; // Acum este prețul fără TVA
};

// Constante de Prețuri (FĂRĂ TVA)
const MINIMUM_AREA_PER_ORDER = 1.0;
const PRICING_TIERS = [
  { maxSqm: 5, price: 35.0 },
  { maxSqm: 10, price: 32.0 },
  { maxSqm: 20, price: 30.0 },
  { maxSqm: 50, price: 28.0 },
  { maxSqm: Infinity, price: 26.0 },
];
const SURCHARGES = {
  frontlit_510: 1.15,
  wind_holes: 1.05,
  hem_and_grommets: 1.10,
};

const roundMoney = (num: number): number => Math.round(num * 100) / 100;

export const calculatePrice = (input: PriceInput): PriceOutput => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
    return { sqm_per_unit: 0, total_sqm_taxable: 0, pricePerSqmBase: 0, finalPrice: 0 };
  }

  const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
  const total_sqm_calculated = sqm_per_unit * input.quantity;
  const total_sqm_taxable = Math.max(total_sqm_calculated, MINIMUM_AREA_PER_ORDER);
  
  let pricePerSqmBase = PRICING_TIERS.find(t => total_sqm_taxable <= t.maxSqm)?.price || PRICING_TIERS[PRICING_TIERS.length - 1].price;
  
  let totalMultiplier = 1;
  if (input.material === "frontlit_510") totalMultiplier *= SURCHARGES.frontlit_510;
  if (input.want_wind_holes) totalMultiplier *= SURCHARGES.wind_holes;
  if (input.want_hem_and_grommets) totalMultiplier *= SURCHARGES.hem_and_grommets;
  
  const pricePerSqmAdjusted = pricePerSqmBase * totalMultiplier;
  const finalPrice = total_sqm_taxable * pricePerSqmAdjusted;

  return {
    sqm_per_unit: roundMoney(sqm_per_unit),
    total_sqm_taxable: roundMoney(total_sqm_taxable),
    pricePerSqmBase: roundMoney(pricePerSqmAdjusted),
    finalPrice: roundMoney(finalPrice), // Prețul final este acum FĂRĂ TVA
  };
};