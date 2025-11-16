import { NextResponse } from "next/server";

type Body = {
  widthCm?: number;
  heightCm?: number;
  quantity?: number;
  materialId?: string | null;
  want_wind_holes?: boolean;
  want_hem_and_grommets?: boolean;
  designOption?: string | null; // "upload" | "text_only" | "pro"
  // Carton specific
  printDouble?: boolean;
  edgePerimeter_m?: number;
  edgeType?: string | null;
};

function roundMoney(n: number) {
  return Math.round(n * 100) / 100;
}

// Carton price maps
const ONDULAT_PRICE_SINGLE: Record<string, number> = {
  E: 80,   // Micro Ondula E - 1 mm
  "3B": 85, // Tip 3 Ondula B - 2 mm
  "3C": 90, // Tip 3 Ondula C - 3 mm
  "5BC": 100, // Tip 5 Ondula B+C - 5 mm
};

const ONDULAT_PRICE_DOUBLE: Record<string, number> = {
  E: 120,
  "3B": 130,
  "3C": 135,
  "5BC": 150,
};

const RECICLAT_PRICE: Record<string, number> = {
  board10: 200, // Eco Board 10 mm
  board16: 250, // Board 16 mm
};

const EDGE_PRICE_PER_ML: Record<string, number> = {
  board10: 15,
  board16: 17,
};

export async function POST(request: Request) {
  try {
    const body: Body = await request.json().catch(() => ({} as Body));

    const widthCm = Number(body.widthCm || 0);
    const heightCm = Number(body.heightCm || 0);
    const quantity = Math.max(1, Math.floor(Number(body.quantity ?? 1)));

    // Defaults (compatible cu UI existent)
    const wantHemAndGrommets = typeof body.want_hem_and_grommets === "boolean" ? body.want_hem_and_grommets : true; // UI default true
    const wantWindHoles = typeof body.want_wind_holes === "boolean" ? body.want_wind_holes : false;
    const designOption = body.designOption ?? "upload";
    const materialId = (body.materialId ?? "frontlit_440").toString().toLowerCase();

    // Carton specific
    const printDouble = typeof body.printDouble === "boolean" ? body.printDouble : false;
    const edgePerimeter_m = Number(body.edgePerimeter_m || 0);
    const edgeType = body.edgeType ?? null;

    if (!(widthCm > 0) || !(heightCm > 0)) {
      return NextResponse.json({ ok: false, message: "Width and height must be positive numbers" }, { status: 400 });
    }

    // sqm per unit and total sqm
    const sqmPerUnit = (widthCm / 100) * (heightCm / 100);
    const totalSqm = sqmPerUnit * quantity;

    let finalTotal = 0;
    let pricePerSqm = 0;
    let accessoryCost = 0;
    let designFee = 0;

    // Check if carton
    if (materialId.startsWith("ondulat_") || materialId.startsWith("reciclat_")) {
      // Carton pricing
      const materialParts = materialId.split("_");
      const materialType = materialParts[0]; // ondulat or reciclat
      const variant = materialParts[1]; // E, 3B, etc. or board10, board16

      if (materialType === "ondulat") {
        pricePerSqm = printDouble ? ONDULAT_PRICE_DOUBLE[variant] : ONDULAT_PRICE_SINGLE[variant];
      } else if (materialType === "reciclat") {
        pricePerSqm = RECICLAT_PRICE[variant];
      }

      const basePrice = roundMoney(totalSqm * pricePerSqm);

      // Edge banding cost
      if (edgePerimeter_m > 0 && edgeType && EDGE_PRICE_PER_ML[edgeType]) {
        accessoryCost = roundMoney(edgePerimeter_m * EDGE_PRICE_PER_ML[edgeType]);
      }

      finalTotal = roundMoney(basePrice + accessoryCost);

      // Design fee for pro
      if (designOption === "pro") {
        designFee = 50; // Assuming same as banners
        finalTotal = roundMoney(finalTotal + designFee);
      }
    } else {
      // Banner pricing (existing logic)
      // Determine price per sqm by bands (based on total area of the order)
      let pricePerSqmBand = 35;
      if (totalSqm < 1) pricePerSqmBand = 100;
      else if (totalSqm <= 5) pricePerSqmBand = 75;
      else if (totalSqm <= 20) pricePerSqmBand = 60;
      else if (totalSqm <= 50) pricePerSqmBand = 45;
      else pricePerSqmBand = 35;

      // Base price (before surcharges) = total area * pricePerSqm
      const basePrice = totalSqm * pricePerSqmBand;

      // Surcharges: percentages applied to the basePrice
      let multiplier = 1;

      // material surcharge: 510g -> +10%
      if (materialId.includes("510") || materialId.includes("frontlit_510") || materialId.includes("pvc-510")) {
        multiplier *= 1.10;
      }

      // tiv si capse -> +10%
      if (wantHemAndGrommets) multiplier *= 1.10;

      // gauri pentru vant -> +10%
      if (wantWindHoles) multiplier *= 1.10;

      const priceAfterMultipliers = basePrice * multiplier;

      // Graphic (pro) fee: +50 RON one-time per order
      designFee = designOption === "pro" ? 50 : 0;

      // Final total (rounded)
      finalTotal = roundMoney(priceAfterMultipliers + designFee);
      pricePerSqm = roundMoney(pricePerSqmBand * multiplier);
    }

    // Per unit price (rounded)
    const pricePerUnit = quantity > 0 ? roundMoney(finalTotal / quantity) : roundMoney(finalTotal);

    return NextResponse.json({
      ok: true,
      price: finalTotal,
      pricePerUnit,
      pricePerSqm,
      sqmPerUnit: roundMoney(sqmPerUnit),
      totalSqm: roundMoney(totalSqm),
      accessoryCost: roundMoney(accessoryCost),
      designFee,
      breakdown: {
        basePrice: roundMoney(totalSqm * pricePerSqm),
        accessoryCost: roundMoney(accessoryCost),
        designFee,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Unknown error" }, { status: 500 });
  }
}