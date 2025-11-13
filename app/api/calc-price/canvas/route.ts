import { NextResponse } from "next/server";

// Fixed-size presets with frame (RON per unit)
const SIZE_PRICE_MAP: Record<string, number> = {
  "30x40": 89,
  "30x50": 99,
  "40x60": 119,
  "50x70": 169,
  "60x90": 199,
  "80x100": 249,
  "80x120": 299,
  "100x120": 369,
  "30x30": 79,
  "40x40": 99,
  "50x50": 129,
  "60x60": 149,
  "70x70": 189,
  "80x80": 219,
  "90x90": 299,
  "100x100": 389,
};

function pricePerSqmForTotalArea(totalSqm: number) {
  if (totalSqm <= 0) return 0;
  if (totalSqm < 1) return 175;
  if (totalSqm <= 5) return 150;
  if (totalSqm <= 20) return 130;
  if (totalSqm <= 50) return 100;
  return 80;
}

const roundMoney = (n: number) => Math.round(n * 100) / 100;

type Body = {
  // common
  quantity?: number;
  // framed mode
  framed?: boolean;
  sizeKey?: string | null; // like "50x70"
  // no-frame mode
  widthCm?: number;
  heightCm?: number;
};

export async function POST(request: Request) {
  try {
    const body: Body = await request.json().catch(() => ({} as Body));

    const quantity = Math.max(1, Math.floor(Number(body.quantity ?? 1)));
    const framed = typeof body.framed === 'boolean' ? body.framed : true;

    if (framed) {
      const key = (body.sizeKey ?? '').toString();
      const unitPrice = SIZE_PRICE_MAP[key];
      if (!unitPrice) {
        return NextResponse.json({ ok: false, message: 'Dimensiune preset invalidă' }, { status: 400 });
      }
      const price = roundMoney(unitPrice * quantity);
      return NextResponse.json({ ok: true, mode: 'framed', price, pricePerUnit: unitPrice, quantity });
    }

    // no-frame mode
    const widthCm = Number(body.widthCm || 0);
    const heightCm = Number(body.heightCm || 0);
    if (!(widthCm > 0) || !(heightCm > 0)) {
      return NextResponse.json({ ok: false, message: 'Width and height must be positive numbers' }, { status: 400 });
    }
    const sqmPerUnit = (widthCm / 100) * (heightCm / 100);
    const totalSqm = sqmPerUnit * quantity;
    const band = pricePerSqmForTotalArea(totalSqm);
    const unitPrice = roundMoney(sqmPerUnit * band);
    const price = roundMoney(unitPrice * quantity);
    return NextResponse.json({ ok: true, mode: 'noframe', price, pricePerUnit: unitPrice, pricePerSqm: band, sqmPerUnit: roundMoney(sqmPerUnit), totalSqm: roundMoney(totalSqm) });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? 'Unknown error' }, { status: 500 });
  }
}
