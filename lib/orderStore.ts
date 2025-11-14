import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export type Address = {
  nume_prenume: string;
  email: string;
  telefon: string;
  judet: string;
  localitate: string;
  strada_nr: string;
};

export type Billing = {
  tip_factura: 'persoana_fizica' | 'companie' | 'persoana_juridica';
  cui?: string;
  name?: string;
  judet?: string;
  localitate?: string;
  strada_nr?: string;
};

export type MarketingInfo = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landingPage?: string;
  userAgent?: string;
};

export type StoredOrder = {
  orderNo: number;
  id: string;
  createdAt: string; // ISO
  paymentType: 'Ramburs' | 'Card';
  address: Address;
  billing: Billing;
  items: Array<{ name: string; qty: number; unit: number; total: number }>;
  shippingFee: number;
  total: number;
  invoiceLink?: string | null;
  marketing?: MarketingInfo;
  userId?: string | null;
};

export type NewOrder = Omit<StoredOrder, 'id' | 'createdAt' | 'orderNo'>;

const DATA_DIR = path.join(process.cwd(), '.data');
const FILE_PATH = path.join(DATA_DIR, 'orders.jsonl');
const SEQ_PATH = path.join(DATA_DIR, 'order-seq.txt');
const SESSION_MAP_PATH = path.join(DATA_DIR, 'session-map.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE_PATH)) fs.writeFileSync(FILE_PATH, '');
}

async function nextOrderNo(): Promise<number> {
  ensureDir();
  let current = 999; // so first becomes 1000
  try {
    if (fs.existsSync(SEQ_PATH)) {
      const txt = await fs.promises.readFile(SEQ_PATH, 'utf8').catch(() => '');
      const n = parseInt((txt || '').trim(), 10);
      if (Number.isFinite(n) && n >= 999) current = n;
    } else {
      // Fallback: derive from existing orders if seq missing
      const content = await fs.promises.readFile(FILE_PATH, 'utf8').catch(() => '');
      const lines = content.split(/\r?\n/).filter(Boolean);
      let maxNo = 0;
      for (const line of lines) {
        try {
          const obj = JSON.parse(line);
          if (obj?.orderNo && Number.isFinite(obj.orderNo)) maxNo = Math.max(maxNo, obj.orderNo);
        } catch {}
      }
      if (maxNo >= 999) current = maxNo;
    }
  } catch {}
  const next = current + 1;
  await fs.promises.writeFile(SEQ_PATH, String(next), 'utf8');
  return next;
}

export async function appendOrder(input: NewOrder): Promise<StoredOrder> {
  // If DATABASE_URL exists, persist in PostgreSQL via Prisma; else fallback to file
  if (process.env.DATABASE_URL) {
    // Compute next orderNo from DB to keep continuity; fallback to 1000 series
    const last = await prisma.order.findFirst({ orderBy: { orderNo: 'desc' } }).catch(() => null);
    const orderNo = (last?.orderNo ?? 999) + 1;
    const created = await prisma.order.create({
      data: {
        orderNo,
        paymentType: input.paymentType,
        address: input.address as any,
        billing: input.billing as any,
        shippingFee: new Prisma.Decimal(input.shippingFee ?? 0),
        total: new Prisma.Decimal(input.total ?? 0),
        invoiceLink: input.invoiceLink || null,
        marketing: (input.marketing as any) || undefined,
        userId: input.userId || undefined,
        items: {
          create: (input.items || []).map((it) => ({
            name: it.name,
            qty: it.qty,
            unit: new Prisma.Decimal(it.unit ?? 0),
            total: new Prisma.Decimal(it.total ?? 0),
          })),
        },
      },
    });
    // Best-effort: update user's default shipping address with latest order address
    try {
      if (created.userId) {
        const a = input.address as any;
        // Clear previous default
        await prisma.address.updateMany({ where: { userId: created.userId, isDefault: true, type: 'shipping' }, data: { isDefault: false } });
        await prisma.address.create({
          data: {
            userId: created.userId,
            type: 'shipping',
            isDefault: true,
            nume: a.nume_prenume || null,
            telefon: a.telefon || null,
            judet: a.judet || '',
            localitate: a.localitate || '',
            strada_nr: a.strada_nr || '',
            postCode: a.postCode || null,
            label: 'Implicit',
          },
        });
      }
    } catch (e) {
      console.warn('[orderStore] address save skipped:', (e as any)?.message || e);
    }
    return {
      id: created.id,
      orderNo: created.orderNo,
      createdAt: created.createdAt.toISOString(),
      paymentType: created.paymentType as any,
      address: created.address as any,
      billing: created.billing as any,
      items: (input.items || []) as any,
      shippingFee: Number(created.shippingFee),
      total: Number(created.total),
      invoiceLink: created.invoiceLink,
      marketing: created.marketing as any,
      userId: created.userId,
    };
  }

  // File fallback (development without DB)
  ensureDir();
  const orderNo = await nextOrderNo();
  const order: StoredOrder = {
    orderNo,
    id: (globalThis as any).crypto?.randomUUID?.() || require('crypto').randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  await fs.promises.appendFile(FILE_PATH, JSON.stringify(order) + '\n', 'utf8');
  return order;
}

export async function listOrders(limit = 200): Promise<StoredOrder[]> {
  ensureDir();
  const content = await fs.promises.readFile(FILE_PATH, 'utf8').catch(() => '');
  const lines = content.split(/\r?\n/).filter(Boolean);
  const orders: StoredOrder[] = [];
  for (let i = Math.max(0, lines.length - limit); i < lines.length; i++) {
    try {
      orders.push(JSON.parse(lines[i]));
    } catch {}
  }
  // newest first
  orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return orders;
}

export async function getOrder(id: string): Promise<StoredOrder | null> {
  ensureDir();
  const content = await fs.promises.readFile(FILE_PATH, 'utf8').catch(() => '');
  const lines = content.split(/\r?\n/).filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const obj = JSON.parse(lines[i]);
      if (obj.id === id) return obj as StoredOrder;
    } catch {}
  }
  return null;
}

// Stripe session -> order mapping helpers
type SessionMap = Record<string, { orderId: string; orderNo: number; createdAt: string }>;

function ensureSessionMap(): void {
  ensureDir();
  if (!fs.existsSync(SESSION_MAP_PATH)) {
    fs.writeFileSync(SESSION_MAP_PATH, '{}', 'utf8');
  }
}

export async function mapStripeSessionToOrder(sessionId: string, orderId: string, orderNo: number): Promise<void> {
  try {
    ensureSessionMap();
    const raw = await fs.promises.readFile(SESSION_MAP_PATH, 'utf8').catch(() => '{}');
    let map: SessionMap = {};
    try { map = JSON.parse(raw || '{}'); } catch { map = {}; }
    map[sessionId] = { orderId, orderNo, createdAt: new Date().toISOString() };
    await fs.promises.writeFile(SESSION_MAP_PATH, JSON.stringify(map, null, 2), 'utf8');
  } catch (e) {
    console.warn('[orderStore] Nu pot scrie session-map:', (e as any)?.message || e);
  }
}

export async function getOrderNoByStripeSession(sessionId: string): Promise<number | undefined> {
  try {
    ensureSessionMap();
    const raw = await fs.promises.readFile(SESSION_MAP_PATH, 'utf8').catch(() => '{}');
    const map = JSON.parse(raw || '{}') as SessionMap;
    const rec = map[sessionId];
    return rec?.orderNo;
  } catch {
    return undefined;
  }
}
