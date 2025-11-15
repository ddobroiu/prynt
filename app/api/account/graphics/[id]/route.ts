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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  const userId = (session?.user as any)?.id as string | undefined;
  const { id } = params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: 'ID-ul graficii lipsește.' }, { status: 400 });
  }

  try {
    // Find the graphic to ensure it belongs to the user and to get the public_id
    const graphic = await prisma.userGraphic.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!graphic) {
      return NextResponse.json({ error: 'Grafica nu a fost găsită sau nu ai permisiunea să o ștergi.' }, { status: 404 });
    }

    // Step 1: Delete from Cloudinary
    await cloudinary.uploader.destroy(graphic.publicId);

    // Step 2: Delete from our database
    await prisma.userGraphic.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(`[DELETE /api/account/graphics/${id}]`, e);
    return NextResponse.json({ error: 'A apărut o eroare internă.' }, { status: 500 });
  }
}
