import { NextRequest, NextResponse } from 'next/server';
import { getAllSitesRO, type DpdSiteRow } from '../../../../lib/dpdService';

let sitesCache: { at: number; sites: DpdSiteRow[] } | null = null;
const CACHE_TTL_MS = 1000 * 60 * 60; // 1h

async function ensureSites(): Promise<DpdSiteRow[]> {
  const now = Date.now();
  if (sitesCache && now - sitesCache.at < CACHE_TTL_MS) return sitesCache.sites;
  const sites = await getAllSitesRO();
  sitesCache = { at: now, sites };
  return sites;
}

// GET /api/dpd/localitati?judet=Ilfov&q=buftea
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const judet = (searchParams.get('judet') || '').trim();
    const q = (searchParams.get('q') || '').trim().toLowerCase();
    if (!judet) {
      return NextResponse.json({ ok: false, message: 'Parametrul judet este obligatoriu' }, { status: 400 });
    }
    const sites = await ensureSites();
    const filtered = sites.filter((s) => (s.region || '').toLowerCase() === judet.toLowerCase());
    const list = (q
      ? filtered.filter((s) => s.name.toLowerCase().includes(q) || (s.municipality || '').toLowerCase().includes(q))
      : filtered
    ).map((s) => ({ id: s.id, name: s.name, municipality: s.municipality, postCode: s.postCode, region: s.region }));
    return NextResponse.json({ ok: true, localitati: list });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message || 'Eroare internă' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Optional: POST { judet, q }
  const body = await req.json().catch(() => ({}));
  const url = new URL(req.url);
  if (body?.judet) url.searchParams.set('judet', body.judet);
  if (body?.q) url.searchParams.set('q', body.q);
  return GET(new NextRequest(url.toString()));
}
