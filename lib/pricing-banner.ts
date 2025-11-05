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
  pricePerSqmBase: number; // Prețul de bază/mp pentru acel prag (pentru afișare)
  totalBasePrice: number; // Preț total înainte de TVA
  finalPrice: number; // Preț final cu TVA
  isMinAreaApplied: boolean; // Indicator dacă a fost aplicat minimum 1m²
};


// --- CONSTANTE DE PREȚURI ---
const TVA = 0.19;
const MINIMUM_AREA_PER_ORDER = 1.0; // Suprafața minimă taxabilă (în m²)

// Prețurile de BAZĂ (Frontlit 440g) în RON, pe prag de suprafață totală (mp)
const PRICING_TIERS = [
  { area: 0, price: 40.0 },   // 0+ mp
  { area: 5, price: 38.0 },   // 5+ mp
  { area: 10, price: 35.0 },  // 10+ mp
  { area: 25, price: 32.0 },  // 25+ mp
  { area: 50, price: 30.0 },  // 50+ mp
];

const SURCHARGES = {
  frontlit_510: 1.15,        // Multiplicator 15% pentru 510g
  wind_holes: 1.05,          // Multiplicator 5% pentru găuri de vânt
  hem_and_grommets: 1.10,    // Multiplicator 10% pentru tiv și capse
};

// --- FUNCȚII HELPER ---

// Funcție pentru rotunjirea la două zecimale (bani)
export function roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
}

// Funcție pentru formatarea prețului
export function money(amount: number): string {
    return `${roundMoney(amount).toFixed(2)} RON`;
}

// Găsește prețul pe mp în funcție de suprafața totală taxabilă
function getTierPricePerSqm(area: number): number {
    let price = PRICING_TIERS[0].price;

    // Iterăm în ordine pentru a găsi cel mai mare prag aplicabil
    for (const tier of PRICING_TIERS) {
        if (area >= tier.area) {
            price = tier.price;
        }
    }
    return price;
}

// --- FUNCȚIA PRINCIPALĂ DE CALCUL (FIXATĂ) ---

export function calculatePrice(input: PriceInput): PriceOutput {
    // Validare
    if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
        return {
            sqm_per_unit: 0,
            total_sqm_calculated: 0,
            total_sqm_taxable: 0,
            pricePerSqmAdjusted: 0,
            pricePerSqmBase: 0,
            totalBasePrice: 0,
            finalPrice: 0, // CRITIC: returnează 0 la input invalid
            isMinAreaApplied: false,
        };
    }

    // 1. Calculul suprafeței
    const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
    const total_sqm_calculated = sqm_per_unit * input.quantity;

    // 2. Aplicarea suprafeței minime
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
    
    // Prețul pe mp ajustat (fără TVA)
    const pricePerSqmAdjusted = pricePerSqmBase * totalMultiplier;

    // 5. Preț total FĂRĂ TVA
    const totalBasePrice = total_sqm_taxable * pricePerSqmAdjusted;

    // 6. Preț total CU TVA (FIXAT)
    const finalPrice = totalBasePrice * (1 + TVA); 

    return {
        sqm_per_unit: roundMoney(sqm_per_unit),
        total_sqm_calculated: roundMoney(total_sqm_calculated),
        total_sqm_taxable: roundMoney(total_sqm_taxable),
        pricePerSqmAdjusted: roundMoney(pricePerSqmAdjusted),
        pricePerSqmBase: roundMoney(pricePerSqmBase), // Prețul de baza (înainte de multiplicatori, dar după tier)
        totalBasePrice: roundMoney(totalBasePrice),
        finalPrice: roundMoney(finalPrice),
        isMinAreaApplied,
    };
}