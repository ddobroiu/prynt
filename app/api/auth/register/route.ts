import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, message: 'Email invalid.' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ success: false, message: 'Parola trebuie să aibă minim 8 caractere.' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Există deja un cont cu acest email.' }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name: (typeof name === 'string' && name.trim()) ? name.trim() : undefined,
        passwordHash,
      },
    });
    // Trimite email de bun venit / confirmare cont
    try {
      const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
      if (resend) {
        const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || 'https://www.prynt.ro';
        const html = `
          <div style="font-family:sans-serif; background:#f7f7fb; padding:24px;">
            <div style="max-width:640px; margin:auto; background:#ffffff; border-radius:10px; padding:24px;">
              <h1 style="margin:0 0 12px; color:#111;">Bun venit la Prynt!</h1>
              <p style="margin:0 0 12px; color:#444;">Ți-am creat contul cu adresa <strong>${email}</strong>.</p>
              <p style="margin:0 0 16px; color:#444;">Te poți autentifica oricând pentru a urmări comenzile tale și pentru a salva datele de facturare.</p>
              <p style="margin:0;">
                <a href="${base}/login" style="display:inline-block; background:#4f46e5; color:#fff; padding:10px 18px; text-decoration:none; border-radius:8px;">Autentifică-te</a>
              </p>
            </div>
          </div>`;
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'contact@prynt.ro',
          to: email,
          subject: 'Cont creat - Prynt.ro',
          html,
        });
      }
    } catch (e) {
      console.warn('[register] email welcome failed:', (e as any)?.message || e);
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('[register] error', e?.message || e);
    return NextResponse.json({ success: false, message: 'Eroare internă.' }, { status: 500 });
  }
}
