import Link from 'next/link';
import Stripe from 'stripe';

type PageProps = {
  searchParams: { session_id?: string };
};

export const metadata = {
  title: 'Plată eșuată',
  robots: { index: false, follow: false },
  alternates: { canonical: '/checkout/failed' },
};

export default async function FailedPage({ searchParams }: PageProps) {
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
      <h1 className="text-3xl font-semibold mb-4">Comandă nereușită</h1>
      <p className="text-zinc-700 mb-2">
        Plata a fost anulată sau a eșuat. {paymentStatus ? `Status plată: ${paymentStatus}.` : ''}
      </p>
      <p className="text-zinc-700">
        Te rugăm să încerci din nou. Dacă problema persistă, contactează-ne.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/checkout"
          className="inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800"
        >
          Reîncearcă plata
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center rounded-md border border-zinc-300 px-4 py-2 hover:bg-zinc-50"
        >
          Contact suport
        </Link>
      </div>
    </main>
  );
}