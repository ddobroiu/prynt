import { Resend } from 'resend';

// Tipuri locale (nu depind de types.ts ca să nu stricăm alt cod)
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

  const response = await fetch("https://www.oblio.eu/api/authorize/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Eroare obținere token Oblio: ${response.status}. Răspuns: ${err}`);
  }
  const data = (await response.json()) as { access_token?: string; expires_in?: string };
  if (!data.access_token) throw new Error("Token API Oblio invalid.");

  const expiresIn = parseInt(data.expires_in || "3600", 10);
  oblioTokenCache = { token: data.access_token, expiresAt: now + expiresIn * 1000 - 60000 };
  return data.access_token;
}

function formatRON(n: number) {
  return n.toFixed(2);
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

async function tryCreateOblioInvoice(payload: any, token: string) {
  // Endpoint corect: /api/invoice (nu /api/docs/invoice)
  const resp = await fetch("https://www.oblio.eu/api/invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });

  const contentType = resp.headers.get('content-type') || '';
  let data: any;
  if (contentType.includes('application/json')) {
    data = await resp.json();
  } else {
    // Evită "Unexpected token '<' ..." în UI – păstrăm textul pt. loguri
    const text = await resp.text();
    throw new Error(`Răspuns Oblio non-JSON (status ${resp.status}): ${text.slice(0, 200)}`);
  }

  return data;
}

async function sendEmails(address: Address, billing: Billing, cart: CartItem[], invoiceLink: string | null, paymentType: 'Ramburs' | 'Card', warnings: string[]) {
  const subtotal = cart.reduce((acc, item) => acc + item.totalAmount, 0);
  const totalComanda = subtotal + SHIPPING_FEE;

  const produseListHTML = cart
    .map((item) => {
      const line = `${item.name} - <strong>${item.quantity} buc.</strong> - ${formatRON(item.totalAmount)} RON`;
      const artwork =
        item.artworkUrl
          ? ` — <a href="${item.artworkUrl}" target="_blank" rel="noopener noreferrer">Fișier grafică</a>`
          : "";
      return `<li>${line}${artwork}</li>`;
    })
    .join("");

  const warningHtml = warnings.length
    ? `<div style="background:#fff3cd;color:#664d03;padding:10px;border-radius:6px;margin:14px 0">
         <strong>Atenție:</strong> ${warnings.join(' ')}
       </div>`
    : '';

  // Admin
  await resend.emails.send({
    from: "comenzi@prynt.ro",
    to: "contact@prynt.ro",
    subject: `Comandă Nouă (${paymentType}) - ${address.nume_prenume}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 640px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
          <h1 style="color: #333; margin: 0 0 12px;">Comandă Nouă (${paymentType})</h1>

          ${warningHtml}

          <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #555; margin-top: 20px;">Date Client</h2>
          <p><strong>Nume:</strong> ${address.nume_prenume}</p>
          <p><strong>Email:</strong> ${address.email}</p>
          <p><strong>Telefon:</strong> ${address.telefon}</p>

          <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #555; margin-top: 20px;">Adresă Livrare</h2>
          <p>${address.strada_nr}, ${address.localitate}, ${address.judet}</p>

          <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #555; margin-top: 20px;">Detalii Facturare</h2>
          <p><strong>Tip:</strong> ${billing.tip_factura === 'companie' ? 'Companie' : 'Persoană Fizică'}</p>
          ${
            billing.tip_factura === 'companie'
              ? `<p><strong>CUI:</strong> ${billing.cui ?? ''}</p>`
              : `<p><strong>Nume Factură:</strong> ${billing.name ?? ''}</p>`
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
                   Factura nu a putut fi generată automat. Emite manual în Oblio (clientul: ${billing.cui || billing.name || address.nume_prenume}).
                 </p>`
          }
        </div>
      </div>
    `,
  });

  // Client
  await resend.emails.send({
    from: "contact@prynt.ro",
    to: address.email,
    subject: "Confirmare comandă Prynt.ro",
    html: `
      <p>Mulțumim pentru comandă!</p>
      ${
        invoiceLink
          ? `<p>Poți vizualiza factura aici: <a href="${invoiceLink}">Factura Oblio</a></p>`
          : `<p>Factura va fi emisă și trimisă pe email în scurt timp.</p>`
      }
    `,
  });
}

/**
 * Procesează comanda NON-BLOCANT:
 * - Încearcă să genereze factura în Oblio; dacă pică, continuă oricum
 * - Trimite email Admin și Client indiferent de statusul Oblio
 * Returnează mereu 200 către caller (în afară de validări de input).
 */
export async function fulfillOrder(
  orderData: { address: Address; billing: Billing; cart: CartItem[] },
  paymentType: 'Ramburs' | 'Card'
): Promise<{ invoiceLink: string | null; warnings: string[] }> {
  const { address, billing, cart } = orderData;

  console.log(`[OrderService] Procesare comandă pentru ${address.email}, plată ${paymentType}.`);
  const warnings: string[] = [];
  let invoiceLink: string | null = null;

  // Token Oblio (dacă pică aici, marcăm warning și mergem mai departe)
  let token: string | null = null;
  try {
    token = await getOblioAccessToken();
  } catch (e: any) {
    warnings.push(`[Oblio] Nu am putut obține token: ${e?.message || e}`);
  }

  // Construim date client – pentru “doar CUI” folosește client existent; dacă nu există, folosim și name+address+email ca fallback
  const billingAddressLine = buildAddressLine(
    { judet: (billing as any).judet, localitate: (billing as any).localitate, strada_nr: (billing as any).strada_nr },
    { judet: address.judet, localitate: address.localitate, strada_nr: address.strada_nr }
  );

  const products = cart.map((item) => ({
    name: item.name,
    price: item.unitAmount,
    measuringUnitName: "buc",
    vatName: "S",
    quantity: item.quantity,
  }));

  if (token) {
    try {
      // 1) încercare “doar CUI”
      let client = billing.tip_factura === 'companie' && billing.cui
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

      let data = await tryCreateOblioInvoice(basePayload, token);

      if (data?.status !== 200) {
        const msg = data?.statusMessage || data?.message || '';
        const needDetails = /selecteaza clientul|alege clientul/i.test(msg) || data?.status === 422;
        if (needDetails && billing.tip_factura === 'companie' && billing.cui) {
          // 2) fallback cu detalii minime
          const payloadWithDetails = {
            ...basePayload,
            client: {
              cif: billing.cui,
              name: billing.name || address.nume_prenume,
              address: billingAddressLine,
              email: address.email,
            },
          };
          data = await tryCreateOblioInvoice(payloadWithDetails, token);
        }
      }

      if (data?.status === 200 && data?.data?.link) {
        invoiceLink = data.data.link as string;
        console.log(`[OrderService] Factura Oblio generată: ${invoiceLink}`);
      } else {
        const msg = data?.statusMessage || data?.message || 'Eșec creare factură.';
        warnings.push(`[Oblio] ${msg}`);
      }
    } catch (e: any) {
      warnings.push(`[Oblio] ${e?.message || 'Eroare la apelul API'}`);
    }
  }

  // Trimite emailuri indiferent de Oblio
  try {
    await sendEmails(address, billing, cart, invoiceLink, paymentType, warnings);
  } catch (e: any) {
    // Chiar și dacă emailurile pică, nu aruncăm – doar logăm
    console.error('[OrderService] Eroare trimitere emailuri:', e?.message || e);
  }

  return { invoiceLink, warnings };
}