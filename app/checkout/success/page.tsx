'use client';

import { useEffect } from 'react';
import { useCart } from '../../../components/CartProvider';
import { CheckCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const { clear } = useCart();
  const search = useSearchParams();
  const sessionId = search.get('session_id');

  useEffect(() => {
    // golește coșul când intrăm pe pagina de succes
    clear();
  }, [clear]);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <CheckCircle className="mx-auto mb-4 text-emerald-400" size={56} />
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Plata a fost finalizată</h1>
        <p className="text-white/70 mb-6">
          Îți mulțumim! Vei primi un email cu detaliile comenzii.
        </p>

        {sessionId && (
          <p className="text-xs text-white/50 mb-8">
            ID sesiune Stripe: {sessionId}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 transition"
          >
            Continuă cumpărăturile
          </a>
          <a
            href="/checkout"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
          >
            Vezi detalii comandă
          </a>
        </div>
      </div>
    </main>
  );
}