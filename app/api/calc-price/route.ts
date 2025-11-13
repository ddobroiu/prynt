import { NextResponse } from "next/server";

type Body = {
  widthCm?: number;
  heightCm?: number;
  quantity?: number;
  materialId?: string | null;
  want_wind_holes?: boolean;
  want_hem_and_grommets?: boolean;
  designOption?: string | null; // "upload" | "text_only" | "pro"
};

function roundMoney(n: number) {
  return Math.round(n * 100) / 100;
}

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

    if (!(widthCm > 0) || !(heightCm > 0)) {
      return NextResponse.json({ ok: false, message: "Width and height must be positive numbers" }, { status: 400 });
    }

    // sqm per unit and total sqm
    const sqmPerUnit = (widthCm / 100) * (heightCm / 100);
    const totalSqm = sqmPerUnit * quantity;

    // Determine price per sqm by bands (based on total area of the order)
  let pricePerSqm = 35;
  if (totalSqm < 1) pricePerSqm = 100;
  else if (totalSqm <= 5) pricePerSqm = 75;
  else if (totalSqm <= 20) pricePerSqm = 60;
  else if (totalSqm <= 50) pricePerSqm = 45;
  else pricePerSqm = 35;

    // Base price (before surcharges) = total area * pricePerSqm
    const basePrice = totalSqm * pricePerSqm;

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
  const designFee = designOption === "pro" ? 50 : 0;

    // Final total (rounded)
    const finalTotal = roundMoney(priceAfterMultipliers + designFee);

    // Per unit price (rounded)
    const pricePerUnit = quantity > 0 ? roundMoney(finalTotal / quantity) : roundMoney(finalTotal);

    return NextResponse.json({
      ok: true,
      price: finalTotal,
      pricePerUnit,
      pricePerSqm,
      sqmPerUnit: roundMoney(sqmPerUnit),
      totalSqm: roundMoney(totalSqm),
      breakdown: {
        basePrice: roundMoney(basePrice),
        multiplier: roundMoney(multiplier),
        priceAfterMultipliers: roundMoney(priceAfterMultipliers),
        designFee,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Unknown error" }, { status: 500 });
  }
}