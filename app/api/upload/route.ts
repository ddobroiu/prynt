// app/api/upload/route.ts (COD NOU)
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary'; // Importăm Cloudinary
import streamifier from 'streamifier'; // Necesită instalare: npm install streamifier

// Configurația Cloudinary se încarcă automat din variabilele de mediu
// CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

// Configure Cloudinary from env if available to avoid silent failures
if (process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL) {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    } catch (e) {
        // continue - we'll report errors on upload
        console.warn('[upload] cloudinary.config failed:', e?.message || e);
    }
}

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
        let result: any = null;
        try {
            result = await uploadStream(buffer, 'prynt-uploads');
        } catch (cloudinaryError: any) {
            // Log details server-side for diagnosis, but return clean JSON
            console.error('[upload] Cloudinary error:', cloudinaryError?.message || cloudinaryError);
            const msg = cloudinaryError?.message || String(cloudinaryError);
            return NextResponse.json({ error: 'cloudinary', message: msg }, { status: 500 });
        }

        const fileUrl = result?.secure_url || result?.url || null;

        if (!fileUrl) {
            console.error('[upload] Cloudinary returned no URL, result:', result);
            return NextResponse.json({ error: 'cloudinary', message: 'No URL returned from Cloudinary' }, { status: 500 });
        }

        // LOGICA CRITICĂ: Dacă e grafică de produs, actualizăm OrderItem
        if (type === 'order_item_artwork' && publicId) {
            try {
                await prisma.orderItem.update({
                    where: { id: publicId },
                    data: { artworkUrl: fileUrl },
                });
            } catch (dbErr) {
                console.error('[upload] Failed to update orderItem:', dbErr?.message || dbErr);
                // Continue — we still return the URL to the client
            }
        }

        // Aici, URL-ul se returnează către BannerConfigurator.tsx
        return NextResponse.json({ success: true, url: fileUrl });
    } catch (error: any) {
        console.error('Cloudinary Upload Error:', error?.message || error);
        return NextResponse.json({ error: 'fail', message: error?.message || String(error) }, { status: 500 });
    }
}