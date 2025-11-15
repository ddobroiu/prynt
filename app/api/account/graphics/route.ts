import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET: Listează graficele utilizatorului
export async function GET() {
  const session = await getAuthSession();
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  try {
    const graphics = await prisma.userGraphic.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ graphics });
  } catch (e) {
    console.error('[GET /api/account/graphics]', e);
    return NextResponse.json({ error: 'A apărut o eroare internă.' }, { status: 500 });
  }
}

// POST: Salvează metadatele unei grafice încărcate
export async function POST(req: Request) {
  const session = await getAuthSession();
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { originalName, storagePath, publicId, size, mimeType } = body;

    if (!originalName || !storagePath || !publicId || !size || !mimeType) {
      return NextResponse.json({ error: 'Datele furnizate sunt incomplete.' }, { status: 400 });
    }

    const newGraphic = await prisma.userGraphic.create({
      data: {
        userId,
        originalName,
        storagePath,
        publicId,
        size,
        mimeType,
      },
    });

    return NextResponse.json({ success: true, graphic: newGraphic }, { status: 201 });
  } catch (e) {
    console.error('[POST /api/account/graphics]', e);
    return NextResponse.json({ error: 'A apărut o eroare internă.' }, { status: 500 });
  }
}
