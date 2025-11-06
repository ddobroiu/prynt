"use client";

import { useMemo, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../../components/CartProvider";
import { ShieldCheck, Truck, X } from "lucide-react";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type PaymentMethod = "ramburs" | "card";

type Address = {
  nume_prenume: string;
  email: string;
  telefon: string;
  judet: string;
  localitate: string;
  strada_nr: string;
};

type Billing = {
  tip_factura: "persoana_fizica" | "persoana_juridica";
  denumire_companie?: string;
  cui?: string;
  reg_com?: string;
  judet?: string;
  localitate?: string;
  strada_nr?: string;
};

export default function CheckoutPage() {
  const { items, removeItem, isLoaded } = useCart();

  const [address, setAddress] = useState<Address>({
    nume_prenume: "",
    email: "",
    telefon: "",
    judet: "",
    localitate: "",
    strada_nr: "",
  });

  const [billing, setBilling] = useState<Billing>({
    tip_factura: "persoana_fizica",
  });

  const [sameAsDelivery, setSameAsDelivery] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ramburs");

  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showEmbed, setShowEmbed] = useState(false);

  // pentru scroll la primul câmp invalid
  const firstInvalidRef = useRef<HTMLElement | null>(null);

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.totalAmount, 0),
    [items]
  );
  const costLivrare = items.length > 0 ? 19.99 : 0;
  const totalPlata = items.length > 0 ? subtotal + costLivrare : 0;
  const isEmpty = isLoaded && items.length === 0;

  const fmt = new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    maximumFractionDigits: 2,
  }).format;

  function validate(): { ok: boolean; errs: Record<string, string> } {
    const e: Record<string, string> = {};

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telRe = /^[0-9+()\-\s]{7,}$/;

    // Livrare - obligatorii
    if (!address.nume_prenume.trim()) e["address.nume_prenume"] = "Nume și prenume obligatoriu";
    if (!emailRe.test(address.email)) e["address.email"] = "Email invalid";
    if (!telRe.test(address.telefon)) e["address.telefon"] = "Telefon invalid";
    if (!address.judet) e["address.judet"] = "Alege județul";
    if (!address.localitate.trim()) e["address.localitate"] = "Localitate obligatorie";
    if (!address.strada_nr.trim()) e["address.strada_nr"] = "Stradă și număr obligatorii";

    // Facturare
    if (billing.tip_factura === "persoana_juridica") {
      if (!billing.denumire_companie?.trim())
        e["billing.denumire_companie"] = "Denumire companie obligatorie";
      if (!billing.cui?.trim()) e["billing.cui"] = "CUI/CIF obligatoriu";
      // reg_com poate fi opțional
    }

    // Adresa de facturare (dacă nu e aceeași)
    if (!sameAsDelivery) {
      if (!billing.judet) e["billing.judet"] = "Alege județul (facturare)";
      if (!billing.localitate?.trim())
        e["billing.localitate"] = "Localitate facturare obligatorie";
      if (!billing.strada_nr?.trim())
        e["billing.strada_nr"] = "Stradă și număr facturare obligatorii";
    }

    // Coș
    if (items.length === 0) e["cart.empty"] = "Coșul este gol";

    return { ok: Object.keys(e).length === 0, errs: e };
  }

  async function placeOrder() {
    if (placing) return;
    setPlacing(true);
    setErrors({});
    firstInvalidRef.current = null;

    const { ok, errs } = validate();
    if (!ok) {
      setErrors(errs);
      // încearcă să derulezi la primul câmp invalid (după id-uri stabilite în CheckoutForm)
      const firstKey = Object.keys(errs)[0];
      const el = document.querySelector<HTMLElement>(
        `[data-field="${firstKey}"]`
      );
      if (el) {
        firstInvalidRef.current = el;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setPlacing(false);
      return;
    }

    const orderData = {
      cart: items,
      address,
      billing: {
        ...billing,
        // dacă e aceeași, copiem adresa de livrare în facturare (să existe valori)
        ...(sameAsDelivery
          ? {
              judet: address.judet,
              localitate: address.localitate,
              strada_nr: address.strada_nr,
            }
          : {}),
      },
    };

    try {
      if (paymentMethod === "ramburs") {
        const res = await fetch("/api/order/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        const data = await res.json();
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Eroare la crearea comenzii.");
        }
        window.location.href = "/checkout/success";
        return;
      }

      // Card (Stripe Embedded Checkout)
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (!res.ok || !data?.clientSecret) {
        throw new Error(data?.error || "Nu s-a putut iniția plata cu cardul.");
      }

      // Arată containerul pentru Embedded Checkout și montează
      setShowEmbed(true);
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe nu a putut fi inițializat.");

      const embeddedCheckout = await stripe.initEmbeddedCheckout({
        clientSecret: data.clientSecret,
      });
      embeddedCheckout.mount("#stripe-embedded");
      // UI rămâne blocat până la finalizarea plății (success redirect)
    } catch (err: any) {
      console.error("[placeOrder] error:", err?.message || err);
      alert(err?.message || "A apărut o eroare. Reîncearcă.");
      setShowEmbed(false);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <main className="bg-[#0b0f19] min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header + CTA continuă cumpărăturile */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Coșul tău</h1>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition"
          >
            Continuă cumpărăturile
          </a>
        </div>

        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* SUMAR primul pe mobil */}
            <aside className="order-1 lg:order-2 lg:col-span-1">
              <SummaryCard
                subtotal={subtotal}
                shipping={costLivrare}
                total={totalPlata}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onPlaceOrder={placeOrder}
                placing={placing}
              />
            </aside>

            {/* FORM + PRODUSE */}
            <section className={`order-2 lg:order-1 lg:col-span-2 space-y-6 ${showEmbed ? "hidden" : ""}`}>
              <CartItems items={items} onRemove={removeItem} />

              <CheckoutForm
                address={address}
                setAddress={(updater) => setAddress((prev) => updater(prev))}
                billing={billing}
                setBilling={(updater) => setBilling((prev) => updater(prev))}
                sameAsDelivery={sameAsDelivery}
                setSameAsDelivery={setSameAsDelivery}
                errors={errors}
              />
            </section>
          </div>
        )}
      </div>

      {/* CONTAINER Stripe Embedded Checkout */}
      {showEmbed && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-gray-950 p-4">
            <div className="mb-3 text-center text-white/80">Finalizează plata în siguranță</div>
            <div id="stripe-embedded" />
            <div className="mt-3 text-center text-xs text-white/50">
              După finalizare, vei fi redirecționat înapoi pentru confirmare.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function EmptyCart() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
      <h2 className="text-xl font-bold mb-2">Coșul tău este gol</h2>
      <p className="text-white/70 mb-6">Adaugă produse pentru a continua.</p>
      <a
        href="/"
        className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 transition"
      >
        Continuă cumpărăturile
      </a>
    </div>
  );
}

function SummaryCard({
  subtotal,
  shipping,
  total,
  paymentMethod,
  setPaymentMethod,
  onPlaceOrder,
  placing,
}: {
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: "ramburs" | "card";
  setPaymentMethod: (v: "ramburs" | "card") => void;
  onPlaceOrder: () => void;
  placing: boolean;
}) {
  const fmt = new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 2 }).format;

  return (
    <div className="lg:sticky lg:top-6 rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-xl font-bold mb-4">Sumar comandă</h2>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-white/70">Produse</span>
          <span className="font-semibold">{fmt(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-white/70">
            <Truck size={16} className="text-white/50" />
            Livrare
          </span>
          <span className="font-semibold">{fmt(shipping)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-white/90 font-semibold">Total</span>
          <span className="text-2xl font-extrabold">{fmt(total)}</span>
        </div>
      </div>

      {/* Plata */}
      <div className="mt-5">
        <div className="mb-3 flex gap-3">
          <button
            onClick={() => setPaymentMethod("ramburs")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold border ${
              paymentMethod === "ramburs" ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            Ramburs
          </button>
          <button
            onClick={() => setPaymentMethod("card")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold border ${
              paymentMethod === "card" ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            Card online
          </button>
        </div>

        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={placing}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-60"
        >
          <ShieldCheck size={16} />
          {placing ? "Se procesează..." : "Plasează comanda"}
        </button>

        <p className="mt-2 text-[11px] text-white/50 text-center">
          Plata cu cardul este securizată. Pentru ramburs, plătești la curier.
        </p>
      </div>
    </div>
  );
}

function CartItems({ items, onRemove }: { items: Array<any>; onRemove: (id: string) => void }) {
  const fmt = new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 2 }).format;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h2 className="text-xl font-bold mb-4">Produsele tale</h2>
      <ul className="divide-y divide-white/10">
        {items.map((item) => (
          <li key={item.id} className="py-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-semibold truncate pr-2">{item.name}</p>
                <span className="text-white/70 text-sm">x{item.quantity}</span>
              </div>
              <div className="mt-1 text-sm text-white/70">
                {item.artworkUrl && (
                  <a
                    className="underline text-indigo-300"
                    href={item.artworkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    fișier încărcat
                  </a>
                )}
                {"textDesign" in item && item.textDesign && (
                  <span className="ml-2 inline-block rounded bg-white/10 px-2 py-0.5 text-[11px]">
                    text inclus
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-semibold">{fmt(item.totalAmount)}</span>
              <button
                onClick={() => onRemove(item.id)}
                className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10"
                aria-label="Elimină"
                title="Elimină"
              >
                <X size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}