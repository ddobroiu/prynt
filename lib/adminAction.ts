import crypto from 'crypto';

export type AdminAction = 'validate' | 'emit_awb' | 'confirm_awb' | 'cancel_awb';

export type AdminActionPayload = {
  action: AdminAction;
  iat: number; // issued at (ms)
  exp: number; // expires at (ms)
  // minimal order/shipment info needed to create AWB
  address: {
    nume_prenume: string;
    email: string;
    telefon: string;
    judet: string;
    localitate: string;
    strada_nr: string;
    postCode?: string;
  };
  items?: { name: string; qty: number }[]; // optional to keep token short
  paymentType?: 'Ramburs' | 'Card';
  totalAmount?: number; // total order amount (RON) – used for COD when Ramburs
  // optionally carry created shipment data so we can print/send later without re-creating
  shipmentId?: string;
  parcels?: { id: string }[];
};

function getSecret(): string {
  const secret = process.env.ADMIN_ACTION_SECRET;
  if (!secret) throw new Error('Missing ADMIN_ACTION_SECRET');
  return secret;
}

function base64url(buf: Buffer): string {
  return buf.toString('base64').replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function fromBase64url(str: string): Buffer {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  const b64 = str.replaceAll('-', '+').replaceAll('_', '/') + pad;
  return Buffer.from(b64, 'base64');
}

export function signAdminAction(payload: Omit<AdminActionPayload, 'iat' | 'exp'>, ttlMinutes = 60 * 24 * 7): string {
  const now = Date.now();
  const full: AdminActionPayload = { ...payload, iat: now, exp: now + ttlMinutes * 60_000 } as AdminActionPayload;
  const json = JSON.stringify(full);
  const data = base64url(Buffer.from(json, 'utf8'));
  const hmac = crypto.createHmac('sha256', getSecret()).update(data).digest();
  const sig = base64url(hmac);
  return `${data}.${sig}`;
}

export function verifyAdminAction(token: string): AdminActionPayload | null {
  try {
    const [data, sig] = token.split('.', 2);
    if (!data || !sig) return null;
    const expected = base64url(crypto.createHmac('sha256', getSecret()).update(data).digest());
    if (expected !== sig) return null;
    const json = fromBase64url(data).toString('utf8');
    const payload = JSON.parse(json) as AdminActionPayload;
    if (!payload || typeof payload.exp !== 'number' || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function buildAdminActionUrl(baseUrl: string, token: string): string {
  const u = new URL('/api/dpd/admin-action', baseUrl);
  u.searchParams.set('token', token);
  return u.toString();
}
