import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);

// --- Funcții ajutătoare copiate din celălalt API ---
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
// --------------------------------------------------

export async function POST(req: NextRequest) {
    const body = await req.text();
    // --- CORECȚIA: Citim header-ul direct din `req.headers` ---
    const signature = req.headers.get('stripe-signature') as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook Signature Verification Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const metadata = session.metadata;
        if (!metadata) {
            console.error("Metadata lipsă în sesiunea Stripe! Nu se poate procesa comanda.");
            return NextResponse.json({ error: "Metadata lipsă" }, { status: 400 });
        }

        const cart = JSON.parse(metadata.cart);
        const address = JSON.parse(metadata.address);
        const billing = JSON.parse(metadata.billing);

        try {
            console.log("Plată Stripe confirmată! Se procesează comanda pentru:", address.email);
            
            // --- PASUL 1: GENERARE FACTURĂ OBLIO ---
            const token = await getOblioAccessToken();
            let clientPayload = billing.tip_factura === 'companie' ? { cif: billing.cui } : { name: billing.name, address: billing.address, email: address.email };
            const facturaData = {
                cif: process.env.OBLIO_CIF_FIRMA, client: clientPayload, issueDate: new Date().toISOString().slice(0, 10), seriesName: process.env.OBLIO_SERIE_FACTURA,
                products: cart.map((item: any) => ({ name: item.name, price: item.unitAmount, measuringUnitName: "buc", vatName: "S", quantity: item.quantity })),
            };
            const oblioResponse = await fetch("https://www.oblio.eu/api/docs/invoice", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify(facturaData) });
            const oblioData = await oblioResponse.json();
            if (oblioData.status !== 200) throw new Error(`Eroare Oblio: ${oblioData.statusMessage}`);
            const invoiceLink = oblioData.data.link;
            console.log(`[Webhook] Factura Oblio generată: ${invoiceLink}`);

            // --- PASUL 2: TRIMITERE EMAILURI RESEND ---
            const totalComanda = (cart.reduce((acc: number, item: any) => acc + item.totalAmount, 0) + 19.99).toFixed(2);
            await resend.emails.send({ from: 'comenzi@prynt.ro', to: 'contact@prynt.ro', subject: `Comandă Nouă (Plătită Card) - ${address.nume_prenume}`, html: `<h1>Comandă Nouă Plătită</h1><p>Client: ${address.nume_prenume} (${address.email})</p><p>Factură: <a href="${invoiceLink}">${invoiceLink}</a></p><!-- Adaugă restul detaliilor aici -->` });
            await resend.emails.send({ from: 'contact@prynt.ro', to: address.email, subject: 'Comanda ta Prynt.ro a fost confirmată și plătită', html: `<h1>Comandă Confirmată</h1><p>Salut ${address.nume_prenume},</p><p>Confirmăm că am primit plata pentru comanda ta. Îți mulțumim!</p><p>Poți descărca factura de aici: <a href="${invoiceLink}">Descarcă Factura</a></p>` });
            console.log(`[Webhook] Emailuri de confirmare trimise.`);

        } catch (err: any) {
            console.error("[Webhook] EROARE la procesarea comenzii după plată:", err.message);
            // Puteți trimite un email de notificare aici în caz de eroare la procesare
            return NextResponse.json({ error: "Eroare la procesarea internă a comenzii." }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}