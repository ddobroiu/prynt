import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: 'Neautentificat.' }, { status: 401 });
  }
  try {
    const { currentPassword, newPassword } = await req.json();
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json({ success: false, message: 'Parolă nouă invalidă (minim 8 caractere).' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
    if (!user) return NextResponse.json({ success: false, message: 'Utilizator inexistent.' }, { status: 404 });
    if (user.passwordHash) {
      // dacă are deja parolă, trebuie validată currentPassword
      if (!currentPassword || typeof currentPassword !== 'string') {
        return NextResponse.json({ success: false, message: 'Parola curentă lipsă.' }, { status: 400 });
      }
      const ok = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!ok) return NextResponse.json({ success: false, message: 'Parola curentă greșită.' }, { status: 400 });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } });
    return NextResponse.json({ success: true, message: 'Parola a fost schimbată.' });
  } catch (e: any) {
    console.error('[change-password] error', e?.message || e);
    return NextResponse.json({ success: false, message: 'Eroare internă.' }, { status: 500 });
  }
}