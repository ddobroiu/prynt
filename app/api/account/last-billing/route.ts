import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getAuthSession();
    const userId = (session?.user as any)?.id as string | undefined;
    if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

    // Latest order with billing
    const order = await prisma.order.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { billing: true },
    }).catch(() => null);
    if (!order?.billing) return NextResponse.json({ billing: null });

    const b = order.billing as any;
    // Normalizare structuri vechi
    const tip_factura = b.tip_factura || b.type || 'persoana_fizica';
    const response = {
      tip_factura,
      name: b.name || undefined,
      cui: b.cui || b.cif || '',
      denumire_companie: b.name || b.denumire_companie || '',
      judet: b.judet || '',
      localitate: b.localitate || '',
      strada_nr: b.strada_nr || '',
      postCode: b.postCode || '',
    };
    return NextResponse.json({ billing: response });
  } catch (e: any) {
    console.error('[GET /api/account/last-billing] error:', e?.message || e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
