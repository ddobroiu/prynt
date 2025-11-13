import { NextResponse } from "next/server";

type Body = {
  widthCm?: number;
  heightCm?: number;
  quantity?: number;
  want_adhesive?: boolean;
  designOption?: "upload" | "pro" | string | null;
};

const roundMoney = (n: number) => Math.round(n * 100) / 100;

export async function POST(request: Request) {
  try {
    const body: Body = await request.json().catch(() => ({} as Body));

    const widthCm = Number(body.widthCm || 0);
    const heightCm = Number(body.heightCm || 0);
    const quantity = Math.max(1, Math.floor(Number(body.quantity ?? 1)));
    const wantAdhesive = Boolean(body.want_adhesive);
    const designOption = (body.designOption ?? "upload").toString();

    if (!(widthCm > 0) || !(heightCm > 0)) {
      return NextResponse.json({ ok: false, message: "Width and height must be positive numbers" }, { status: 400 });
    }

    const sqmPerUnit = (widthCm / 100) * (heightCm / 100);
    const totalSqm = sqmPerUnit * quantity;

    // Bands: <1: 180; 1-<5: 170; 5-<20: 160; >=20: 150
    let pricePerSqmBand = 180;
    if (totalSqm >= 20) pricePerSqmBand = 150;
    else if (totalSqm >= 5) pricePerSqmBand = 160;
    else if (totalSqm >= 1) pricePerSqmBand = 170;
    else pricePerSqmBand = 180;

    const multiplier = wantAdhesive ? 1.1 : 1.0; // +10% for adhesive variant
    const pricePerSqm = roundMoney(pricePerSqmBand * multiplier);

    const basePrice = roundMoney(totalSqm * pricePerSqm);

    const designFee = designOption === "pro" ? 200 : 0; // one-time fee
    const finalTotal = roundMoney(basePrice + designFee);
    const pricePerUnit = roundMoney(finalTotal / quantity);

    return NextResponse.json({
      ok: true,
      price: finalTotal,
      pricePerUnit,
      pricePerSqm,
      sqmPerUnit: roundMoney(sqmPerUnit),
      totalSqm: roundMoney(totalSqm),
      breakdown: {
        band: pricePerSqmBand,
        multiplier: roundMoney(multiplier),
        basePrice,
        designFee,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
