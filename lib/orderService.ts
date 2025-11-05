import { Resend } from 'resend';

// Reutilizăm tipurile pe care le avem deja definite
interface CartItem { name: string; quantity: number; unitAmount: number; totalAmount: number; }
interface Address { nume_prenume: string; email: string; telefon: string; judet: string; localitate: string; strada_nr: string; }
interface Billing { tip_factura: 'persoana_fizica' | 'companie'; cui?: string; name?: string; address?: string; }

// Ne asigurăm că Resend este inițializat o singură dată
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
 * Generează factura Oblio și trimite emailurile de confirmare.
 * @param orderData Conține adresa, facturarea și coșul de cumpărături.
 * @param paymentType Indică dacă plata a fost 'Ramburs' sau 'Card'.
 */
export async function fulfillOrder(
    orderData: { address: Address; billing: Billing; cart: CartItem[] },
    paymentType: 'Ramburs' | 'Card'
) {
    const { address, billing, cart } = orderData;
    
    // --- Pasul A: Generare Factură Oblio ---
    console.log(`[OrderService] Procesare comandă pentru ${address.email}, plată ${paymentType}. Se generează factura...`);
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

    // --- Pasul B: Trimitere Emailuri Resend ---
    try {
        console.log('[OrderService] Se pregătesc emailurile...');
        const totalComanda = (cart.reduce((acc, item) => acc + item.totalAmount, 0) + 19.99).toFixed(2);
        
        // Email către Admin
        await resend.emails.send({
            from: 'comenzi@prynt.ro',
            to: 'contact@prynt.ro',
            subject: `Comandă Nouă (${paymentType}) - ${address.nume_prenume}`,
            html: `<h1>Comandă Nouă (${paymentType})</h1><p><strong>Client:</strong> ${address.nume_prenume} (${address.email})</p><p><strong>Total:</strong> ${totalComanda} RON</p><p><strong>Factură:</strong> <a href="${invoiceLink}">${invoiceLink}</a></p><!-- Adăugați aici mai multe detalii dacă doriți -->`
        });

        // Email către Client
        await resend.emails.send({
            from: 'contact@prynt.ro',
            to: address.email,
            subject: 'Comanda ta Prynt.ro a fost înregistrată',
            html: `<h1>Confirmare Comandă</h1><p>Salut ${address.nume_prenume},</p><p>Îți mulțumim pentru comanda plasată pe Prynt.ro! Am înregistrat-o cu succes.</p><p><strong>Metoda de plată:</strong> ${paymentType}</p><p><strong>Total Plată: ${totalComanda} RON</strong></p><p>Poți descărca factura proformă de aici: <a href="${invoiceLink}">Descarcă Factura</a></p><p>O zi excelentă,<br>Echipa Prynt.ro</p>`
        });
        console.log('[OrderService] Emailuri trimise cu succes!');
    } catch (emailError: any) {
        console.error("[OrderService] A apărut o eroare la trimiterea emailurilor, dar comanda a fost procesată:", emailError.message);
        // Nu aruncăm eroare mai departe, pentru a nu pica procesul principal.
    }

    // Returnăm link-ul facturii pentru a-l putea folosi în API-ul original
    return { invoiceLink };
}