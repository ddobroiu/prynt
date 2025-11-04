// lib/cart.ts
import { cookies } from 'next/headers';

export type CartItem = {
  sku: string;
  name: string;
  quantity: number;       // int
  unitPrice: number;      // fără TVA sau cu? — noi folosim la calcul + vatRate
  vatRate: number;        // ex: 19
  weightGr?: number;
  lengthMm?: number;
  widthMm?: number;
  heightMm?: number;
  imageUrl?: string;
};

const COOKIE_KEYS = ['cart', 'cart_v1', 'cartItems']; // încercăm mai multe chei uzuale

export function readCartFromCookies(): CartItem[] {
  const jar = cookies();
  for (const key of COOKIE_KEYS) {
    const c = jar.get(key)?.value;
    if (!c) continue;
    try {
      const arr = JSON.parse(c);
      if (Array.isArray(arr)) {
        return arr
          .map((x) => ({
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
      }
    } catch {
      // ignora cookie corupt
    }
  }
  return [];
}

export function calcTotals(items: CartItem[]) {
  const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
  const vat = items.reduce((s, it) => s + (it.unitPrice * it.quantity * it.vatRate) / 100, 0);
  const shipping = 24; // DPD Standard fix
  const total = subtotal + vat + shipping;
  const totalWeightGr = items.reduce((s, it) => s + (it.weightGr ?? 0) * it.quantity, 0);
  return { subtotal, vat, shipping, total, totalWeightGr };
}
