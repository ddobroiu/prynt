import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const prisma = new PrismaClient();

function computeHmac(secret: string, payload: string) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function safeParseJson(s: string) {
  try {
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
}

function extractAwb(payload: any) {
  if (!payload) return null;
  return (
    payload.awb ||
    payload.awbNumber ||
    payload.parcelNumber ||
    payload.parcel?.parcelNumber ||
    payload.data?.parcel?.parcelNumber ||
    null
  );
}

function mapDpdEventToInternal(status: string) {
  if (!status) return 'unknown';
  const s = status.toLowerCase();
  if (s.includes('deliv') || s.includes('delivered')) return 'delivered';
  if (s.includes('out') || s.includes('out_for_delivery') || s.includes('on delivery')) return 'out_for_delivery';
  if (s.includes('pickup') || s.includes('collected') || s.includes('picked')) return 'picked_up';
  if (s.includes('in transit') || s.includes('transit') || s.includes('in_transit')) return 'in_transit';
  if (s.includes('exception') || s.includes('problem') || s.includes('failed')) return 'exception';
  return 'unknown';
}

async function appendLog(awb: string | null, raw: string, parsed: any) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    const logFile = path.join(dataDir, 'dpd-webhooks.log');
    const entry = { at: new Date().toISOString(), awb, parsed };
    fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');

    if (awb) {
      const trackingDir = path.join(dataDir, 'tracking');
      if (!fs.existsSync(trackingDir)) fs.mkdirSync(trackingDir, { recursive: true });
      const file = path.join(trackingDir, `${awb}.json`);
      let current = { awb, history: [] as any[] };
      if (fs.existsSync(file)) {
        try {
          current = JSON.parse(fs.readFileSync(file, 'utf8'));
        } catch (e) {
          // ignore parse errors and overwrite
        }
      }
      current.history.push({ at: new Date().toISOString(), payload: parsed });
      // Keep only recent 50 entries
      if (current.history.length > 50) current.history = current.history.slice(-50);
      fs.writeFileSync(file, JSON.stringify(current, null, 2));
    }
  } catch (e) {
    console.error('Failed to append DPD webhook log', e);
  }
}

export async function POST(req: Request) {
  const raw = await req.text();
  const parsed = safeParseJson(raw) || {};

  // Optional signature verification: if DPD_WEBHOOK_SECRET is set, expect header 'x-dpd-signature' with HMAC SHA256 hex
  const secret = process.env.DPD_WEBHOOK_SECRET;
  if (secret) {
    const sigHeader = (req.headers.get('x-dpd-signature') || req.headers.get('x-signature') || '').trim();
    if (!sigHeader) {
      console.warn('DPD webhook missing signature header');
      return NextResponse.json({ ok: false, message: 'missing signature' }, { status: 401 });
    }
    const expected = computeHmac(secret, raw);
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sigHeader))) {
      console.warn('DPD webhook signature mismatch');
      return NextResponse.json({ ok: false, message: 'invalid signature' }, { status: 401 });
    }
  }

  const awb = extractAwb(parsed);
  await appendLog(awb, raw, parsed);

  // Try to find an order with this AWB and note that we received an update (do not change status automatically)
  try {
    if (awb) {
      const order = await prisma.order.findFirst({ where: { awbNumber: awb } });
      if (order) {
        // Map event if present and store an internal note (non-destructive): create OrderNote if model exists
        const event = parsed.event || parsed.status || parsed.state || parsed.currentStatus || null;
        const mapped = mapDpdEventToInternal(String(event || ''));

        // We will record a lightweight note in the DB if an `orderNote`/`notes` relationship exists —
        // to avoid schema assumptions we do a defensive attempt to update a `lastDeliveryStatus` string field if present.
        try {
          await prisma.$executeRawUnsafe(`UPDATE "Order" SET "lastDeliveryStatus" = $1 WHERE id = $2`, mapped, order.id);
        } catch (e) {
          // field may not exist; ignore
        }

        // Revalidate admin orders listing and order page (best-effort)
        try {
          revalidatePath('/admin/orders');
        } catch (e) {}
        try {
          revalidatePath(`/admin/orders/${order.id}`);
        } catch (e) {}
      }
    }
  } catch (e) {
    console.error('Error processing DPD webhook:', e);
  }

  return NextResponse.json({ ok: true });
}
