"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import ReturningCustomerLogin from "@/components/ReturningCustomerLogin";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../../components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { ShieldCheck, Truck, X, Plus, Minus, CreditCard, Banknote, Building2, MapPin, AlertCircle, Package } from "lucide-react";
import CheckoutForm from "./CheckoutForm";
import DeliveryInfo from "@/components/DeliveryInfo";
import DiscountCodeInput from "@/components/DiscountCodeInput";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// --- CONFIGURARE LIMITE ---
const MAX_RAMBURS_LIMIT = 500; 

type PaymentMethod = "ramburs" | "card" | "op";

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
  const toast = useToast();
  
  // FIX: Race condition prevention cu ref atomic
  const isPlacingOrder = useRef(false);

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ramburs");

  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showEmbed, setShowEmbed] = useState(false);
  const [createAccount, setCreateAccount] = useState(true);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

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

  // State pentru codul de reducere
  const [appliedDiscount, setAppliedDiscount] = useState<{
    type: string;
    value: number;
    amount: number;
  } | null>(null);

  const subtotal = useMemo(() => {
    const norm = normalizeCart(items);
    return norm.reduce((s, it) => s + Number(it.totalAmount || it.unitAmount * it.quantity || 0), 0);
  }, [items]);

  const FREE_SHIPPING_THRESHOLD = 500;
  const SHIPPING_FEE = 19.99;
  
  // Calculez livrarea - dacă am livrare gratuită prin cod, costul este 0
  const costLivrare = useMemo(() => {
    if (appliedDiscount?.type === 'free_shipping') return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  }, [subtotal, appliedDiscount]);

  // Calculez reducerea aplicată pe produse
  const discountAmount = useMemo(() => {
    if (!appliedDiscount || appliedDiscount.type === 'free_shipping') return 0;
    return appliedDiscount.amount || 0;
  }, [appliedDiscount]);

  const totalPlata = useMemo(() => {
    if ((items ?? []).length === 0) return 0;
    return Math.max(0, subtotal - discountAmount + costLivrare);
  }, [subtotal, discountAmount, costLivrare, items]);
  const isEmpty = isLoaded && (items ?? []).length === 0;

  const isRambursDisabled = totalPlata > MAX_RAMBURS_LIMIT;

  useEffect(() => {
    if (isRambursDisabled && paymentMethod === 'ramburs') {
      setPaymentMethod('card');
    }
  }, [isRambursDisabled, paymentMethod]);

  function validate(): { ok: boolean; errs: Record<string, string> } {
    const e: Record<string, string> = {};
    // FIX: Regex mai robust pentru email validation
    const emailRe = /^[a-zA-Z0-9][a-zA-Z0-9._-]*@[a-zA-Z0-9][a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const telRe = /^[0-9+()\-\s]{7,}$/;

    if (!address.nume_prenume.trim()) e["address.nume_prenume"] = "Nume și prenume obligatoriu";
    if (!emailRe.test(address.email)) e["address.email"] = "Email invalid";
    if (!telRe.test(address.telefon)) e["address.telefon"] = "Telefon invalid";
    if (!address.judet) e["address.judet"] = "Alege județul";
    if (!address.localitate.trim()) e["address.localitate"] = "Localitate obligatorie";
    if (!address.strada_nr.trim()) e["address.strada_nr"] = "Stradă și număr obligatorii";

    if (billing.tip_factura === "persoana_juridica") {
      if (!billing.cui?.trim()) e["billing.cui"] = "CUI/CIF obligatoriu";
      if (!billing.denumire_companie?.trim()) e["billing.denumire_companie"] = "Denumire companie obligatorie";
    }

    if (!sameAsDelivery && billing.tip_factura === 'persoana_fizica') {
      if (!billing.judet) e["billing.judet"] = "Alege județul (facturare)";
      if (!billing.localitate?.trim()) e["billing.localitate"] = "Localitate facturare obligatorie";
      if (!billing.strada_nr?.trim()) e["billing.strada_nr"] = "Stradă și număr facturare obligatorii";
    }

    if ((items ?? []).length === 0) e["cart.empty"] = "Coșul este gol";
    
    if (!acceptTerms) e["terms"] = "Trebuie să accepți Termenii și Condițiile";

    if (paymentMethod === 'ramburs' && isRambursDisabled) {
       setPaymentMethod('card'); 
       return { ok: true, errs: {} }; 
    }

    return { ok: Object.keys(e).length === 0, errs: e };
  }

  async function placeOrder() {
    // FIX: Previne race condition cu ref atomic
    if (isPlacingOrder.current || placing) return;
    isPlacingOrder.current = true;
    setPlacing(true);
    setErrors({});
    firstInvalidRef.current = null;

    const { ok, errs } = validate();
    if (!ok) {
      setErrors(errs);
      toast.warning('Te rugăm să completezi toate câmpurile obligatorii!');
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
      subscribeNewsletter: subscribeNewsletter,
      paymentMethod: paymentMethod === 'op' ? 'OP' : paymentMethod === 'ramburs' ? 'Ramburs' : 'Card',
    };

    try {
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
        
        const o = Number(data?.orderNo);
        const qOrder = Number.isFinite(o) && o > 0 ? `o=${o}` : "";
        const qPm = `pm=${paymentMethod === 'op' ? 'OP' : 'Ramburs'}`;
        const query = [qOrder, qPm].filter(Boolean).join('&');
        
        window.location.href = `/checkout/success?${query}`;
        return;
      }

      // Card
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
      toast.error(err?.message || "A apărut o eroare. Reîncearcă.");
      setShowEmbed(false);
    } finally {
      setPlacing(false);
      isPlacingOrder.current = false; // FIX: Reset ref atomic
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header modern */}
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors mb-3 group">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Înapoi la magazin
          </Link>
          
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-800 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-600 bg-clip-text text-transparent">
              Finalizare Comandă
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Completează detaliile pentru a plasa comanda</p>
          </div>
        </div>

        {isEmpty ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-slate-400 dark:text-slate-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Coșul tău este gol</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">Nu ai adăugat încă niciun produs în coș.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Continuă cumpărăturile
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 xl:gap-8 items-start">
            
            {/* MAIN CONTENT - 2 COLOANE */}
            <section className="lg:col-span-2 space-y-4 lg:space-y-6">
              <CartItems items={items} onRemove={removeItem} />
              <ReturningCustomerLogin />
              
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

            <aside className="lg:col-span-1 lg:sticky lg:top-6 space-y-4 lg:space-y-6">
              {/* SECȚIUNE METODĂ DE PLATĂ - MODERNIZAT */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-linear-to-r from-purple-600 to-indigo-600 px-4 sm:px-5 py-3">
                  <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    Metodă de plată
                  </h2>
                </div>
                
                <div className="p-3 sm:p-4 space-y-3">
                    
                    {/* Ramburs */}
                    <label className={`group relative flex items-start gap-3 p-3 sm:p-4 rounded-xl border transition-all duration-200 min-h-16 touch-manipulation
                        ${isRambursDisabled
                            ? 'border-red-500/30 bg-red-500/5 opacity-60 cursor-not-allowed' 
                            : paymentMethod === 'ramburs' 
                                ? 'border-emerald-500 bg-linear-to-br from-emerald-500/10 to-green-500/5 shadow-md shadow-emerald-500/10' 
                                : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 cursor-pointer'
                        }
                    `}>
                        <div className="mt-0.5">
                            <input 
                                type="radio" 
                                name="payment" 
                                value="ramburs" 
                                checked={paymentMethod === 'ramburs'} 
                                onChange={() => !isRambursDisabled && setPaymentMethod('ramburs')} 
                                disabled={isRambursDisabled}
                                className="h-4 w-4 border border-slate-600 text-emerald-500 focus:ring-emerald-500 focus:ring-1 bg-slate-800 disabled:opacity-50 cursor-pointer" 
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`p-1.5 rounded-lg ${isRambursDisabled ? 'bg-gray-700/30' : 'bg-emerald-500/10'}`}>
                                    <Banknote className={`w-4 h-4 ${isRambursDisabled ? "text-gray-500" : "text-emerald-400"}`} />
                                </div>
                                <span className={`text-sm font-semibold ${isRambursDisabled ? "text-slate-500 dark:text-slate-500 line-through decoration-red-500" : "text-slate-900 dark:text-white"}`}>
                                    Ramburs (Plata la livrare)
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 ml-8">
                                {isRambursDisabled 
                                    ? "Indisponibil pentru comenzi mari" 
                                    : "Plătești curierului numerar la primirea coletului"
                                }
                            </p>
                            {isRambursDisabled && (
                                <div className="mt-2 ml-8 flex items-start gap-1.5 text-xs text-red-400 font-medium bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>Pentru comenzi peste <strong>{MAX_RAMBURS_LIMIT} RON</strong>, rambursul nu este disponibil. Alege Card sau Transfer Bancar.</span>
                                </div>
                            )}
                        </div>
                        {paymentMethod === 'ramburs' && !isRambursDisabled && (
                            <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                                Selectat
                            </div>
                        )}
                    </label>

                    {/* Card */}
                    <label className={`group relative flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all duration-200
                        ${paymentMethod === 'card' 
                            ? 'border-blue-500 bg-linear-to-br from-blue-500/10 to-indigo-500/5 shadow-md shadow-blue-500/10' 
                            : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
                        }
                    `}>
                        <div className="mt-0.5">
                            <input 
                                type="radio" 
                                name="payment" 
                                value="card" 
                                checked={paymentMethod === 'card'} 
                                onChange={() => setPaymentMethod('card')} 
                                className="h-4 w-4 border border-slate-600 text-blue-500 focus:ring-blue-500 focus:ring-1 bg-slate-800 cursor-pointer" 
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 rounded-lg bg-blue-500/10">
                                    <CreditCard className="w-4 h-4 text-blue-400" />
                                </div>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">Card Online (Securizat)</span>
                                <span className="ml-auto px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-bold rounded-full border border-blue-500/30">
                                    Recomandat
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 ml-8">Plătești instant prin Stripe. Securitate maximă garantată.</p>
                        </div>
                        {paymentMethod === 'card' && (
                            <div className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                                Selectat
                            </div>
                        )}
                    </label>

                    {/* Transfer Bancar (OP) */}
                    <label className={`group relative flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all duration-200
                        ${paymentMethod === 'op' 
                            ? 'border-amber-500 bg-linear-to-br from-amber-500/10 to-yellow-500/5 shadow-md shadow-amber-500/10' 
                            : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
                        }
                    `}>
                        <div className="mt-0.5">
                            <input 
                                type="radio" 
                                name="payment" 
                                value="op" 
                                checked={paymentMethod === 'op'} 
                                onChange={() => setPaymentMethod('op')} 
                                className="h-4 w-4 border border-slate-600 text-amber-500 focus:ring-amber-500 focus:ring-1 bg-slate-800 cursor-pointer" 
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 rounded-lg bg-amber-500/10">
                                    <Building2 className="w-4 h-4 text-amber-400" />
                                </div>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">Transfer Bancar (OP)</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 ml-8">
                                Vei primi factura și datele bancare pe email. Comanda intră în producție după confirmarea plății.
                            </p>
                            {paymentMethod === 'op' && (
                                <div className="mt-2 ml-8 p-2.5 bg-linear-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/40 rounded-lg text-xs text-blue-100 animate-in slide-in-from-top-2 duration-300">
                                    <p className="flex items-start gap-1.5">
                                        <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                        <span>
                                            <strong className="text-blue-300">Notă:</strong> Pentru procesare rapidă, trimite dovada plății pe email la <span className="font-semibold text-blue-200 underline decoration-blue-400">contact@prynt.ro</span> după plasarea comenzii.
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                        {paymentMethod === 'op' && (
                            <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                                Selectat
                            </div>
                        )}
                    </label>
                </div>
              </div>
              
              <SummaryCard
                subtotal={subtotal}
                shipping={costLivrare}
                total={totalPlata}
                discount={appliedDiscount}
                discountAmount={discountAmount}
                onDiscountApplied={setAppliedDiscount}
                onPlaceOrder={placeOrder}
                placing={placing}
                county={address.judet}
                addressPreview={address}
                showEmbed={showEmbed}
                setShowEmbed={setShowEmbed}
                createAccount={createAccount}
                setCreateAccount={setCreateAccount}
                acceptTerms={acceptTerms}
                setAcceptTerms={setAcceptTerms}
                subscribeNewsletter={subscribeNewsletter}
                setSubscribeNewsletter={setSubscribeNewsletter}
                isLoggedIn={!!session?.user}
                paymentMethod={paymentMethod}
                errors={errors}
              />
              
              <div className="text-center">
                <a href="/" className="text-sm text-slate-950 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 underline decoration-dotted font-medium">
                  Continuă cumpărăturile
                </a>
              </div>
            </aside>

          </div>
        )}
      </div>
    </main>
  );
}

function EmptyCart() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-900 dark:text-white max-w-lg mx-auto">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
        <Truck size={32} className="text-slate-500 dark:text-slate-400" opacity={0.5} />
      </div>
      <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Coșul tău este gol</h2>
      <p className="text-slate-700 dark:text-slate-300 mb-8">Nu ai adăugat încă niciun produs.</p>
      <a href="/" className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20 dark:shadow-indigo-900/20">
        Mergi la Magazin
      </a>
    </div>
  );
}

function SummaryCard({
  subtotal,
  shipping,
  total,
  discount,
  discountAmount,
  onDiscountApplied,
  onPlaceOrder,
  placing,
  county,
  addressPreview,
  showEmbed,
  setShowEmbed,
  createAccount,
  setCreateAccount,
  acceptTerms,
  setAcceptTerms,
  subscribeNewsletter,
  setSubscribeNewsletter,
  isLoggedIn,
  paymentMethod,
  errors,
}: {
  subtotal: number;
  shipping: number;
  total: number;
  discount?: { type: string; value: number; amount: number } | null;
  discountAmount?: number;
  onDiscountApplied: (discount: { type: string; value: number; amount: number } | null) => void;
  onPlaceOrder: () => void;
  placing: boolean;
  county?: string;
  addressPreview?: Address;
  showEmbed: boolean;
  setShowEmbed: (v: boolean) => void;
  createAccount: boolean;
  setCreateAccount: (v: boolean) => void;
  acceptTerms: boolean;
  setAcceptTerms: (v: boolean) => void;
  subscribeNewsletter: boolean;
  setSubscribeNewsletter: (v: boolean) => void;
  isLoggedIn: boolean;
  paymentMethod: PaymentMethod;
  errors: Record<string, string>;
}) {
  const fmt = new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 2 }).format;

  const btnLabel = useMemo(() => {
      if (placing) return "Se procesează...";
      if (paymentMethod === 'card') return `Plătește ${fmt(total)}`;
      if (paymentMethod === 'op') return "Trimite comanda (OP)";
      return "Plasează comanda";
  }, [paymentMethod, placing, total]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-800 shadow-xl shadow-slate-200/50">
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 text-slate-900">
        Sumar comandă
      </h2>

      {/* Preview Livrare - FIXAT PENTRU VIZIBILITATE */}
      {addressPreview?.localitate && (
        <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 opacity-50"></div>
            <div className="relative z-10 flex items-start gap-3">
                <div className="p-2 bg-white rounded-full shadow-sm border border-slate-100 text-indigo-600">
                    <MapPin size={16} />
                </div>
                <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Livrare către:</span>
                    <span className="block font-semibold text-slate-800 text-sm">{addressPreview.nume_prenume || "Nume..."}</span>
                    <span className="block text-sm text-slate-600 leading-snug mt-0.5">
                        {addressPreview.localitate}, {addressPreview.judet}
                    </span>
                </div>
            </div>
        </div>
      )}

      <div className="space-y-3 text-sm">
        <DeliveryInfo county={county} variant="text" size="xs" showCod={false} showShippingFrom={false} />
        
        <div className="flex items-center justify-between">
          <span className="text-slate-950 dark:text-slate-400 font-medium">Produse</span>
          <span className="font-semibold text-slate-950 dark:text-white">{fmt(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-950 dark:text-slate-400 font-medium">
            <Truck size={16} className="text-slate-950 dark:text-slate-400" />
            Livrare
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-500">{shipping === 0 ? "Gratuit" : fmt(shipping)}</span>
        </div>

        {/* Cod de reducere */}
        <div className="space-y-2">
          <DiscountCodeInput
            subtotal={subtotal}
            onDiscountApplied={onDiscountApplied}
          />
        </div>

        {/* Afișez reducerea aplicată */}
        {discount && discountAmount && discountAmount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-slate-950 dark:text-slate-400 font-medium">Reducere</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-500">-{fmt(discountAmount)}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-4 mt-4">
          <span className="text-lg font-bold text-slate-700">Total</span>
          <span className="text-2xl font-extrabold text-indigo-600">{fmt(total)}</span>
        </div>
      </div>

      <div className="mt-6">
        {!isLoggedIn && (
          <label className="flex items-start gap-3 mb-4 text-sm cursor-pointer select-none opacity-90 hover:opacity-100 transition-opacity touch-manipulation p-2 rounded-lg hover:bg-slate-50">
            <input
              type="checkbox"
              checked={createAccount}
              onChange={(e) => setCreateAccount(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 bg-white"
            />
            <span className="text-slate-950 dark:text-slate-300 leading-relaxed font-medium">
              Vreau cont nou (parola vine pe email).
            </span>
          </label>
        )}

        {/* Newsletter Subscription */}
        <label className="flex items-start gap-3 mb-4 text-sm cursor-pointer select-none opacity-90 hover:opacity-100 transition-opacity touch-manipulation p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
          <input
            type="checkbox"
            checked={subscribeNewsletter}
            onChange={(e) => setSubscribeNewsletter(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 bg-white"
          />
          <span className="text-slate-950 dark:text-slate-300 leading-relaxed font-medium">
            Vreau să primesc oferte și noutăți pe email.
          </span>
        </label>

        {/* Terms and Conditions Acceptance */}
        <div className="mb-6 p-4 bg-linear-to-r from-slate-50 to-blue-50/30 border border-slate-200/60 rounded-2xl shadow-sm">
          <label className="flex items-start gap-4 cursor-pointer select-none group touch-manipulation">
            <div className="relative shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-5 h-5 rounded-md border-2 border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white transition-all duration-200 hover:border-indigo-400"
              />
              {acceptTerms && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="text-sm leading-relaxed text-slate-600 group-hover:text-slate-800 transition-colors">
              <span className="text-slate-800 font-medium">Sunt de acord cu </span>
              <Link href="/termeni" target="_blank" className="text-indigo-600 hover:text-indigo-700 underline decoration-2 underline-offset-2 font-medium transition-colors">
                Termenii și Condițiile
              </Link>
              <span className="text-slate-500"> și </span>
              <Link href="/confidentialitate" target="_blank" className="text-indigo-600 hover:text-indigo-700 underline decoration-2 underline-offset-2 font-medium transition-colors">
                Politica de Confidențialitate
              </Link>
              <span className="text-slate-500"> Prynt.ro</span>
              {errors["terms"] && (
                <div className="mt-3 flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle size={14} className="text-red-500 shrink-0" />
                  <p className="text-xs text-red-700 font-medium">{errors["terms"]}</p>
                </div>
              )}
            </div>
          </label>
        </div>

        {!showEmbed && (
          <button
            type="button"
            onClick={onPlaceOrder}
            disabled={placing || !acceptTerms}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-base font-bold text-white transition shadow-lg active:scale-[0.98] ${
              acceptTerms && !placing
                ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                : 'bg-slate-400 cursor-not-allowed opacity-60 shadow-slate-400/20'
            }`}
          >
            <ShieldCheck size={20} />
            {btnLabel}
          </button>
        )}

        {showEmbed && (
          <div className="mt-4 space-y-3">
            <div className="text-sm font-semibold text-slate-700">Finalizează plata în siguranță</div>
            <div id="stripe-embedded" className="rounded-lg border border-slate-200 bg-white p-3" />
            <div className="text-center text-xs text-slate-500">După finalizare revenim la confirmare.</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowEmbed(false)}
                className="flex-1 inline-flex items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Anulează
              </button>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}

function CartItems({ items, onRemove }: { items: Array<any> | undefined; onRemove: (id: string) => void }) {
  const fmt = new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 2 }).format;
  const { updateQuantity } = useCart();

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
      <div className="mt-2 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs text-slate-950 dark:text-slate-300">
        {details.map((d, idx) => (
          <div key={idx} className="flex gap-2 py-0.5">
            <span className="opacity-90 font-medium">{d.label}:</span>
            <span className="font-bold text-slate-950 dark:text-white">{d.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-slate-900 dark:text-white">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Package size={20} className="text-indigo-600 dark:text-indigo-400" />
        Produse în coș
      </h2>
      <ul className="divide-y divide-slate-200 dark:divide-slate-700">
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
                    <button onClick={() => onRemove(item.id)} className="inline-flex items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-950 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"><X size={16} /></button>
                    <p className="font-semibold truncate pr-2 text-slate-950 dark:text-white">{title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                      <button onClick={() => updateQuantity(item.id, Math.max(1, qty - 1))} className="px-2 py-1 text-sm text-slate-950 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"><Minus size={14} /></button>
                      <div className="px-3 text-sm font-bold text-slate-950 dark:text-white">{qty}</div>
                      <button onClick={() => updateQuantity(item.id, qty + 1)} className="px-2 py-1 text-sm text-slate-950 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
                {renderDetails(item)}
                <div className="mt-2 text-right">
                    <div className="text-sm font-bold text-slate-950 dark:text-white">{fmt(Number(lineTotal))}</div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}