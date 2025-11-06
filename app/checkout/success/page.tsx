="use client";

import { useEffect } from "react";
import { useCart } from "../../components/CartProvider";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    clear(); // golește coșul la intrarea pe pagină
  }, [clear]);

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <CheckCircle className="mx-auto mb-4 text-emerald-400" size={56} />
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Comanda a fost plasată</h1>
        <p className="text-white/70 mb-8">Îți mulțumim! Vei primi în scurt timp un email cu detaliile comenzii.</p>

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