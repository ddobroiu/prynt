// lib/oblio.ts
let cachedToken: { access_token: string; expires_at: number } | null = null;

const API_BASE = process.env.OBLIO_API_BASE ?? 'https://www.oblio.eu/api';
const CLIENT_ID = process.env.OBLIO_CLIENT_ID!;
const CLIENT_SECRET = process.env.OBLIO_CLIENT_SECRET!;
const COMPANY_CIF_RAW = process.env.OBLIO_CIF_FIRMA!;
const SERIES = process.env.OBLIO_SERIE_FACTURA ?? 'F5';

function ensureRoPrefix(cif: string) {
  const t = cif.trim().toUpperCase();
  return t.startsWith('RO') ? t : `RO${t}`;
}

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expires_at - 30 > now) {
    return cachedToken.access_token;
  }
  const res = await fetch(`${API_BASE}/authorize/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Oblio auth failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as {
    access_token: string;
    expires_in: string | number;
  };
  cachedToken = {
    access_token: data.access_token,
    expires_at: now + Number(data.expires_in || 3600),
  };
  return cachedToken.access_token;
}

async function oblioFetch(path: string, init: RequestInit & { auth?: boolean } = {}) {
  const headers: HeadersInit = { ...(init.headers || {}) };
  if (init.auth !== false) {
    const token = await getAccessToken();
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Oblio API ${path} -> ${res.status}: ${text}`);
  }
  return res.json();
}

export type OblioInvoiceLine = {
  name: string;
  code?: string;
  qty: number;
  unitPrice: number;
  vatRate: number;
  description?: string;
  measuringUnit?: string;
  vatIncluded?: 0 | 1;
};

export type OblioClient = {
  cif?: string;
  name: string;
  rc?: string;
  address?: string;
  state?: string;
  city?: string;
  country?: string;
  email?: string;
  phone?: string;
  vatPayer?: boolean;
};

export async function createOblioInvoice(args: {
  currency: string;
  client: OblioClient;
  lines: OblioInvoiceLine[];
  issueDate?: string;
  dueDate?: string;
}): Promise<{ seriesName: string; number: string; link?: string }> {
  const cif = ensureRoPrefix(COMPANY_CIF_RAW);

  const body = {
    cif,
    seriesName: SERIES,
    currency: args.currency?.toUpperCase() || 'RON',
    language: 'RO',
    precision: 2,
    client: {
      cif: args.client.cif ? ensureRoPrefix(args.client.cif) : '',
      name: args.client.name,
      rc: args.client.rc ?? '',
      address: args.client.address ?? '',
      state: args.client.state ?? '',
      city: args.client.city ?? '',
      country: args.client.country ?? '',
      email: args.client.email ?? '',
      phone: args.client.phone ?? '',
      vatPayer: !!args.client.vatPayer,
    },
    products: args.lines.map((l) => ({
      name: l.name,
      code: l.code ?? '',
      description: l.description ?? '',
      price: l.unitPrice,
      measuringUnit: l.measuringUnit ?? 'buc',
      vatPercentage: l.vatRate,
      vatIncluded: l.vatIncluded ?? 0,
      quantity: l.qty,
      productType: 'Serviciu',
    })),
  };

  const data = await oblioFetch('/docs/invoice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const out = data?.data ?? data;
  return {
    seriesName: out.seriesName,
    number: out.number,
    link: out.link,
  };
}
