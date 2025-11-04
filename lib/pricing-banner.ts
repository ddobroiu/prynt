// lib/pricing-banner.ts - LOGICA CENTRALĂ DE CALCUL A PREȚULUI

export type BannerMaterial = "frontlit_440" | "frontlit_510";

export type PriceInput = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: BannerMaterial;
  want_wind_holes: boolean;
  want_hem_and_grommets: boolean; // Tiv + capse
};

export type PriceOutput = {
  sqm_per_unit: number; // Suprafața unei singure unități (m²)
  total_sqm_calculated: number; // Suprafața totală reală (m²)
  total_sqm_taxable: number; // Suprafața taxabilă (m²), cu min. 1m²
  pricePerSqmAdjusted: number; // Prețul de bază/mp ajustat cu multiplicatorii (fără TVA)
  totalBasePrice: number; // Preț total înainte de TVA
  finalPrice: number; // Preț final cu TVA
  isMinAreaApplied: boolean; // Indicator dacă a fost aplicat minimum 1m²
};


// --- CONSTANTE DE PREȚURI ---
const TVA = 0.19;
const MINIMUM_AREA_PER_ORDER = 1.0; // Suprafața minimă taxabilă (în m²)

// Prețurile de BAZĂ (Frontlit 440g) în RON, pe prag de suprafață totală taxabilă (fără finisaje/TVA)
// NOTĂ: Primul prag (1.0 mp) are un preț mai mare pentru a acoperi costul minim de producție/setup.
const TIERED_PRICES: { maxSqm: number, price: number }[] = [
    { maxSqm: MINIMUM_AREA_PER_ORDER, price: 150.00 }, // Taxa minima de 150 RON pentru 1mp
    { maxSqm: 5, price: 100.00 },
    { maxSqm: 20, price: 75.00 },
    { maxSqm: Infinity, price: 50.00 }, // Peste 20 mp
];

// Supra-taxe (multiplicator) - Aplicate multiplicativ la prețul de bază/mp
const SURCHARGES = {
    // Frontlit 510g este cu 15% mai scump (x1.15)
    frontlit_510: 1.15,
    // Găuri de vânt (adaugă 5% la costul de bază al suprafeței)
    wind_holes: 1.05,
    // Tiv + Capse (adaugă 10% la costul de bază al suprafeței)
    hem_and_grommets: 1.10,
    // TVA
    tva_multiplier: 1 + TVA
};
// -----------------------------


export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Calculează suprafața unei piese (în m²).
 */
export function computeSqm(width_cm: number, height_cm: number): number {
  // width/height poate fi 0 sau negativ in input, le tratam ca 0 pentru calculul suprafetei reale
  const w_m = Math.max(0, width_cm) / 100;
  const h_m = Math.max(0, height_cm) / 100;
  return w_m * h_m;
}

/**
 * Calculează prețul de bază pe metru pătrat în funcție de suprafața totală taxabilă.
 */
function getTierPricePerSqm(sqm: number): number {
    for (const tier of TIERED_PRICES) {
        if (sqm <= tier.maxSqm) {
            return tier.price;
        }
    }
    return TIERED_PRICES[TIERED_PRICES.length - 1].price;
}

/**
 * Calculează prețul total al comenzii de bannere.
 */
export function computeBannerPrice(input: PriceInput): PriceOutput {
    // 1. Suprafața pe unitate și totală reală (brută)
    const sqm_per_unit = computeSqm(input.width_cm, input.height_cm);
    const total_sqm_calculated = sqm_per_unit * input.quantity;

    // 2. Suprafața totală taxabilă (Minim 1m² regula)
    const total_sqm_taxable = Math.max(total_sqm_calculated, MINIMUM_AREA_PER_ORDER);
    const isMinAreaApplied = roundMoney(total_sqm_taxable) > roundMoney(total_sqm_calculated);

    // 3. Prețul de bază pe metru pătrat (din tier-ul de cantitate)
    let pricePerSqmBase = getTierPricePerSqm(total_sqm_taxable);

    // 4. Aplicarea Multiplicatorilor (Surcharges)
    let totalMultiplier = 1;
    
    // Multiplicator Material
    if (input.material === "frontlit_510") {
        totalMultiplier *= SURCHARGES.frontlit_510;
    }

    // Multiplicator Finisaj (multiplicare cumulativă)
    if (input.want_wind_holes) {
        totalMultiplier *= SURCHARGES.wind_holes;
    }
    if (input.want_hem_and_grommets) {
        totalMultiplier *= SURCHARGES.hem_and_grommets;
    }
    
    // Prețul final pe mp ajustat (fără TVA)
    const pricePerSqmAdjusted = pricePerSqmBase * totalMultiplier;

    // 5. Preț total FĂRĂ TVA
    const totalBasePrice = total_sqm_taxable * pricePerSqmAdjusted;

    // 6. Preț total CU TVA
    const finalPrice = totalBasePrice * SURCHARGES.tva_multiplier;
    
    return {
        sqm_per_unit: roundMoney(sqm_per_unit),
        total_sqm_calculated: roundMoney(total_sqm_calculated),
        total_sqm_taxable: roundMoney(total_sqm_taxable),
        pricePerSqmAdjusted: roundMoney(pricePerSqmAdjusted), 
        totalBasePrice: roundMoney(totalBasePrice),
        finalPrice: roundMoney(finalPrice),
        isMinAreaApplied: isMinAreaApplied,
    };
}
