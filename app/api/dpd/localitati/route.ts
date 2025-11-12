import { NextResponse } from 'next/server';

// Minimal shim for DPD localitati route used by a generated types file.
// Returns an empty array; implement properly if you need real data.
export async function GET() {
  return NextResponse.json([], { status: 200 });
}

export async function POST(request: Request) {
  // echo back for basic compatibility; real implementation should validate input
  try {
    const body = await request.json();
    return NextResponse.json({ ok: true, body }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }
}
