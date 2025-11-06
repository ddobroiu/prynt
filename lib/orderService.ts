import { Resend } from 'resend';

interface CartItem {
  name: string;
  quantity: number;
  unitAmount: number;
  totalAmount: number;
  artworkUrl?: string;
}
interface Address {
  nume_prenume: string;
  email: string;
  telefon: string;
  judet: string;
  localitate: string;
  strada_nr: string;
}
interface Billing {
  tip_factura: 'persoana_fizica' | 'companie';
  cui?: string;
  name?: string;
  judet?: string;
  localitate?: string;
  strada_nr?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);
const SHIPPING_FEE = 19.99;

// Cache token Oblio
let oblioTokenCache: { token: string; expiresAt: number } | null = null;

async function getOblioAccessToken() {
  const now = Date.now();
  if (oblioTokenCache && oblioTokenCache.expiresAt > now) return oblioTokenCache.token;

  const params = new URLSearchParams({
    client_id: process.env.OBLIO_CLIENT_ID!,
    client_secret: process.env.OBLIO_CLIENT_SECRET!,
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
  return String(str)
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

// Apel Oblio – endpoint ca în proiectul care îți mergea
async function createOblioInvoice(payload: any, token: string) {
  const resp = await fetch('https://www.oblio.eu/api/docs/invoice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  const ct = resp.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return await resp.json();
  } else {
    const text = await resp.text();
    // Nu injectăm în email; doar logăm scurt.
    throw new Error(`Oblio răspuns non-JSON (status ${resp.status}): ${text.slice(0, 200)}`);
  }
}

async function sendEmails(
  address: Address,
  billing: Billing,
  cart: CartItem[],
  invoiceLink: string | null,
  paymentType: 'Ramburs' | 'Card'
) {
  const subtotal = cart.reduce((acc, item) => acc + item.totalAmount, 0);
  const totalComanda = subtotal + SHIPPING_FEE;

  const produseListHTML = cart
    .map((item) => {
      const line = `${escapeHtml(item.name)} - <strong>${item.quantity} buc.</strong> - ${formatRON(item.totalAmount)} RON`;
      const artwork = item.artworkUrl
        ? ` — <a href="${item.artworkUrl}" target="_blank" rel="noopener noreferrer">Fișier grafică</a>`
        : '';
      return `<li>${line}${artwork}</li>`;
    })
    .join('');

  // Email ADMIN – COMPLET, cu CUI la Companie
  await resend.emails.send({
    from: 'comenzi@prynt.ro',
    to: 'contact@prynt.ro',
    subject: `Comandă Nouă (${paymentType}) - ${escapeHtml(address.nume_prenume)}`,
    html: `
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
          <p><strong>Tip:</strong> ${billing.tip_factura === 'companie' ? 'Companie' : 'Persoană Fizică'}</p>
          ${
            billing.tip_factura === 'companie'
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
    `,
  });

  // Email CLIENT – COMPLET, minimal cerut în UI, include CUI dacă e Companie
  await resend.emails.send({
    from: 'contact@prynt.ro',
    to: address.email,
    subject: 'Confirmare comandă Prynt.ro',
    html: `
      <div style="font-family:sans-serif; background:#f7f7fb; padding:24px;">
        <div style="max-width:640px; margin:auto; background:#ffffff; border-radius:10px; padding:24px;">
          <h1 style="margin:0 0 12px; color:#111;">Mulțumim pentru comandă!</h1>
          <p style="margin:0 0 16px; color:#444;">
            Am primit comanda ta și am început procesarea. Mai jos ai un rezumat.
          </p>

          <h2 style="border-bottom:1px solid #eee; padding-bottom:8px; color:#333; margin-top:18px;">Datele tale</h2>
          <p style="margin:4px 0;"><strong>Nume:</strong> ${escapeHtml(address.nume_prenume)}</p>
          <p style="margin:4px 0;"><strong>Email:</strong> ${escapeHtml(address.email)}</p>
          <p style="margin:4px 0;"><strong>Telefon:</strong> ${escapeHtml(address.telefon)}</p>

          <h2 style="border-bottom:1px solid #eee; padding-bottom:8px; color:#333; margin-top:18px;">Adresă livrare</h2>
          <p style="margin:4px 0;">${escapeHtml(address.strada_nr)}, ${escapeHtml(address.localitate)}, ${escapeHtml(address.judet)}</p>

          <h2 style="border-bottom:1px solid #eee; padding-bottom:8px; color:#333; margin-top:18px;">Facturare</h2>
          <p style="margin:4px 0;"><strong>Tip:</strong> ${billing.tip_factura === 'companie' ? 'Companie' : 'Persoană Fizică'}</p>
          ${
            billing.tip_factura === 'companie'
              ? `<p style="margin:4px 0;"><strong>CUI:</strong> ${escapeHtml(billing.cui ?? '')}</p>`
              : `<p style="margin:4px 0;"><strong>Nume factură:</strong> ${escapeHtml(billing.name ?? address.nume_prenume)}</p>`
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
            <p style="margin:6px 0;">Întrebări? Scrie-ne la <a href="mailto:contact@prynt.ro">contact@prynt.ro</a>.</p>
          </div>
        </div>
      </div>
    `,
  });
}

/**
 * Procesează comanda NON‑BLOCANT și cu MINIM de date cerute în UI:
 * - Companie: încearcă “doar CUI”; dacă cere client, reîncearcă cu nume+adresă+email generate din formular
 * - Persoană fizică: nume + adresă + email
 * - Emailuri se trimit oricum; dacă factura nu iese, nu blocăm comanda
 */
export async function fulfillOrder(
  orderData: { address: Address; billing: Billing; cart: CartItem[] },
  paymentType: 'Ramburs' | 'Card'
): Promise<{ invoiceLink: string | null }> {
  const { address, billing, cart } = orderData;

  let invoiceLink: string | null = null;

  // Adresă de facturare din câmpurile disponibile (sau livrare ca fallback)
  const billingAddressLine = buildAddressLine(
    { judet: (billing as any).judet, localitate: (billing as any).localitate, strada_nr: (billing as any).strada_nr },
    { judet: address.judet, localitate: address.localitate, strada_nr: address.strada_nr }
  );

  const products = cart.map((item) => ({
    name: item.name,
    price: item.unitAmount,
    measuringUnitName: 'buc',
    vatName: 'S',
    quantity: item.quantity,
  }));

  // Încercăm Oblio, dar nu blocăm dacă pică
  try {
    const token = await getOblioAccessToken();

    // 1) Încercare “doar CUI” dacă e Companie și avem CUI
    let client =
      billing.tip_factura === 'companie' && billing.cui
        ? { cif: billing.cui }
        : {
            name: billing.name || address.nume_prenume,
            address: billingAddressLine,
            email: address.email,
          };

    const basePayload = {
      cif: process.env.OBLIO_CIF_FIRMA,
      client,
      issueDate: new Date().toISOString().slice(0, 10),
      seriesName: process.env.OBLIO_SERIE_FACTURA,
      products,
    };

    let data = await createOblioInvoice(basePayload, token);

    // 2) Dacă cere selectarea clientului, reîncercăm cu detalii minime
    if (data?.status !== 200) {
      const msg = (data?.statusMessage || data?.message || '').toString();
      const needDetails = /selecteaza clientul|alege clientul/i.test(msg) || data?.status === 422;

      if (needDetails && billing.tip_factura === 'companie' && billing.cui) {
        const payloadWithDetails = {
          ...basePayload,
          client: {
            cif: billing.cui,
            name: billing.name || address.nume_prenume,
            address: billingAddressLine,
            email: address.email,
          },
        };
        data = await createOblioInvoice(payloadWithDetails, token);
      }
    }

    if (data?.status === 200 && data?.data?.link) {
      invoiceLink = data.data.link as string;
      console.log('[OrderService] Factura Oblio generată:', invoiceLink);
    } else if (data) {
      console.warn('[OrderService] Oblio nu a emis factura:', data?.statusMessage || data?.message || data);
    }
  } catch (e: any) {
    console.warn('[OrderService] Oblio a eșuat (comanda continuă):', e?.message || e);
  }

  // Emailuri – întotdeauna
  try {
    await sendEmails(address, billing, cart, invoiceLink, paymentType);
  } catch (e: any) {
    console.error('[OrderService] Eroare trimitere emailuri:', e?.message || e);
  }

  return { invoiceLink };
}