// Patch: app/api/auth/token/route.ts (Next.js App Router)
// ---
// This is a template. Replace `verifyUserCredentials` with your project's auth logic.
// Save this file as: <your-nextjs-project>/app/api/auth/token/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ success: false, message: 'Date invalide.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ success: false, message: 'Credentials invalid.' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ success: false, message: 'Credentials invalid.' }, { status: 401 });
    }

    if (!SECRET) {
      console.error('AUTH_SECRET / NEXTAUTH_SECRET not set');
      return NextResponse.json({ success: false, message: 'Server misconfigured.' }, { status: 500 });
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, SECRET, { expiresIn: '1h' });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (e: any) {
    console.error('[auth/token] error', e?.message || e);
    return NextResponse.json({ success: false, message: 'Eroare internă.' }, { status: 500 });
  }
}
