// app/api/dpd/localities/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchLocalities } from '@/lib/dpd';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') ?? '').trim();
  const country = (searchParams.get('country') ?? 'RO').toUpperCase();

  if (!q || q.length < 2) {
    return NextResponse.json({ items: [] });
  }

  try {
    const items = await searchLocalities({ query: q, country });
    return NextResponse.json({ items });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
