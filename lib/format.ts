// lib/format.ts

// Forțăm moneda implicită să fie RON
export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY || "RON";

/**
 * Formatează un număr în RON cu două zecimale,
 * folosind locale "ro-RO" pentru separatori corecți.
 *
 * Exemplu: money(1250.5) => "1.250,50 lei"
 */
export function money(n: number) {
  if (isNaN(n)) return "0,00 lei";

  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}
