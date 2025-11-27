import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  // Debugging: log incoming cookie header to verify auth cookie is sent from browser
  try {
    const cookieHeader = (req.headers && (req as any).cookies) ? undefined : req.headers.get('cookie');
    console.log('[PUT /api/account/details] Incoming Cookie header:', cookieHeader);
  } catch (e) {
    console.log('[PUT /api/account/details] Could not read cookie header', e);
  }

  const session = await getAuthSession();
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email } = body;

    if (!name) {
      return NextResponse.json({ error: 'Numele este obligatoriu.' }, { status: 400 });
    }

    // Build update payload dynamically: update name always, email only if provided
    const updateData: any = { name };
    if (email) updateData.email = email;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: { name: updatedUser.name, email: updatedUser.email } });
  } catch (e: any) {
    console.error('[PUT /api/account/details] error', e);
    // Handle potential duplicate email error from Prisma
    if (e.code === 'P2002' && e.meta?.target?.includes('email')) {
      return NextResponse.json({ error: 'Adresa de e-mail este deja folosită de alt cont.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'A apărut o eroare internă.' }, { status: 500 });
  }
}
