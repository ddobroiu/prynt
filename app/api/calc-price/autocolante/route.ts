import { NextResponse } from "next/server";

type Body = {
  widthCm?: number;
  heightCm?: number;
  quantity?: number;
  material?: "paper_gloss" | "paper_matte" | "vinyl" | string | null;
  laminated?: boolean;
  shape_diecut?: boolean;
  designOption?: "upload" | "text_only" | "pro" | string | null;
};

const roundMoney = (n: number) => Math.round(n * 100) / 100;

export async function POST(request: Request) {
  try {
    const body: Body = await request.json().catch(() => ({} as Body));

    const widthCm = Number(body.widthCm || 0);
    const heightCm = Number(body.heightCm || 0);
    const quantity = Math.max(1, Math.floor(Number(body.quantity ?? 1)));

    const material = (body.material ?? "paper_gloss").toString();
    const laminated = Boolean(body.laminated);
    const shapeDiecut = Boolean(body.shape_diecut);
    const designOption = (body.designOption ?? "upload").toString();

    if (!(widthCm > 0) || !(heightCm > 0)) {
      return NextResponse.json({ ok: false, message: "Width and height must be positive numbers" }, { status: 400 });
    }

    // Area metrics
    const sqmPerUnit = (widthCm / 100) * (heightCm / 100);
    const totalSqm = sqmPerUnit * quantity;

    // Placeholder pricing bands per unit based on total area (adjust when real tariffs are available)
    let pricePerUnitBase = 0.5; // RON per piece baseline
    if (totalSqm < 0.1) pricePerUnitBase = 0.6;
    else if (totalSqm <= 0.5) pricePerUnitBase = 0.45;
    else if (totalSqm <= 2) pricePerUnitBase = 0.35;
    else pricePerUnitBase = 0.25;

    // Multipliers
    let multiplier = 1.0;
    if (/vinyl/i.test(material)) multiplier *= 1.15; // premium vinyl
    if (laminated) multiplier *= 1.1; // lamination +10%
    if (shapeDiecut) multiplier *= 1.12; // die-cut +12%

    const pricePerUnit = roundMoney(pricePerUnitBase * multiplier);
    const basePrice = roundMoney(pricePerUnit * quantity);

    const designFee = designOption === "pro" ? 30 : 0; // one-time example
    const finalTotal = roundMoney(basePrice + designFee);

    return NextResponse.json({
      ok: true,
      price: finalTotal,
      pricePerUnit,
      sqmPerUnit: roundMoney(sqmPerUnit),
      totalSqm: roundMoney(totalSqm),
      breakdown: {
        pricePerUnitBase: roundMoney(pricePerUnitBase),
        multiplier: roundMoney(multiplier),
        basePrice,
        designFee,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
