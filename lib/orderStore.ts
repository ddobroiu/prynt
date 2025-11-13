import fs from 'fs';
import path from 'path';

export type Address = {
  nume_prenume: string;
  email: string;
  telefon: string;
  judet: string;
  localitate: string;
  strada_nr: string;
};

export type Billing = {
  tip_factura: 'persoana_fizica' | 'companie';
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
};

export type NewOrder = Omit<StoredOrder, 'id' | 'createdAt' | 'orderNo'>;

const DATA_DIR = path.join(process.cwd(), '.data');
const FILE_PATH = path.join(DATA_DIR, 'orders.jsonl');
const SEQ_PATH = path.join(DATA_DIR, 'order-seq.txt');

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
