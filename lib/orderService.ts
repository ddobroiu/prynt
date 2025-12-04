import { Resend } from 'resend';
import { signAdminAction } from './adminAction';
import { appendOrder } from './orderStore';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

type AnyRecord = Record<string, unknown>;

interface CartItem {
  id?: string;
  name?: string;
  title?: string;
  slug?: string;
  quantity?: number;
  unitAmount?: number; 
  price?: number; 
  totalAmount?: number;
  artworkUrl?: string; 
  textDesign?: string; 
  metadata?: AnyRecord;
  designOption?: string; 
}

interface Address {
  nume_prenume: string;
  email: string;
  telefon: string;
  judet: string;
  localitate: string;
  strada_nr: string;
  postCode?: string;
  bloc?: string;
  scara?: string;
  etaj?: string;
  ap?: string;
  interfon?: string;
}

interface Billing {
  tip_factura: 'persoana_fizica' | 'companie' | 'persoana_juridica';
  cui?: string;
  reg_com?: string; // Adăugat pentru persoane juridice
  denumire_companie?: string; // Adăugat pentru persoane juridice
  name?: string;
  email?: string;
  telefon?: string;
  phone?: string;
  judet?: string;
  localitate?: string;
  strada_nr?: string;
  postCode?: string;
  bloc?: string;
  scara?: string;
  etaj?: string;
  ap?: string;
  interfon?: string;
}

interface MarketingInfo {
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
}

const SHIPPING_FEE = 19.99;
const FREE_SHIPPING_THRESHOLD = 500;

// Cache token Oblio
let oblioTokenCache: { token: string; expiresAt: number } | null = null;

async function getOblioAccessToken() {
  const now = Date.now();
  if (oblioTokenCache && oblioTokenCache.expiresAt > now) return oblioTokenCache.token;

  const params = new URLSearchParams({
    client_id: process.env.OBLIO_CLIENT_ID!,
    client_secret: process.env.OBLIO_CLIENT_SECRET!,
    grant_type: 'client_credentials',
  });

  const response = await fetch('https://www.oblio.eu/api/authorize/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Eroare obținere token Oblio: ${response.status}. Răspuns: ${err}`);
  }
  const data = (await response.json()) as { access_token?: string; expires_in?: string };
  if (!data.access_token) throw new Error('Token API Oblio invalid.');

  const expiresIn = parseInt(data.expires_in || '3600', 10);
  oblioTokenCache = { token: data.access_token, expiresAt: now + expiresIn * 1000 - 60000 };
  return data.access_token;
}

function formatRON(n: number) {
  return n.toFixed(2);
}

function escapeHtml(str: string) {
  return String(str || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function apartmentLineText(src: { bloc?: string; scara?: string; etaj?: string; ap?: string; interfon?: string }): string {
  const parts: string[] = [];
  if (src.bloc) parts.push('Bloc ' + src.bloc);
  if (src.scara) parts.push('Sc. ' + src.scara);
  if (src.etaj) parts.push('Et. ' + src.etaj);
  if (src.ap) parts.push('Ap. ' + src.ap);
  if (src.interfon) parts.push('Interfon ' + src.interfon);
  return parts.join(', ');
}

function buildAddressLine(
  src: { judet?: string; localitate?: string; strada_nr?: string } | undefined,
  fallback: { judet: string; localitate: string; strada_nr: string }
) {
  const j = src?.judet || fallback.judet;
  const l = src?.localitate || fallback.localitate;
  const s = src?.strada_nr || fallback.strada_nr;
  return [s, l, j].filter(Boolean).join(', ');
}

async function createOblioInvoice(payload: unknown, token: string) {
  const endpoints = [
    'https://www.oblio.eu/api/invoices',
    'https://www.oblio.eu/api/invoice',
    'https://www.oblio.eu/api/1.0/invoices',
    'https://www.oblio.eu/api/docs/invoice',
  ];
  let lastErr: unknown = null;
  for (const url of endpoints) {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const ct = resp.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const json = await resp.json();
        return { ...json, _endpoint: url };
      }
      const text = await resp.text();
      lastErr = new Error(`Oblio non-JSON (${resp.status}) @ ${url}: ${text.slice(0, 200)}`);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('Oblio: nu s-a putut emite factura (fără răspuns valid)');
}

function normalizeCUI(input?: string): { primary?: string; alternate?: string } {
  if (!input) return {};
  let raw = String(input).trim().toUpperCase();
  raw = raw.replace(/\s|-/g, '');
  const digits = raw.replace(/\D/g, '');
  const hasRO = /^RO\d+$/i.test(raw);
  const primary = hasRO ? raw : digits;
  const alternate = hasRO ? digits : (digits ? `RO${digits}` : undefined);
  return { primary, alternate };
}

async function sendEmails(
  address: Address,
  billing: Billing,
  cart: CartItem[],
  invoiceLink: string | null,
  paymentType: 'Ramburs' | 'Card',
  marketing?: MarketingInfo,
  orderNo?: number,
  createdPassword?: string,
  orderId?: string
) {
  const normalized = cart.map((raw) => {
    const qty = Number(raw.quantity ?? 1) || 1;
    const unit = Number(raw.unitAmount ?? raw.price ?? (raw.metadata?.price ?? 0)) || 0;
    const total = Number(raw.totalAmount ?? (unit > 0 ? unit * qty : raw.metadata?.totalAmount ?? 0)) || 0;
    const artwork = raw.artworkUrl ?? raw.metadata?.artworkUrl ?? raw.metadata?.artworkLink ?? raw.metadata?.artwork ?? null;
    const textDesign = raw.textDesign ?? raw.metadata?.textDesign ?? raw.metadata?.text ?? null;
    const name = raw.name ?? raw.title ?? raw.metadata?.title ?? raw.slug ?? 'Produs';
    return { ...raw, name, qty, unit, total, artwork, textDesign, rawMetadata: raw.metadata ?? {} };
  });

  const subtotal = normalized.reduce((acc, it) => acc + (Number(it.total) || 0), 0);
  const shippingFeeForEmail = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const totalComanda = subtotal + shippingFeeForEmail;

  function formatYesNo(v: unknown): string {
    if (typeof v === 'boolean') return v ? 'Da' : 'Nu';
    if (typeof v === 'string') {
      const t = v.toLowerCase();
      if (['true', 'da', 'yes', 'y', '1'].includes(t)) return 'Da';
      if (['false', 'nu', 'no', 'n', '0'].includes(t)) return 'Nu';
    }
    return String(v);
  }

  const labelForKey: Record<string, string> = {
    width: 'Lățime (cm)',
    height: 'Înălțime (cm)',
    width_cm: 'Lățime (cm)',
    height_cm: 'Înălțime (cm)',
    totalSqm: 'Suprafață totală (m²)',
    sqmPerUnit: 'm²/buc',
    pricePerSqm: 'Preț pe m² (RON)',
    materialId: 'Material',
    want_hem_and_grommets: 'Tiv și capse',
    want_wind_holes: 'Găuri pentru vânt',
    designOption: 'Grafică',
    want_adhesive: 'Adeziv',
    material: 'Material',
    laminated: 'Laminare',
    shape_diecut: 'Tăiere la contur',
    productType: 'Tip panou',
    thickness_mm: 'Grosime (mm)',
    sameGraphicFrontBack: 'Aceeași grafică față/spate',
    framed: 'Șasiu',
    sizeKey: 'Dimensiune preset',
    mode: 'Mod canvas',
    orderNotes: 'Observații',
  };

  function prettyValue(k: string, v: unknown): string {
    if (k === 'materialId') return v === 'frontlit_510' ? 'Frontlit 510g' : v === 'frontlit_440' ? 'Frontlit 440g' : String(v);
    if (k === 'productType') return v === 'alucobond' ? 'Alucobond' : v === 'polipropilena' ? 'Polipropilenă' : v === 'pvc-forex' ? 'PVC Forex' : String(v);
    if (k === 'designOption') return v === 'pro' ? 'Pro' : v === 'upload' ? 'Am fișier' : v === 'text_only' ? 'Text' : String(v);
    if (k === 'framed') return formatYesNo(v);
    if (typeof v === 'boolean') return formatYesNo(v);
    return String(v);
  }

  function buildDetailsHTML(item: AnyRecord) {
    const details: string[] = [];
    const itemAny = item as any;
    const width = itemAny.width ?? itemAny.width_cm ?? itemAny.rawMetadata?.width_cm ?? itemAny.rawMetadata?.width;
    const height = itemAny.height ?? itemAny.height_cm ?? itemAny.rawMetadata?.height_cm ?? itemAny.rawMetadata?.height;
    if (width || height) {
      details.push(`<div><strong>Dimensiune:</strong> ${escapeHtml(String(width || '—'))} x ${escapeHtml(String(height || '—'))} cm</div>`);
    }
    const meta = (item.rawMetadata || {}) as any;
    const knownKeys = Object.keys(labelForKey).filter((k) => meta[k] !== undefined);
    knownKeys.forEach((k) => {
      const label = labelForKey[k];
      const val = prettyValue(k, meta[k]);
      details.push(`<div><strong>${escapeHtml(label)}:</strong> ${escapeHtml(val)}</div>`);
    });
    ['sqmPerUnit', 'totalSqm', 'pricePerSqm'].forEach((k) => {
      if (!knownKeys.includes(k) && meta[k] !== undefined) {
        const label = labelForKey[k] || k;
        details.push(`<div><strong>${escapeHtml(label)}:</strong> ${escapeHtml(String(meta[k]))}</div>`);
      }
    });
    const exclude = new Set(['price', 'totalAmount', 'qty', 'quantity', 'artwork', 'artworkUrl', 'artworkLink', 'text', 'textDesign', 'selectedReadable', 'selections', 'title', 'name']);
    const leftovers = Object.keys(meta).filter((k) => !knownKeys.includes(k) && !exclude.has(k));
    leftovers.forEach((k) => {
      const v = meta[k];
      details.push(`<div><strong>${escapeHtml(k)}:</strong> ${escapeHtml(String(v))}</div>`);
    });
    if (itemAny.artwork) {
      details.push(`<div><strong>Fișier:</strong> <a href="${escapeHtml(String(itemAny.artwork))}" target="_blank" rel="noopener noreferrer">link</a></div>`);
    }
    if (itemAny.textDesign) {
      details.push(`<div><strong>Text:</strong> <em>${escapeHtml(String(itemAny.textDesign))}</em></div>`);
    }
    if (details.length === 0) return '';
    return `<div style="margin-top:6px;padding:8px 10px;background:#fafafa;border:1px solid #eee;border-radius:6px;color:#333">${details.join('')}</div>`;
  }

  const produseListHTML = normalized
    .map((item) => {
      const escapedName = escapeHtml(String(item.name));
      const line = `${escapedName} - <strong>${item.qty} buc.</strong> - ${formatRON(Number(item.total) || 0)} RON`;
      const detailsBlock = buildDetailsHTML(item);
      return `<li style="margin-bottom:12px;">${line}${detailsBlock}</li>`;
    })
    .join('');

  const isCompany = billing && (billing.tip_factura === 'persoana_juridica' || billing.tip_factura === 'companie');
  const contactName = isCompany ? (billing.denumire_companie || billing.name || billing.cui || address.nume_prenume) : (address.nume_prenume || billing.name || '');
  const contactEmail = isCompany ? (billing.email || address.email) : (address.email || billing.email || '');
  const contactPhone = isCompany ? (billing.telefon || billing.phone || address.telefon) : (address.telefon || billing.telefon || '');
  const contactAddressLine = isCompany
    ? buildAddressLine({ judet: billing.judet, localitate: billing.localitate, strada_nr: billing.strada_nr }, { judet: address.judet, localitate: address.localitate, strada_nr: address.strada_nr })
    : buildAddressLine({ judet: address.judet, localitate: address.localitate, strada_nr: address.strada_nr }, { judet: address.judet, localitate: address.localitate, strada_nr: address.strada_nr });

  let actionButtons = '';
  try {
    if (process.env.ADMIN_ACTION_SECRET && process.env.DPD_DEFAULT_SERVICE_ID) {
      const tokenEdit = signAdminAction({
        action: 'edit',
        address,
        paymentType,
        totalAmount: totalComanda,
        orderId: orderId || undefined,
      });
      const tokenConfirm = signAdminAction({
        action: 'confirm_awb',
        address,
        paymentType,
        totalAmount: totalComanda,
        orderId: orderId || undefined,
      });
      const baseUrl = process.env.PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.prynt.ro';
      const defaultSid = encodeURIComponent(String(process.env.DPD_DEFAULT_SERVICE_ID));
      const urlEdit = `${baseUrl}/api/dpd/admin-action?token=${encodeURIComponent(tokenEdit)}&sid=${defaultSid}`;
      const urlConfirm = `${baseUrl}/api/dpd/admin-action?token=${encodeURIComponent(tokenConfirm)}&sid=${defaultSid}`;
      actionButtons = `
        <div style="margin:20px 0; text-align:center;">
          <a href="${urlConfirm}" style="display:inline-block; background:#16a34a; color:#fff; padding:10px 16px; border-radius:8px; text-decoration:none; margin-right:8px;">Validează și trimite</a>
          <a href="${urlEdit}" style="display:inline-block; background:#0ea5e9; color:#fff; padding:10px 16px; border-radius:8px; text-decoration:none;">Editează AWB</a>
        </div>`;
    }
  } catch (e) {
    console.warn('[OrderService] Quick actions disabled:', (e as any)?.message || e);
  }

  function sourceLabel(m?: MarketingInfo) {
    if (!m) return '—';
    if (m.utmSource) return m.utmSource;
    try {
      if (m.referrer) {
        const u = new URL(m.referrer);
        return u.hostname.replace(/^www\./, '');
      }
    } catch (err) {}
    return 'direct';
  }

  const mkLines: string[] = [];
  if (marketing?.utmSource) mkLines.push(`<div><strong>utm_source:</strong> ${escapeHtml(marketing.utmSource)}</div>`);
  if (marketing?.utmMedium) mkLines.push(`<div><strong>utm_medium:</strong> ${escapeHtml(marketing.utmMedium)}</div>`);
  if (marketing?.utmCampaign) mkLines.push(`<div><strong>utm_campaign:</strong> ${escapeHtml(marketing.utmCampaign)}</div>`);
  if (marketing?.utmContent) mkLines.push(`<div><strong>utm_content:</strong> ${escapeHtml(marketing.utmContent)}</div>`);
  if (marketing?.utmTerm) mkLines.push(`<div><strong>utm_term:</strong> ${escapeHtml(marketing.utmTerm)}</div>`);
  if (marketing?.gclid) mkLines.push(`<div><strong>gclid:</strong> ${escapeHtml(marketing.gclid)}</div>`);
  if (marketing?.fbclid) mkLines.push(`<div><strong>fbclid:</strong> ${escapeHtml(marketing.fbclid)}</div>`);
  if (marketing?.referrer) mkLines.push(`<div><strong>referrer:</strong> ${escapeHtml(marketing.referrer)}</div>`);
  if (marketing?.landingPage) mkLines.push(`<div><strong>landing:</strong> ${escapeHtml(marketing.landingPage)}</div>`);
  const marketingBlock = `
    <div style="margin-top:16px;padding:10px 12px;background:#fafafa;border:1px solid #eee;border-radius:8px;color:#333;">
      <div style="font-weight:600;margin-bottom:6px;">Sursă trafic: ${escapeHtml(sourceLabel(marketing))}</div>
      <div style="font-size:12px;line-height:1.5;color:#555;">${mkLines.join('')}</div>
    </div>
  `;

  const orderNoSuffix = orderNo ? ' #' + orderNo : '';
  const deliveryAptHtml = (address.bloc || address.scara || address.etaj || address.ap || address.interfon)
    ? `<p class="muted" style="margin:4px 0 0;color:#64748b;font-size:13px">${escapeHtml(apartmentLineText(address))}</p>`
    : '';
  const invoiceBlock = invoiceLink
    ? `<p style="text-align: center; margin-top: 20px;"><a href="${invoiceLink}" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Vezi Factura Oblio</a></p>`
    : `<p style=\"text-align:center;margin-top:20px;color:#b54708\">Factura va fi emisă manual în Oblio (client: ${escapeHtml(String(isCompany ? (billing.denumire_companie ?? billing.cui ?? '') : (billing.name ?? address.nume_prenume ?? '')))}).</p>`;

  let billingBlockAdmin = '';
  if (isCompany) {
      billingBlockAdmin = `
        <p><strong>Tip:</strong> Companie</p>
        <p><strong>Companie:</strong> ${escapeHtml(billing.denumire_companie ?? '')}</p>
        <p><strong>CUI:</strong> ${escapeHtml(billing.cui ?? '')}</p>
        ${billing.reg_com ? `<p><strong>Reg. Com:</strong> ${escapeHtml(billing.reg_com)}</p>` : ''}
      `;
  } else {
      billingBlockAdmin = `
        <p><strong>Tip:</strong> Persoană Fizică</p>
        <p><strong>Nume Factură:</strong> ${escapeHtml(billing.name ?? address.nume_prenume)}</p>
      `;
  }

  const adminHtml = `
    <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 640px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
        <h1 style="color: #333; margin: 0 0 12px;">Comandă Nouă (${paymentType})</h1>

        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #555; margin-top: 20px;">Date Client</h2>
        <p><strong>Nume:</strong> ${escapeHtml(contactName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(contactEmail)}</p>
        <p><strong>Telefon:</strong> ${escapeHtml(contactPhone)}</p>

        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #555; margin-top: 20px;">Adresă Livrare / Facturare</h2>
        <p>${escapeHtml(contactAddressLine)}${address.postCode ? ', ' + escapeHtml(address.postCode) : ''}</p>
        ${isCompany ? '' : deliveryAptHtml}

        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #555; margin-top: 20px;">Detalii Facturare</h2>
        ${billingBlockAdmin}

        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #555; margin-top: 20px;">Produse Comandate</h2>
        <ul style="padding-left: 18px;">
          ${produseListHTML}
        </ul>

        <div style="border-top: 1px solid #eee; margin: 16px 0; padding-top: 12px;">
          <p style="margin: 4px 0; color: #333;">Taxă livrare: ${formatRON(shippingFeeForEmail)} RON</p>
          <h3 style="text-align: right; color: #111; margin: 8px 0 0;">Total Comandă: ${formatRON(totalComanda)} RON</h3>
        </div>

        ${actionButtons || ''}

        ${marketingBlock}

        ${invoiceBlock}
      </div>
    </div>
  `;

  try {
    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    if (!resend) throw new Error('RESEND_API_KEY lipsă');
    const adminResp = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'contact@prynt.ro',
      to: process.env.ADMIN_EMAIL || 'contact@prynt.ro',
      subject: `Comandă${orderNoSuffix} (${paymentType}) - ${escapeHtml(address.nume_prenume)}`,
      html: adminHtml,
    });
    console.log('[OrderService] Admin email sent, resend response:', adminResp);
  } catch (e: any) {
    console.error('[OrderService] Eroare trimitere email admin:', e?.message || e);
  }

  const accountBlock = createdPassword
    ? `
        <h2 style="border-bottom:1px solid #eee; padding-bottom:8px; color:#333; margin-top:18px;">Cont creat</h2>
        <p style="margin:4px 0;">Ți-am creat automat un cont pe Prynt.ro cu acest email.</p>
        <p style="margin:4px 0;">Parola inițială: <strong>${escapeHtml(createdPassword)}</strong></p>
        <p style="margin:4px 0; font-size:12px; color:#555;">Te rugăm să te autentifici și să schimbi parola din secțiunea contului pentru siguranță.</p>
      `
    : '';

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || 'https://www.prynt.ro';
  const orderLink = orderId ? `${baseUrl}/account/orders/${encodeURIComponent(orderId)}` : `${baseUrl}/account/orders`;
  const preheader = 'Mulțumim pentru comandă' + orderNoSuffix + '!'; 
  const clientInvoiceBtn = invoiceLink ? `<a href="${invoiceLink}" class="btn" style="background:#16a34a;color:#fff !important;text-decoration:none;padding:12px 16px;border-radius:10px;display:inline-block">Descarcă factura</a>` : '';
  const clientAptHtml = (address.bloc || address.scara || address.etaj || address.ap || address.interfon)
    ? `<p class="muted" style="margin:4px 0 0;color:#64748b;font-size:13px">${escapeHtml(apartmentLineText(address))}</p>`
    : '';
  
  let billingBlockClient = '';
  if (isCompany) {
      billingBlockClient = `
        <p style="margin:0;color:#111"><strong>Tip:</strong> Companie</p>
        <p style="margin:4px 0 0;color:#111"><strong>Companie:</strong> ${escapeHtml(billing.denumire_companie ?? '')}</p>
        <p style="margin:2px 0 0;color:#111"><strong>CUI:</strong> ${escapeHtml(billing.cui ?? '')}</p>
      `;
  } else {
      billingBlockClient = `
        <p style="margin:0;color:#111"><strong>Tip:</strong> Persoană fizică</p>
        <p style="margin:4px 0 0;color:#111"><strong>Nume factură:</strong> ${escapeHtml(billing.name ?? address.nume_prenume)}</p>
      `;
  }

  const clientHtml = `
  <!DOCTYPE html>
  <html lang="ro">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Confirmare comandă${orderNoSuffix}</title>
    <style>
      @media (max-width: 600px){
        .container{padding:16px !important}
        .card{padding:16px !important}
        .grid{display:block !important}
        .col{width:100% !important; display:block !important; margin-bottom:12px !important}
      }
      a.btn{background:#4f46e5;color:#fff !important;text-decoration:none;padding:12px 16px;border-radius:10px;display:inline-block}
      .muted{color:#6b7280}
    </style>
  </head>
  <body style="margin:0;background:#f7f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
    <span style="display:none !important; visibility:hidden; opacity:0; height:0; width:0; overflow:hidden;">${escapeHtml(preheader)}</span>
    <div class="container" style="max-width:680px;margin:0 auto;padding:24px;">
      <div style="text-align:center; padding:18px 0 10px;">
        <a href="${baseUrl}" style="text-decoration:none;">
          <img src="${baseUrl}/logo.jpg" alt="Prynt.ro" style="height:40px;width:auto;" />
        </a>
      </div>
      <div style="height:4px;background:linear-gradient(90deg,#4f46e5,#22d3ee);border-radius:999px;margin:8px 0 20px;"></div>
      <div class="card" style="background:#ffffff;border-radius:16px;padding:24px;border:1px solid #e5e7eb;">
        <h1 style="margin:0;color:#0f172a;font-size:22px;">Mulțumim pentru comandă!</h1>
        <p style="margin:8px 0 12px;color:#334155">Am primit comanda ta și am început procesarea. Mai jos ai un rezumat.</p>
        ${orderNo ? '<p style="margin:0 0 12px;color:#111;"><strong>Nr. comandă:</strong> #' + orderNo + '</p>' : ''}
        ${accountBlock}
        <div class="grid" style="display:flex;gap:16px;margin-top:12px;">
            <div class="col" style="flex:1;min-width:0;">
              <h3 style="margin:0 0 8px;color:#0f172a;font-size:14px;text-transform:uppercase;letter-spacing:.04em;">Livrare / Facturare</h3>
              <p style="margin:0;color:#111;font-weight:600;">${escapeHtml(contactName)}</p>
              <p class="muted" style="margin:2px 0 0;color:#64748b;font-size:13px">${escapeHtml(contactEmail)} • ${escapeHtml(contactPhone)}</p>
              <p style="margin:6px 0 0;color:#111">${escapeHtml(contactAddressLine)}${address.postCode ? ', ' + escapeHtml(address.postCode) : ''}</p>
              ${isCompany ? '' : clientAptHtml}
            </div>
             <div class="col" style="flex:1;min-width:0;background:#f8fafc;padding:12px;border-radius:8px;">
                <h3 style="margin:0 0 8px;color:#0f172a;font-size:14px;text-transform:uppercase;letter-spacing:.04em;">Date Factură</h3>
                ${billingBlockClient}
            </div>
        </div>
        <h3 style="margin:16px 0 8px;color:#0f172a;font-size:14px;text-transform:uppercase;letter-spacing:.04em;">Produse</h3>
        <ul style="margin:0;padding:0;list-style:none;">
          ${produseListHTML}
        </ul>
        <div style="border-top:1px solid #e5e7eb;margin:16px 0 0;padding-top:12px;display:flex;justify-content:space-between;align-items:center;">
          <div class="muted" style="color:#64748b;font-size:14px;">Taxă livrare: ${formatRON(shippingFeeForEmail)} RON</div>
          <div style="font-size:18px;font-weight:800;color:#0f172a;">Total: ${formatRON(totalComanda)} RON</div>
        </div>
        <div style="text-align:center;margin-top:18px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
          <a href="${orderLink}" class="btn" style="background:#4f46e5;color:#fff !important;text-decoration:none;padding:12px 16px;border-radius:10px;display:inline-block">Vezi comanda în cont</a>
          ${clientInvoiceBtn}
        </div>
        <p class="muted" style="margin:18px 0 0;color:#64748b;font-size:13px;">Metodă de plată: <strong>${paymentType}</strong></p>
      </div>
      <p class="muted" style="text-align:center;color:#94a3b8;font-size:12px;margin:12px 0 0;">Întrebări? Scrie-ne la <a href="mailto:${escapeHtml(process.env.SUPPORT_EMAIL || 'contact@prynt.ro')}" style="color:#4f46e5; text-decoration:none;">${escapeHtml(process.env.SUPPORT_EMAIL || 'contact@prynt.ro')}</a>.</p>
      <p class="muted" style="text-align:center;color:#cbd5e1;font-size:11px;margin:6px 0 0;">© ${new Date().getFullYear()} Prynt.ro</p>
    </div>
  </body>
  </html>`;

  try {
    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    if (!resend) throw new Error('RESEND_API_KEY lipsă');
    const clientResp = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'contact@prynt.ro',
      to: address.email,
      subject: `Confirmare comandă${orderNoSuffix} - Prynt.ro`,
      html: clientHtml,
    });
    console.log('[OrderService] Client email sent, resend response:', clientResp);
  } catch (e: any) {
    console.error('[OrderService] Eroare trimitere email client:', e?.message || e);
  }
}

export async function fulfillOrder(
  orderData: { address: Address; billing: Billing; cart: CartItem[]; marketing?: MarketingInfo; createAccount?: boolean; subscribeNewsletter?: boolean; userId?: string | null },
  paymentType: 'Ramburs' | 'Card'
): Promise<{ invoiceLink: string | null; orderNo?: number; orderId?: string; createdPassword?: string }> {
  const { address, billing, cart, marketing } = orderData;

  // FIX CRITIC 1: Asigurăm că email-ul există în billing pentru a putea fi găsit în AccountPage
  if (!billing.email && address.email) {
      (billing as any).email = address.email;
  }

  let invoiceLink: string | null = null;
  const billingAddressLine = buildAddressLine(
    { judet: billing.judet, localitate: billing.localitate, strada_nr: billing.strada_nr },
    { judet: address.judet, localitate: address.localitate, strada_nr: address.strada_nr }
  );

  const products = (cart ?? []).map((item) => {
    const name = item.name ?? item.title ?? item.slug ?? 'Produs';
    const quantity = Number(item.quantity ?? 1) || 1;
    const unitAmount = Number(item.unitAmount ?? item.price ?? item.metadata?.price ?? 0) || 0;
    return { name, price: unitAmount, measuringUnitName: 'buc', vatName: 'S', quantity };
  });

  const billingTip = billing?.tip_factura;
  // MODIFICARE: Permitem și persoane juridice/companii
  const shouldTryOblio = billingTip === 'persoana_fizica' || billingTip === 'persoana_juridica' || billingTip === 'companie';

  if (shouldTryOblio) {
    try {
      const token = await getOblioAccessToken();
      
      // Selectăm numele corect în funcție de tip
      let clientName = billing.name || address.nume_prenume;
      if (billingTip === 'persoana_juridica' || billingTip === 'companie') {
          clientName = billing.denumire_companie || billing.name || billing.cui || address.nume_prenume;
      }

      const cuiRaw = billing.cui;
      const cuiNormalized = normalizeCUI(cuiRaw);
      let clientCif: string | undefined = cuiNormalized.primary || cuiNormalized.alternate;
      if (clientCif && !clientCif.toUpperCase().startsWith('RO')) clientCif = `RO${clientCif}`;

      const client: any = {
        name: clientName,
        address: billingAddressLine,
        email: billing.email || address.email,
        phone: billing.telefon || address.telefon,
      };
      if (clientCif) client.cif = clientCif;
      // Adaugăm Reg Com dacă există
      if (billing.reg_com) client.rc = billing.reg_com;

      const basePayload: any = {
        cif: process.env.OBLIO_CIF_FIRMA,
        client,
        issueDate: new Date().toISOString().slice(0, 10),
        seriesName: process.env.OBLIO_SERIE_FACTURA,
        products,
      };

      const data = await createOblioInvoice(basePayload, token);
      const link = (data && (data.data?.link || data.link || data.data?.url || data.url)) as string | undefined;
      if (link) {
        invoiceLink = link;
        console.log('[OrderService] Factura Oblio generată automat:', invoiceLink);
      } else if (data) {
        console.warn('[OrderService] Oblio nu a emis factura automat:', data?.statusMessage || data?.message || data);
      }
    } catch (e: any) {
      console.warn('[OrderService] Oblio a eșuat (comanda continuă):', e?.message || e);
    }
  } else {
    invoiceLink = null; 
  }

  let createdPassword: string | undefined;
  let finalUserId = orderData.userId || null;

  // FIX CRITIC 2: Creăm contul ÎNAINTE de a salva comanda, pentru a avea userId valid
  if (orderData.createAccount && !finalUserId) {
    try {
      const existing = await prisma.user.findUnique({ where: { email: address.email } });
      if (existing) {
          finalUserId = existing.id;
          console.log('[OrderService] User existent găsit, asignăm comanda la:', finalUserId);
      } else {
          const rawPass = generateRandomPassword();
          const hash = await bcrypt.hash(rawPass, 10);
          const newUser = await prisma.user.create({
            data: {
              email: address.email,
              name: address.nume_prenume || undefined,
              passwordHash: hash,
              phone: address.telefon || undefined,
            },
          });
          createdPassword = rawPass;
          finalUserId = newUser.id;
          console.log('[OrderService] User nou creat, asignăm comanda la:', finalUserId);
      }
    } catch (e: any) {
      console.warn('[OrderService] Eroare la crearea/verificarea contului:', e?.message || e);
    }
  }

  // Newsletter subscription
  if (orderData.subscribeNewsletter) {
    try {
      const email = address.email;
      console.log('[OrderService] Subscribing to newsletter:', email);
      
      // Call newsletter API
      const newsletterResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          source: 'checkout',
          configuratorId: 'order'
        })
      });
      
      if (newsletterResponse.ok) {
        console.log('[OrderService] Newsletter subscription successful for:', email);
      } else {
        console.warn('[OrderService] Newsletter subscription failed for:', email);
      }
    } catch (e: any) {
      console.warn('[OrderService] Eroare la abonarea newsletter:', e?.message || e);
    }
  }

  try {
    const normalized = (cart ?? []).map((raw) => {
      const qty = Number(raw.quantity ?? 1) || 1;
      const unit = Number((raw as any).unitAmount ?? (raw as any).price ?? (raw as any)?.metadata?.price ?? 0) || 0;
      const total = Number((raw as any).totalAmount ?? (unit > 0 ? unit * qty : (raw as any)?.metadata?.totalAmount ?? 0)) || 0;
      const name = String((raw as any).name ?? (raw as any).title ?? (raw as any).slug ?? (raw as any)?.metadata?.title ?? 'Produs');
      const artworkUrl = String(raw.artworkUrl ?? raw.metadata?.artworkUrl ?? '') || null;
      const textDesign = String(raw.textDesign ?? raw.metadata?.textDesign ?? '') || null;
      const designOption = String(raw.designOption ?? raw.metadata?.designOption ?? '') || null;

      return { 
          name, 
          qty, 
          unit, 
          total, 
          artworkUrl,
          metadata: { ...(raw.metadata || {}), textDesign, designOption }
      };
    });

    const subtotal = normalized.reduce((s, it) => s + (Number(it.total) || 0), 0);
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const totalComanda = subtotal + shippingFee;
    
    // Salvăm comanda cu ID-ul final (fie cel din sesiune, fie cel tocmai creat)
    const saved = await appendOrder({
      paymentType,
      address,
      billing, // Conține acum și email-ul și datele firmei
      items: normalized,
      shippingFee: shippingFee,
      total: totalComanda,
      invoiceLink: invoiceLink ?? null,
      marketing,
      userId: finalUserId, 
    });
    
    await sendEmails(address, billing, cart, invoiceLink, paymentType, marketing, saved.orderNo, createdPassword, saved.id);
    return { invoiceLink, orderNo: saved.orderNo, orderId: saved.id, createdPassword };
  } catch (e: any) {
    console.warn('[OrderService] Salvare comandă a eșuat:', e?.message || e);
  }
  
  // În cazul puțin probabil în care salvarea eșuează dar vrem să trimitem email de confirmare manuală
  await sendEmails(address, billing, cart, invoiceLink, paymentType, marketing, undefined, createdPassword, undefined);
  return { invoiceLink, createdPassword };
}

function generateRandomPassword(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@$%';
  let out = '';
  for (let i = 0; i < 12; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export { getOblioAccessToken, createOblioInvoice };