import { NextResponse } from "next/server";

type Body = {
  widthCm?: number;
  heightCm?: number;
  quantity?: number;
  productType?: 'pvc-forex' | 'alucobond' | 'polipropilena' | string | null;
  thicknessMm?: number;
};

const roundMoney = (n: number) => Math.round(n * 100) / 100;

const PVC_FOREX_PRICE: Record<number, number> = {
  1: 120,
  2: 150,
  3: 180,
  4: 210,
  5: 240,
  6: 270,
  8: 300,
  10: 400,
};

const ALU_PRICE: Record<number, number> = {
  3: 350,
  4: 450,
};

const PP_PRICE: Record<number, number> = {
  3: 110,
  5: 120,
};

function getPriceMap(productType: string) {
  const t = productType.toLowerCase();
  if (t.includes('alucobond')) return ALU_PRICE;
  if (t.includes('poliprop')) return PP_PRICE;
  return PVC_FOREX_PRICE; // default pvc-forex
}

export async function POST(request: Request) {
  try {
    const body: Body = await request.json().catch(() => ({} as Body));

    const widthCm = Number(body.widthCm || 0);
    const heightCm = Number(body.heightCm || 0);
    const quantity = Math.max(1, Math.floor(Number(body.quantity ?? 1)));
    const productType = (body.productType ?? 'pvc-forex').toString();
    const thicknessMm = Number(body.thicknessMm || 0);

    if (!(widthCm > 0) || !(heightCm > 0)) {
      return NextResponse.json({ ok: false, message: 'Width and height must be positive numbers' }, { status: 400 });
    }

    const priceMap = getPriceMap(productType);
    const pricePerSqm = priceMap[thicknessMm];
    if (!pricePerSqm) {
      return NextResponse.json({ ok: false, message: 'Invalid thickness for selected product type' }, { status: 400 });
    }

    const sqmPerUnit = (widthCm / 100) * (heightCm / 100);
    const totalSqm = sqmPerUnit * quantity;

    const finalTotal = roundMoney(totalSqm * pricePerSqm);
    const pricePerUnit = roundMoney(finalTotal / quantity);

    return NextResponse.json({
      ok: true,
      price: finalTotal,
      pricePerUnit,
      pricePerSqm: roundMoney(pricePerSqm),
      sqmPerUnit: roundMoney(sqmPerUnit),
      totalSqm: roundMoney(totalSqm),
      breakdown: {
        thicknessMm,
        productType,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}
