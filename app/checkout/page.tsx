"use client";

import { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Address, Billing, CartItem } from "../../types";
import { useCart } from "../../components/CartProvider";
import { X, ShoppingCart, Truck, ShieldCheck } from "lucide-react";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
  const [billing, setBilling] = useState<Billing>({ tip_factura: "persoana_fizica" });
  const [sameAsDelivery, setSameAsDelivery] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"ramburs" | "card">("ramburs");
  const [judete, setJudete] = useState<string[]>([]);

  useEffect(() => {
    const listaJudete = [
      "Alba","Arad","Arges","Bacau","Bihor","Bistrita-Nasaud","Botosani","Brasov","Braila",
      "Bucuresti","Buzau","Caras-Severin","Calarasi","Cluj","Constanta","Covasna","Dambovita",
      "Dolj","Galati","Giurgiu","Gorj","Harghita","Hunedoara","Ialomita","Iasi","Ilfov",
      "Maramures","Mehedinti","Mures","Neamt","Olt","Prahova","Satu Mare","Salaj","Sibiu",
      "Suceava","Teleorman","Timis","Tulcea","Vaslui","Valcea","Vrancea",
    ];
    setJudete(listaJudete);
  }, []);

  // Totaluri
  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.totalAmount, 0), [items]);
  const costLivrare = items.length > 0 ? 19.99 : 0;
  const totalPlata = items.length > 0 ? subtotal + costLivrare : 0;

  // Opțiuni Stripe
  const stripeOptions = {
    mode: "payment" as const,
    amount: Math.round(totalPlata * 100),
    currency: "ron",
    // Asigură-te că succesul redirecționează la /success ca să se golească coșul
    // Dacă folosești server-side session, setează acolo success_url: `${origin}/success`
  };

  const isEmpty = isLoaded && items.length === 0;

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
            {/* Sumar pe mobil primul: order-1; pe desktop apare în dreapta și sticky */}
            <aside className="order-1 lg:order-2 lg:col-span-1">
              <SummaryCard
                items={items}
                subtotal={subtotal}
                shipping={costLivrare}
                total={totalPlata}
              />
            </aside>

            {/* Lista produse + Form pe mobil după sumar: order-2; pe desktop în stânga */}
            <section className="order-2 lg:order-1 lg:col-span-2 space-y-6">
              <CartItems items={items} onRemove={removeItem} />

              {/* Formularele de adresă/facturare (simplificat – poți păstra ce aveai) */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h2 className="text-xl font-bold mb-3">Date livrare</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input label="Nume și prenume" value={address.nume_prenume} onChange={(v) => setAddress((a) => ({ ...a, nume_prenume: v }))} />
                  <Input label="Telefon" value={address.telefon} onChange={(v) => setAddress((a) => ({ ...a, telefon: v }))} />
                  <Input label="Email" value={address.email} onChange={(v) => setAddress((a) => ({ ...a, email: v }))} />
                  <Select label="Județ" value={address.judet} onChange={(v) => setAddress((a) => ({ ...a, judet: v }))} options={judete} />
                  <Input label="Localitate" value={address.localitate} onChange={(v) => setAddress((a) => ({ ...a, localitate: v }))} />
                  <Input label="Stradă, nr." value={address.strada_nr} onChange={(v) => setAddress((a) => ({ ...a, strada_nr: v }))} />
                </div>
              </div>

              {/* Integrare Stripe (dacă plătești cu cardul) */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h2 className="text-xl font-bold mb-3">Plată</h2>
                <div className="flex gap-3 mb-3">
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
                      paymentMethod === "card" ? "border-emerald-500 bg-emerald-500/10" : "border-white/10 bg-white/5 hover:bg:white/10"
                    }`}
                  >
                    Card online
                  </button>
                </div>

                {paymentMethod === "card" ? (
                  <Elements stripe={stripePromise} options={stripeOptions}>
                    <CheckoutForm
                      address={address}
                      billing={billing}
                      sameAsDelivery={sameAsDelivery}
                      total={totalPlata}
                      // Asigură-te că după succes redirecționezi la /success în CheckoutForm
                    />
                  </Elements>
                ) : (
                  <div className="text-sm text-white/70">
                    Vei plăti cash sau cu cardul la curier. Pentru finalizare, apasă pe “Plasează comanda” din sumar.
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
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
  items,
  subtotal,
  shipping,
  total,
}: {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
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

      <div className="mt-5 space-y-2">
        <a
          href="/"
          className="inline-flex w-full items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition"
        >
          Continuă cumpărăturile
        </a>

        {/* Pentru ramburs: finalizează comanda direct (poți adapta să creeze comanda server-side) */}
        <button
          type="button"
          onClick={() => {
            // Pentru plata ramburs: redirect direct la succes (sau creezi comanda și apoi redirect)
            window.location.href = "/success";
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition"
        >
          <ShieldCheck size={16} />
          Plasează comanda
        </button>

        <p className="text-[11px] text-white/50 text-center">
          Plata cu cardul este securizată. Pentru ramburs, vei achita curierului.
        </p>
      </div>
    </div>
  );
}

function CartItems({ items, onRemove }: { items: CartItem[]; onRemove: (id: string) => void }) {
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
                  <a className="underline text-indigo-300" href={item.artworkUrl} target="_blank" rel="noopener noreferrer">
                    fișier încărcat
                  </a>
                )}
                {item.textDesign && (
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

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="text-sm">
      <span className="mb-1 block text-white/70">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-white/10 bg-gray-900/40 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="text-sm">
      <span className="mb-1 block text-white/70">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-white/10 bg-gray-900/40 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
      >
        <option value="">— alege —</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}