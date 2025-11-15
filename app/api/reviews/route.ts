import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET: Preluare recenzii pentru un produs
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productSlug = searchParams.get('productSlug');

  if (!productSlug) {
    return NextResponse.json({ error: 'Lipsește "productSlug".' }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { productSlug },
      include: {
        user: {
          select: { name: true, image: true }, // Selectăm doar datele publice ale utilizatorului
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ reviews });
  } catch (e) {
    console.error(`[GET /api/reviews?productSlug=${productSlug}]`, e);
    return NextResponse.json({ error: 'A apărut o eroare internă.' }, { status: 500 });
  }
}

// POST: Adăugare recenzie nouă
export async function POST(req: Request) {
  const session = await getAuthSession();
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: 'Trebuie să fii autentificat pentru a lăsa o recenzie.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { rating, title, content, productSlug } = body;

    if (!rating || !content || !productSlug) {
      return NextResponse.json({ error: 'Rating-ul, conținutul și slug-ul produsului sunt obligatorii.' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating-ul trebuie să fie între 1 și 5.' }, { status: 400 });
    }

    const newReview = await prisma.review.create({
      data: {
        userId,
        productSlug,
        rating,
        title,
        content,
      },
    });

    return NextResponse.json({ success: true, review: newReview }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/reviews]', e);
    return NextResponse.json({ error: 'A apărut o eroare internă.' }, { status: 500 });
  }
}
