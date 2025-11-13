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
  searchParams: { session_id?: string; o?: string };
};

export default async function SuccessPage({ searchParams }: PageProps) {
  const sessionId = searchParams?.session_id;
  const qsOrder = Number(searchParams?.o);
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
      // Ignorăm erorile pentru UX
    }
  }

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

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-muted">Nr. comandă</div>
              <div className="mt-1 text-xl font-semibold">
                {orderNo ? `#${orderNo}` : <span className="text-muted">se alocă… verifică emailul</span>}
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
            <Link href="/checkout" className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold hover:bg-white/10 transition">
              Vezi coșul
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}