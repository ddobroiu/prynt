import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { verifyAdminSession } from '../../../../../../lib/adminSession';
import { prisma } from '../../../../../../lib/prisma';
import fs from 'fs';
import path from 'path';
import { Resend } from 'resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const DATA_DIR = path.join(process.cwd(), '.data');
const INVOICES_PATH = path.join(DATA_DIR, 'invoices.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(INVOICES_PATH)) fs.writeFileSync(INVOICES_PATH, '{}');
}

function uploadBufferToCloudinary(buffer: Buffer, filename?: string) {
  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'invoices',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        filename_override: filename,
      },
      (err, result) => {
        if (err || !result) return reject(err || new Error('Upload failed'));
        resolve({ secure_url: result.secure_url!, public_id: result.public_id! });
      }
    );
    stream.end(buffer);
  });
}

async function fileSave(id: string, data: any) {
  ensureDir();
  try {
    const raw = await fs.promises.readFile(INVOICES_PATH, 'utf8').catch(() => '{}');
    let map: Record<string, any> = {};
    try { map = JSON.parse(raw || '{}'); } catch { map = {}; }
    map[id] = { ...(map[id] || {}), ...data };
    await fs.promises.writeFile(INVOICES_PATH, JSON.stringify(map, null, 2), 'utf8');
  } catch {}
}

export async function POST(req: Request, ctx: any) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_auth')?.value;
    const session = verifyAdminSession(token);
    if (!session) return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });

    const id = ctx?.params?.id as string;
    if (!id) return NextResponse.json({ ok: false, message: 'Missing id' }, { status: 400 });

    const form = await req.formData();
    const file = form.get('file') as File | null;
    const billingRaw = form.get('billing') as string | null;
    let billing = null;
    try { if (billingRaw) billing = JSON.parse(billingRaw); } catch {}

    if (!file) return NextResponse.json({ ok: false, message: 'Lipsește fișierul' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { secure_url } = await uploadBufferToCloudinary(buffer, file.name);

    if (process.env.DATABASE_URL) {
      // update order record
      try {
        await prisma.order.update({ where: { id }, data: { invoiceLink: secure_url, billing: billing ? billing : undefined } });
      } catch (e: any) {
        console.warn('[admin/upload-invoice] DB update failed:', e?.message || e);
      }

      // notify client
      try {
        if (process.env.RESEND_API_KEY) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          // try to get order address/billing to email
          const order = await prisma.order.findUnique({ where: { id } });
          const orderAddress = (order?.address as any) || {};
          const orderBilling = (order?.billing as any) || billing || {};
          const to = (orderBilling && orderBilling.email) || orderAddress.email;
          if (to) {
            await resend.emails.send({
              from: process.env.EMAIL_FROM || 'contact@prynt.ro',
              to,
              subject: 'Factura pentru comanda ta - Prynt',
              html: `<p>Am adăugat factura pentru comanda ta. Poți descărca fișierul aici: <a href="${secure_url}">Descarcă factura</a></p>`,
            });
          }
        }
      } catch (e: any) {
        console.warn('[admin/upload-invoice] notify failed:', e?.message || e);
      }

      return NextResponse.json({ ok: true, url: secure_url });
    }

    // File fallback
    await fileSave(id, { invoiceLink: secure_url, billing: billing || null });
    return NextResponse.json({ ok: true, url: secure_url });
  } catch (e: any) {
    console.error('[admin/upload-invoice] error:', e);
    return NextResponse.json({ ok: false, message: e?.message || 'Error' }, { status: 500 });
  }
}
