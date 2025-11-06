import { Resend } from 'resend';

/**
 * Tipuri de date pentru comandă
 * NOTĂ: `artworkUrl?` pentru link-ul către fișierul de grafică.
 */
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
  address?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

const SHIPPING_FEE = 19.99;

// Cache pentru token-ul Oblio
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

/**
 * Procesează comanda:
 * - Generează factura în Oblio
 * - Trimite email Admin (include link fișier grafică dacă există)
 * - Trimite email Client
 */
export async function fulfillOrder(
  orderData: { address: Address; billing: Billing; cart: CartItem[] },
  paymentType: 'Ramburs' | 'Card'
) {
  const { address, billing, cart } = orderData;

  // --- Factură Oblio ---
  console.log(`[OrderService] Procesare comandă pentru ${address.email}, plată ${paymentType}.`);
  const token = await getOblioAccessToken();

  const clientPayload =
    billing.tip_factura === 'companie'
      ? { cif: billing.cui }
      : { name: billing.name, address: billing.address, email: address.email };

  const facturaData = {
    cif: process.env.OBLIO_CIF_FIRMA,
    client: clientPayload,
    issueDate: new Date().toISOString().slice(0, 10),
    seriesName: process.env.OBLIO_SERIE_FACTURA,
    products: cart.map((item) => ({
      name: item.name,
      price: item.unitAmount,
      measuringUnitName: "buc",
      vatName: "S",
      quantity: item.quantity,
    })),
  };

  const oblioResponse = await fetch("https://www.oblio.eu/api/docs/invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(facturaData),
  });
  const oblioData = await oblioResponse.json();

  if (oblioData.status !== 200) throw new Error(`Eroare Oblio: ${oblioData.statusMessage}`);
  const invoiceLink = oblioData.data.link as string;
  console.log(`[OrderService] Factura Oblio generată: ${invoiceLink}`);

  // --- Totaluri ---
  const subtotal = cart.reduce((acc, item) => acc + item.totalAmount, 0);
  const totalComanda = subtotal + SHIPPING_FEE;

  // --- Emailuri ---
  try {
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
                : `<p><strong>Nume Factură:</strong> ${billing.name ?? ''}</p><p><strong>Adresă Factură:</strong> ${billing.address ?? ''}</p>`
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
      subject: "Comanda ta Prynt.ro a fost înregistrată",
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 640px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
            <p>Salut ${address.nume_prenume},</p>
            <p>Îți mulțumim pentru comanda plasată! Am înregistrat-o cu succes.</p>

            <h3 style="margin-top: 16px; color: #333;">Rezumat comandă</h3>
            <ul style="padding-left: 18px; color: #333;">
              ${cart.map((item) => `<li>${item.name} — ${item.quantity} buc. — ${formatRON(item.totalAmount)} RON</li>`).join("")}
            </ul>

            <p style="margin: 8px 0; color: #333;">Taxă livrare: ${formatRON(SHIPPING_FEE)} RON</p>
            <p style="font-weight: bold; color: #111;">Total Plată: ${formatRON(totalComanda)} RON</p>

            <p style="margin-top: 16px;">
              Factura proformă: <a href="${invoiceLink}" target="_blank" rel="noopener noreferrer">Descarcă Factura</a>
            </p>

            <p style="margin-top: 16px;">O zi excelentă,<br/>Echipa Prynt.ro</p>
          </div>
        </div>
      `,
    });

    console.log("[OrderService] Emailuri trimise cu succes!");
  } catch (emailError: any) {
    console.error("[OrderService] Eroare la trimiterea emailurilor:", emailError?.message || emailError);
  }

  return { invoiceLink };
}