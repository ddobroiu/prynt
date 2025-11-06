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
  // în UI avem câmpuri structurate pentru adresă la facturare
  judet?: string;
  localitate?: string;
  strada_nr?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);
const SHIPPING_FEE = 19.99;

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

async function createOblioInvoice(payload: any, token: string) {
  // Endpoint corect pentru creare factură
  const oblioResponse = await fetch("https://www.oblio.eu/api/invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  let data: any = null;
  try {
    data = await oblioResponse.json();
  } catch {
    // dacă răspunsul nu e JSON, punem un mesaj generic
    throw new Error(`Eroare Oblio: răspuns invalid (status ${oblioResponse.status}).`);
  }
  return { status: oblioResponse.status, data };
}

/**
 * Procesează comanda:
 * - Generează factura în Oblio (fallback: întâi doar CUI; dacă nu există clientul -> reîncercare cu name+address+email)
 * - Trimite email Admin și Client
 */
export async function fulfillOrder(
  orderData: { address: Address; billing: Billing; cart: CartItem[] },
  paymentType: 'Ramburs' | 'Card'
) {
  const { address, billing, cart } = orderData;

  console.log(`[OrderService] Procesare comandă pentru ${address.email}, plată ${paymentType}.`);
  const token = await getOblioAccessToken();

  // construire adresă de facturare din câmpurile disponibile (sau livrare ca fallback)
  const billingAddressLine = buildAddressLine(
    { judet: (billing as any).judet, localitate: (billing as any).localitate, strada_nr: (billing as any).strada_nr },
    { judet: address.judet, localitate: address.localitate, strada_nr: address.strada_nr }
  );

  // produse
  const products = cart.map((item) => ({
    name: item.name,
    price: item.unitAmount,
    measuringUnitName: "buc",
    vatName: "S",
    quantity: item.quantity,
  }));

  // payload de bază
  const basePayload = {
    cif: process.env.OBLIO_CIF_FIRMA,
    seriesName: process.env.OBLIO_SERIE_FACTURA,
    issueDate: new Date().toISOString().slice(0, 10),
    products,
  };

  // 1) Încercare doar cu CUI pentru companii (comportamentul "ieri a mers doar cu CUI")
  if (billing.tip_factura === 'companie' && billing.cui) {
    const payloadOnlyCIF = {
      ...basePayload,
      client: { cif: billing.cui },
    };
    const firstTry = await createOblioInvoice(payloadOnlyCIF, token);
    if (firstTry.data?.status === 200 && firstTry.data?.data?.link) {
      const invoiceLink = firstTry.data.data.link as string;
      console.log(`[OrderService] Factura Oblio generată (doar CUI): ${invoiceLink}`);
      await sendEmails(address, billing, cart, invoiceLink, paymentType);
      return { invoiceLink };
    }

    // Dacă clientul nu e găsit, Oblio răspunde cu mesaj de tip "Selecteaza Clientul"
    const msg = firstTry.data?.statusMessage || firstTry.data?.message || '';
    const needClientDetails =
      /selecteaza clientul/i.test(msg) || /alege clientul/i.test(msg) || firstTry.data?.status === 422 || firstTry.status === 422;

    if (!needClientDetails && firstTry.data?.status !== 200) {
      throw new Error(`Eroare Oblio: ${msg || 'Eșec creare factură cu doar CUI.'}`);
    }

    // 2) Fallback: trimitem și name + address + email pentru a crea/folosi clientul automat
    const payloadWithDetails = {
      ...basePayload,
      client: {
        cif: billing.cui,
        name: (billing as any).companyName || billing.name || address.nume_prenume,
        address: billingAddressLine,
        email: address.email,
      },
    };
    const secondTry = await createOblioInvoice(payloadWithDetails, token);
    if (secondTry.data?.status !== 200) {
      const msg2 = secondTry.data?.statusMessage || secondTry.data?.message || 'Eșec creare factură (fallback).';
      throw new Error(`Eroare Oblio: ${msg2}`);
    }
    const invoiceLink = secondTry.data.data.link as string;
    console.log(`[OrderService] Factura Oblio generată (fallback client detaliat): ${invoiceLink}`);
    await sendEmails(address, billing, cart, invoiceLink, paymentType);
    return { invoiceLink };
  }

  // Persoană fizică (sau companie fără CUI trimis)
  const clientPayload =
    billing.tip_factura === 'companie'
      ? {
          // dacă totuși nu avem CUI, trimitem minimul necesar
          name: (billing as any).companyName || billing.name || address.nume_prenume,
          address: billingAddressLine,
          email: address.email,
        }
      : {
          name: billing.name || address.nume_prenume,
          address: billingAddressLine,
          email: address.email,
        };

  const finalPayload = { ...basePayload, client: clientPayload };
  const oblio = await createOblioInvoice(finalPayload, token);
  if (oblio.data?.status !== 200) {
    const msg = oblio.data?.statusMessage || oblio.data?.message || 'Eșec creare factură.';
    throw new Error(`Eroare Oblio: ${msg}`);
  }
  const invoiceLink = oblio.data.data.link as string;
  console.log(`[OrderService] Factura Oblio generată: ${invoiceLink}`);

  await sendEmails(address, billing, cart, invoiceLink, paymentType);
  return { invoiceLink };
}

async function sendEmails(address: Address, billing: Billing, cart: CartItem[], invoiceLink: string, paymentType: 'Ramburs' | 'Card') {
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

  // Admin
  await resend.emails.send({
    from: "comenzi@prynt.ro",
    to: "contact@prynt.ro",
    subject: `Comandă Nouă (${paymentType}) - ${address.nume_prenume}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 640px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
          <h1 style="color: #333; margin: 0 0 12px;">Comandă Nouă (${paymentType})</h1>

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

          <p style="text-align: center; margin-top: 20px;">
            <a href="${invoiceLink}" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Vezi Factura Oblio</a>
          </p>
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
      <p>Poți vizualiza factura aici: <a href="${invoiceLink}">Factura Oblio</a></p>
    `,
  });
}