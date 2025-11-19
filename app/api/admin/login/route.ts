import { NextRequest, NextResponse } from 'next/server';
import { signAdminSession } from '../../../../lib/adminSession';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.formData().catch(() => null);
  const password = (body?.get('password') as string) || '';
  const expected = process.env.ADMIN_PANEL_TOKEN || process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json({ error: 'ADMIN_PANEL_TOKEN lipsă' }, { status: 500 });
  }

  // FIX: Luăm originea direct din request (ex: http://localhost:3000 sau https://prynt.ro)
  // Astfel redirect-ul rămâne pe același domeniu de unde a venit cererea
  const requestUrl = new URL(req.url);
  const base = requestUrl.origin;

  if (password !== expected) {
    return NextResponse.redirect(`${base}/admin/login?err=1`, { status: 303 });
  }

  const token = signAdminSession();
  
  const res = NextResponse.redirect(`${base}/admin/orders`, { status: 303 });
  
  res.cookies.set('admin_auth', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
  
  return res;
}