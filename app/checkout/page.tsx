"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import ReturningCustomerLogin from "@/components/ReturningCustomerLogin";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../../components/CartContext";
import { ShieldCheck, Truck, X, Plus, Minus, CreditCard, Banknote, Building2 } from "lucide-react";
import CheckoutForm from "./CheckoutForm";
import DeliveryInfo from "@/components/DeliveryInfo";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type PaymentMethod = "ramburs" | "card" | "op"; // Adăugat tip 'op'

type Address = {
  nume_prenume: string;
  email: string;
  telefon: string;
  judet: string;
  localitate: string;
  strada_nr: string;
  postCode?: string;
  bloc?: string;
  scara?: string;
  etaj?: string;
  ap?: string;
  interfon?: string;
};

type Billing = {
  tip_factura: "persoana_fizica" | "persoana_juridica";
  name?: string;
  denumire_companie?: string;
  cui?: string;
  reg_com?: string;
  judet?: string;
  localitate?: string;
  strada_nr?: string;
  postCode?: string;
  bloc?: string;
  scara?: string;
  etaj?: string;
  ap?: string;
  interfon?: string;
};

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items = [], removeItem, isLoaded } = useCart();

  const [address, setAddress] = useState<Address>({
    nume_prenume: "",
    email: "",
    telefon: "",
    judet: "",
    localitate: "",
    strada_nr: "",
    postCode: "",
  });

  const [billing, setBilling] = useState<Billing>({
    tip_factura: "persoana_fizica",
  });

  const [sameAsDelivery, setSameAsDelivery] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ramburs");

  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showEmbed, setShowEmbed] = useState(false);
  const [createAccount, setCreateAccount] = useState(true);

  const firstInvalidRef = useRef<HTMLElement | null>(null);

  // Prefill address
  useEffect(() => {
    const alreadyFilled = address?.nume_prenume || address?.email || address?.telefon || address?.judet || address?.localitate || address?.strada_nr;
    if (!session?.user || alreadyFilled) return;
    fetch('/api/account/last-address', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => { if (data?.address) setAddress((prev) => ({ ...prev, ...data.address })); })
      .catch(() => {});
  }, [session?.user]);

  // Prefill billing
  useEffect(() => {
    if (!session?.user) return;
    const emptyBilling = !billing.cui && !billing.denumire_companie && !billing.judet && !billing.localitate && !billing.strada_nr;
    if (!emptyBilling) return;
    fetch('/api/account/last-billing', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data?.billing) {
          setBilling((prev) => ({ ...prev, ...data.billing }));
          if (data.billing.judet && data.billing.localitate && data.billing.strada_nr) {
            setSameAsDelivery(false);
          }
        }
      })
      .catch(() => {});
  }, [session?.user]);

  useEffect(() => {
    if (session?.user) setCreateAccount(false);
  }, [session?.user]);

  function normalizeCart(cart: any[]) {
    return (cart ?? []).map((it) => {
      const quantity = Number(it.quantity ?? 1) || 1;
      const unitAmount = Number(it.price ?? it.unitAmount ?? it.metadata?.price ?? 0) || 0;
      const totalAmount = Number(it.totalAmount ?? (unitAmount > 0 ? unitAmount * quantity : 0)) || 0;
      const artworkUrl = it.artworkUrl ?? it.metadata?.artworkUrl ?? it.metadata?.artworkLink ?? it.metadata?.artwork ?? null;
      const textDesign = it.textDesign ?? it.metadata?.textDesign ?? it.metadata?.text ?? null;
      const name = it.title ?? it.name ?? it.slug ?? it.metadata?.title ?? `Produs`;
      return {
        id: it.id,
        name,
        quantity,
        unitAmount,
        totalAmount,
        artworkUrl,
        textDesign,
        metadata: it.metadata ?? {},
      };
    });
  }

  const subtotal = useMemo(() => {
    const norm = normalizeCart(items);
    return norm.reduce((s, it) => s + Number(it.totalAmount || it.unitAmount * it.quantity || 0), 0);
  }, [items]);

  const FREE_SHIPPING_THRESHOLD = 500;
  const SHIPPING_FEE = 19.99;
  const costLivrare = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const totalPlata = (items ?? []).length > 0 ? subtotal + costLivrare : 0;
  const isEmpty = isLoaded && (items ?? []).length === 0;

  function validate(): { ok: boolean; errs: Record<string, string> } {
    const e: Record<string, string> = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telRe = /^[0-9+()\-\s]{7,}$/;

    if (!address.nume_prenume.trim()) e["address.nume_prenume"] = "Nume și prenume obligatoriu";
    if (!emailRe.test(address.email)) e["address.email"] = "Email invalid";
    if (!telRe.test(address.telefon)) e["address.telefon"] = "Telefon invalid";
    if (!address.judet) e["address.judet"] = "Alege județul";
    if (!address.localitate.trim()) e["address.localitate"] = "Localitate obligatorie";
    if (!address.strada_nr.trim()) e["address.strada_nr"] = "Stradă și număr obligatorii";

    if (billing.tip_factura === "persoana_juridica") {
      if (!billing.cui?.trim()) e["billing.cui"] = "CUI/CIF obligatoriu";
    }

    if (!sameAsDelivery && billing.tip_factura === 'persoana_fizica') {
      if (!billing.judet) e["billing.judet"] = "Alege județul (facturare)";
      if (!billing.localitate?.trim()) e["billing.localitate"] = "Localitate facturare obligatorie";
      if (!billing.strada_nr?.trim()) e["billing.strada_nr"] = "Stradă și număr facturare obligatorii";
    }

    if ((items ?? []).length === 0) e["cart.empty"] = "Coșul este gol";
    if (!agreedToTerms) e["terms.agreement"] = "Trebuie să confirmi că ești de acord cu prelucrarea datelor.";

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
      const firstKey = Object.keys(errs)[0];
      const el = document.querySelector<HTMLElement>(`[data-field="${firstKey}"]`);
      if (el) {
        firstInvalidRef.current = el;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setPlacing(false);
      return;
    }

    const normalizedCart = normalizeCart(items);
    const url = typeof window !== 'undefined' ? new URL(window.location.href) : null;
    const params = url ? Object.fromEntries(url.searchParams.entries()) : {} as any;
    const marketing = {
      utmSource: params.utm_source || '',
      utmMedium: params.utm_medium || '',
      utmCampaign: params.utm_campaign || '',
      utmContent: params.utm_content || '',
      utmTerm: params.utm_term || '',
      gclid: params.gclid || '',
      fbclid: params.fbclid || '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
      landingPage: url ? url.pathname + (url.search || '') : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    };

    const orderData = {
      cart: normalizedCart,
      address,
      billing: {
        ...billing,
        ...(sameAsDelivery
          ? {
              name: address.nume_prenume,
              judet: address.judet,
              localitate: address.localitate,
              strada_nr: address.strada_nr,
              postCode: address.postCode,
              bloc: address.bloc,
              scara: address.scara,
              etaj: address.etaj,
              ap: address.ap,
              interfon: address.interfon,
            }
          : {}),
      },
      marketing,
      createAccount: createAccount && !session?.user,
      paymentMethod: paymentMethod === 'op' ? 'OP' : paymentMethod === 'ramburs' ? 'Ramburs' : 'Card', // Mapping pentru backend
    };

    try {
      // Ramburs SAU OP - trimitem direct la server
      if (paymentMethod === "ramburs" || paymentMethod === "op") {
        const res = await fetch("/api/order/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        const data = await res.json();
        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Eroare la crearea comenzii.");
        }
        
        // Redirect cu params pentru success page (o=orderNo, pm=paymentMethod)
        const o = Number(data?.orderNo);
        const qOrder = Number.isFinite(o) && o > 0 ? `o=${o}` : "";
        const qPm = `pm=${paymentMethod === 'op' ? 'OP' : 'Ramburs'}`;
        const query = [qOrder, qPm].filter(Boolean).join('&');
        
        window.location.href = `/checkout/success?${query}`;
        return;
      }

      // Card: Stripe session
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (!res.ok || !data?.clientSecret) {
        throw new Error(data?.error || "Nu s-a putut inițializa plata cu cardul.");
      }

      setShowEmbed(true);
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe nu a putut fi inițializat.");
      const embeddedCheckout = await stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret });
      setTimeout(() => {
        const host = document.getElementById('stripe-embedded');
        if (host) embeddedCheckout.mount('#stripe-embedded');
      }, 0);
    } catch (err: any) {
      console.error("[placeOrder] error:", err?.message || err);
      alert(err?.message || "A apărut o eroare. Reîncearcă.");
      setShowEmbed(false);
    } finally {
      setPlacing(false);
    }
  }

  return (
    <main className="bg-ui min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Coșul tău</h1>
        </div>

        {isEmpty ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <aside className="order-1 lg:order-2 lg:col-span-1">
              <a
                href="/"
                className="mb-3 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition"
              >
                Continuă cumpărăturile
              </a>
              <SummaryCard
                subtotal={subtotal}
                shipping={costLivrare}
                total={totalPlata}
                onPlaceOrder={placeOrder}
                placing={placing}
                county={address.judet}
                showEmbed={showEmbed}
                setShowEmbed={setShowEmbed}
                createAccount={createAccount}
                setCreateAccount={setCreateAccount}
                isLoggedIn={!!session?.user}
                paymentMethod={paymentMethod} // Pass pt button label
              />
            </aside>

            <section className={`order-2 lg:order-1 lg:col-span-2 space-y-6`}>
              <CartItems items={items} onRemove={removeItem} />
              <ReturningCustomerLogin />
              <CheckoutForm
                address={address}
                setAddress={(updater) => setAddress((prev) => updater(prev))}
                billing={billing}
                setBilling={(updater) => setBilling((prev) => updater(prev))}
                sameAsDelivery={sameAsDelivery}
                setSameAsDelivery={setSameAsDelivery}
                agreedToTerms={agreedToTerms}
                setAgreedToTerms={setAgreedToTerms}
                errors={errors}
              />

              {/* SECȚIUNE METODĂ DE PLATĂ (Actualizată) */}
              <div className="card p-4 border border-[--border] bg-surface rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-ui">Metodă de plată</h2>
                <div className="space-y-3">
                    
                    {/* Ramburs */}
                    <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'ramburs' ? 'border-indigo-500 bg-indigo-500/10' : 'border-[--border] hover:bg-white/5'}`}>
                        <div className="mt-1">
                            <input type="radio" name="payment" value="ramburs" checked={paymentMethod === 'ramburs'} onChange={() => setPaymentMethod('ramburs')} className="h-4 w-4 border-gray-600 text-indigo-600 focus:ring-indigo-600 bg-slate-800" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Banknote size={18} className="text-emerald-400" />
                                <span className="font-bold text-ui">Ramburs (Plata la livrare)</span>
                            </div>
                            <div className="text-xs text-muted">Plătești curierului numerar când ajunge coletul.</div>
                        </div>
                    </label>

                    {/* Card */}
                    <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-indigo-500 bg-indigo-500/10' : 'border-[--border] hover:bg-white/5'}`}>
                        <div className="mt-1">
                            <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="h-4 w-4 border-gray-600 text-indigo-600 focus:ring-indigo-600 bg-slate-800" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <CreditCard size={18} className="text-blue-400" />
                                <span className="font-bold text-ui">Card Online (Securizat)</span>
                            </div>
                            <div className="text-xs text-muted">Plătești online prin Stripe. Siguranță garantată.</div>
                        </div>
                    </label>

                    {/* Transfer Bancar (OP) - NOU */}
                    <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'op' ? 'border-indigo-500 bg-indigo-500/10' : 'border-[--border] hover:bg-white/5'}`}>
                        <div className="mt-1">
                            <input type="radio" name="payment" value="op" checked={paymentMethod === 'op'} onChange={() => setPaymentMethod('op')} className="h-4 w-4 border-gray-600 text-indigo-600 focus:ring-indigo-600 bg-slate-800" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <Building2 size={18} className="text-amber-400" />
                                <span className="font-bold text-ui">Transfer Bancar (OP)</span>
                            </div>
                            <div className="text-xs text-muted">
                                Vei primi factura și datele bancare pe email. Comanda intră în producție după confirmarea plății.
                            </div>
                            {paymentMethod === 'op' && (
                                <div className="mt-3 p-3 bg-blue-900/30 border border-blue-500/30 rounded text-xs text-blue-200 animate-in fade-in">
                                    <p><strong>Notă:</strong> Pentru o procesare rapidă, te rugăm să ne trimiți dovada plății pe email la <u>contact@prynt.ro</u> după plasarea comenzii.</p>
                                </div>
                            )}
                        </div>
                    </label>
                </div>
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
    <div className="rounded-2xl border card-bg p-8 text-center text-ui">
      <h2 className="text-xl font-bold mb-2">Coșul tău este gol</h2>
      <p className="text-muted mb-6">Adaugă produse pentru a continua.</p>
      <a href="/" className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 transition">
        Continuă cumpărăturile
      </a>
    </div>
  );
}

function SummaryCard({
  subtotal,
  shipping,
  total,
  onPlaceOrder,
  placing,
  county,
  showEmbed,
  setShowEmbed,
  createAccount,
  setCreateAccount,
  isLoggedIn,
  paymentMethod,
}: {
  subtotal: number;
  shipping: number;
  total: number;
  onPlaceOrder: () => void;
  placing: boolean;
  county?: string;
  showEmbed: boolean;
  setShowEmbed: (v: boolean) => void;
  createAccount: boolean;
  setCreateAccount: (v: boolean) => void;
  isLoggedIn: boolean;
  paymentMethod: PaymentMethod;
}) {
  const fmt = new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 2 }).format;

  const btnLabel = useMemo(() => {
      if (placing) return "Se procesează...";
      if (paymentMethod === 'card') return "Plătește";
      if (paymentMethod === 'op') return "Trimite comanda (OP)";
      return "Plasează comanda";
  }, [paymentMethod, placing]);

  return (
    <div className="lg:sticky lg:top-6 rounded-2xl border card-bg p-5 text-ui">
      <h2 className="text-xl font-bold mb-4">Sumar comandă</h2>

      <div className="space-y-3 text-sm">
        <DeliveryInfo county={county} variant="text" size="xs" showCod={false} showShippingFrom={false} />
        <div className="flex items-center justify-between">
          <span className="text-muted">Produse</span>
          <span className="font-semibold">{fmt(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted">
            <Truck size={16} className="text-muted" />
            Livrare
          </span>
          <span className="font-semibold">{fmt(shipping)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-ui font-semibold">Total</span>
          <span className="text-2xl font-extrabold">{fmt(total)}</span>
        </div>
      </div>

      <div className="mt-5">
        {!isLoggedIn && (
          <label className="flex items-start gap-2 mb-4 text-xs cursor-pointer select-none">
            <input
              type="checkbox"
              checked={createAccount}
              onChange={(e) => setCreateAccount(e.target.checked)}
              className="mt-0.5 rounded border-gray-600 text-indigo-600 focus:ring-indigo-600 bg-slate-800"
            />
            <span className="text-ui leading-snug">
              Creează un cont cu acest email și parolă generată automat (trimisă pe email). O vei putea schimba ulterior.
            </span>
          </label>
        )}

        {!showEmbed && (
          <button
            type="button"
            onClick={onPlaceOrder}
            disabled={placing}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-500 transition disabled:opacity-60 shadow-lg shadow-indigo-900/20"
          >
            <ShieldCheck size={18} />
            {btnLabel}
          </button>
        )}

        {showEmbed && (
          <div className="mt-4 space-y-3">
            <div className="text-sm font-semibold text-ui">Finalizează plata în siguranță</div>
            <div id="stripe-embedded" className="rounded-lg border border-white/10 bg-white/5 p-3" />
            <div className="text-center text-xs text-muted">După finalizare revenim la confirmare.</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowEmbed(false)}
                className="flex-1 inline-flex items-center justify-center rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20"
              >
                Anulează plata
              </button>
            </div>
          </div>
        )}

        <p className="mt-3 text-[11px] text-muted text-center leading-relaxed opacity-70">
          Prin plasarea comenzii, ești de acord cu <Link href="/termeni" className="underline hover:text-white">Termenii</Link>. <br/>
          Plata cu cardul este securizată prin Stripe.
        </p>
      </div>
    </div>
  );
}

function CartItems({ items, onRemove }: { items: Array<any> | undefined; onRemove: (id: string) => void }) {
  const fmt = new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 2 }).format;
  const { updateQuantity } = useCart();

  // Helper labels...
  const labelForKey: Record<string, string> = {
    width: "Lățime (cm)", height: "Înălțime (cm)", width_cm: "Lățime (cm)", height_cm: "Înălțime (cm)",
    totalSqm: "Suprafață totală (m²)", sqmPerUnit: "m²/buc", pricePerSqm: "Preț pe m² (RON)",
    materialId: "Material", material: "Material", laminated: "Laminare", designOption: "Grafică",
    proDesignFee: "Taxă grafică Pro (RON)", want_adhesive: "Adeziv", want_hem_and_grommets: "Tiv și capse",
    want_wind_holes: "Găuri pentru vânt", shape_diecut: "Tăiere la contur", productType: "Tip panou",
    thickness_mm: "Grosime (mm)", sameGraphicFrontBack: "Aceeași grafică față/spate", framed: "Șasiu",
    sizeKey: "Dimensiune preset", mode: "Mod canvas", orderNotes: "Observații",
  };

  function formatYesNo(v: any) {
    if (typeof v === "boolean") return v ? "Da" : "Nu";
    if (typeof v === "string") {
      const t = v.toLowerCase();
      if (["true", "da", "yes", "y", "1"].includes(t)) return "Da";
      if (["false", "nu", "no", "n", "0"].includes(t)) return "Nu";
    }
    return String(v);
  }

  function prettyValue(k: string, v: any) {
    if (k === "materialId") return v === "frontlit_510" ? "Frontlit 510g" : v === "frontlit_440" ? "Frontlit 440g" : String(v);
    if (k === "productType") return v === "alucobond" ? "Alucobond" : v === "polipropilena" ? "Polipropilenă" : v === "pvc-forex" ? "PVC Forex" : String(v);
    if (k === "designOption") return v === "pro" ? "Pro" : v === "upload" ? "Am fișier" : v === "text_only" ? "Text" : String(v);
    if (k === "framed") return formatYesNo(v);
    if (typeof v === "boolean") return formatYesNo(v);
    return String(v);
  }

  function renderDetails(item: any) {
    const meta = item.metadata ?? {};
    const details: Array<{ label: string; value: string }> = [];

    const width = item.width ?? item.width_cm ?? meta.width_cm ?? meta.width;
    const height = item.height ?? item.height_cm ?? meta.height_cm ?? meta.height;
    if (width || height) details.push({ label: "Dimensiune", value: `${width ?? "—"} x ${height ?? "—"} cm` });

    const isFonduri = (item?.slug === 'fonduri-eu') || (item?.productId === 'fonduri-eu');
    if (isFonduri && typeof meta.selectedReadable === 'string' && meta.selectedReadable.trim().length > 0) {
      details.push({ label: 'Opțiuni selectate', value: String(meta.selectedReadable) });
    }

    const knownKeys = Object.keys(labelForKey).filter((k) => meta[k] !== undefined);
    knownKeys.forEach((k) => {
      if (k === 'proDesignFee') { const num = Number(meta[k]); if (!isFinite(num) || num <= 0) return; }
      details.push({ label: labelForKey[k], value: prettyValue(k, meta[k]) });
    });

    ["sqmPerUnit", "totalSqm", "pricePerSqm"].forEach((k) => {
      if (!knownKeys.includes(k) && meta[k] !== undefined) details.push({ label: (labelForKey as any)[k] || k, value: String(meta[k]) });
    });

    const exclude = new Set(["price", "totalAmount", "qty", "quantity", "artwork", "artworkUrl", "artworkLink", "text", "textDesign", "selectedReadable", "selections", "title", "name"]);
    Object.keys(meta).filter((k) => !knownKeys.includes(k) && !exclude.has(k)).forEach((k) => {
      const v = meta[k];
      if (k === 'proDesignFee') { const num = Number(v); if (!isFinite(num) || num <= 0) return; }
      if (v === null || v === undefined) return;
      if (typeof v === 'number' && v === 0) return;
      if (typeof v === 'string' && v.trim() === '') return;
      details.push({ label: k, value: String(v) });
    });

    if (details.length === 0) return null;

    return (
      <div className="mt-2 rounded-md border border-white/10 bg-white/5 p-2 text-xs text-muted">
        {details.map((d, idx) => (
          <div key={idx} className="flex gap-2 py-0.5">
            <span className="opacity-80">{d.label}:</span>
            <span className="font-medium text-ui">{d.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border card-bg p-4 text-ui">
      <h2 className="text-xl font-bold mb-4">Produsele tale</h2>
      <ul className="divide-y divide-white/10">
        {(items ?? []).map((item) => {
          const title = item.title ?? item.name ?? item.slug ?? 'Produs';
          const qty = Number(item.quantity ?? 1) || 1;
          const unit = Number(item.price ?? item.unitAmount ?? 0) || 0;
          const lineTotal = unit > 0 ? unit * qty : Number(item.totalAmount ?? 0) || 0;
          return (
            <li key={item.id} className="py-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <button onClick={() => onRemove(item.id)} className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/5 p-2 text-muted hover:bg-white/10"><X size={16} /></button>
                    <p className="font-semibold truncate pr-2">{title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center border border-white/10 rounded-lg overflow-hidden bg-white/5">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, qty - 1))} className="px-2 py-1 text-sm hover:bg-white/10"><Minus size={14} /></button>
                      <div className="px-3 text-sm font-bold">{qty}</div>
                      <button onClick={() => updateQuantity(item.id, qty + 1)} className="px-2 py-1 text-sm hover:bg-white/10"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
                {renderDetails(item)}
                <div className="mt-1 text-sm text-muted">
                  <div className="mt-2">
                    <div className="text-xs text-muted">{unit > 0 ? `Preț unitar: ${fmt(unit)}` : "Preț unitar: —"}</div>
                    <div className="text-sm text-muted mt-1">{fmt(Number(lineTotal))}</div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}