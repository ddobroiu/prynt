import Link from 'next/link';
import Stripe from 'stripe';
import { redirect } from 'next/navigation';

type PageProps = {
  searchParams: { session_id?: string };
};

// Dacă vine din plata cu cardul (Stripe Embedded Checkout), Stripe adaugă ?session_id=...
// Pentru "ramburs", nu avem session_id și afișăm un mesaj generic de succes.
export default async function SuccessPage({ searchParams }: PageProps) {
  const sessionId = searchParams?.session_id;

  let paid = false;
  let email: string | null = null;
  let amountTotalRon: string | null = null;

  if (sessionId) {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      // Dacă lipsesc cheile, mai bine nu blocăm UX-ul, continuăm cu mesaj generic
      console.warn('STRIPE_SECRET_KEY nu este setat.');
    } else {
      const stripe = new Stripe(stripeSecret);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      // Considerăm succes: payment_status === 'paid' sau status === 'complete'
      paid = session.payment_status === 'paid' || session.status === 'complete';
      email = session.customer_details?.email ?? null;
      if (session.amount_total && session.currency === 'ron') {
        amountTotalRon = (session.amount_total / 100).toFixed(2);
      }
      if (!paid) {
        redirect(`/checkout/failed?session_id=${encodeURIComponent(sessionId)}`);
      }
    }
  } else {
    // Scenariu "ramburs": nu avem session_id, tratăm ca succes
    paid = true;
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-semibold mb-4">Comandă reușită 🎉</h1>
      <p className="text-zinc-700 mb-2">
        Îți mulțumim pentru comandă! {email ? `Ți-am trimis confirmarea pe ${email}.` : 'Ți-am trimis confirmarea pe email.'}
      </p>
      {amountTotalRon && (
        <p className="text-zinc-700 mb-2">Total plătit: {amountTotalRon} RON</p>
      )}
      {!sessionId && (
        <p className="text-zinc-700 mb-2">
          Metodă de plată: Ramburs. Vei achita la livrare.
        </p>
      )}
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-md bg-black px-4 py-2 text-white hover:bg-zinc-800"
        >
          Continuă cumpărăturile
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center rounded-md border border-zinc-300 px-4 py-2 hover:bg-zinc-50"
        >
          Ai întrebări? Contactează-ne
        </Link>
      </div>
    </main>
  );
}