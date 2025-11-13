import { Resend } from 'resend';
import { signAdminAction } from './adminAction';
import { appendOrder } from './orderStore';

type AnyRecord = Record<string, any>;

interface CartItem {
  // support multiple incoming shapes (legacy/current)
  id?: string;
  name?: string;
  title?: string;
  slug?: string;
  quantity?: number;
  unitAmount?: number; // preferred by some handlers (RON)
  price?: number; // alternative unit price field
  totalAmount?: number; // optional precomputed line total
  artworkUrl?: string; // direct artwork url
  textDesign?: string; // text content for text-only graphic
  metadata?: AnyRecord;
}

interface Address {
  nume_prenume: string;
  email: string;
  telefon: string;
  judet: string;
  localitate: string;
  strada_nr: string;
  postCode?: string;
}
interface Billing {
  tip_factura: 'persoana_fizica' | 'companie' | 'persoana_juridica';
  cui?: string;
  name?: string;
  judet?: string;
  localitate?: string;
  strada_nr?: string;
}

interface MarketingInfo {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string; // full referrer url
  landingPage?: string; // path + query
  userAgent?: string;
}

// Do not instantiate Resend at module load to avoid build failures in envs without key
const SHIPPING_FEE = 19.99;

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

function buildAddressLine(
  src: { judet?: string; localitate?: string; strada_nr?: string } | undefined,
  fallback: { judet: string; localitate: string; strada_nr: string }
) {
  const j = src?.judet || fallback.judet;
  const l = src?.localitate || fallback.localitate;
  const s = src?.strada_nr || fallback.strada_nr;
  return [s, l, j].filter(Boolean).join(', ');
}

// Apel Oblio – încercăm mai multe endpoint-uri cunoscute
async function createOblioInvoice(payload: any, token: string) {
  const endpoints = [
    'https://www.oblio.eu/api/invoices',
    'https://www.oblio.eu/api/invoice',
    'https://www.oblio.eu/api/1.0/invoices',
    'https://www.oblio.eu/api/docs/invoice',
  ];
  let lastErr: any = null;
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

/**
 * sendEmails
 * - Acceptă cart ca array de CartItem (flexibil)
 * - Include link-ul graficii (artworkUrl) sau textul trimis (textDesign) în emailuri
 * - Loghează răspunsul de la Resend pentru debugging
 */
async function sendEmails(
  address: Address,
  billing: Billing,
  cart: CartItem[],
  invoiceLink: string | null,
  paymentType: 'Ramburs' | 'Card',
  marketing?: MarketingInfo,
  orderNo?: number
) {
  // Normalize cart for totals and for listing in emails
  const normalized = cart.map((raw) => {
    const qty = Number(raw.quantity ?? 1) || 1;
    const unit =
      Number(raw.unitAmount ?? raw.price ?? (raw.metadata?.price ?? 0)) || 0;
    const total =
      Number(raw.totalAmount ?? (unit > 0 ? unit * qty : raw.metadata?.totalAmount ?? 0)) || 0;
    const artwork =
      raw.artworkUrl ??
      raw.metadata?.artworkUrl ??
      raw.metadata?.artworkLink ??
      raw.metadata?.artwork ??
      null;
    const textDesign = raw.textDesign ?? raw.metadata?.textDesign ?? raw.metadata?.text ?? null;
    const name = raw.name ?? raw.title ?? raw.metadata?.title ?? raw.slug ?? 'Produs';
    return { ...raw, name, qty, unit, total, artwork, textDesign, rawMetadata: raw.metadata ?? {} };
  });

  const subtotal = normalized.reduce((acc, it) => acc + (Number(it.total) || 0), 0);
  const totalComanda = subtotal + SHIPPING_FEE;

  function formatYesNo(v: any) {
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

  function prettyValue(k: string, v: any) {
    if (k === 'materialId') return v === 'frontlit_510' ? 'Frontlit 510g' : v === 'frontlit_440' ? 'Frontlit 440g' : String(v);
    if (k === 'productType') return v === 'alucobond' ? 'Alucobond' : v === 'polipropilena' ? 'Polipropilenă' : v === 'pvc-forex' ? 'PVC Forex' : String(v);
    if (k === 'designOption') return v === 'pro' ? 'Pro' : v === 'upload' ? 'Am fișier' : v === 'text_only' ? 'Text' : String(v);
    if (k === 'framed') return formatYesNo(v);
    if (typeof v === 'boolean') return formatYesNo(v);
    return String(v);
  }

  function buildDetailsHTML(item: AnyRecord) {
    const details: string[] = [];
    // width/height if present at top-level or metadata
    const width = item.width ?? item.width_cm ?? item.rawMetadata?.width_cm ?? item.rawMetadata?.width;
    const height = item.height ?? item.height_cm ?? item.rawMetadata?.height_cm ?? item.rawMetadata?.height;
    if (width || height) {
      details.push(`<div><strong>Dimensiune:</strong> ${escapeHtml(String(width || '—'))} x ${escapeHtml(String(height || '—'))} cm</div>`);
    }
    // List known metadata keys
    const meta = item.rawMetadata || {};
    const knownKeys = Object.keys(labelForKey).filter((k) => meta[k] !== undefined);
    knownKeys.forEach((k) => {
      const label = labelForKey[k];
      const val = prettyValue(k, meta[k]);
      details.push(`<div><strong>${escapeHtml(label)}:</strong> ${escapeHtml(val)}</div>`);
    });
    // If sqm/prices are at top-level in metadata
    ['sqmPerUnit', 'totalSqm', 'pricePerSqm'].forEach((k) => {
      if (!knownKeys.includes(k) && meta[k] !== undefined) {
        const label = labelForKey[k] || k;
        details.push(`<div><strong>${escapeHtml(label)}:</strong> ${escapeHtml(String(meta[k]))}</div>`);
      }
    });
    // Fallback other keys (exclude noisy/duplicate ones)
    const exclude = new Set([
      'price',
      'totalAmount',
      'qty',
      'quantity',
      // duplicates handled separately
      'artwork',
      'artworkUrl',
      'artworkLink',
      'text',
      'textDesign',
      // internal snapshot fields from configurators
      'selectedReadable',
      'selections',
      'title',
      'name',
    ]);
    const leftovers = Object.keys(meta).filter((k) => !knownKeys.includes(k) && !exclude.has(k));
    leftovers.forEach((k) => {
      const v = meta[k];
      details.push(`<div><strong>${escapeHtml(k)}:</strong> ${escapeHtml(String(v))}</div>`);
    });
    if (item.artwork) {
      details.push(`<div><strong>Fișier:</strong> <a href="${escapeHtml(item.artwork)}" target="_blank" rel="noopener noreferrer">link</a></div>`);
    }
    if (item.textDesign) {
      details.push(`<div><strong>Text:</strong> <em>${escapeHtml(item.textDesign)}</em></div>`);
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

  // Build admin email HTML (includes artwork links / text)
  // Build quick action buttons if config allows
  let actionButtons = '';
  try {
    if (process.env.ADMIN_ACTION_SECRET && process.env.DPD_DEFAULT_SERVICE_ID) {
      const tokenEdit = signAdminAction({
        action: 'edit',
        address,
        paymentType,
        totalAmount: totalComanda,
      });
      const tokenConfirm = signAdminAction({
        action: 'confirm_awb',
        address,
        paymentType,
        totalAmount: totalComanda,
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

  // Build marketing/source block for admin
  function sourceLabel(m?: MarketingInfo) {
    if (!m) return '—';
    if (m.utmSource) return m.utmSource;
    try {
      if (m.referrer) {
        const u = new URL(m.referrer);
        return u.hostname.replace(/^www\./, '');
      }
    } catch {}
    return 'direct';
  }

  const marketingBlock = `
    <div style="margin-top:16px;padding:10px 12px;background:#fafafa;border:1px solid #eee;border-radius:8px;color:#333;">
      <div style="font-weight:600;margin-bottom:6px;">Sursă trafic: ${escapeHtml(sourceLabel(marketing))}</div>
      <div style="font-size:12px;line-height:1.5;color:#555;">
        ${marketing?.utmSource ? `<div><strong>utm_source:</strong> ${escapeHtml(marketing.utmSource)}</div>` : ''}
        ${marketing?.utmMedium ? `<div><strong>utm_medium:</strong> ${escapeHtml(marketing.utmMedium)}</div>` : ''}
        ${marketing?.utmCampaign ? `<div><strong>utm_campaign:</strong> ${escapeHtml(marketing.utmCampaign)}</div>` : ''}
        ${marketing?.utmContent ? `<div><strong>utm_content:</strong> ${escapeHtml(marketing.utmContent)}</div>` : ''}
        ${marketing?.utmTerm ? `<div><strong>utm_term:</strong> ${escapeHtml(marketing.utmTerm)}</div>` : ''}
        ${marketing?.gclid ? `<div><strong>gclid:</strong> ${escapeHtml(marketing.gclid)}</div>` : ''}
        ${marketing?.fbclid ? `<div><strong>fbclid:</strong> ${escapeHtml(marketing.fbclid)}</div>` : ''}
        ${marketing?.referrer ? `<div><strong>referrer:</strong> ${escapeHtml(marketing.referrer)}</div>` : ''}
        ${marketing?.landingPage ? `<div><strong>landing:</strong> ${escapeHtml(marketing.landingPage)}</div>` : ''}
      </div>
    </div>
  `;

  const adminHtml = `
    <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 640px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
        <h1 style="color: #333; margin: 0 0 12px;">Comandă Nouă (${paymentType})</h1>

        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #555; margin-top: 20px;">Date Client</h2>
        <p><strong>Nume:</strong> ${escapeHtml(address.nume_prenume)}</p>
        <p><strong>Email:</strong> ${escapeHtml(address.email)}</p>
        <p><strong>Telefon:</strong> ${escapeHtml(address.telefon)}</p>

        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #555; margin-top: 20px;">Adresă Livrare</h2>
        <p>${escapeHtml(address.strada_nr)}, ${escapeHtml(address.localitate)}, ${escapeHtml(address.judet)}</p>

        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #555; margin-top: 20px;">Detalii Facturare</h2>
        <p><strong>Tip:</strong> ${billing.tip_factura !== 'persoana_fizica' ? 'Companie' : 'Persoană Fizică'}</p>
        ${
          billing.tip_factura !== 'persoana_fizica'
            ? `<p><strong>CUI:</strong> ${escapeHtml(billing.cui ?? '')}</p>`
            : `<p><strong>Nume Factură:</strong> ${escapeHtml(billing.name ?? address.nume_prenume)}</p>`
        }

        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #555; margin-top: 20px;">Produse Comandate</h2>
        <ul style="padding-left: 18px;">
          ${produseListHTML}
        </ul>

        <div style="border-top: 1px solid #eee; margin: 16px 0; padding-top: 12px;">
          <p style="margin: 4px 0; color: #333;">Taxă livrare: ${formatRON(SHIPPING_FEE)} RON</p>
          <h3 style="text-align: right; color: #111; margin: 8px 0 0;">Total Comandă: ${formatRON(totalComanda)} RON</h3>
        </div>

        ${actionButtons || ''}

        ${marketingBlock}

        ${
          invoiceLink
            ? `<p style="text-align: center; margin-top: 20px;">
                 <a href="${invoiceLink}" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Vezi Factura Oblio</a>
               </p>`
            : `<p style="text-align:center;margin-top:20px;color:#b54708">
                 Factura va fi emisă manual în Oblio (client: ${escapeHtml(
                   billing.cui || billing.name || address.nume_prenume
                 )}).
               </p>`
        }
      </div>
    </div>
  `;

  // Admin email
  try {
    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    if (!resend) throw new Error('RESEND_API_KEY lipsă');
    const adminResp = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'comenzi@prynt.ro',
      to: process.env.ADMIN_EMAIL || 'contact@prynt.ro',
      subject: `Comandă${orderNo ? ` #${orderNo}` : ''} (${paymentType}) - ${escapeHtml(address.nume_prenume)}`,
      html: adminHtml,
    });
    console.log('[OrderService] Admin email sent, resend response:', adminResp);
  } catch (e: any) {
    console.error('[OrderService] Eroare trimitere email admin:', e?.message || e);
  }

  // Email CLIENT – include artwork link or text if provided
  const clientHtml = `
    <div style="font-family:sans-serif; background:#f7f7fb; padding:24px;">
      <div style="max-width:640px; margin:auto; background:#ffffff; border-radius:10px; padding:24px;">
        <h1 style="margin:0 0 12px; color:#111;">Mulțumim pentru comandă!</h1>
        <p style="margin:0 0 16px; color:#444;">
          Am primit comanda ta și am început procesarea. Mai jos ai un rezumat.
        </p>
        ${orderNo ? `<p style="margin:0 0 12px; color:#111;"><strong>Nr. comandă:</strong> #${orderNo}</p>` : ''}

        <h2 style="border-bottom:1px solid #eee; padding-bottom:8px; color:#333; margin-top:18px;">Datele tale</h2>
        <p style="margin:4px 0;"><strong>Nume:</strong> ${escapeHtml(address.nume_prenume)}</p>
        <p style="margin:4px 0;"><strong>Email:</strong> ${escapeHtml(address.email)}</p>
        <p style="margin:4px 0;"><strong>Telefon:</strong> ${escapeHtml(address.telefon)}</p>

        <h2 style="border-bottom:1px solid #eee; padding-bottom:8px; color:#333; margin-top:18px;">Adresă livrare</h2>
        <p style="margin:4px 0;">${escapeHtml(address.strada_nr)}, ${escapeHtml(address.localitate)}, ${escapeHtml(address.judet)}</p>

        <h2 style="border-bottom:1px solid #eee; padding-bottom:8px; color:#333; margin-top:18px;">Facturare</h2>
        <p style="margin:4px 0;"><strong>Tip:</strong> ${billing.tip_factura !== 'persoana_fizica' ? 'Companie' : 'Persoană Fizică'}</p>
        ${
          billing.tip_factura !== 'persoana_fizica'
            ? `<p style=\"margin:4px 0;\"><strong>CUI:</strong> ${escapeHtml(billing.cui ?? '')}</p>`
            : `<p style=\"margin:4px 0;\"><strong>Nume factură:</strong> ${escapeHtml(billing.name ?? address.nume_prenume)}</p>`
        }

        <h2 style="border-bottom:1px solid #eee; padding-bottom:8px; color:#333; margin-top:18px;">Produse</h2>
        <ul style="padding-left:18px; margin:8px 0 0;">
          ${produseListHTML}
        </ul>

        <div style="border-top:1px solid #eee; margin:16px 0; padding-top:12px;">
          <p style="margin:4px 0; color:#333;">Taxă livrare: ${formatRON(SHIPPING_FEE)} RON</p>
          <h3 style="text-align:right; color:#111; margin:8px 0 0;">Total: ${formatRON(totalComanda)} RON</h3>
        </div>

        ${
          invoiceLink
            ? `<p style="text-align:center; margin-top:16px;">
                 <a href="${invoiceLink}" style="display:inline-block; background:#4f46e5; color:#fff; padding:10px 18px; text-decoration:none; border-radius:8px;">Descarcă Factura</a>
               </p>`
            : `<p style="text-align:center; margin-top:16px; color:#555;">
                 Factura va fi emisă și trimisă pe email ulterior.
               </p>`
        }

        <div style="margin-top:20px; color:#555; font-size:14px;">
          <p style="margin:6px 0;">Întrebări? Scrie-ne la <a href="mailto:${escapeHtml(process.env.SUPPORT_EMAIL || 'contact@prynt.ro')}">${escapeHtml(process.env.SUPPORT_EMAIL || 'contact@prynt.ro')}</a>.</p>
        </div>
      </div>
    </div>
  `;

  try {
    const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
    if (!resend) throw new Error('RESEND_API_KEY lipsă');
    const clientResp = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'contact@prynt.ro',
      to: address.email,
      subject: `Confirmare comandă${orderNo ? ` #${orderNo}` : ''} - Prynt.ro`,
      html: clientHtml,
    });
    console.log('[OrderService] Client email sent, resend response:', clientResp);
  } catch (e: any) {
    console.error('[OrderService] Eroare trimitere email client:', e?.message || e);
  }
}

/**
 * Procesează comanda NON‑BLOCANT și cu MINIM de date cerute în UI:
 * - Acceptă cart cu forme diferite (normalizăm local)
 * - Emailuri se trimit oricum; dacă factura nu iese, nu blocăm comanda
 */
export async function fulfillOrder(
  orderData: { address: Address; billing: Billing; cart: CartItem[]; marketing?: MarketingInfo },
  paymentType: 'Ramburs' | 'Card'
): Promise<{ invoiceLink: string | null; orderNo?: number; orderId?: string }> {
  const { address, billing, cart, marketing } = orderData;

  let invoiceLink: string | null = null;

  // Adresă de facturare din câmpurile disponibile (sau livrare ca fallback)
  const billingAddressLine = buildAddressLine(
    { judet: (billing as any).judet, localitate: (billing as any).localitate, strada_nr: (billing as any).strada_nr },
    { judet: address.judet, localitate: address.localitate, strada_nr: address.strada_nr }
  );

  // Normalize products into Oblio expected shape (name, price, quantity)
  const products = (cart ?? []).map((item) => {
    const name = item.name ?? item.title ?? item.slug ?? 'Produs';
    const quantity = Number(item.quantity ?? 1) || 1;
    const unitAmount = Number(item.unitAmount ?? item.price ?? item.metadata?.price ?? 0) || 0;
    return {
      name,
      price: unitAmount,
      measuringUnitName: 'buc',
      vatName: 'S',
      quantity,
    };
  });

  // Emitem automat doar pentru persoană fizică; pentru juridică lăsăm manual
  if (billing.tip_factura === 'persoana_fizica') {
    try {
      const token = await getOblioAccessToken();
      const client = {
        name: billing.name || address.nume_prenume,
        address: billingAddressLine,
        email: address.email,
        phone: address.telefon,
      } as any;

      const basePayload = {
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
        console.log('[OrderService] Factura Oblio PF generată:', invoiceLink);
      } else if (data) {
        console.warn('[OrderService] Oblio (PF) nu a emis factura:', data?.statusMessage || data?.message || data);
      }
    } catch (e: any) {
      console.warn('[OrderService] Oblio PF a eșuat (comanda continuă):', e?.message || e);
    }
  } else {
    invoiceLink = null; // juridică – emisă manual ulterior
  }

  // Emailuri – întotdeauna; sendEmails este tolerant la forma cart-ului
  try {
    // 1) Persist order (append-only). Normalize minimal for listing
    try {
      const normalized = (cart ?? []).map((raw) => {
        const qty = Number(raw.quantity ?? 1) || 1;
        const unit = Number((raw as any).unitAmount ?? (raw as any).price ?? (raw as any)?.metadata?.price ?? 0) || 0;
        const total = Number((raw as any).totalAmount ?? (unit > 0 ? unit * qty : (raw as any)?.metadata?.totalAmount ?? 0)) || 0;
        const name = (raw as any).name ?? (raw as any).title ?? (raw as any).slug ?? (raw as any)?.metadata?.title ?? 'Produs';
        return { name, qty, unit, total };
      });
      const subtotal = normalized.reduce((s, it) => s + (Number(it.total) || 0), 0);
      const totalComanda = subtotal + SHIPPING_FEE;
      const saved = await appendOrder({
        paymentType,
        address,
        billing,
        items: normalized,
        shippingFee: SHIPPING_FEE,
        total: totalComanda,
        invoiceLink: invoiceLink ?? null,
        marketing,
      });
      // Trimite emailurile cu numărul comenzii în subiect
      await sendEmails(address, billing, cart, invoiceLink, paymentType, marketing, saved.orderNo);
      return { invoiceLink, orderNo: saved.orderNo, orderId: saved.id };
    } catch (e: any) {
      console.warn('[OrderService] Salvare comandă a eșuat (non-blocant):', e?.message || e);
    }
    // Dacă salvarea eșuează, tot trimitem emailuri (fără orderNo)
    await sendEmails(address, billing, cart, invoiceLink, paymentType, marketing);
  } catch (e: any) {
    console.error('[OrderService] Eroare trimitere emailuri:', e?.message || e);
  }

  return { invoiceLink };
}