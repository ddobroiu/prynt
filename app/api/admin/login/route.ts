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
  if (password !== expected) {
    return NextResponse.redirect(new URL('/admin/login?err=1', req.url), { status: 303 });
  }

  const token = signAdminSession();
  const res = NextResponse.redirect(new URL('/admin/orders', req.url), { status: 303 });
  res.cookies.set('admin_auth', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
  return res;
}
