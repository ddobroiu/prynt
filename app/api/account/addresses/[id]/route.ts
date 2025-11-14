import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const id = params.id;
  try {
    const body = await req.json();
    const existing = await prisma.address.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data: any = {
      label: body.label ?? existing.label,
      nume: body.nume ?? existing.nume,
      telefon: body.telefon ?? existing.telefon,
      judet: body.judet ?? existing.judet,
      localitate: body.localitate ?? existing.localitate,
      strada_nr: body.strada_nr ?? existing.strada_nr,
      postCode: body.postCode ?? existing.postCode,
    };

    if (body.isDefault === true && existing.type === 'shipping') {
      await prisma.address.updateMany({ where: { userId, type: 'shipping', isDefault: true }, data: { isDefault: false } });
      data.isDefault = true;
    } else if (body.isDefault === false && existing.type === 'shipping') {
      data.isDefault = false;
    }

    const updated = await prisma.address.update({ where: { id }, data });
    return NextResponse.json({ success: true, address: updated });
  } catch (e: any) {
    console.error('[PUT /api/account/addresses/[id]] error', e?.message || e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  const userId = (session?.user as any)?.id as string | undefined;
  if (!userId) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  const id = params.id;
  try {
    const existing = await prisma.address.findFirst({ where: { id, userId } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await prisma.address.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('[DELETE /api/account/addresses/[id]] error', e?.message || e);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
