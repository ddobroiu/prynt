import { NextResponse } from 'next/server';
import { getAllSitesRO } from '../../../../lib/dpdService';

let cache: { at: number; judete: string[] } | null = null;
const TTL = 1000 * 60 * 60; // 1h

export async function GET() {
  try {
    const now = Date.now();
    if (!cache || now - cache.at > TTL) {
      const sites = await getAllSitesRO();
      const set = new Set<string>();
      for (const s of sites) {
        const r = (s.region || '').trim();
        if (r) set.add(r);
      }
      const judete = Array.from(set).sort((a, b) => a.localeCompare(b, 'ro'));
      cache = { at: now, judete };
    }
    return NextResponse.json({ ok: true, judete: cache.judete });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Eroare internă' }, { status: 500 });
  }
}
