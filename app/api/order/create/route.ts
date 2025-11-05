import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend'; // Importăm noua librărie

// Tipuri de date
interface CartItem { name: string; quantity: number; unitAmount: number; totalAmount: number; }
interface Address { nume_prenume: string; email: string; telefon: string; judet: string; localitate: string; strada_nr: string; }
interface Billing { tip_factura: 'persoana_fizica' | 'companie'; cui?: string; name?: string; address?: string; }
interface OrderPayload { address: Address; billing: Billing; cart: CartItem[]; }

// Cache pentru token-ul Oblio
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

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    const { address, billing, cart }: OrderPayload = await req.json();

    if (!address || !billing || !cart || !cart.length) {
        return NextResponse.json({ message: 'Date de comandă invalide.' }, { status: 400 });
    }

    try {
        // --- PASUL 1: GENERARE FACTURĂ OBLIO ---
        console.log('[Oblio Invoice] - Încercare de generare factură...');
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
        console.log(`[Oblio Invoice] SUCCES: Factura generată: ${invoiceLink}`);

        // --- PASUL 2: TRIMITERE EMAILURI CU RESEND ---
        try {
            console.log('[Resend] - Se pregătesc emailurile...');
            const totalComanda = (cart.reduce((acc, item) => acc + item.totalAmount, 0) + 19.99).toFixed(2);
            
            // Email către Admin
            await resend.emails.send({
                from: 'comenzi@prynt.ro', // Trebuie să fie un domeniu verificat în contul Resend
                to: 'contact@prynt.ro',
                subject: `Comandă Nouă - ${address.nume_prenume}`,
                html: `
                    <h1>Comandă Nouă</h1>
                    <p><strong>Nume:</strong> ${address.nume_prenume}</p>
                    <p><strong>Email:</strong> ${address.email}</p>
                    <p><strong>Telefon:</strong> ${address.telefon}</p>
                    <hr>
                    <h2>Adresă Livrare</h2>
                    <p>${address.strada_nr}, ${address.localitate}, ${address.judet}</p>
                    <hr>
                    <h2>Detalii Facturare</h2>
                    <p><strong>Tip:</strong> ${billing.tip_factura}</p>
                    ${billing.tip_factura === 'companie' ? `<p><strong>CUI:</strong> ${billing.cui}</p>` : `<p><strong>Nume:</strong> ${billing.name}</p><p><strong>Adresă:</strong> ${billing.address}</p>`}
                    <hr>
                    <h2>Produse</h2>
                    <ul>
                        ${cart.map(item => `<li>${item.name} - ${item.quantity} buc. - ${item.totalAmount.toFixed(2)} RON</li>`).join('')}
                    </ul>
                    <h3>Total: ${totalComanda} RON</h3>
                    <hr>
                    <p><strong>Link Factură Oblio:</strong> <a href="${invoiceLink}">${invoiceLink}</a></p>
                `
            });

            // Email către Client
            await resend.emails.send({
                from: 'contact@prynt.ro', // Trebuie să fie un domeniu verificat
                to: address.email,
                subject: 'Comanda ta Prynt.ro a fost înregistrată',
                html: `
                    <h1>Confirmare Comandă</h1>
                    <p>Salut ${address.nume_prenume},</p>
                    <p>Îți mulțumim pentru comanda plasată pe Prynt.ro! Am înregistrat-o cu succes.</p>
                    <h3>Sumar Comandă</h3>
                    <ul>
                        ${cart.map(item => `<li>${item.name} - ${item.quantity} buc.</li>`).join('')}
                    </ul>
                    <p><strong>Total Plată: ${totalComanda} RON</strong></p>
                    <p>Vei fi contactat în curând pentru confirmarea finală și detalii despre livrare.</p>
                    <p>Poți descărca factura proformă de aici: <a href="${invoiceLink}">Descarcă Factura</a></p>
                    <br>
                    <p>O zi excelentă,</p>
                    <p>Echipa Prynt.ro</p>
                `
            });
            console.log('[Resend] - Emailuri trimise cu succes!');
        } catch (emailError: any) {
            console.error("[Resend] - A apărut o eroare la trimiterea emailurilor:", emailError.message);
            // Nu oprim procesul, doar înregistrăm eroarea. Comanda este deja plasată.
        }

        return NextResponse.json({ success: true, message: 'Factura a fost generată și emailurile au fost trimise!', invoiceLink: invoiceLink });

    } catch (error: any) {
        console.error('[Create Order API] - EROARE CRITICĂ:', error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}