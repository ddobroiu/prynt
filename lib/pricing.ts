export type BannerMaterial = "frontlit_440" | "mesh_370" | "blackout_610";
export type BannerFinish = "fara_finisare" | "capse_30cm" | "buzunar_5cm" | "tiv_termic";

export type PriceInput = {
  width_cm: number;
  height_cm: number;
  material: BannerMaterial;
  finish: BannerFinish;
  quantity: number;
};

const BASE_PRICE_PER_SQM: Record<BannerMaterial, number> = {
  frontlit_440: 32,
  mesh_370: 38,
  blackout_610: 55,
};

const FINISHING_PRICE_PER_M: Record<BannerFinish, number> = {
  fara_finisare: 0,
  capse_30cm: 4,
  buzunar_5cm: 6,
  tiv_termic: 5,
};

export function roundMoney(n: number) { return Math.round(n * 100) / 100; }
export function computeSqm(wcm: number, hcm: number) { return (Math.max(1,wcm)/100)*(Math.max(1,hcm)/100); }
export function computePerimeterM(wcm: number, hcm: number) { return 2*((Math.max(1,wcm)/100)+(Math.max(1,hcm)/100)); }

export function computeBannerPrice(input: PriceInput) {
  const sqm = computeSqm(input.width_cm, input.height_cm);
  const perimeterM = computePerimeterM(input.width_cm, input.height_cm);
  const materialBase = BASE_PRICE_PER_SQM[input.material] * sqm;
  const finishing = FINISHING_PRICE_PER_M[input.finish] * perimeterM;
  const processing = 2.5;
  const unitPrice = Math.max(15, materialBase + finishing + processing);
  const subtotal = unitPrice * input.quantity;

  let discount = 0;
  if (input.quantity >= 5 && input.quantity < 10) discount = 0.05 * subtotal;
  else if (input.quantity >= 10 && input.quantity < 20) discount = 0.08 * subtotal;
  else if (input.quantity >= 20) discount = 0.12 * subtotal;

  const total = subtotal - discount;

  return {
    sqm: roundMoney(sqm),
    perimeterM: roundMoney(perimeterM),
    unitPrice: roundMoney(unitPrice),
    subtotal: roundMoney(subtotal),
    discount: roundMoney(discount),
    total: roundMoney(total),
  };
}
