import { Resend } from 'resend';

// Tipurile de date pentru comandă
interface CartItem { name: string; quantity: number; unitAmount: number; totalAmount: number; }
interface Address { nume_prenume: string; email: string; telefon: string; judet: string; localitate: string; strada_nr: string; }
interface Billing { tip_factura: 'persoana_fizica' | 'companie'; cui?: string; name?: string; address?: string; }

const resend = new Resend(process.env.RESEND_API_KEY);

// Cache-ul pentru token-ul Oblio
let oblioTokenCache: { token: string; expiresAt: number } | null = null;
async function getOblioAccessToken() {
    const now = Date.now();
    if (oblioTokenCache && oblioTokenCache.expiresAt > now) return oblioTokenCache.token;
    const params = new URLSearchParams({ client_id: process.env.OBLIO_CLIENT_ID!, client_secret: process.env.OBLIO_CLIENT_SECRET! });
    const response = await fetch("https://www.oblio.eu/api/authorize/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: params });
    if (!response.ok) { const err = await response.text(); throw new Error(`Eroare obținere token Oblio: ${response.status}. Răspuns: ${err}`); }
    const data = await response.json() as { access_token?: string; expires_in?: string };
    if (!data.access_token) throw new Error("Token API Oblio invalid.");
    const expiresIn = parseInt(data.expires_in || '3600', 10);
    oblioTokenCache = { token: data.access_token, expiresAt: now + expiresIn * 1000 - 60000 };
    return data.access_token;
}

/**
 * Funcția centralizată pentru procesarea unei comenzi.
 */
export async function fulfillOrder(
    orderData: { address: Address; billing: Billing; cart: CartItem[] },
    paymentType: 'Ramburs' | 'Card'
) {
    const { address, billing, cart } = orderData;
    
    // --- Pasul 1: Generare Factură Oblio ---
    console.log(`[OrderService] Procesare comandă pentru ${address.email}, plată ${paymentType}.`);
    const token = await getOblioAccessToken();
    let clientPayload = billing.tip_factura === 'companie' ? { cif: billing.cui } : { name: billing.name, address: billing.address, email: address.email };
    const facturaData = {
        cif: process.env.OBLIO_CIF_FIRMA, client: clientPayload, issueDate: new Date().toISOString().slice(0, 10), seriesName: process.env.OBLIO_SERIE_FACTURA,
        products: cart.map(item => ({ name: item.name, price: item.unitAmount, measuringUnitName: "buc", vatName: "S", quantity: item.quantity })),
    };
    const oblioResponse = await fetch("https://www.oblio.eu/api/docs/invoice", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(facturaData) });
    const oblioData = await oblioResponse.json();
    if (oblioData.status !== 200) throw new Error(`Eroare Oblio: ${oblioData.statusMessage}`);
    const invoiceLink = oblioData.data.link;
    console.log(`[OrderService] Factura Oblio generată: ${invoiceLink}`);

    // --- Pasul 2: Trimitere Emailuri Resend ---
    try {
        const totalComanda = (cart.reduce((acc, item) => acc + item.totalAmount, 0) + 19.99).toFixed(2);
        
        // --- AICI ESTE CORECȚIA PRINCIPALĂ: Email-ul către Admin ---
        await resend.emails.send({
            from: 'comenzi@prynt.ro',
            to: 'contact@prynt.ro',
            subject: `Comandă Nouă (${paymentType}) - ${address.nume_prenume}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px;">
                        <h1 style="color: #333;">Comandă Nouă (${paymentType})</h1>
                        
                        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #555;">Date Client</h2>
                        <p><strong>Nume:</strong> ${address.nume_prenume}</p>
                        <p><strong>Email:</strong> ${address.email}</p>
                        <p><strong>Telefon:</strong> ${address.telefon}</p>
                        
                        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #555;">Adresă Livrare</h2>
                        <p>${address.strada_nr}, ${address.localitate}, ${address.judet}</p>
                        
                        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #555;">Detalii Facturare</h2>
                        <p><strong>Tip:</strong> ${billing.tip_factura === 'companie' ? 'Companie' : 'Persoană Fizică'}</p>
                        ${billing.tip_factura === 'companie' ? `<p><strong>CUI:</strong> ${billing.cui}</p>` : `<p><strong>Nume Factură:</strong> ${billing.name}</p><p><strong>Adresă Factură:</strong> ${billing.address}</p>`}
                        
                        <h2 style="border-bottom: 1px solid #eee; padding-bottom: 10px; color: #555;">Produse Comandate</h2>
                        <ul>
                            ${cart.map(item => `<li>${item.name} - <strong>${item.quantity} buc.</strong> - ${item.totalAmount.toFixed(2)} RON</li>`).join('')}
                        </ul>
                        
                        <h3 style="text-align: right; color: #333;">Total Comandă: ${totalComanda} RON</h3>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                        
                        <p style="text-align: center;">
                            <a href="${invoiceLink}" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Vezi Factura Oblio</a>
                        </p>
                    </div>
                </div>
            `
        });

        // Email-ul către client rămâne la fel
        await resend.emails.send({
            from: 'contact@prynt.ro',
            to: address.email,
            subject: 'Comanda ta Prynt.ro a fost înregistrată',
            html: `<p>Salut ${address.nume_prenume},</p><p>Îți mulțumim pentru comanda plasată! Am înregistrat-o cu succes.</p><p><strong>Total Plată: ${totalComanda} RON</strong></p><p>Factura proformă: <a href="${invoiceLink}">Descarcă Factura</a></p><p>O zi excelentă,<br>Echipa Prynt.ro</p>`
        });
        console.log('[OrderService] Emailuri trimise cu succes!');
    } catch (emailError: any) {
        console.error("[OrderService] Eroare la trimiterea emailurilor:", emailError.message);
    }

    return { invoiceLink };
}