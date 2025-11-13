import crypto from 'crypto';

type AdminSession = {
  role: 'admin';
  iat: number; // ms
  exp: number; // ms
};

const ALG = 'sha256';

function getSecret() {
  const s = process.env.ADMIN_ACTION_SECRET || process.env.ADMIN_PANEL_SECRET;
  if (!s) throw new Error('Missing ADMIN_ACTION_SECRET/ADMIN_PANEL_SECRET');
  return s;
}

export function signAdminSession(ttlMs = 7 * 24 * 60 * 60 * 1000) {
  const payload: AdminSession = { role: 'admin', iat: Date.now(), exp: Date.now() + ttlMs };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const h = crypto.createHmac(ALG, getSecret()).update(data).digest('base64url');
  return `${data}.${h}`;
}

export function verifyAdminSession(token: string | undefined | null): AdminSession | null {
  try {
    if (!token) return null;
    const [data, sig] = token.split('.');
    if (!data || !sig) return null;
    const expected = crypto.createHmac(ALG, getSecret()).update(data).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString()) as AdminSession;
    if (payload.exp < Date.now()) return null;
    if (payload.role !== 'admin') return null;
    return payload;
  } catch {
    return null;
  }
}
