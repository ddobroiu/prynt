import { NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || '';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body as { email?: string; password?: string };
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!SECRET) {
      console.error('AUTH_SECRET is not set');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, SECRET, { expiresIn: '1h' });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (err: any) {
    console.error('/api/auth/token error', err?.message || err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
