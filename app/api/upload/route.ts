import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/prisma'; //

const s3 = new S3Client({
  region: process.env.DO_REGION || 'us-east-1',
  endpoint: process.env.DO_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DO_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.DO_SECRET_ACCESS_KEY || '',
  },
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; 
    const publicId = formData.get('publicId') as string; // Acesta va fi orderItemId

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.DO_BUCKET,
      Key: fileName,
      Body: buffer,
      ACL: 'public-read',
      ContentType: file.type,
    }));

    const fileUrl = `${process.env.DO_CDN_URL || process.env.NEXT_PUBLIC_CDN_URL}/${fileName}`;

    // LOGICA CRITICĂ: Dacă e grafică de produs, actualizăm OrderItem
    if (type === 'order_item_artwork' && publicId) {
        await prisma.orderItem.update({
            where: { id: publicId },
            data: { artworkUrl: fileUrl }
        });
    }

    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Fail' }, { status: 500 });
  }
}