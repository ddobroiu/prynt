// lib/format.ts
export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "EUR";

export function money(n: number) {
  return new Intl.NumberFormat("ro-RO", { style: "currency", currency: CURRENCY }).format(n);
}
