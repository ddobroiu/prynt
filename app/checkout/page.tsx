"use client";

import { useCart } from "../../components/CartProvider";
import { money } from "../../lib/format";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, total, removeItem, clear } = useCart();
  const [loading, setLoading] = useState(false);

  async function pay() {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      if (data.url) window.location.href = data.url; // Stripe Checkout URL
    } catch (e) {
      alert("Eroare la inițierea plății.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      <section className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Finalizează comanda</h1>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            Coșul este gol. <a className="underline" href="/banner">Adaugă un banner</a>.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Listă produse */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((it) => (
                <div key={it.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold">{it.name}</div>
                      {it.description && <div className="text-white/70 text-sm">{it.description}</div>}
                      <div className="text-sm mt-1">
                        Buc: <b>{it.quantity}</b> • Unitar: <b>{money(it.unitAmount)}</b>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{money(it.totalAmount)}</div>
                      <button onClick={() => removeItem(it.id)} className="text-xs text-white/60 hover:text-white underline mt-1">
                        Șterge
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button onClick={clear} className="text-sm text-white/70 underline">
                Golește coșul
              </button>
            </div>

            {/* Sumar & plată */}
            <aside className="rounded-2xl border border-white/10 bg-white/5 p-6 h-fit">
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="text-xl font-bold">{money(total)}</span>
              </div>
              <p className="text-xs text-white/60 mt-2">
                Plata procesată prin Stripe. Se pot colecta date de livrare în pasul următor.
              </p>
              <button
                onClick={pay}
                disabled={loading}
                className="mt-4 w-full px-5 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 disabled:opacity-60"
              >
                {loading ? "Se inițiază plata..." : "Plătește cu cardul"}
              </button>
              <div className="mt-3 text-xs text-white/60">
                Continuând, accepți <a className="underline" href="#">Termenii</a> & <a className="underline" href="#">Politica</a>.
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
