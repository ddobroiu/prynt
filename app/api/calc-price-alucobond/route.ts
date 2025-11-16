import { NextResponse } from "next/server";

type Body = {
  widthCm?: number;
  heightCm?: number;
  quantity?: number;
  material?: "PE" | "PVDF";
  color?: string;
  designOption?: string | null; // "upload" | "text_only" | "pro"
};

const PRICE_MAP: Record<"PE" | "PVDF", Record<string, number>> = {
  PE: { Alb: 250, Argintiu: 250, Negru: 250 },
  PVDF: { Alb: 350 },
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
    const material = body.material ?? "PE";
    const color = body.color ?? "Alb";
    const designOption = body.designOption ?? "upload";

    if (!(widthCm > 0) || !(heightCm > 0)) {
      return NextResponse.json({ ok: false, message: "Width and height must be positive numbers" }, { status: 400 });
    }

    const sqmPerUnit = (widthCm / 100) * (heightCm / 100);
    const totalSqm = sqmPerUnit * quantity;

    const pricePerSqm = PRICE_MAP[material]?.[color] ?? 0;
    const basePrice = totalSqm * pricePerSqm;

    const designFee = designOption === "pro" ? 50 : 0;
    const finalTotal = roundMoney(basePrice + designFee);
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
        designFee,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, message: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
