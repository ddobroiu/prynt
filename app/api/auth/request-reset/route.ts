import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { Resend } from 'resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, message: 'Email invalid.' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Răspundem succes pentru a nu divulga existența contului
      return NextResponse.json({ success: true, message: 'Dacă există un cont, vei primi email.' });
    }

    // Ștergem token-uri vechi
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 min
    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expires },
    });

    const base = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || 'https://www.prynt.ro';
    const resetUrl = `${base}/login/reset?token=${encodeURIComponent(token)}`;

    try {
      const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
      if (!resend) throw new Error('RESEND_API_KEY missing');
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'contact@prynt.ro',
        to: email,
        subject: 'Resetare parolă Prynt.ro',
        html: `<p>Ai solicitat resetarea parolei.</p><p><a href="${resetUrl}">Apasă aici pentru a seta o parolă nouă</a>.</p><p>Link-ul expiră în 30 de minute.</p>`,
      });
    } catch (e: any) {
      console.error('[request-reset] email error:', e?.message || e);
    }

    return NextResponse.json({ success: true, message: 'Email trimis (dacă există cont).' });
  } catch (e: any) {
    console.error('[request-reset] error', e?.message || e);
    return NextResponse.json({ success: false, message: 'Eroare internă.' }, { status: 500 });
  }
}