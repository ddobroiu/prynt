// app/checkout/page.tsx
import CheckoutForm from '@/components/CheckoutForm';
import { readCartFromCookies, calcTotals } from '@/lib/cart';
import Link from 'next/link';

export default function CheckoutPage() {
  const items = readCartFromCookies();

  if (!items.length) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <div className="rounded-2xl border p-8 text-center">
          <p>Coșul este gol.</p>
          <Link
            href="/"
            className="inline-block mt-4 rounded-xl border px-5 py-3 hover:bg-black hover:text-white transition"
          >
            Înapoi la magazin
          </Link>
        </div>
      </main>
    );
  }

  const totals = calcTotals(items);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <CheckoutForm
        initialCart={items as any}
        initialTotals={{ shippingCost: totals.shipping, currency: 'RON' }}
      />
    </main>
  );
}
