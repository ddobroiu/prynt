import { NextRequest, NextResponse } from 'next/server';

// Tipuri de date
interface CartItem { name: string; quantity: number; unitAmount: number; totalAmount: number; }
interface Address { nume_prenume: string; email: string; telefon: string; judet: string; localitate: string; strada_nr: string; }
interface Billing { tip_factura: 'persoana_fizica' | 'companie'; cui?: string; name?: string; address?: string; }
interface OrderPayload { address: Address; billing: Billing; cart: CartItem[]; }

let oblioTokenCache: { token: string; expiresAt: number } | null = null;

// --- FUNCȚIA DE AUTENTIFICARE, CU LOGGING DETALIAT ---
async function getOblioAccessToken() {
    const now = Date.now();
    if (oblioTokenCache && oblioTokenCache.expiresAt > now) return oblioTokenCache.token;

    console.log('[Oblio Auth] - Se cere un token nou cu Client ID:', process.env.OBLIO_CLIENT_ID);
    const params = new URLSearchParams({
        client_id: process.env.OBLIO_CLIENT_ID!,
        client_secret: process.env.OBLIO_CLIENT_SECRET!
    });

    const response = await fetch("https://www.oblio.eu/api/authorize/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
    });

    // --- LOGGING DETALIAT PENTRU EROARE ---
    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`[Oblio Auth] - EROARE ${response.status} la obținere token. Răspuns brut:`, errorBody);
        throw new Error(`Eroare obținere token Oblio: ${response.status}. Răspuns server: ${errorBody}`);
    }

    const data = await response.json() as { access_token?: string; expires_in?: string };
    if (!data.access_token) throw new Error("Token API Oblio invalid primit.");
    
    const expiresIn = parseInt(data.expires_in || '3600', 10);
    oblioTokenCache = { token: data.access_token, expiresAt: now + expiresIn * 1000 - 60000 };
    return data.access_token;
}


export async function POST(req: NextRequest) {
    const { address, billing, cart }: OrderPayload = await req.json();
    if (!address || !billing || !cart || !cart.length) {
        return NextResponse.json({ message: 'Date de comandă invalide.' }, { status: 400 });
    }

    try {
        const token = await getOblioAccessToken();
        
        let clientPayload = {};
        if (billing.tip_factura === 'companie') {
            clientPayload = { cif: billing.cui };
        } else {
            clientPayload = { name: billing.name, address: billing.address, email: address.email };
        }

        const facturaData = {
            cif: process.env.OBLIO_CIF_FIRMA,
            client: clientPayload,
            issueDate: new Date().toISOString().slice(0, 10),
            seriesName: process.env.OBLIO_SERIE_FACTURA,
            products: cart.map(item => ({
                name: item.name, price: item.unitAmount, measuringUnitName: "buc", vatName: "S", quantity: item.quantity
            })),
        };

        const oblioResponse = await fetch("https://www.oblio.eu/api/docs/invoice", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(facturaData) });
        const rawResponse = await oblioResponse.text();
        const data = JSON.parse(rawResponse);

        if (data.status !== 200) {
            throw new Error(`Eroare Oblio: ${data.statusMessage || rawResponse}`);
        }

        const invoiceLink = data.data.link;
        console.log(`[Oblio Invoice] Factura generată: ${invoiceLink}`);
        console.log('[DPD] Simulare generare AWB pentru:', address);
        return NextResponse.json({ success: true, message: 'Comanda procesată!', facturaUrl: invoiceLink });

    } catch (error: any) {
        console.error('[Create Order API] - EROARE CRITICĂ:', error.message);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
