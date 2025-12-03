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
  return new Promise<{ secure_url: string; public_id: string }>(async (resolve, reject) => {
    // Detect PDF by filename or buffer header
    let resourceType: 'image' | 'auto' | 'raw' | 'video' | undefined = 'auto';
    if (filename && filename.toLowerCase().endsWith('.pdf')) {
      resourceType = 'raw';
    } else {
      // Optionally, check buffer header for PDF magic number
      if (buffer.slice(0, 4).toString() === '%PDF') resourceType = 'raw';
    }
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: 'invoices',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        filename_override: filename,
        type: 'upload', // asigură acces public
      },
      (err, result) => {
        if (err || !result) return reject(err || new Error('Upload failed'));
        // Folosește secure_url, care e public
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

    let id = ctx?.params?.id as string;
    // Fallback: some runtimes may not populate ctx.params for app routes when
    // invoked in certain dev/proxy setups. Try to extract the id from the URL.
    if (!id) {
      try {
        const u = new URL(req.url);
        const m = u.pathname.match(/\/api\/admin\/order\/([^\/]+)\/upload-invoice/);
        if (m) id = m[1];
      } catch (e) {
        // ignore
      }
    }
    if (!id) return NextResponse.json({ ok: false, message: 'Missing id' }, { status: 400 });

    const form = await req.formData();
    // @ts-ignore - FormData.get() exists at runtime
    const file = form.get('file') as File | null;
    // @ts-ignore - FormData.get() exists at runtime
    const billingRaw = form.get('billing') as string | null;
    let billing = null;
    try { if (billingRaw) billing = JSON.parse(billingRaw); } catch {}

    if (!file) {
      console.warn('[admin/upload-invoice] missing file for id', id);
      return NextResponse.json({ ok: false, message: 'Lipsește fișierul' }, { status: 400 });
    }
    // Server-side validation: accept only PDF and limit size
    const maxBytes = 10 * 1024 * 1024; // 10MB
    try {
      const t = (file as any).type || '';
      const s = (file as any).size || 0;
      console.log('[admin/upload-invoice] debug:', { id, fileType: t, fileSize: s, billingProvided: !!billing });
      if (t && t !== 'application/pdf') return NextResponse.json({ ok: false, message: 'Acceptăm doar PDF', fileType: t }, { status: 400 });
      if (s && s > maxBytes) return NextResponse.json({ ok: false, message: 'Fișier prea mare (max 10MB)', fileSize: s }, { status: 413 });
    } catch (e) {
      console.warn('[admin/upload-invoice] validation error', e);
    }

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
