import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/adminSession';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Configurare S3 (DigitalOcean Spaces / AWS)
const s3 = new S3Client({
  region: process.env.DO_REGION || 'us-east-1',
  endpoint: process.env.DO_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DO_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.DO_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = req.cookies;
  const token = cookieStore.get('admin_auth')?.value;
  const session = verifyAdminSession(token);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id: orderId } = await params;
    const data = await req.formData();
    // @ts-ignore - FormData.get() exists at runtime
    const file = data.get('file') as FormDataEntryValue | null;
    // @ts-ignore - FormData.get() exists at runtime
    const orderItemId = data.get('orderItemId') as FormDataEntryValue | null;

    if (!file || typeof orderItemId !== 'string' || !(file instanceof File)) {
      return NextResponse.json({ error: 'File or Item ID missing' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `admin-uploads/${orderId}/${Date.now()}-${file.name}`;

    // Upload pe S3
    await s3.send(new PutObjectCommand({
      Bucket: process.env.DO_BUCKET,
      Key: fileName,
      Body: buffer,
      ACL: 'public-read',
      ContentType: file.type,
    }));

    const fileUrl = `${process.env.DO_CDN_URL || process.env.NEXT_PUBLIC_CDN_URL}/${fileName}`;

    // Salvăm URL-ul în baza de date (OrderItem)
    // Putem folosi câmpul 'artworkUrl' existent sau unul nou 'adminArtworkUrl'
    await prisma.orderItem.update({
      where: { id: orderItemId },
      data: {
        artworkUrl: fileUrl // Suprascriem sau adăugăm (poți crea un câmp separat dacă vrei istoric)
      }
    });

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error('[ADMIN_UPLOAD]', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}