import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(req: Request) {
  try {
    const session = await getAuthSession();
    // Verificăm structura sesiunii pentru a extrage corect ID-ul
    let userId = (session?.user as any)?.id as string | undefined;

    // Fallback: dacă getAuthSession nu a returnat sesiune, încercăm să extragem token-ul JWT
    if (!userId) {
      try {
        const token: any = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
        if (token) {
          userId = token?.id || token?.sub || undefined;
        }
      } catch (e) {
        console.warn('[PUT /api/account/details] getToken fallback failed', e);
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'Trebuie să fii autentificat pentru a efectua această acțiune.' }, { status: 401 });
    }

    const body = await req.json();
    const { name, email } = body;

    if (!name) {
      return NextResponse.json({ error: 'Numele este obligatoriu.' }, { status: 400 });
    }

    // Construim obiectul de update dinamic
    const updateData: any = { name };
    
    // Actualizăm email-ul doar dacă este trimis și este diferit de cel gol
    if (email && email.trim() !== '') {
        updateData.email = email;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    console.log(`[API Account] User updated: ${userId}`);

    return NextResponse.json({ 
        success: true, 
        user: { 
            name: updatedUser.name, 
            email: updatedUser.email 
        } 
    });

  } catch (e: any) {
    console.error('[PUT /api/account/details] error', e);
    // Gestionăm eroarea specifică Prisma pentru email duplicat
    if (e.code === 'P2002' && e.meta?.target?.includes('email')) {
      return NextResponse.json({ error: 'Această adresă de e-mail este deja asociată altui cont.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'A apărut o eroare internă la salvarea datelor.' }, { status: 500 });
  }
}