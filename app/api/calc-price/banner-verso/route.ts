import { NextResponse } from "next/server";

type Body = {
  widthCm?: number;
  heightCm?: number;
  quantity?: number;
  want_wind_holes?: boolean;
  want_hem_and_grommets?: boolean; // default true
  sameGraphicFrontBack?: boolean; // default true
  designOption?: "upload" | "text_only" | "pro" | string | null;
};

const roundMoney = (n: number) => Math.round(n * 100) / 100;

export async function POST(request: Request) {
  try {
    const body: Body = await request.json().catch(() => ({} as Body));

    const widthCm = Number(body.widthCm || 0);
    const heightCm = Number(body.heightCm || 0);
    const quantity = Math.max(1, Math.floor(Number(body.quantity ?? 1)));

    const wantWindHoles = Boolean(body.want_wind_holes);
    const wantHemAndGrommets = typeof body.want_hem_and_grommets === 'boolean' ? body.want_hem_and_grommets : true;
    const sameGraphic = typeof body.sameGraphicFrontBack === 'boolean' ? body.sameGraphicFrontBack : true;
    const designOption = (body.designOption ?? 'upload').toString();

    if (!(widthCm > 0) || !(heightCm > 0)) {
      return NextResponse.json({ ok: false, message: 'Width and height must be positive numbers' }, { status: 400 });
    }

    const sqmPerUnit = (widthCm / 100) * (heightCm / 100);
    const totalSqm = sqmPerUnit * quantity;

    // Bands for Blockout 610 (verso): <1:165; 1-5:120; 5-20:99; 20-50:75; >50:55
    let pricePerSqmBand = 55;
    if (totalSqm < 1) pricePerSqmBand = 165;
    else if (totalSqm <= 5) pricePerSqmBand = 120;
    else if (totalSqm <= 20) pricePerSqmBand = 99;
    else if (totalSqm <= 50) pricePerSqmBand = 75;
    else pricePerSqmBand = 55;

    let multiplier = 1.0;
    if (wantHemAndGrommets) multiplier *= 1.10; // keep consistent with single-face logic
    if (wantWindHoles) multiplier *= 1.10;

    const pricePerSqm = roundMoney(pricePerSqmBand * multiplier);
    const basePrice = roundMoney(totalSqm * pricePerSqm);

    // Graphic fees
    const PRO_SAME = 50;
    const PRO_DIFF = 100;
    const DIFF_GRAPHICS_FEE = 100;

    let extra = 0;
    if (designOption === 'pro') {
      extra += sameGraphic ? PRO_SAME : PRO_DIFF;
    } else if (!sameGraphic) {
      // if graphics differ and not pro, apply difference fee
      extra += DIFF_GRAPHICS_FEE;
    }

    const finalTotal = roundMoney(basePrice + extra);
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
        extra,
        sameGraphic,
        designOption,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}
