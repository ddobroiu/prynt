import Link from "next/link";
import Stripe from "stripe";
import { getOrderNoByStripeSession } from "../../../lib/orderStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Plată reușită",
  robots: { index: false, follow: false },
  alternates: { canonical: "/checkout/success" },
};

type PageProps = {
  searchParams: Promise<{ session_id?: string; o?: string; pm?: string }>;
};

export default async function SuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params?.session_id;
  const qsOrder = Number(params?.o);
  const paymentMethod = params?.pm; // 'OP', 'Ramburs', 'Card'

  let orderNo: number | null = Number.isFinite(qsOrder) && qsOrder > 0 ? qsOrder : null;
  let paymentStatus: string | null = null;

  if (!orderNo && sessionId) {
    try {
      const looked = await getOrderNoByStripeSession(sessionId);
      if (looked && Number.isFinite(looked)) orderNo = looked;
    } catch {}
  }

  if (sessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      paymentStatus = session.payment_status ?? null;
    } catch {
      // Ignorăm erorile
    }
  }

  // Setăm statusul pentru OP/Ramburs manual dacă nu vine din Stripe
  if (!paymentStatus && paymentMethod === 'OP') paymentStatus = 'În așteptare plată';
  if (!paymentStatus && paymentMethod === 'Ramburs') paymentStatus = 'Plată la livrare';

  return (
    <main className="min-h-[60vh] bg-ui">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="rounded-2xl border card-bg p-8 text-ui">
          <div className="flex items-start gap-4">
            <div className="shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-emerald-600/20 border border-emerald-500/30">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">Comanda a fost plasată</h1>
              <p className="text-muted">Mulțumim! Am început procesarea și te ținem la curent pe email.</p>
            </div>
          </div>

          {/* SECȚIUNE TRANSFER BANCAR */}
          {paymentMethod === 'OP' && (
            <div className="mt-8 rounded-xl bg-indigo-900/20 border border-indigo-500/30 p-6">
              <h3 className="text-lg font-bold text-indigo-300 mb-4 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
                Detalii pentru Transfer Bancar
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Te rugăm să efectuezi plata în contul de mai jos. Pentru o procesare rapidă, trimite dovada plății pe email la <span className="text-white font-medium">contact@prynt.ro</span>.
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-indigo-500/20 pb-2">
                  <span className="text-gray-400">Beneficiar:</span>
                  <span className="font-mono font-bold text-white">CULOAREA DIN VIATA SA SRL</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-indigo-500/20 pb-2">
                  <span className="text-gray-400">Banca:</span>
                  <span className="font-bold text-white">Revolut Bank</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-indigo-500/20 pb-2">
                  <span className="text-gray-400">IBAN:</span>
                  <span className="font-mono font-bold text-yellow-400 text-base select-all">RO61REVO0000389950240012</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between border-b border-indigo-500/20 pb-2">
                  <span className="text-gray-400">SWIFT (BIC):</span>
                  <span className="font-mono font-bold text-white select-all">REVOROBB</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between pt-2">
                  <span className="text-gray-400">Detalii plată (Obligatoriu):</span>
                  <span className="font-bold text-indigo-300 text-lg">Comanda #{orderNo || '...'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-muted">Nr. comandă</div>
              <div className="mt-1 text-xl font-semibold">
                {orderNo ? `#${orderNo}` : <span className="text-muted">se alocă...</span>}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-muted">Status plată</div>
              <div className="mt-1 text-xl font-semibold">{paymentStatus ? paymentStatus : '—'}</div>
            </div>
          </div>

          <div className="mt-6 text-sm text-muted">
            Vei primi factura pe email. Când coletul este pregătit, îți trimitem și link-ul de urmărire.
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition">
              Înapoi la prima pagină
            </Link>
            <Link href="/account/orders" className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold hover:bg-white/10 transition">
              Istoric Comenzi
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}