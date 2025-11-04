// lib/pricing-flyer.ts
export type FlyerFormat = "A6" | "A5" | "A4" | "A3";
export type PaperGsm = 130 | 170 | 250;
export type PrintSide = "single" | "double";

export type FlyerInput = {
  format: FlyerFormat;
  paper: PaperGsm;
  side: PrintSide;
  lamination: boolean;  // +15% invizibil
  quantity: number;
};

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

// bază per bucată (tiraj mic,  <100 buc)
function basePricePerUnit(format: FlyerFormat) {
  switch (format) {
    case "A6": return 0.70;
    case "A5": return 1.20;
    case "A4": return 2.00;
    case "A3": return 3.80;
  }
}

// discount pe tiraj (se aplică multiplicativ)
function tierMultiplier(qty: number) {
  if (qty < 100) return 1.00;
  if (qty < 250) return 0.85;
  if (qty < 500) return 0.70;
  if (qty < 1000) return 0.55;
  if (qty < 2500) return 0.40;
  return 0.30; // 2500+
}

// adaosuri invizibile la preț unitar
function paperUp(p: PaperGsm) {
  if (p === 170) return 0.10;   // +10%
  if (p === 250) return 0.25;   // +25%
  return 0;                     // 130 = bază
}

export function computeFlyerPrice(input: FlyerInput) {
  const q = Math.max(1, Math.floor(input.quantity));
  const base = basePricePerUnit(input.format);

  let mult = tierMultiplier(q);
  mult *= (1 + paperUp(input.paper));
  if (input.side === "double") mult *= 1.20;   // față/verso +20% invizibil
  if (input.lamination)        mult *= 1.15;   // laminare +15% invizibil

  const unit = round2(base * mult);
  const total = round2(unit * q);

  return {
    unitPrice: unit,
    total,
  };
}
