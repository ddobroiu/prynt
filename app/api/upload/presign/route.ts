import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Pentru S3-compatibil (Cloudflare R2, MinIO, etc.) setează AWS_S3_ENDPOINT și forcePathStyle
const s3 = new S3Client({
  region: process.env.AWS_REGION || "eu-central-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  endpoint: process.env.AWS_S3_ENDPOINT || undefined,
  forcePathStyle: !!process.env.AWS_S3_ENDPOINT,
});

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { filename, contentType } = await req.json();
    if (!filename || !contentType) {
      return NextResponse.json({ error: "filename și contentType sunt necesare" }, { status: 400 });
    }

    const sanitized = String(filename).replace(/[^\w.\-]/g, "_");
    const key = `artwork/${Date.now()}-${sanitized}`;
    const bucket = process.env.S3_BUCKET_NAME!;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      // ACL: "public-read", // de preferat folosești bucket policy în loc de ACL
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5 minute

    // URL-ul public final, dacă bucket-ul permite public read
    const objectUrl = process.env.S3_PUBLIC_BASE_URL
      ? `${process.env.S3_PUBLIC_BASE_URL}/${key}`
      : `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({ uploadUrl, objectUrl, key });
  } catch (e: any) {
    console.error("[presign] error:", e);
    return NextResponse.json({ error: e?.message ?? "Presign failed" }, { status: 500 });
  }
}