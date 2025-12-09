import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const env = {
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL || process.env.DATABASE_INTERNAL_URL),
    hasResendApiKey: Boolean(process.env.RESEND_API_KEY),
    emailFromSet: Boolean(process.env.EMAIL_FROM),
    adminEmailSet: Boolean(process.env.ADMIN_EMAIL),
    nextauthUrlSet: Boolean(process.env.NEXTAUTH_URL),
    publicBaseUrlSet: Boolean(process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL),
    oblioConfigured: Boolean(
      process.env.OBLIO_CLIENT_ID && process.env.OBLIO_CLIENT_SECRET && process.env.OBLIO_CIF_FIRMA && process.env.OBLIO_SERIE_FACTURA
    ),
    dpdConfigured: Boolean(process.env.DPD_USERNAME && process.env.DPD_PASSWORD && process.env.DPD_DEFAULT_SERVICE_ID),
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
  };

  const db = { connected: false as boolean, error: undefined as string | undefined };
  try {
    if (env.hasDatabaseUrl) {
      await prisma.$queryRaw`SELECT 1 as x`;
      db.connected = true;
    }
  } catch (e: any) {
    db.error = e?.message || String(e);
  }

  const notes: string[] = [];
  if (!env.hasDatabaseUrl) notes.push('DATABASE_URL lipsă în runtime. Admin nu poate salva comenzi.');
  if (!env.hasResendApiKey) notes.push('RESEND_API_KEY lipsă. Emailurile nu se trimit.');
  if (!env.emailFromSet) notes.push('EMAIL_FROM lipsă. Setează adresa expeditorului.');
  if (!env.adminEmailSet) notes.push('ADMIN_EMAIL lipsă. Setează adresa de primire pentru admin.');

  return NextResponse.json({ ok: true, env, db, notes });
}
