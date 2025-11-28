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
  PRICES: {
    base_bands: [
      { max_sqm: 0.1, price_per_unit: 0.60 },
      { max_sqm: 0.5, price_per_unit: 0.45 },
      { max_sqm: 2.0, price_per_unit: 0.35 },
      { max_sqm: Infinity, price_per_unit: 0.25 },
    ],
    multipliers: {
      vinyl: 1.15,
      laminated: 1.10,
      die_cut: 1.12,
    }
  },
  PRO_DESIGN_FEE: 30,
};

export type PriceInputAutocolante = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: "paper_gloss" | "paper_matte" | "vinyl";
  laminated: boolean;
  shape_diecut: boolean;
  designOption: "upload" | "text_only" | "pro";
};

export const calculateAutocolantePrice = (input: PriceInputAutocolante) => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
      return { finalPrice: 0, total_sqm: 0, pricePerUnit: 0, sqmPerUnit: 0 };
  }

  const sqmPerUnit = (input.width_cm / 100) * (input.height_cm / 100);
  const totalSqm = roundMoney(sqmPerUnit * input.quantity);

  let pricePerUnitBase = 0.25;
  for (const band of AUTOCOLANTE_CONSTANTS.PRICES.base_bands) {
      if (totalSqm <= band.max_sqm) {
          pricePerUnitBase = band.price_per_unit;
          break;
      }
  }

  let multiplier = 1.0;
  if (input.material === "vinyl") multiplier *= AUTOCOLANTE_CONSTANTS.PRICES.multipliers.vinyl;
  if (input.laminated) multiplier *= AUTOCOLANTE_CONSTANTS.PRICES.multipliers.laminated;
  if (input.shape_diecut) multiplier *= AUTOCOLANTE_CONSTANTS.PRICES.multipliers.die_cut;

  const pricePerUnit = roundMoney(pricePerUnitBase * multiplier);
  let finalPrice = roundMoney(pricePerUnit * input.quantity);

  if (input.designOption === "pro") {
      finalPrice += AUTOCOLANTE_CONSTANTS.PRO_DESIGN_FEE;
  }

  return { finalPrice: roundMoney(finalPrice), total_sqm: totalSqm, pricePerUnit, sqmPerUnit };
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
  PRO_DESIGN_FEE: 40,
};

export type PriceInputCanvas = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  edge_type: "white" | "mirror" | "wrap";
  designOption: "upload" | "pro";
};

export const calculateCanvasPrice = (input: PriceInputCanvas) => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
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
    paper_150_lucioasa: { A3: [{ min: 1, price: 3.0 }], A2: [{ min: 1, price: 9.98 }], A1: [{ min: 1, price: 39.96 }], A0: [{ min: 1, price: 80.0 }], S5: [{ min: 1, price: 28.0 }], S7: [{ min: 1, price: 56.0 }] },
    blueback_115: { A0: [{ min: 1, price: 70.0 }], A1: [{ min: 1, price: 17.48 }], A2: [{ min: 1, price: 17.46 }] },
    whiteback_150_material: { A0: [{ min: 1, price: 80.0 }] },
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
    { key: "A6", label: "A6", dims: "105 × 148 mm", brackets: [{ max: 5000, oneSided: 0.22, twoSided: 0.28 }, { max: Infinity, oneSided: 0.22, twoSided: 0.28 }] },
    { key: "A5", label: "A5", dims: "148 × 210 mm", brackets: [{ max: 5000, oneSided: 0.28, twoSided: 0.32 }, { max: Infinity, oneSided: 0.28, twoSided: 0.32 }] },
    { key: "21x10", label: "21 × 10 cm", dims: "210 × 100 mm", brackets: [{ max: 5000, oneSided: 0.22, twoSided: 0.28 }, { max: Infinity, oneSided: 0.22, twoSided: 0.28 }] },
  ],
  PAPER_WEIGHTS: [{ key: "135", label: "135 g/mp (Standard)", multiplier: 1.0 }, { key: "250", label: "250 g/mp (Premium)", multiplier: 1.2 }],
  PRO_FEE_PER_FACE: 50,
};

export type PriceInputFlyer = { sizeKey: string; quantity: number; twoSided: boolean; paperWeightKey: string; designOption: "upload" | "pro" };

export const calculateFlyerPrice = (input: PriceInputFlyer) => {
  const sizeDef = FLYER_CONSTANTS.SIZES.find((x) => x.key === input.sizeKey);
  const bracket = sizeDef?.brackets.find((b) => input.quantity <= b.max) || sizeDef?.brackets[0];
  if (!bracket) return { finalPrice: 0, unitPrice: 0, proFee: 0 };

  const baseUnit = input.twoSided ? bracket.twoSided : bracket.oneSided;
  const multiplier = FLYER_CONSTANTS.PAPER_WEIGHTS.find((p) => p.key === input.paperWeightKey)?.multiplier ?? 1;
  
  const unitPrice = roundMoney(baseUnit * multiplier);
  const proFee = input.designOption === "pro" ? (input.twoSided ? FLYER_CONSTANTS.PRO_FEE_PER_FACE * 2 : FLYER_CONSTANTS.PRO_FEE_PER_FACE) : 0;
  
  return { finalPrice: roundMoney(unitPrice * input.quantity + proFee), unitPrice, proFee };
};

// ==========================================
// 12. PLIANTE
// ==========================================
export type PlianteFoldType = "simplu" | "fereastra" | "paralel" | "fluture";
export type PlianteWeightKey = "115" | "170" | "250";

export const PLIANTE_CONSTANTS = {
  FOLDS: {
    simplu: { label: "1 big (Simplu)", open: "297×210mm", closed: "148.5×210mm" },
    fereastra: { label: "2 biguri (Fereastră)", open: "297×210mm", closed: "148.5×210mm" },
    paralel: { label: "3 biguri (Paralel)", open: "297×210mm", closed: "75×210mm" },
    fluture: { label: "4 biguri (Fluture)", open: "297×210mm", closed: "74.25×210mm" },
  } as Record<PlianteFoldType, { label: string; open: string; closed: string }>,
  PRICE_TABLE: {
    "115": [{ min: 1, price: 3.2 }],
    "170": [{ min: 1, price: 3.5 }],
    "250": [{ min: 1, price: 3.7 }],
  } as Record<PlianteWeightKey, { min: number; price: number }[]>,
  PRO_FEES: { simplu: 100, fereastra: 135, paralel: 175, fluture: 200 } as Record<PlianteFoldType, number>,
};

export type PriceInputPliante = { weight: PlianteWeightKey; quantity: number; fold: PlianteFoldType; designOption: "upload" | "pro" };

export const calculatePliantePrice = (input: PriceInputPliante) => {
  const tiers = PLIANTE_CONSTANTS.PRICE_TABLE[input.weight];
  let unitBasePrice: number = tiers[0].price;
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
    bands: [{ max_sqm: Infinity, price_per_sqm: 150 }],
    multipliers: { adhesive: 1.10 }
  },
  PRO_DESIGN_FEE: 200,
};

export type PriceInputTapet = { width_cm: number; height_cm: number; quantity: number; want_adhesive: boolean; designOption: "upload" | "pro" };

export const calculateTapetPrice = (input: PriceInputTapet) => {
  if (input.width_cm <= 0 || input.height_cm <= 0) return { finalPrice: 0, total_sqm: 0, pricePerUnit: 0 };
  const sqmPerUnit = (input.width_cm / 100) * (input.height_cm / 100);
  const totalSqm = roundMoney(sqmPerUnit * input.quantity);
  let pricePerSqm = 150; 
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