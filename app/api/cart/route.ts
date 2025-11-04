// app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { readCartFromCookies, calcTotals } from '@/lib/cart';

export async function GET() {
  const items = readCartFromCookies();
  const totals = calcTotals(items);
  return NextResponse.json({ items, totals });
}
