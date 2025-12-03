// lib/pricing.ts

// --- UTILS ---
export const roundMoney = (num: number) => Math.round(num * 100) / 100;
export const formatMoneyDisplay = (amount: number) => 
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(amount);

/* =========================================================================
   HELPER NOU: UPSELL CALCULATOR (GENERIC)
   Detectează automat următorul prag de reducere pentru produse bazate pe benzi de preț/mp.
   ========================================================================= */
export type UpsellResult = {
  hasUpsell: boolean;
  requiredQty: number;
  discountPercent: number;
  newUnitPrice: number;
  totalSavings: number;
  message: string; // Mesaj gata formatat pentru AI / UI
} | null;

export const calculateUpsellGeneric = (
  currentTotalSqm: number,
  sqmPerUnit: number,
  currentQty: number,
  currentUnitPrice: number,
  bands: { max: number, price: number }[],
  basePriceCalculator: (qty: number) => { finalPrice: number }
): UpsellResult => {
  
  // 1. Identificăm banda curentă
  let currentBandIndex = -1;
  for (let i = 0; i < bands.length; i++) {
      if (currentTotalSqm <= bands[i].max) {
          currentBandIndex = i;
          break;
      }
  }

  // Dacă nu am găsit banda sau suntem deja în ultima (cea mai ieftină), nu există upsell
  if (currentBandIndex === -1 || currentBandIndex >= bands.length - 1) return null;

  // 2. Calculăm ținta pentru următorul prag
  const thresholdSqm = bands[currentBandIndex].max;
  // Adăugăm o mică marjă pentru a trece sigur în următoarea bandă
  const targetSqm = thresholdSqm + 0.001; 
  
  const requiredQty = Math.ceil(targetSqm / sqmPerUnit);

  // Dacă cantitatea necesară este egală cu cea curentă (cazuri rare la dimensiuni mari), sărim
  if (requiredQty <= currentQty) return null;

  // 3. Simulăm prețul pentru noua cantitate
  const futurePriceData = basePriceCalculator(requiredQty);
  const futureUnitPrice = futurePriceData.finalPrice / requiredQty;

  // 4. Calculăm reducerea procentuală
  const discountPercent = Math.round(((currentUnitPrice - futureUnitPrice) / currentUnitPrice) * 100);

  // Ignorăm reducerile nesemnificative (< 2%)
  if (discountPercent < 2) return null;

  const totalSavings = (currentUnitPrice * requiredQty) - futurePriceData.finalPrice;

  return {
      hasUpsell: true,
      requiredQty,
      discountPercent,
      newUnitPrice: parseFloat(futureUnitPrice.toFixed(2)),
      totalSavings: parseFloat(totalSavings.toFixed(2)),
      message: `Sfat: Dacă mărești cantitatea la ${requiredQty} bucăți, prețul unitar scade cu ${discountPercent}%, ajungând la ${formatMoneyDisplay(futureUnitPrice)}/buc. Economie totală estimată: ${formatMoneyDisplay(totalSavings)}.`
  };
};

// ==========================================
// 1. BANNER SIMPLU (FRONTLIT)
// ==========================================
export const BANNER_CONSTANTS = {
  PRICES: {
    bands: [
      { max: 1, price: 100 },
      { max: 5, price: 75 },
      { max: 20, price: 60 },
      { max: 50, price: 45 },
      { max: Infinity, price: 35 },
    ],
    multipliers: {
      frontlit_510: 1.10,
      hem_grommets: 1.10,
      wind_holes: 1.10,
    }
  },
  PRO_DESIGN_FEE: 50,
};

export type PriceInputBanner = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: "frontlit_440" | "frontlit_510";
  want_wind_holes: boolean;
  want_hem_and_grommets: boolean;
  designOption: "upload" | "pro" | "text_only";
};

export const calculateBannerPrice = (input: PriceInputBanner) => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
      return { finalPrice: 0, total_sqm: 0, pricePerSqm: 0 };
  }
  
  const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
  const total_sqm = roundMoney(sqm_per_unit * input.quantity);

  // Base Price Band
  let basePrice = 35;
  for (const band of BANNER_CONSTANTS.PRICES.bands) {
      if (total_sqm <= band.max) {
          basePrice = band.price;
          break;
      }
  }

  // Multipliers
  let multiplier = 1;
  if (input.material === "frontlit_510") multiplier *= BANNER_CONSTANTS.PRICES.multipliers.frontlit_510;
  if (input.want_hem_and_grommets) multiplier *= BANNER_CONSTANTS.PRICES.multipliers.hem_grommets;
  if (input.want_wind_holes) multiplier *= BANNER_CONSTANTS.PRICES.multipliers.wind_holes;

  const pricePerSqm = roundMoney(basePrice * multiplier);
  let finalPrice = roundMoney(total_sqm * pricePerSqm);

  // Design Fee
  if (input.designOption === "pro") {
      finalPrice += BANNER_CONSTANTS.PRO_DESIGN_FEE;
  }

  return { finalPrice: roundMoney(finalPrice), total_sqm: roundMoney(total_sqm), pricePerSqm };
};

// --- NEW FUNCTION: UPSELL FOR BANNER ---
export const getBannerUpsell = (input: PriceInputBanner): UpsellResult => {
  if (input.width_cm <= 0 || input.height_cm <= 0) return null;
  
  const priceData = calculateBannerPrice(input);
  const sqmPerUnit = (input.width_cm / 100) * (input.height_cm / 100);
  const currentTotalSqm = sqmPerUnit * input.quantity;
  const currentUnitPrice = priceData.finalPrice / input.quantity;

  return calculateUpsellGeneric(
      currentTotalSqm,
      sqmPerUnit,
      input.quantity,
      currentUnitPrice,
      BANNER_CONSTANTS.PRICES.bands,
      (newQty) => calculateBannerPrice({ ...input, quantity: newQty })
  );
};

// ==========================================
// 2. BANNER VERSO (BLOCKOUT)
// ==========================================
export const BANNER_VERSO_CONSTANTS = {
  PRICES: {
    bands: [
      // Prețurile sunt 1.5x față de cele de la BANNER_CONSTANTS
      { max: 1, price: roundMoney(100 * 1.5) },    // 150.0
      { max: 5, price: roundMoney(75 * 1.5) },     // 112.5
      { max: 20, price: roundMoney(60 * 1.5) },    // 90.0
      { max: 50, price: roundMoney(45 * 1.5) },    // 67.5
      { max: Infinity, price: roundMoney(35 * 1.5) }, // 52.5
    ],
    multipliers: {
      wind_holes: 1.10,
      hem_grommets: 1.10, // Implicit
    }
  },
  FEES: {
    PRO_SAME: 50, // Taxă Design Pro - Grafică Identică
    PRO_DIFF: 100, // Taxă Design Pro - Grafică Diferită
    DIFF_GRAPHICS: 100, // Taxă procesare grafică proprie diferită
  }
};

export type PriceInputBannerVerso = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  want_wind_holes: boolean;
  same_graphic: boolean;
  designOption: "upload" | "pro" | "text_only";
};

export const calculateBannerVersoPrice = (input: PriceInputBannerVerso) => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
      return { finalPrice: 0, total_sqm: 0, pricePerSqm: 0, proFee: 0, diffFee: 0 };
  }

  const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
  const total_sqm = roundMoney(sqm_per_unit * input.quantity);

  let basePrice = BANNER_VERSO_CONSTANTS.PRICES.bands[BANNER_VERSO_CONSTANTS.PRICES.bands.length - 1].price;
  for (const band of BANNER_VERSO_CONSTANTS.PRICES.bands) {
      if (total_sqm <= band.max) {
          basePrice = band.price;
          break;
      }
  }

  let multiplier = 1.0;
  multiplier *= BANNER_VERSO_CONSTANTS.PRICES.multipliers.hem_grommets;
  if (input.want_wind_holes) multiplier *= BANNER_VERSO_CONSTANTS.PRICES.multipliers.wind_holes;

  const pricePerSqm = roundMoney(basePrice * multiplier);
  let finalPrice = roundMoney(total_sqm * pricePerSqm);

  let proFee = 0;
  let diffFee = 0;

  if (input.designOption === "pro") {
    proFee = input.same_graphic ? BANNER_VERSO_CONSTANTS.FEES.PRO_SAME : BANNER_VERSO_CONSTANTS.FEES.PRO_DIFF;
    finalPrice += proFee;
  } else if (!input.same_graphic) {
    diffFee = BANNER_VERSO_CONSTANTS.FEES.DIFF_GRAPHICS;
    finalPrice += diffFee;
  }

  return { finalPrice: roundMoney(finalPrice), total_sqm: roundMoney(total_sqm), pricePerSqm, proFee, diffFee };
};

// --- NEW FUNCTION: UPSELL FOR BANNER VERSO ---
export const getBannerVersoUpsell = (input: PriceInputBannerVerso): UpsellResult => {
  if (input.width_cm <= 0 || input.height_cm <= 0) return null;

  const priceData = calculateBannerVersoPrice(input);
  const sqmPerUnit = (input.width_cm / 100) * (input.height_cm / 100);
  const currentTotalSqm = sqmPerUnit * input.quantity;
  const currentUnitPrice = priceData.finalPrice / input.quantity;

  return calculateUpsellGeneric(
      currentTotalSqm,
      sqmPerUnit,
      input.quantity,
      currentUnitPrice,
      BANNER_VERSO_CONSTANTS.PRICES.bands,
      (newQty) => calculateBannerVersoPrice({ ...input, quantity: newQty })
  );
};


// ==========================================
// 3. POLIPROPILENA (AKYPLAC)
// ==========================================
export const POLIPROPILENA_CONSTANTS = {
  LIMITS: { MAX_WIDTH: 400, MAX_HEIGHT: 200 },
  PRICES: { 3: 160, 5: 200 } as Record<number, number>,
  GRAMAJ: { 3: 450, 5: 1050 } as Record<number, number>,
  AVAILABLE_THICKNESS: [3, 5],
  PRO_DESIGN_FEE: 50,
};

export type PriceInputPolipropilena = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  thickness_mm: number;
  designOption: "upload" | "pro" | "text_only";
};

export const calculatePolipropilenaPrice = (input: PriceInputPolipropilena) => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
      return { finalPrice: 0, total_sqm: 0, pricePerUnit: 0 };
  }

  const sqmPerUnit = (input.width_cm / 100) * (input.height_cm / 100);
  const totalSqm = roundMoney(sqmPerUnit * input.quantity);
  
  const pricePerSqm = POLIPROPILENA_CONSTANTS.PRICES[input.thickness_mm] ?? 0;
  let finalPrice = roundMoney(totalSqm * pricePerSqm);

  if (input.designOption === "pro") {
      finalPrice += POLIPROPILENA_CONSTANTS.PRO_DESIGN_FEE;
  }

  const pricePerUnit = roundMoney(finalPrice / input.quantity);
  return { finalPrice: roundMoney(finalPrice), total_sqm: totalSqm, pricePerUnit };
};

// ==========================================
// 4. PVC FOREX
// ==========================================
export const PVC_FOREX_CONSTANTS = {
  LIMITS: { MAX_WIDTH: 200, MAX_HEIGHT: 300 },
  PRICES: {
    1: 120, 2: 150, 3: 180, 4: 210, 5: 240, 6: 270, 8: 300, 10: 400,
  } as Record<number, number>,
  AVAILABLE_THICKNESS: [1, 2, 3, 4, 5, 6, 8, 10],
  PRO_DESIGN_FEE: 50,
};

export type PriceInputPVCForex = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  thickness_mm: number;
  designOption: "upload" | "pro" | "text_only";
};

export const calculatePVCForexPrice = (input: PriceInputPVCForex) => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
      return { finalPrice: 0, total_sqm: 0, pricePerUnit: 0 };
  }

  const sqmPerUnit = (input.width_cm / 100) * (input.height_cm / 100);
  const totalSqm = roundMoney(sqmPerUnit * input.quantity);

  const pricePerSqm = PVC_FOREX_CONSTANTS.PRICES[input.thickness_mm] ?? 0;
  let finalPrice = roundMoney(totalSqm * pricePerSqm);

  if (input.designOption === "pro") {
      finalPrice += PVC_FOREX_CONSTANTS.PRO_DESIGN_FEE;
  }

  const pricePerUnit = roundMoney(finalPrice / input.quantity);
  return { finalPrice: roundMoney(finalPrice), total_sqm: totalSqm, pricePerUnit };
};

// ==========================================
// 5. ALUCOBOND
// ==========================================
export const ALUCOBOND_CONSTANTS = {
  PRICES: { 3: 350, 4: 450 } as Record<number, number>,
  LIMITS: { MAX_WIDTH: 300, MAX_HEIGHT: 150 },
  AVAILABLE_THICKNESS: [3, 4],
  COLORS: ["Alb", "Argintiu (Silver)", "Antracit (Gri Închis)", "Negru", "Rosu", "Albastru", "Verde", "Galben", "Brushed (Aluminiu Perișat)"],
  PRO_DESIGN_FEE: 60,
};

export type PriceInputAlucobond = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  thickness_mm: number;
  color: string;
  designOption: "upload" | "pro" | "text_only";
};

export const calculateAlucobondPrice = (input: PriceInputAlucobond) => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
      return { finalPrice: 0, total_sqm: 0, pricePerUnit: 0 };
  }

  const sqmPerUnit = (input.width_cm / 100) * (input.height_cm / 100);
  const totalSqm = roundMoney(sqmPerUnit * input.quantity);

  const pricePerSqm = ALUCOBOND_CONSTANTS.PRICES[input.thickness_mm] ?? 0;
  let finalPrice = roundMoney(totalSqm * pricePerSqm);

  if (input.designOption === "pro") {
      finalPrice += ALUCOBOND_CONSTANTS.PRO_DESIGN_FEE;
  }

  const pricePerUnit = roundMoney(finalPrice / input.quantity);
  return { finalPrice: roundMoney(finalPrice), total_sqm: totalSqm, pricePerUnit };
};

// ==========================================
// 6. PLEXIGLASS
// ==========================================
export const PLEXIGLASS_CONSTANTS = {
  LIMITS: { MAX_WIDTH: 400, MAX_HEIGHT: 200 },
  THICKNESS: {
    ALB: [2, 3, 4, 5],
    TRANSPARENT: [2, 3, 4, 5, 6, 8, 10],
  },
  PRICES: {
    ALB: { 2: 200, 3: 250, 4: 300, 5: 350 } as Record<number, number>,
    TRANSPARENT_SINGLE: { 2: 280, 3: 350, 4: 410, 5: 470, 6: 700, 8: 1100, 10: 1450 } as Record<number, number>,
    TRANSPARENT_DOUBLE: { 2: 380, 3: 450, 4: 510, 5: 570, 6: 800, 8: 1200, 10: 1650 } as Record<number, number>,
  },
  PRO_DESIGN_FEE: 60,
};

export type PriceInputPlexiglass = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: "alb" | "transparent";
  thickness_mm: number;
  print_double: boolean;
  designOption: "upload" | "pro" | "text_only";
};

export const calculatePlexiglassPrice = (input: PriceInputPlexiglass) => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
      return { finalPrice: 0, total_sqm: 0, pricePerUnit: 0 };
  }

  const sqmPerUnit = (input.width_cm / 100) * (input.height_cm / 100);
  const totalSqm = roundMoney(sqmPerUnit * input.quantity);
  
  let pricePerSqm = 0;
  if (input.material === "alb") {
      pricePerSqm = PLEXIGLASS_CONSTANTS.PRICES.ALB[input.thickness_mm] ?? 0;
  } else {
      if (input.print_double) {
          pricePerSqm = PLEXIGLASS_CONSTANTS.PRICES.TRANSPARENT_DOUBLE[input.thickness_mm] ?? 0;
      } else {
          pricePerSqm = PLEXIGLASS_CONSTANTS.PRICES.TRANSPARENT_SINGLE[input.thickness_mm] ?? 0;
      }
  }

  let finalPrice = roundMoney(totalSqm * pricePerSqm);

  if (input.designOption === "pro") {
      finalPrice += PLEXIGLASS_CONSTANTS.PRO_DESIGN_FEE;
  }

  const pricePerUnit = roundMoney(finalPrice / input.quantity);
  return { finalPrice: roundMoney(finalPrice), total_sqm: totalSqm, pricePerUnit };
};

// ==========================================
// 7. CARTON
// ==========================================
export const CARTON_CONSTANTS = {
  LIMITS: { MAX_WIDTH: 400, MAX_HEIGHT: 200 },
  ONDULAT: {
    SINGLE: { "E": 80, "3B": 85, "3C": 90, "5BC": 100 } as Record<string, number>,
    DOUBLE: { "E": 120, "3B": 130, "3C": 135, "5BC": 150 } as Record<string, number>,
  },
  RECICLAT: {
    BOARD: { "board10": 200, "board16": 250 } as Record<string, number>,
    EDGE: { "board10": 15, "board16": 17 } as Record<string, number>,
  },
  PRO_DESIGN_FEE: 50,
};

export type PriceInputCarton = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: "ondulat" | "reciclat";
  ondula?: string;
  reciclatBoard?: string;
  printDouble?: boolean;
  edgePerimeter_m?: number;
  edgeType?: string | null;
  designOption: "upload" | "pro" | "text_only";
};

export const calculateCartonPrice = (input: PriceInputCarton) => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
      return { finalPrice: 0, total_sqm: 0, pricePerUnit: 0, accessoryCost: 0 };
  }

  const sqmPerUnit = (input.width_cm / 100) * (input.height_cm / 100);
  const totalSqm = roundMoney(sqmPerUnit * input.quantity);
  
  let pricePerSqm = 0;
  let accessoryCost = 0;

  if (input.material === "ondulat" && input.ondula) {
      const prices = input.printDouble ? CARTON_CONSTANTS.ONDULAT.DOUBLE : CARTON_CONSTANTS.ONDULAT.SINGLE;
      pricePerSqm = prices[input.ondula] ?? 0;
  } else if (input.material === "reciclat" && input.reciclatBoard) {
      pricePerSqm = CARTON_CONSTANTS.RECICLAT.BOARD[input.reciclatBoard] ?? 0;
      if (input.edgePerimeter_m && input.edgeType && CARTON_CONSTANTS.RECICLAT.EDGE[input.edgeType]) {
          accessoryCost = roundMoney(input.edgePerimeter_m * CARTON_CONSTANTS.RECICLAT.EDGE[input.edgeType]);
      }
  }

  let finalPrice = roundMoney(totalSqm * pricePerSqm + accessoryCost);
  if (input.designOption === "pro") {
      finalPrice += CARTON_CONSTANTS.PRO_DESIGN_FEE;
  }

  const pricePerUnit = roundMoney(finalPrice / input.quantity);
  return { finalPrice: roundMoney(finalPrice), total_sqm: totalSqm, pricePerUnit, accessoryCost };
};

// ==========================================
// 8. AUTOCOLANTE (GENERIC - SQM BASED)
// ==========================================
export const AUTOCOLANTE_CONSTANTS = {
  MATERIALS: [
    { key: "oracal_641", label: "Oracal 641 — Folie economică", bands: [
      { max_sqm: 1, price_per_sqm: 120 },
      { max_sqm: 5, price_per_sqm: 90 },
      { max_sqm: 20, price_per_sqm: 80 },
      { max_sqm: Infinity, price_per_sqm: 70 },
    ]},
    { key: "oracal_351", label: "Oracal 351 — Folie aurie / argintie", bands: [
      { max_sqm: 1, price_per_sqm: 150 },
      { max_sqm: 5, price_per_sqm: 120 },
      { max_sqm: 20, price_per_sqm: 110 },
      { max_sqm: Infinity, price_per_sqm: 100 },
    ]},
    { key: "oracal_451", label: "Oracal 451 — Folie pentru banner", bands: [
      { max_sqm: 1, price_per_sqm: 130 },
      { max_sqm: 5, price_per_sqm: 100 },
      { max_sqm: 20, price_per_sqm: 90 },
      { max_sqm: Infinity, price_per_sqm: 80 },
    ]},
    { key: "oracal_621", label: "Oracal 621 — Folie cu adeziv removabil", bands: [
      { max_sqm: 1, price_per_sqm: 120 },
      { max_sqm: 5, price_per_sqm: 90 },
      { max_sqm: 20, price_per_sqm: 80 },
      { max_sqm: Infinity, price_per_sqm: 70 },
    ]},
    { key: "oracal_638m", label: "Oracal 638M — Folie decorat pereți", bands: [
      { max_sqm: 1, price_per_sqm: 160 },
      { max_sqm: 5, price_per_sqm: 130 },
      { max_sqm: 20, price_per_sqm: 120 },
      { max_sqm: Infinity, price_per_sqm: 110 },
    ]},
    { key: "oracal_651", label: "Oracal 651 — Folie pentru casete luminoase", bands: [
      { max_sqm: 1, price_per_sqm: 140 },
      { max_sqm: 5, price_per_sqm: 110 },
      { max_sqm: 20, price_per_sqm: 100 },
      { max_sqm: Infinity, price_per_sqm: 90 },
    ]},
    { key: "oracal_970", label: "Oracal 970 — Folie car wrapping", bands: [
      { max_sqm: 1, price_per_sqm: 250 },
      { max_sqm: 5, price_per_sqm: 220 },
      { max_sqm: 20, price_per_sqm: 200 },
      { max_sqm: Infinity, price_per_sqm: 180 },
    ]},
  ],
  PRO_DESIGN_FEE: 30,
};

export type AutocolantesMaterialKey = "oracal_641" | "oracal_351" | "oracal_451" | "oracal_621" | "oracal_638m" | "oracal_651" | "oracal_970";

export type PriceInputAutocolante = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: AutocolantesMaterialKey;
  print_type: "print_cut" | "print_only"; // print+cut sau doar print (-20%)
  laminated: boolean; // laminare (+10%)
  designOption: "upload" | "text_only" | "pro";
};

export const calculateAutocolantePrice = (input: PriceInputAutocolante) => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
      return { finalPrice: 0, total_sqm: 0, pricePerSqm: 0, sqmPerUnit: 0 };
  }

  const sqmPerUnit = (input.width_cm / 100) * (input.height_cm / 100);
  const totalSqm = roundMoney(sqmPerUnit * input.quantity);

  // Găsim materialul selectat
  const materialDef = AUTOCOLANTE_CONSTANTS.MATERIALS.find(m => m.key === input.material);
  if (!materialDef) return { finalPrice: 0, total_sqm: totalSqm, pricePerSqm: 0, sqmPerUnit };

  // Găsim prețul per MP bazat pe totalSqm
  let pricePerSqm = materialDef.bands[materialDef.bands.length - 1].price_per_sqm;
  for (const band of materialDef.bands) {
      if (totalSqm <= band.max_sqm) {
          pricePerSqm = band.price_per_sqm;
          break;
      }
  }

  // Aplicăm reducere de 20% dacă e doar print (fără cut)
  if (input.print_type === "print_only") {
      pricePerSqm = roundMoney(pricePerSqm * 0.8);
  }

  // Aplicăm +10% dacă are laminare
  if (input.laminated) {
      pricePerSqm = roundMoney(pricePerSqm * 1.1);
  }

  let finalPrice = roundMoney(totalSqm * pricePerSqm);

  if (input.designOption === "pro") {
      finalPrice += AUTOCOLANTE_CONSTANTS.PRO_DESIGN_FEE;
  }

  return { finalPrice: roundMoney(finalPrice), total_sqm: totalSqm, pricePerSqm, sqmPerUnit };
};

// ==========================================
// 9. CANVAS
// ==========================================
export const CANVAS_CONSTANTS = {
  PRICES: {
    bands: [
      { max_sqm: 1, price_per_sqm: 180 },
      { max_sqm: 3, price_per_sqm: 160 },
      { max_sqm: 5, price_per_sqm: 140 },
      { max_sqm: Infinity, price_per_sqm: 120 },
    ],
    chassis_price_per_ml: 20,
  },
  FRAMED_PRICES_RECTANGLE: {
    "20x30": [61.86, 55.66, 50.11, 45.10, 40.59, 37.10],
    "30x40": [83.36, 75.02, 67.52, 60.77, 57.39, 54.18],
    "30x50": [102.19, 91.97, 82.77, 74.48, 74.48, 66.43],
    "40x50": [127.74, 114.96, 103.46, 93.10, 87.94, 83.04],
    "40x60": [147.90, 133.10, 119.79, 107.81, 101.82, 97.02],
    "50x70": [169.44, 152.48, 137.23, 123.50, 116.64, 110.14],
    "50x80": [189.58, 170.62, 153.55, 138.19, 130.51, 123.23],
    "60x80": [243.36, 219.02, 197.12, 177.41, 167.55, 158.19],
    "60x90": [248.75, 223.87, 201.49, 181.33, 171.26, 161.70],
    "70x80": [263.54, 237.18, 213.47, 192.13, 181.46, 171.30],
    "70x100": [321.36, 305.28, 289.20, 260.29, 234.27, 208.88],
    "80x100": [330.77, 297.70, 267.94, 241.15, 229.10, 217.63],
    "80x120": [357.65, 321.89, 289.70, 260.74, 247.71, 235.33],
    "90x120": [389.92, 350.93, 315.84, 284.26, 270.03, 256.54],
    "100x120": [540.51, 487.81, 463.42, 440.26, 418.24, 397.33],
  },
  FRAMED_PRICES_SQUARE: {
    "20x20": [52.45, 47.20, 42.48, 38.22, 34.42, 31.46],
    "30x30": [79.33, 71.41, 64.27, 57.84, 54.64, 51.57],
    "40x40": [106.22, 95.60, 86.03, 77.42, 73.12, 69.06],
    "50x50": [133.12, 126.46, 119.81, 107.82, 97.04, 86.53],
    "60x60": [186.90, 168.21, 151.38, 136.24, 128.67, 121.33],
    "70x70": [248.75, 223.89, 201.50, 181.34, 171.28, 161.70],
    "80x80": [275.63, 248.06, 223.26, 200.94, 189.76, 179.17],
    "90x90": [295.81, 266.22, 239.60, 215.63, 203.65, 192.27],
    "100x100": [342.86, 308.58, 277.71, 249.94, 236.06, 240.00],
  },
  FRAMED_QUANTITY_RANGES: [
    { min: 1, max: 1, index: 0 },
    { min: 2, max: 5, index: 1 },
    { min: 6, max: 15, index: 2 },
    { min: 16, max: 25, index: 3 },
    { min: 26, max: 40, index: 4 },
    { min: 41, max: 50, index: 5 },
  ],
  DISCOUNT_PERCENT: 20, // Reducere 20%
  PRO_DESIGN_FEE: 40,
};

export type PriceInputCanvas = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  edge_type: "white" | "mirror" | "wrap";
  designOption: "upload" | "pro";
  frameType?: "none" | "framed"; // nou: tip ramă
  framedSize?: string; // nou: dimensiune pentru opțiunea cu ramă (ex: "20x30")
  framedShape?: "rectangle" | "square"; // nou: formă pentru opțiunea cu ramă
};

export const calculateCanvasPrice = (input: PriceInputCanvas) => {
  if (input.quantity <= 0) {
      return { finalPrice: 0, total_sqm: 0, pricePerUnit: 0 };
  }

  // Dacă este cu ramă, folosim prețurile prestabilite
  if (input.frameType === "framed" && input.framedSize) {
    const shape = input.framedShape || "rectangle";
    const priceTable = shape === "square" 
      ? CANVAS_CONSTANTS.FRAMED_PRICES_SQUARE 
      : CANVAS_CONSTANTS.FRAMED_PRICES_RECTANGLE;
    
    const priceArray = priceTable[input.framedSize as keyof typeof priceTable];
    if (!priceArray) {
      return { finalPrice: 0, total_sqm: 0, pricePerUnit: 0 };
    }

    // Găsim indexul pentru prețul în funcție de cantitate
    let priceIndex = 0;
    for (const range of CANVAS_CONSTANTS.FRAMED_QUANTITY_RANGES) {
      if (input.quantity >= range.min && input.quantity <= range.max) {
        priceIndex = range.index;
        break;
      }
    }

    const pricePerUnit = priceArray[priceIndex] || priceArray[priceArray.length - 1];
    let finalPrice = roundMoney(pricePerUnit * input.quantity);

    if (input.designOption === "pro") {
      finalPrice += CANVAS_CONSTANTS.PRO_DESIGN_FEE;
    }

    return { finalPrice: roundMoney(finalPrice), total_sqm: 0, pricePerUnit: roundMoney(pricePerUnit) };
  }

  // Logic original pentru fără ramă (dimensiuni personalizate)
  if (input.width_cm <= 0 || input.height_cm <= 0) {
      return { finalPrice: 0, total_sqm: 0, pricePerUnit: 0 };
  }

  const sqmPerUnit = (input.width_cm / 100) * (input.height_cm / 100);
  const totalSqm = roundMoney(sqmPerUnit * input.quantity);
  const perimeterPerUnitMl = 2 * (input.width_cm + input.height_cm) / 100;

  let pricePerSqm = 120;
  for (const band of CANVAS_CONSTANTS.PRICES.bands) {
      if (totalSqm <= band.max_sqm) {
          pricePerSqm = band.price_per_sqm;
          break;
      }
  }
  const printCost = totalSqm * pricePerSqm;
  const totalPerimeter = perimeterPerUnitMl * input.quantity;
  const chassisCost = totalPerimeter * CANVAS_CONSTANTS.PRICES.chassis_price_per_ml;

  let finalPrice = roundMoney(printCost + chassisCost);
  
  // Aplicare reducere 20%
  finalPrice = roundMoney(finalPrice * 0.8);
  
  if (input.designOption === "pro") {
      finalPrice += CANVAS_CONSTANTS.PRO_DESIGN_FEE;
  }

  const pricePerUnit = roundMoney(finalPrice / input.quantity);
  return { finalPrice: roundMoney(finalPrice), total_sqm: totalSqm, pricePerUnit };
};

// ==========================================
// 10. AFISE
// ==========================================
export const AFISE_CONSTANTS = {
  SIZES: [
    { key: "A3", label: "A3", dims: "297×420 mm" }, { key: "A2", label: "A2", dims: "420×594 mm" }, { key: "A1", label: "A1", dims: "594×841 mm" },
    { key: "A0", label: "A0", dims: "841×1189 mm" }, { key: "S5", label: "S5", dims: "500×700 mm" }, { key: "S7", label: "S7", dims: "700×1000 mm" },
  ],
  MATERIALS: [
    { key: "paper_150_lucioasa", label: "Hârtie 150g lucioasă", description: "Standard" }, 
    { key: "paper_150_mata", label: "Hârtie 150g mată", description: "Elegant" },
    { key: "paper_300_lucioasa", label: "Carton 300g lucios", description: "Rigid" }, 
    { key: "paper_300_mata", label: "Carton 300g mat", description: "Premium" },
    { key: "blueback_115", label: "Blueback 115g", description: "Outdoor" }, 
    { key: "whiteback_150_material", label: "Whiteback 150g", description: "Indoor" },
    { key: "satin_170", label: "Satin 170g", description: "Foto" }, 
    { key: "foto_220", label: "Hârtie Foto 220g", description: "Foto Premium" },
  ],
  PRO_DESIGN_FEE: 100,
  PRICE_TABLE: {
    paper_150_lucioasa: { 
      A3: [{ min: 1, price: 3.0 }], 
      A2: [{ min: 1, price: 9.98 }], 
      A1: [{ min: 1, price: 39.96 }], 
      A0: [{ min: 1, price: 80.0 }], 
      S5: [{ min: 1, price: 28.0 }], 
      S7: [{ min: 1, price: 56.0 }] 
    },
    blueback_115: { 
      A2: [
        { min: 1, price: 17.46 },
        { min: 51, price: 14.96 },
        { min: 100, price: 12.48 },
        { min: 200, price: 9.98 },
        { min: 300, price: 7.48 },
        { min: 400, price: 6.24 },
        { min: 500, price: 5.74 },
        { min: 1000, price: 4.98 },
      ],
      A1: [
        { min: 1, price: 34.96 },
        { min: 51, price: 29.98 },
        { min: 100, price: 24.98 },
        { min: 200, price: 19.98 },
        { min: 300, price: 14.98 },
        { min: 400, price: 12.48 },
        { min: 500, price: 11.48 },
        { min: 1000, price: 10.00 },
      ],
      A0: [
        { min: 1, price: 70.00 },
        { min: 51, price: 60.00 },
        { min: 100, price: 50.00 },
        { min: 200, price: 40.00 },
        { min: 300, price: 30.00 },
        { min: 400, price: 25.00 },
        { min: 500, price: 23.00 },
        { min: 1000, price: 20.00 },
      ],
      S5: [
        { min: 1, price: 24.50 },
        { min: 51, price: 21.00 },
        { min: 100, price: 17.50 },
        { min: 200, price: 14.00 },
        { min: 300, price: 10.50 },
        { min: 400, price: 8.76 },
        { min: 500, price: 8.06 },
        { min: 1000, price: 7.00 },
      ],
      S7: [
        { min: 1, price: 49.00 },
        { min: 51, price: 42.00 },
        { min: 100, price: 35.00 },
        { min: 200, price: 28.00 },
        { min: 300, price: 21.00 },
        { min: 400, price: 17.50 },
        { min: 500, price: 16.10 },
        { min: 1000, price: 14.00 },
      ]
    },
    whiteback_150_material: { 
      A3: [
        { min: 1, price: 3.00 },
        { min: 51, price: 2.50 },
        { min: 100, price: 2.30 },
        { min: 200, price: 2.20 },
        { min: 300, price: 1.98 },
        { min: 400, price: 1.88 },
        { min: 500, price: 1.60 },
        { min: 1000, price: 1.20 },
      ],
      A2: [
        { min: 1, price: 19.96 },
        { min: 51, price: 17.46 },
        { min: 100, price: 14.96 },
        { min: 200, price: 12.48 },
        { min: 300, price: 9.98 },
        { min: 400, price: 8.74 },
        { min: 500, price: 7.48 },
        { min: 1000, price: 6.24 },
      ],
      A1: [
        { min: 1, price: 39.96 },
        { min: 51, price: 34.96 },
        { min: 100, price: 29.98 },
        { min: 200, price: 24.98 },
        { min: 300, price: 19.98 },
        { min: 400, price: 17.48 },
        { min: 500, price: 14.98 },
        { min: 1000, price: 12.48 },
      ],
      A0: [
        { min: 1, price: 80.00 },
        { min: 51, price: 70.00 },
        { min: 100, price: 60.00 },
        { min: 200, price: 50.00 },
        { min: 300, price: 40.00 },
        { min: 400, price: 35.00 },
        { min: 500, price: 30.00 },
        { min: 1000, price: 25.00 },
      ],
      S5: [
        { min: 1, price: 28.00 },
        { min: 51, price: 24.50 },
        { min: 100, price: 21.00 },
        { min: 200, price: 17.50 },
        { min: 300, price: 14.00 },
        { min: 400, price: 12.26 },
        { min: 500, price: 10.50 },
        { min: 1000, price: 8.76 },
      ],
      S7: [
        { min: 1, price: 56.00 },
        { min: 51, price: 49.00 },
        { min: 100, price: 42.00 },
        { min: 200, price: 35.00 },
        { min: 300, price: 28.00 },
        { min: 400, price: 24.50 },
        { min: 500, price: 21.00 },
        { min: 1000, price: 17.50 },
      ]
    },
    satin_170: {
      A2: [
        { min: 1, price: 22.46 },
        { min: 51, price: 19.96 },
        { min: 100, price: 17.46 },
        { min: 200, price: 14.96 },
        { min: 300, price: 12.48 },
        { min: 400, price: 9.98 },
        { min: 500, price: 8.74 },
        { min: 1000, price: 8.24 },
      ],
      A1: [
        { min: 1, price: 44.96 },
        { min: 51, price: 39.96 },
        { min: 100, price: 34.96 },
        { min: 200, price: 29.98 },
        { min: 300, price: 24.98 },
        { min: 400, price: 19.98 },
        { min: 500, price: 17.48 },
        { min: 1000, price: 16.48 },
      ],
      A0: [
        { min: 1, price: 90.00 },
        { min: 51, price: 80.00 },
        { min: 100, price: 70.00 },
        { min: 200, price: 60.00 },
        { min: 300, price: 50.00 },
        { min: 400, price: 40.00 },
        { min: 500, price: 35.00 },
        { min: 1000, price: 33.00 },
      ],
      S5: [
        { min: 1, price: 31.50 },
        { min: 51, price: 28.00 },
        { min: 100, price: 24.50 },
        { min: 200, price: 21.00 },
        { min: 300, price: 17.50 },
        { min: 400, price: 14.00 },
        { min: 500, price: 12.26 },
        { min: 1000, price: 11.56 },
      ],
      S7: [
        { min: 1, price: 63.00 },
        { min: 51, price: 56.00 },
        { min: 100, price: 49.00 },
        { min: 200, price: 42.00 },
        { min: 300, price: 35.00 },
        { min: 400, price: 28.00 },
        { min: 500, price: 24.50 },
        { min: 1000, price: 23.10 },
      ]
    },
    foto_220: {
      A2: [
        { min: 1, price: 29.94 },
        { min: 51, price: 24.94 },
        { min: 100, price: 22.46 },
        { min: 200, price: 19.96 },
        { min: 300, price: 17.46 },
        { min: 400, price: 14.96 },
        { min: 500, price: 12.48 },
        { min: 1000, price: 9.98 },
      ],
      A1: [
        { min: 1, price: 59.94 },
        { min: 51, price: 49.96 },
        { min: 100, price: 44.96 },
        { min: 200, price: 39.96 },
        { min: 300, price: 34.96 },
        { min: 400, price: 29.98 },
        { min: 500, price: 24.98 },
        { min: 1000, price: 19.98 },
      ],
      A0: [
        { min: 1, price: 120.00 },
        { min: 51, price: 100.00 },
        { min: 100, price: 90.00 },
        { min: 200, price: 80.00 },
        { min: 300, price: 70.00 },
        { min: 400, price: 60.00 },
        { min: 500, price: 50.00 },
        { min: 1000, price: 40.00 },
      ],
      S5: [
        { min: 1, price: 42.00 },
        { min: 51, price: 35.00 },
        { min: 100, price: 31.50 },
        { min: 200, price: 28.00 },
        { min: 300, price: 24.50 },
        { min: 400, price: 21.00 },
        { min: 500, price: 17.50 },
        { min: 1000, price: 14.00 },
      ],
      S7: [
        { min: 1, price: 84.00 },
        { min: 51, price: 70.00 },
        { min: 100, price: 63.00 },
        { min: 200, price: 56.00 },
        { min: 300, price: 49.00 },
        { min: 400, price: 42.00 },
        { min: 500, price: 35.00 },
        { min: 1000, price: 28.00 },
      ]
    },
  } as Record<string, Record<string, Array<{ min: number; price: number }>>>
};

export type PriceInputAfise = { size: string; material: string; quantity: number; designOption: "upload" | "pro" };

export const calculatePosterPrice = (input: PriceInputAfise) => {
  let matKey = input.material;
  let multiplier = 1;
  if (matKey.startsWith("paper_300")) {
    matKey = matKey.includes("lucioasa") ? "paper_150_lucioasa" : "paper_150_mata";
    multiplier = 2;
  }
  
  let basePrice = 10;
  if (AFISE_CONSTANTS.PRICE_TABLE[matKey] && AFISE_CONSTANTS.PRICE_TABLE[matKey][input.size]) {
       const tiers = AFISE_CONSTANTS.PRICE_TABLE[matKey][input.size];
       const sorted = tiers.slice().sort((a: { min: number; price: number }, b: { min: number; price: number }) => b.min - a.min);
       basePrice = sorted[sorted.length - 1].price;
       for (const t of sorted) { if (input.quantity >= t.min) { basePrice = t.price; break; } }
  }

  const unitPrice = roundMoney(basePrice * multiplier);
  const proFee = input.designOption === "pro" ? AFISE_CONSTANTS.PRO_DESIGN_FEE : 0;
  const finalPrice = roundMoney(unitPrice * input.quantity + proFee);
  return { finalPrice, unitPrice, proFee };
};

// ==========================================
// 11. FLYERE
// ==========================================
export const FLYER_CONSTANTS = {
  SIZES: [
    { 
      key: "A6", 
      label: "A6", 
      dims: "105 × 148 mm", 
      oneSided: [
        { min: 1, price: 0.375 },    // 0.50 - 25% = 0.375
        { min: 101, price: 0.345 },  // 0.46 - 25% = 0.345
        { min: 501, price: 0.225 },  // 0.30 - 25% = 0.225
        { min: 2000, price: 0.21 },  // 0.28 - 25% = 0.21
        { min: 3000, price: 0.195 }, // 0.26 - 25% = 0.195
        { min: 4000, price: 0.18 },  // 0.24 - 25% = 0.18
        { min: 5000, price: 0.165 }, // 0.22 - 25% = 0.165
      ],
      twoSided: [
        { min: 1, price: 0.72 },     // 0.96 - 25% = 0.72
        { min: 101, price: 0.66 },   // 0.88 - 25% = 0.66
        { min: 501, price: 0.45 },   // 0.60 - 25% = 0.45
        { min: 2000, price: 0.345 }, // 0.46 - 25% = 0.345
        { min: 3000, price: 0.30 },  // 0.40 - 25% = 0.30
        { min: 4000, price: 0.27 },  // 0.36 - 25% = 0.27
        { min: 5000, price: 0.21 },  // 0.28 - 25% = 0.21
      ]
    },
    { 
      key: "A5", 
      label: "A5", 
      dims: "148 × 210 mm", 
      oneSided: [
        { min: 1, price: 0.75 },     // 1.00 - 25% = 0.75
        { min: 101, price: 0.69 },   // 0.92 - 25% = 0.69
        { min: 501, price: 0.45 },   // 0.60 - 25% = 0.45
        { min: 2000, price: 0.39 },  // 0.52 - 25% = 0.39
        { min: 3000, price: 0.285 }, // 0.38 - 25% = 0.285
        { min: 4000, price: 0.24 },  // 0.32 - 25% = 0.24
        { min: 5000, price: 0.21 },  // 0.28 - 25% = 0.21
      ],
      twoSided: [
        { min: 1, price: 1.44 },     // 1.92 - 25% = 1.44
        { min: 101, price: 1.32 },   // 1.76 - 25% = 1.32
        { min: 501, price: 0.90 },   // 1.20 - 25% = 0.90
        { min: 2000, price: 0.48 },  // 0.64 - 25% = 0.48
        { min: 3000, price: 0.33 },  // 0.44 - 25% = 0.33
        { min: 4000, price: 0.285 }, // 0.38 - 25% = 0.285
        { min: 5000, price: 0.24 },  // 0.32 - 25% = 0.24
      ]
    },
    { 
      key: "21x10", 
      label: "21 × 10 cm", 
      dims: "210 × 100 mm", 
      oneSided: [
        { min: 1, price: 0.57 },     // 0.76 - 25% = 0.57
        { min: 101, price: 0.51 },   // 0.68 - 25% = 0.51
        { min: 501, price: 0.405 },  // 0.54 - 25% = 0.405
        { min: 2000, price: 0.30 },  // 0.40 - 25% = 0.30
        { min: 3000, price: 0.27 },  // 0.36 - 25% = 0.27
        { min: 4000, price: 0.21 },  // 0.28 - 25% = 0.21
        { min: 5000, price: 0.165 }, // 0.22 - 25% = 0.165
      ],
      twoSided: [
        { min: 1, price: 1.05 },     // 1.40 - 25% = 1.05
        { min: 101, price: 0.90 },   // 1.20 - 25% = 0.90
        { min: 501, price: 0.75 },   // 1.00 - 25% = 0.75
        { min: 2000, price: 0.48 },  // 0.64 - 25% = 0.48
        { min: 3000, price: 0.39 },  // 0.52 - 25% = 0.39
        { min: 4000, price: 0.285 }, // 0.38 - 25% = 0.285
        { min: 5000, price: 0.21 },  // 0.28 - 25% = 0.21
      ]
    },
  ],
  PAPER_WEIGHTS: [
    { key: "135", label: "135 g/m² (Standard)", multiplier: 1.0 },
    { key: "250", label: "250 g/m² (Premium +20%)", multiplier: 1.2 }
  ],
  PRO_FEE_PER_FACE: 50,
  DISCOUNT_PERCENT: 25, // Reducere 25%
};

export type PriceInputFlyer = { sizeKey: string; quantity: number; twoSided: boolean; paperWeightKey: string; designOption: "upload" | "pro" };

export const calculateFlyerPrice = (input: PriceInputFlyer) => {
  const sizeDef = FLYER_CONSTANTS.SIZES.find((x) => x.key === input.sizeKey);
  if (!sizeDef) return { finalPrice: 0, unitPrice: 0, proFee: 0 };

  const tiers = input.twoSided ? sizeDef.twoSided : sizeDef.oneSided;
  let baseUnit: number = tiers[0].price;
  
  // Găsim prețul corect în funcție de cantitate
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (input.quantity >= tiers[i].min) {
      baseUnit = tiers[i].price;
      break;
    }
  }

  const multiplier = FLYER_CONSTANTS.PAPER_WEIGHTS.find((p) => p.key === input.paperWeightKey)?.multiplier ?? 1;
  const unitPrice = roundMoney(baseUnit * multiplier);
  const proFee = input.designOption === "pro" ? (input.twoSided ? FLYER_CONSTANTS.PRO_FEE_PER_FACE * 2 : FLYER_CONSTANTS.PRO_FEE_PER_FACE) : 0;
  
  return { finalPrice: roundMoney(unitPrice * input.quantity + proFee), unitPrice, proFee };
};

// ==========================================
// 12. PLIANTE
// ==========================================
export type PlianteFoldType = "simplu" | "fereastra" | "paralel" | "fluture";
export type PlianteWeightKey = "115" | "135" | "150" | "170" | "200" | "250";

export const PLIANTE_CONSTANTS = {
  FOLDS: {
    simplu: { label: "1 big (Simplu)", open: "297×210mm", closed: "148.5×210mm" },
    fereastra: { label: "2 biguri (Fereastră)", open: "297×210mm", closed: "148.5×210mm" },
    paralel: { label: "3 biguri (Paralel)", open: "297×210mm", closed: "75×210mm" },
    fluture: { label: "4 biguri (Fluture)", open: "297×210mm", closed: "74.25×210mm" },
  } as Record<PlianteFoldType, { label: string; open: string; closed: string }>,
  PRICE_TABLE: {
    "115": [
      { min: 1, price: 2.24 },     // < 100: 3.20 - 30% = 2.24
      { min: 500, price: 1.386 },  // 500: 1.98 - 30% = 1.386
      { min: 1000, price: 0.966 }, // 1000: 1.38 - 30% = 0.966
      { min: 2500, price: 0.574 }, // 2500: 0.82 - 30% = 0.574
      { min: 5000, price: 0.406 }, // 5000: 0.58 - 30% = 0.406
      { min: 10000, price: 0.35 }, // 10000: 0.50 - 30% = 0.35
    ],
    "135": [
      { min: 1, price: 2.31 },     // < 100: 3.30 - 30% = 2.31
      { min: 500, price: 1.456 },  // 500: 2.08 - 30% = 1.456
      { min: 1000, price: 1.036 }, // 1000: 1.48 - 30% = 1.036
      { min: 2500, price: 0.644 }, // 2500: 0.92 - 30% = 0.644
      { min: 5000, price: 0.476 }, // 5000: 0.68 - 30% = 0.476
      { min: 10000, price: 0.42 }, // 10000: 0.60 - 30% = 0.42
    ],
    "150": [
      { min: 1, price: 2.38 },     // < 100: 3.40 - 30% = 2.38
      { min: 500, price: 1.526 },  // 500: 2.18 - 30% = 1.526
      { min: 1000, price: 1.106 }, // 1000: 1.58 - 30% = 1.106
      { min: 2500, price: 0.714 }, // 2500: 1.02 - 30% = 0.714
      { min: 5000, price: 0.546 }, // 5000: 0.78 - 30% = 0.546
      { min: 10000, price: 0.49 }, // 10000: 0.70 - 30% = 0.49
    ],
    "170": [
      { min: 1, price: 2.45 },     // < 100: 3.50 - 30% = 2.45
      { min: 500, price: 1.596 },  // 500: 2.28 - 30% = 1.596
      { min: 1000, price: 1.176 }, // 1000: 1.68 - 30% = 1.176
      { min: 2500, price: 0.784 }, // 2500: 1.12 - 30% = 0.784
      { min: 5000, price: 0.616 }, // 5000: 0.88 - 30% = 0.616
      { min: 10000, price: 0.56 }, // 10000: 0.80 - 30% = 0.56
    ],
    "200": [
      { min: 1, price: 2.52 },     // < 100: 3.60 - 30% = 2.52
      { min: 500, price: 1.666 },  // 500: 2.38 - 30% = 1.666
      { min: 1000, price: 1.246 }, // 1000: 1.78 - 30% = 1.246
      { min: 2500, price: 0.854 }, // 2500: 1.22 - 30% = 0.854
      { min: 5000, price: 0.686 }, // 5000: 0.98 - 30% = 0.686
      { min: 10000, price: 0.63 }, // 10000: 0.90 - 30% = 0.63
    ],
    "250": [
      { min: 1, price: 2.59 },     // < 100: 3.70 - 30% = 2.59
      { min: 500, price: 1.736 },  // 500: 2.48 - 30% = 1.736
      { min: 1000, price: 1.316 }, // 1000: 1.88 - 30% = 1.316
      { min: 2500, price: 0.924 }, // 2500: 1.32 - 30% = 0.924
      { min: 5000, price: 0.756 }, // 5000: 1.08 - 30% = 0.756
      { min: 10000, price: 0.70 }, // 10000: 1.00 - 30% = 0.70
    ],
  } as Record<PlianteWeightKey, { min: number; price: number }[]>,
  PRO_FEES: { simplu: 100, fereastra: 135, paralel: 175, fluture: 200 } as Record<PlianteFoldType, number>,
  DISCOUNT_PERCENT: 30, // Reducere 30%
};

export type PriceInputPliante = { weight: PlianteWeightKey; quantity: number; fold: PlianteFoldType; designOption: "upload" | "pro" };

export const calculatePliantePrice = (input: PriceInputPliante) => {
  const tiers = PLIANTE_CONSTANTS.PRICE_TABLE[input.weight];
  let unitBasePrice: number = tiers[0].price;
  
  // Găsim prețul corect în funcție de cantitate
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (input.quantity >= tiers[i].min) {
      unitBasePrice = tiers[i].price;
      break;
    }
  }
  
  const subtotal = roundMoney(unitBasePrice * input.quantity);
  const proFee = input.designOption === "pro" ? (PLIANTE_CONSTANTS.PRO_FEES[input.fold] ?? 0) : 0;
  const finalPrice = roundMoney(subtotal + proFee);
  const pricePerUnit = roundMoney(finalPrice / input.quantity);
  return { finalPrice, pricePerUnit, proFee };
};

// ==========================================
// 13. TAPET
// ==========================================
export const TAPET_CONSTANTS = {
  PRICES: {
    bands: [
      { max_sqm: 1, price_per_sqm: 150 },
      { max_sqm: 5, price_per_sqm: 140 },
      { max_sqm: 20, price_per_sqm: 130 },
      { max_sqm: Infinity, price_per_sqm: 120 },
    ],
    multipliers: { adhesive: 1.10 }
  },
  PRO_DESIGN_FEE: 200,
};

export type PriceInputTapet = { width_cm: number; height_cm: number; quantity: number; want_adhesive: boolean; designOption: "upload" | "pro" };

export const calculateTapetPrice = (input: PriceInputTapet) => {
  if (input.width_cm <= 0 || input.height_cm <= 0) return { finalPrice: 0, total_sqm: 0, pricePerUnit: 0 };
  const sqmPerUnit = (input.width_cm / 100) * (input.height_cm / 100);
  const totalSqm = roundMoney(sqmPerUnit * input.quantity);
  
  // Găsim prețul pe mp în funcție de totalul de mp
  let pricePerSqm = 120; // default pentru > 20 MP
  for (const band of TAPET_CONSTANTS.PRICES.bands) {
    if (totalSqm <= band.max_sqm) {
      pricePerSqm = band.price_per_sqm;
      break;
    }
  }
  
  // Aplicăm adaos 10% pentru auto-adeziv
  if (input.want_adhesive) pricePerSqm *= TAPET_CONSTANTS.PRICES.multipliers.adhesive;
  
  let finalPrice = roundMoney(totalSqm * pricePerSqm);
  if (input.designOption === "pro") finalPrice += TAPET_CONSTANTS.PRO_DESIGN_FEE;
  return { finalPrice: roundMoney(finalPrice), totalSqm, pricePerUnit: roundMoney(finalPrice / input.quantity) };
};

// ==========================================
// 14. FONDURI EU (KIT VIZIBILITATE)
// ==========================================
export const FONDURI_EU_CONSTANTS = {
  GROUPS: {
    comunicat: {
      title: "Comunicat de presă",
      options: [
        { id: "none", label: "Fără comunicat", price: 0 },
        { id: "start", label: "Începere proiect", price: 247 },
        { id: "final", label: "Finalizare proiect", price: 247 },
        { id: "start+final", label: "Începere și finalizare proiect", price: 494 },
      ],
    },
    bannerSite: {
      title: "Banner site",
      options: [
        { id: "none", label: "Fără banner", price: 0 },
        { id: "with", label: "Banner site (Digital)", price: 100 },
      ],
    },
    afisInformativ: {
      title: "Afiș informativ",
      options: [
        { id: "none", label: "Fără afiș", price: 0 },
        { id: "A4", label: "Format A4", price: 19 },
        { id: "A3", label: "Format A3", price: 49 },
        { id: "A2", label: "Format A2", price: 79 },
      ],
    },
    autoMici: {
      title: "Autocolante mici",
      options: [
        { id: "none", label: "Nu", price: 0 },
        { id: "10x10-20", label: "10×10 cm (set 20 buc)", price: 49 },
        { id: "15x15-10", label: "15×15 cm (set 10 buc)", price: 49 },
        { id: "15x21-5", label: "15×21 cm (set 5 buc)", price: 49 },
      ],
    },
    autoMari: {
      title: "Autocolante mari",
      options: [
        { id: "none", label: "Nu", price: 0 },
        { id: "30x30-3", label: "30×30 cm (set 3 buc)", price: 49 },
        { id: "40x40-1", label: "40×40 cm (1 buc)", price: 49 },
      ],
    },
    panouTemporar: {
      title: "Panou temporar",
      options: [
        { id: "none", label: "Nu", price: 0 },
        { id: "A2", label: "Format A2", price: 200 },
        { id: "80x50", label: "80×50 cm", price: 290 },
        { id: "200x150", label: "200×150 cm", price: 700 },
        { id: "300x200", label: "300×200 cm", price: 1190 },
      ],
    },
    placaPermanenta: {
      title: "Placă permanentă",
      options: [
        { id: "none", label: "Nu", price: 0 },
        { id: "A2", label: "Format A2", price: 200 },
        { id: "80x50", label: "80×50 cm", price: 290 },
        { id: "150x100", label: "150×100 cm", price: 550 },
      ],
    },
  },
};

export type PriceInputFonduriEU = {
  selections: Record<string, string>;
};

export const calculateFonduriEUPrice = (input: PriceInputFonduriEU) => {
  let finalPrice = 0;
  const groups = FONDURI_EU_CONSTANTS.GROUPS;
  
  for (const groupKey in groups) {
      const key = groupKey as keyof typeof groups;
      const selectedId = input.selections[key];
      if (selectedId && selectedId !== "none") {
          const option = groups[key].options.find(o => o.id === selectedId);
          if (option) {
              finalPrice += option.price;
          }
      }
  }

  return { finalPrice: roundMoney(finalPrice) };
};

// ==========================================
// WINDOW GRAPHICS
// ==========================================
export const WINDOW_GRAPHICS_CONSTANTS = {
  PRICES: {
    bands: [
      { max: 1, price: 250 },
      { max: 5, price: 200 },
      { max: 20, price: 170 },
      { max: Infinity, price: 150 },
    ]
  },
  PRO_DESIGN_FEE: 100,
};

export type PriceInputWindowGraphics = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  designOption: "upload" | "pro";
};

export const calculateWindowGraphicsPrice = (input: PriceInputWindowGraphics) => {
  const { width_cm, height_cm, quantity, designOption } = input;
  
  if (width_cm <= 0 || height_cm <= 0) {
    return {
      finalPrice: 0,
      pricePerSqm: 0,
      total_sqm: 0,
      designFee: 0,
    };
  }

  const total_sqm = (width_cm * height_cm * quantity) / 10000;

  // Find price per sqm based on bands
  let pricePerSqm = WINDOW_GRAPHICS_CONSTANTS.PRICES.bands[0].price;
  for (const band of WINDOW_GRAPHICS_CONSTANTS.PRICES.bands) {
    if (total_sqm <= band.max) {
      pricePerSqm = band.price;
      break;
    }
  }

  let finalPrice = roundMoney(total_sqm * pricePerSqm);

  // Add design fee if pro option
  const designFee = designOption === "pro" ? WINDOW_GRAPHICS_CONSTANTS.PRO_DESIGN_FEE : 0;
  finalPrice += designFee;

  return {
    finalPrice: roundMoney(finalPrice),
    pricePerSqm,
    total_sqm: roundMoney(total_sqm),
    designFee,
  };
};

// ==========================================
// ROLLUP BANNER
// ==========================================
export const ROLLUP_CONSTANTS = {
  SIZES: [
    { width_cm: 85, label: "Compact" },
    { width_cm: 100, label: "Standard" },
    { width_cm: 120, label: "Mare" },
    { width_cm: 150, label: "Premium" },
  ],
  PRICE_TABLE: {
    85: [
      { min: 1, max: 5, price: 220 },
      { min: 6, max: 10, price: 200 },
      { min: 11, max: 20, price: 190 },
      { min: 21, max: Infinity, price: 175 },
    ],
    100: [
      { min: 1, max: 5, price: 250 },
      { min: 6, max: 10, price: 240 },
      { min: 11, max: 20, price: 230 },
      { min: 21, max: Infinity, price: 200 },
    ],
    120: [
      { min: 1, max: 5, price: 290 },
      { min: 6, max: 10, price: 270 },
      { min: 11, max: 20, price: 250 },
      { min: 21, max: Infinity, price: 230 },
    ],
    150: [
      { min: 1, max: 5, price: 390 },
      { min: 6, max: 10, price: 370 },
      { min: 11, max: 20, price: 360 },
      { min: 21, max: Infinity, price: 330 },
    ],
  },
  PRO_DESIGN_FEE: 100,
};

export type PriceInputRollup = {
  width_cm: number;
  quantity: number;
  designOption: "upload" | "pro";
};

export const calculateRollupPrice = (input: PriceInputRollup) => {
  const { width_cm, quantity, designOption } = input;
  
  // Get price table for selected width
  const priceTable = ROLLUP_CONSTANTS.PRICE_TABLE[width_cm as keyof typeof ROLLUP_CONSTANTS.PRICE_TABLE];
  
  if (!priceTable) {
    return {
      finalPrice: 0,
      unitPrice: 0,
      designFee: 0,
    };
  }

  // Find price per unit based on quantity
  let unitPrice = priceTable[0].price;
  for (const tier of priceTable) {
    if (quantity >= tier.min && quantity <= tier.max) {
      unitPrice = tier.price;
      break;
    }
  }
  
  let finalPrice = unitPrice * quantity;

  // Add design fee if pro option
  const designFee = designOption === "pro" ? ROLLUP_CONSTANTS.PRO_DESIGN_FEE : 0;
  finalPrice += designFee;

  return {
    finalPrice: roundMoney(finalPrice),
    unitPrice,
    designFee,
  };
};