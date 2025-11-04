// app/checkout/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../components/CartProvider";
import { money } from "../../lib/format";

type Address = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  street?: string;
  city?: string;
  county?: string;
  postcode?: string;
  notes?: string;
};

type Billing = {
  type?: "pf" | "pj";
  company?: string;
  cui?: string;
  regcom?: string;
  billingStreet?: string;
  billingCity?: string;
  billingCounty?: string;
  billingPostcode?: string;
};

export default function CheckoutPage() {
  const { items, total, removeItem, clear } = useCart();
  const [addr, setAddr] = useState<Address>({});
  const [bill, setBill] = useState<Billing>({});
  const [loading, setLoading] = useState(false);

  // load address & billing saved at /checkout/address
  useEffect(() => {
    try {
      const a = localStorage.getItem("addr");
      const b = localStorage.getItem("bill");
      if (a) setAddr(JSON.parse(a));
      if (b) setBill(JSON.parse(b));
    } catch {}
  }, []);

  const hasAddress = useMemo(
    () => Boolean(addr?.firstName && addr?.lastName && addr?.street && addr?.city && addr?.postcode),
    [addr]
  );

  async function pay() {
    if (!hasAddress) {
      alert("Te rugăm să completezi adresa de livrare înainte de plată.");
      window.location.href = "/checkout/address";
      return;
    }
    if (items.length === 0) {
      alert("Coșul este gol.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, addr, bill }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url; // Stripe Checkout
      } else {
        throw new Error("No checkout URL");
      }
    } catch (e) {
      console.error(e);
      alert("A apărut o eroare la inițierea plății. Încearcă din nou.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white">
      <section className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Finalizează comanda</h1>

        {/* Address summary */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-lg font-semibold mb-2">Adresa de livrare</div>
              {hasAddress ? (
                <div className="text-sm text-white/80 space-y-1">
                  <div>
                    {(addr.firstName || "") + " " + (addr.lastName || "")}
                    {addr.phone ? <span className="text-white/60"> • {addr.phone}</span> : null}
                  </div>
                  <div>{addr.street}</div>
                  <div>
                    {addr.city}{addr.city && (addr.county ? ", " : "")}{addr.county}
                  </div>
                  <div>{addr.postcode}</div>
                  {addr.email ? <div className="text-white/60">{addr.email}</div> : null}
                  {addr.notes ? <div className="text-white/60 italic">Note: {addr.notes}</div> : null}
                </div>
              ) : (
                <div className="text-sm text-white/70">
                  Nu ai completat încă adresa de livrare.
                </div>
              )}
            </div>
            <a
              href="/checkout/address"
              className="h-10 inline-flex items-center rounded-lg border border-white/20 bg-white/0 px-4 text-sm hover:bg-white/10"
            >
              {hasAddress ? "Editează adresa" : "Completează adresa"}
            </a>
          </div>

          {/* Billing short view */}
          {bill?.type === "pj" && (
            <div className="mt-4 text-sm text-white/80">
              <div className="font-semibold mb-1">Facturare firmă</div>
              <div>{bill.company}</div>
              <div className="text-white/60">CUI: {bill.cui} • Reg. Com.: {bill.regcom}</div>
              {(bill.billingStreet || bill.billingCity || bill.billingCounty || bill.billingPostcode) && (
                <div className="text-white/60">
                  {bill.billingStreet} {bill.billingCity ? `, ${bill.billingCity}` : ""}{" "}
                  {bill.billingCounty ? `, ${bill.billingCounty}` : ""} {bill.billingPostcode}
                </div>
              )}
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            Coșul este gol. <a className="underline" href="/banner">Adaugă un banner</a>.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((it) => (
                <div key={it.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold">{it.name}</div>
                      {it.description && (
                        <div className="text-white/70 text-sm">{it.description}</div>
                      )}
                      <div className="text-sm mt-1">
                        Cantitate: <b>{it.quantity}</b> • Unitar: <b>{money(it.unitAmount)}</b>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{money(it.totalAmount)}</div>
                      <button
                        onClick={() => removeItem(it.id)}
                        className="text-xs text-white/60 hover:text-white underline mt-1"
                      >
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

            {/* Summary & pay */}
            <aside className="rounded-2xl border border-white/10 bg-white/5 p-6 h-fit">
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="text-xl font-bold">{money(total)}</span>
              </div>
              <p className="text-xs text-white/60 mt-2">
                Plata este procesată prin Stripe. Datele tale sunt securizate.
              </p>

              <button
                onClick={pay}
                disabled={loading}
                className="mt-4 w-full px-5 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 disabled:opacity-60"
              >
                {loading ? "Se inițiază plata..." : "Plătește cu cardul"}
              </button>

              {!hasAddress && (
                <div className="mt-3 text-xs text-amber-300/90">
                  • Trebuie să completezi adresa înainte de plată.
                </div>
              )}

              <div className="mt-3 text-xs text-white/60">
                Continuând, accepți <a className="underline" href="#">Termenii</a> și <a className="underline" href="#">Politica</a>.
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
