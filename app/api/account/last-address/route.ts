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

    // Prefer default shipping address
    const addr = await prisma.address.findFirst({
      where: { userId, OR: [{ type: 'shipping' }, { type: null }] },
      orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
    }).catch(() => null);

    if (addr) {
      return NextResponse.json({
        address: {
          nume_prenume: addr.nume || '',
          email: session?.user?.email || '',
          telefon: addr.telefon || '',
          judet: addr.judet || '',
          localitate: addr.localitate || '',
          strada_nr: addr.strada_nr || '',
          postCode: addr.postCode || undefined,
          // Detalii de bloc pot exista doar în ultima comandă, modelul Address nu le stochează
        },
      });
    }

    // Fallback: last order's address
    const lastOrder = await prisma.order.findFirst({ where: { userId }, orderBy: { createdAt: 'desc' } }).catch(() => null);
    if (lastOrder?.address) {
      const a = lastOrder.address as any;
      return NextResponse.json({
        address: {
          nume_prenume: a.nume_prenume || '',
          email: a.email || session?.user?.email || '',
          telefon: a.telefon || '',
          judet: a.judet || '',
          localitate: a.localitate || '',
          strada_nr: a.strada_nr || '',
          postCode: a.postCode || undefined,
          bloc: a.bloc || undefined,
          scara: a.scara || undefined,
          etaj: a.etaj || undefined,
          ap: a.ap || undefined,
          interfon: a.interfon || undefined,
        },
      });
    }

    return NextResponse.json({ address: null });
  } catch (e: any) {
    console.error('[GET /api/account/last-address] error:', e?.message || e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
