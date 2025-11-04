// lib/cart.ts
import { cookies } from 'next/headers';

export type CartItem = {
  sku: string;
  name: string;
  quantity: number;      // cantitate
  unitPrice: number;     // preț unitar fără TVA
  vatRate: number;       // ex: 19
  weightGr?: number;
  lengthMm?: number;
  widthMm?: number;
  heightMm?: number;
  imageUrl?: string;
};

// chei posibile pentru cookie
const COOKIE_KEYS = ['cart', 'cart_v1', 'cartItems'];

/**
 * Citește conținutul coșului din cookies.
 * Este funcție async pentru compatibilitate cu Next.js 16.
 */
export async function readCartFromCookies(): Promise<CartItem[]> {
  const jar = await cookies(); // ✅ Next.js 16 - trebuie awaited
  const items: CartItem[] = [];

  for (const key of COOKIE_KEYS) {
    const c = jar.get(key)?.value;
    if (!c) continue;

    try {
      const arr = JSON.parse(c);
      if (Array.isArray(arr)) {
        const parsed = arr
          .map((x: any) => ({
            sku: String(x.sku ?? ''),
            name: String(x.name ?? ''),
            quantity: Number(x.quantity ?? 1),
            unitPrice: Number(x.unitPrice ?? 0),
            vatRate: Number(x.vatRate ?? 19),
            weightGr: Number(x.weightGr ?? 0) || 0,
            lengthMm: x.lengthMm != null ? Number(x.lengthMm) : undefined,
            widthMm: x.widthMm != null ? Number(x.widthMm) : undefined,
            heightMm: x.heightMm != null ? Number(x.heightMm) : undefined,
            imageUrl: x.imageUrl ? String(x.imageUrl) : undefined,
          }))
          .filter((x) => x.sku && x.name && x.quantity > 0);

        items.push(...parsed);
      }
    } catch {
      // ignoră cookie invalid
    }
  }

  return items;
}

/**
 * Calculează subtotal, TVA, livrare și total.
 */
export function calcTotals(items: CartItem[]) {
  const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
  const vat = items.reduce(
    (s, it) => s + (it.unitPrice * it.quantity * it.vatRate) / 100,
    0
  );
  const shipping = 24; // livrare standard fixă
  const total = subtotal + vat + shipping;
  const totalWeightGr = items.reduce(
    (s, it) => s + (it.weightGr ?? 0) * it.quantity,
    0
  );

  return { subtotal, vat, shipping, total, totalWeightGr };
}
