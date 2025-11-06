import Link from "next/link";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: { session_id?: string };
};

export default async function SuccessPage({ searchParams }: PageProps) {
  const sessionId = searchParams?.session_id;
  let paymentStatus: string | null = null;

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
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold mb-4">Comandă reușită</h1>
      <p className="text-zinc-700 mb-2">
        Mulțumim pentru comandă!{" "}
        {paymentStatus ? `Status plată: ${paymentStatus}.` : ""}
      </p>
      <p className="text-zinc-700">
        Vei primi un email cu detalii și factura, imediat ce comanda este procesată.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800"
        >
          Înapoi la prima pagină
        </Link>
        <Link
          href="/checkout"
          className="inline-flex items-center rounded-md border border-zinc-300 px-4 py-2 hover:bg-zinc-50"
        >
          Vezi coșul
        </Link>
      </div>
    </main>
  );
}