import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || typeof token !== 'string' || !password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ success: false, message: 'Date invalide.' }, { status: 400 });
    }
    const record = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record || record.expires < new Date()) {
      return NextResponse.json({ success: false, message: 'Token invalid sau expirat.' }, { status: 400 });
    }
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id: record.userId }, data: { passwordHash: hash } });
    await prisma.passwordResetToken.delete({ where: { token } });
    return NextResponse.json({ success: true, message: 'Parola a fost actualizată.' });
  } catch (e: any) {
    console.error('[reset-password] error', e?.message || e);
    return NextResponse.json({ success: false, message: 'Eroare internă.' }, { status: 500 });
  }
}