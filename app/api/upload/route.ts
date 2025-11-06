import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

// Config Cloudinary din ENV (setate în Railway → Variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

function uploadBufferToCloudinary(
  buffer: Buffer,
  filename?: string
): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",     // acceptă image/pdf/ai/psd etc.
        folder: "artwork",         // folderezi fișierele
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        filename_override: filename,
      },
      (err, result) => {
        if (err || !result) return reject(err || new Error("Upload failed"));
        resolve({ secure_url: result.secure_url!, public_id: result.public_id! });
      }
    );
    stream.end(buffer);
  });
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Lipsește fișierul" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { secure_url, public_id } = await uploadBufferToCloudinary(buffer, file.name);

    // întoarcem URL-ul public; pagina /banner îl arată și îl pune în coș
    return NextResponse.json({ url: secure_url, public_id });
  } catch (e: any) {
    console.error("[cloudinary upload] error:", e);
    return NextResponse.json({ error: e?.message ?? "Upload failed" }, { status: 500 });
  }
}