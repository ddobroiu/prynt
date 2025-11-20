// app/api/upload/route.ts (COD NOU)
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary'; // Importăm Cloudinary
import streamifier from 'streamifier'; // Necesită instalare: npm install streamifier

// Configurația Cloudinary se încarcă automat din variabilele de mediu
// CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

// Funcție utilitară pentru a transforma un Buffer/File în upload Cloudinary
const uploadStream = (buffer: Buffer, folder: string) => {
    return new Promise((resolve, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
            { folder: folder, resource_type: "auto" }, // Stocăm în folderul specificat
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(upload_stream);
    });
};


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; 
    const publicId = formData.get('publicId') as string; // Acesta va fi orderItemId

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Încărcare pe Cloudinary
    const result: any = await uploadStream(buffer, "prynt-uploads"); 

    const fileUrl = result.secure_url; // URL-ul final de la Cloudinary

    // LOGICA CRITICĂ: Dacă e grafică de produs, actualizăm OrderItem
    if (type === 'order_item_artwork' && publicId) {
        await prisma.orderItem.update({
            where: { id: publicId },
            data: { artworkUrl: fileUrl }
        });
    }

    // Aici, URL-ul se returnează către BannerConfigurator.tsx
    return NextResponse.json({ success: true, url: fileUrl });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return NextResponse.json({ error: 'Fail' }, { status: 500 });
  }
}