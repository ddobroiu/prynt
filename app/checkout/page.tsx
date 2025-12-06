"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import ReturningCustomerLogin from "@/components/ReturningCustomerLogin";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../../components/CartContext";
import { useToast } from "@/components/ToastProvider";
import {
  ShieldCheck,
  Truck,
  X,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  Building2,
  MapPin,
  AlertCircle,
  Package,
} from "lucide-react";
import CheckoutForm from "./CheckoutForm";
import DeliveryInfo from "@/components/DeliveryInfo";
import DiscountCodeInput from "@/components/DiscountCodeInput";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Address = {
  firstName?: string;
  lastName?: string;
  company?: string;
  email?: string;
  phone?: string;
  county?: string;
  city?: string;
  street?: string;
  postalCode?: string;
};

type BillingInfo = {
  type: "individual" | "company";
  companyName?: string;
  cui?: string;
  regCom?: string;
  bank?: string;
  iban?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  county?: string;
  city?: string;
  street?: string;
  postalCode?: string;
};

type PaymentMethod = "card" | "bank_transfer" | "cash_on_delivery";

type CheckoutErrors = {
  address?: Partial<Record<keyof Address, string>>;
  billing?: Partial<Record<keyof BillingInfo, string>>;
  global?: string;
};

function sanitizeString(v: any): string | undefined {
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  if (!trimmed) return undefined;
  return trimmed;
}

function mergeAddress(oldVal: Address, newVal: Partial<Address>): Address {
  return {
    ...oldVal,
    ...newVal,
  };
}

function mergeBilling(
  oldVal: BillingInfo,
  newVal: Partial<BillingInfo>
): BillingInfo {
  return {
    ...oldVal,
    ...newVal,
  };
}

function useSafeLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (updater: (prev: T) => T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) return defaultValue;
      return JSON.parse(stored);
    } catch {
      return defaultValue;
    }
  });

  const update = (updater: (prev: T) => T) => {
    setValue((prev) => {
      const next = updater(prev);
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(next));
        }
      } catch {
        // ignore
      }
      return next;
    });
  };

  return [value, update];
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, cartTotal, clearCart, removeItem } = useCart();
  const { showToast } = useToast();

  const [address, setAddress] = useSafeLocalStorage<Address>("checkout_address", {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    county: "",
    city: "",
    street: "",
    postalCode: "",
    company: "",
  });

  const [billing, setBilling] = useSafeLocalStorage<BillingInfo>(
    "checkout_billing",
    {
      type: "individual",
      companyName: "",
      cui: "",
      regCom: "",
      bank: "",
      iban: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      county: "",
      city: "",
      street: "",
      postalCode: "",
    }
  );

  const [sameAsDelivery, setSameAsDelivery] = useState(true);
  const [createAccount, setCreateAccount] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [placing, setPlacing] = useState(false);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const [showEmbed, setShowEmbed] = useState(false);
  const embedRef = useRef<HTMLDivElement | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [embedHeight, setEmbedHeight] = useState<number>(600);

  const subtotal = useMemo(() => cartTotal || 0, [cartTotal]);
  const shippingCost = useMemo(() => {
    if (subtotal >= 500) return 0;
    return 19.99;
  }, [subtotal]);

  const totalWithShipping = useMemo(
    () => Math.max(0, subtotal + shippingCost - discountAmount),
    [subtotal, shippingCost, discountAmount]
  );

  useEffect(() => {
    if (sameAsDelivery) {
      setBilling((prev) =>
        mergeBilling(prev, {
          firstName: address.firstName,
          lastName: address.lastName,
          email: address.email,
          phone: address.phone,
          county: address.county,
          city: address.city,
          street: address.street,
          postalCode: address.postalCode,
        })
      );
    }
  }, [sameAsDelivery, address, setBilling]);

  useEffect(() => {
    if (session?.user) {
      const user = session.user as any;
      setAddress((prev) =>
        mergeAddress(prev, {
          firstName:
            sanitizeString(user.firstName) ?? sanitizeString(user.name),
          lastName: sanitizeString(user.lastName),
          email:
            sanitizeString(user.email) ??
            sanitizeString((user as any).emailAddress),
        })
      );
      setBilling((prev) =>
        mergeBilling(prev, {
          firstName:
            sanitizeString(user.firstName) ?? sanitizeString(user.name),
          lastName: sanitizeString(user.lastName),
          email:
            sanitizeString(user.email) ??
            sanitizeString((user as any).emailAddress),
        })
      );
    }
  }, [session?.user, setAddress, setBilling]);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.profile) return;
        const profile = data.profile;
        setAddress((prev) =>
          mergeAddress(prev, {
            firstName:
              sanitizeString(profile.firstName) ??
              sanitizeString(profile.name),
            lastName: sanitizeString(profile.lastName),
            email:
              sanitizeString(profile.email) ??
              sanitizeString((profile as any).emailAddress),
            phone: sanitizeString(profile.phone),
            county: sanitizeString(profile.county),
            city: sanitizeString(profile.city),
            street: sanitizeString(profile.street),
            postalCode: sanitizeString(profile.postalCode),
            company: sanitizeString(profile.company),
          })
        );
        setBilling((prev) =>
          mergeBilling(prev, {
            firstName:
              sanitizeString(profile.billingFirstName) ??
              sanitizeString(profile.firstName) ??
              sanitizeString(profile.name),
            lastName:
              sanitizeString(profile.billingLastName) ??
              sanitizeString(profile.lastName),
            email:
              sanitizeString(profile.billingEmail) ??
              sanitizeString(profile.email) ??
              sanitizeString((profile as any).emailAddress),
            phone:
              sanitizeString(profile.billingPhone) ??
              sanitizeString(profile.phone),
            county:
              sanitizeString(profile.billingCounty) ??
              sanitizeString(profile.county),
            city:
              sanitizeString(profile.billingCity) ??
              sanitizeString(profile.city),
            street:
              sanitizeString(profile.billingStreet) ??
              sanitizeString(profile.street),
            postalCode:
              sanitizeString(profile.billingPostalCode) ??
              sanitizeString(profile.postalCode),
            companyName: sanitizeString(profile.billingCompanyName),
            cui: sanitizeString(profile.billingCui),
            regCom: sanitizeString(profile.billingRegCom),
            bank: sanitizeString(profile.billingBank),
            iban: sanitizeString(profile.billingIban),
          })
        );
        if (
          profile.billingCounty ||
          profile.billingCity ||
          profile.billingStreet ||
          profile.billingPostalCode
        ) {
          setSameAsDelivery(false);
        }
      })
      .catch(() => {});
  }, [session?.user, setAddress, setBilling]);

  useEffect(() => {
    if (session?.user) setCreateAccount(false);
  }, [session?.user]);

  function normalizeCart(cart: any[]) {
    return (cart ?? []).map((it) => {
      const quantity = Number(it.quantity ?? 1) || 1;
      const unitAmount =
        Number(
          it.price ??
            it.unitAmount ??
            it.metadata?.price ??
            it.metadata?.unitAmount ??
            0
        ) || 0;
      return {
        id: it.id,
        productId: it.productId ?? it.id,
        name:
          it.title ??
          it.name ??
          it.productName ??
          it.metadata?.title ??
          "Produs",
        quantity,
        unitAmount,
        totalAmount: unitAmount * quantity,
        metadata: it.metadata ?? {},
        slug: it.slug ?? it.metadata?.slug ?? undefined,
      };
    });
  }

  async function onPlaceOrder() {
    setErrors({});
    if (!items || items.length === 0) {
      showToast("Coșul este gol. Adaugă produse înainte de a continua.", "error");
      return;
    }

    const newErrors: CheckoutErrors = {};

    if (!sanitizeString(address.firstName))
      newErrors.address = {
        ...(newErrors.address ?? {}),
        firstName: "Prenumele este obligatoriu.",
      };
    if (!sanitizeString(address.lastName))
      newErrors.address = {
        ...(newErrors.address ?? {}),
        lastName: "Numele este obligatoriu.",
      };
    if (!sanitizeString(address.email))
      newErrors.address = {
        ...(newErrors.address ?? {}),
        email: "Emailul este obligatoriu.",
      };
    if (!sanitizeString(address.phone))
      newErrors.address = {
        ...(newErrors.address ?? {}),
        phone: "Telefonul este obligatoriu.",
      };
    if (!sanitizeString(address.county))
      newErrors.address = {
        ...(newErrors.address ?? {}),
        county: "Județul este obligatoriu.",
      };
    if (!sanitizeString(address.city))
      newErrors.address = {
        ...(newErrors.address ?? {}),
        city: "Orașul este obligatoriu.",
      };
    if (!sanitizeString(address.street))
      newErrors.address = {
        ...(newErrors.address ?? {}),
        street: "Adresa este obligatorie.",
      };
    if (!sanitizeString(address.postalCode))
      newErrors.address = {
        ...(newErrors.address ?? {}),
        postalCode: "Codul poștal este obligatoriu.",
      };

    if (billing.type === "company") {
      if (!sanitizeString(billing.companyName))
        newErrors.billing = {
          ...(newErrors.billing ?? {}),
          companyName: "Numele companiei este obligatoriu.",
        };
      if (!sanitizeString(billing.cui))
        newErrors.billing = {
          ...(newErrors.billing ?? {}),
          cui: "CUI este obligatoriu.",
        };
      if (!sanitizeString(billing.regCom))
        newErrors.billing = {
          ...(newErrors.billing ?? {}),
          regCom: "Nr. Reg. Com. este obligatoriu.",
        };
    }

    if (!acceptTerms) {
      newErrors.global =
        "Trebuie să accepți termenii și condițiile pentru a plasa comanda.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError =
        newErrors.address?.firstName ||
        newErrors.address?.lastName ||
        newErrors.address?.email ||
        newErrors.address?.phone ||
        newErrors.address?.county ||
        newErrors.address?.city ||
        newErrors.address?.street ||
        newErrors.address?.postalCode ||
        newErrors.billing?.companyName ||
        newErrors.billing?.cui ||
        newErrors.billing?.regCom ||
        newErrors.global;

      if (firstError) {
        showToast(firstError, "error");
      }
      return;
    }

    setPlacing(true);

    const payload = {
      items: normalizeCart(items),
      address,
      billing,
      sameAsDelivery,
      createAccount: createAccount && !session?.user,
      paymentMethod,
      acceptTerms,
      newsletter,
      discountCode,
      discountAmount,
      subtotal,
      shippingCost,
      totalWithShipping,
    };

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message =
          data?.error ||
          "A apărut o eroare la plasarea comenzii. Te rugăm să încerci din nou.";
        showToast(message, "error");
        setPlacing(false);
        return;
      }

      const data = await res.json();

      if (paymentMethod === "card") {
        if (data.checkoutUrl) {
          setEmbedUrl(data.checkoutUrl);
          setShowEmbed(true);
          setTimeout(() => {
            if (embedRef.current) {
              embedRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);
        } else if (data.sessionId) {
          const stripe = await stripePromise;
          if (!stripe) {
            showToast(
              "Nu s-a putut inițializa procesatorul de plăți. Încearcă mai târziu.",
              "error"
            );
            setPlacing(false);
            return;
          }
          const { error } = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          });
          if (error) {
            showToast(error.message || "Eroare la plata cu cardul.", "error");
            setPlacing(false);
          }
        } else {
          showToast(
            "Răspuns invalid de la server pentru plata cu cardul.",
            "error"
          );
          setPlacing(false);
        }
      } else {
        clearCart();
        showToast(
          "Comanda ta a fost plasată cu succes! Vei primi un email cu detaliile.",
          "success"
        );
        window.location.href = `/thank-you?orderId=${encodeURIComponent(
          data.orderId
        )}`;
      }
    } catch (err: any) {
      console.error(err);
      showToast(
        err?.message ||
          "A apărut o eroare neașteptată la plasarea comenzii.",
        "error"
      );
      setPlacing(false);
    }
  }

  const fmt = new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    maximumFractionDigits: 2,
  }).format;

  const discountApplied = discountAmount > 0;

  const freeShippingRemaining = Math.max(0, 500 - subtotal);
  const hasFreeShipping = freeShippingRemaining === 0;

  return (
    <main className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <nav className="mb-6 text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1 flex-wrap">
          <Link
            href="/"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
          >
            Acasă
          </Link>
          <span>/</span>
          <Link
            href="/produse"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
          >
            Produse
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-900 dark:text-white">
            Finalizare comandă
          </span>
        </nav>

        <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1.25fr)] gap-6 lg:gap-8">
          <section className="space-y-6">
            <header className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 dark:text-white flex items-center gap-2">
                  Finalizare Comandă
                  <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-2 py-0.5">
                    {items?.length ?? 0} produse
                  </span>
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Completează detaliile de livrare și facturare pentru a plasa
                  comanda.
                </p>
              </div>
              <div className="mt-2 sm:mt-0 text-sm text-slate-700 dark:text-slate-300 flex flex-col items-start sm:items-end gap-1">
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Plată 100% sigură prin Stripe</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <Truck className="h-4 w-4 text-indigo-500" />
                  <span>Livrare rapidă oriunde în țară</span>
                </div>
              </div>
            </header>

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
            {/* PLATĂ + REZUMAT */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 sm:px-5 py-3">
                <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Metodă de plată
                </h2>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                <div className="grid gap-3">
                  <label
                    className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition ${
                      paymentMethod === "card"
                        ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/50"
                        : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50/60 dark:hover:bg-slate-900/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="hidden"
                    />
                    <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-white dark:bg-slate-900 border border-indigo-400">
                      <CreditCard className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Plată online cu cardul
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Procesată securizat prin Stripe (Visa, Mastercard).
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition ${
                      paymentMethod === "bank_transfer"
                        ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/50"
                        : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50/60 dark:hover:bg-slate-900/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank_transfer"
                      checked={paymentMethod === "bank_transfer"}
                      onChange={() => setPaymentMethod("bank_transfer")}
                      className="hidden"
                    />
                    <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-white dark:bg-slate-900 border border-indigo-400">
                      <Banknote className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Transfer bancar (ordin de plată)
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Primești factura proformă pe email, iar comanda se
                        procesează după confirmarea plății.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition ${
                      paymentMethod === "cash_on_delivery"
                        ? "border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/50"
                        : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50/60 dark:hover:bg-slate-900/60"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === "cash_on_delivery"}
                      onChange={() => setPaymentMethod("cash_on_delivery")}
                      className="hidden"
                    />
                    <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-white dark:bg-slate-900 border border-indigo-400">
                      <Truck className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Ramburs la curier
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Plătești numerar sau cu POS direct la curier, la
                        livrare.
                      </p>
                    </div>
                  </label>
                </div>

                <DiscountCodeInput
                  subtotal={subtotal}
                  onDiscountChange={(code, amount) => {
                    setDiscountCode(code);
                    setDiscountAmount(amount);
                  }}
                />

                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-700 dark:text-slate-300">
                      Subtotal produse
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {fmt(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Truck className="h-4 w-4 text-indigo-500" />
                      <span>Livrare</span>
                    </span>
                    {hasFreeShipping ? (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Gratuit
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {fmt(shippingCost)}
                      </span>
                    )}
                  </div>

                  {!hasFreeShipping && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1 mt-1">
                      <AlertCircle className="h-3.5 w-3.5 mt-0.5 text-indigo-500" />
                      <span>
                        Mai adaugă{" "}
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {fmt(freeShippingRemaining)}
                        </span>{" "}
                        în coș pentru{" "}
                        <span className="font-semibold">transport gratuit</span>.
                      </span>
                    </p>
                  )}

                  {discountApplied && (
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Banknote className="h-4 w-4 text-emerald-500" />
                        <span>Reducere</span>
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        -{fmt(discountAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-3 mt-3">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Total de plată
                    </span>
                    <div className="text-right">
                      <p className="text-xl font-extrabold text-slate-950 dark:text-white">
                        {fmt(totalWithShipping)}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        TVA inclus • {hasFreeShipping ? "livrare gratuită" : "include transport"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>
                      Confirm că am citit și sunt de acord cu{" "}
                      <Link
                        href="/termeni-si-conditii"
                        className="text-indigo-600 dark:text-indigo-400 font-semibold underline-offset-2 hover:underline"
                        target="_blank"
                      >
                        Termenii și condițiile
                      </Link>{" "}
                      și cu{" "}
                      <Link
                        href="/politica-de-confidentialitate"
                        className="text-indigo-600 dark:text-indigo-400 font-semibold underline-offset-2 hover:underline"
                        target="_blank"
                      >
                        Politica de confidențialitate
                      </Link>
                      .
                    </span>
                  </label>

                  <label className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>
                      Doresc să primesc oferte și noutăți de la Prynt.ro (fără
                      spam).
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <PlaceOrderButton
                    placing={placing}
                    acceptTerms={acceptTerms}
                    onPlaceOrder={onPlaceOrder}
                    paymentMethod={paymentMethod}
                  />
                </div>
              </div>
            </div>

            <DeliveryInfo />

            {showEmbed && embedUrl && (
              <div
                ref={embedRef}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-indigo-500" />
                    Finalizează plata în fereastra securizată
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowEmbed(false)}
                    className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    aria-label="Închide fereastra de plată"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <iframe
                    src={embedUrl}
                    style={{ width: "100%", height: embedHeight }}
                    onLoad={() => {
                      setEmbedHeight(
                        window.innerWidth < 640 ? 600 : 700
                      );
                    }}
                    className="border-0"
                  />
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

function PlaceOrderButton({
  placing,
  acceptTerms,
  onPlaceOrder,
  paymentMethod,
}: {
  placing: boolean;
  acceptTerms: boolean;
  onPlaceOrder: () => void;
  paymentMethod: PaymentMethod;
}) {
  const btnLabel = placing
    ? "Se procesează comanda..."
    : paymentMethod === "card"
    ? "Plătește cu cardul"
    : paymentMethod === "bank_transfer"
    ? "Plasează comanda (OP)"
    : "Plasează comanda (ramburs)";

  if (placing) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex w-full items-center justify-center rounded-xl border border-transparent bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition"
      >
        <svg
          className="animate-spin h-4 w-4 mr-2 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        {btnLabel}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onPlaceOrder}
      disabled={placing || !acceptTerms}
      className={`inline-flex w-full items-center justify-center rounded-xl border border-transparent px-4 py-3 text-sm font-bold text-white transition shadow-lg active:scale-[0.98] ${
        acceptTerms && !placing
          ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20"
          : "bg-slate-400 cursor-not-allowed opacity-60 shadow-slate-400/20"
      }`}
    >
      <ShieldCheck size={20} />
      {btnLabel}
    </button>
  );
}

function CartItems({
  items,
  onRemove,
}: {
  items: Array<any> | undefined;
  onRemove: (id: string) => void;
}) {
  const fmt = new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    maximumFractionDigits: 2,
  }).format;
  const { updateQuantity } = useCart();

  const labelForKey: Record<string, string> = {
    width: "Lățime (cm)",
    height: "Înălțime (cm)",
    width_cm: "Lățime (cm)",
    height_cm: "Înălțime (cm)",
    totalSqm: "Suprafață totală (m²)",
    sqmPerUnit: "m²/buc",
    pricePerSqm: "Preț pe m² (RON)",
    materialId: "Material",
    material: "Material",
    laminated: "Laminare",
    designOption: "Grafică",
    proDesignFee: "Taxă grafică Pro (RON)",
    want_adhesive: "Adeziv",
    want_hem_and_grommets: "Tiv și capse",
    want_wind_holes: "Găuri pentru vânt",
    shape_diecut: "Tăiere la contur",
    productType: "Tip panou",
    thickness_mm: "Grosime (mm)",
    sameGraphicFrontBack: "Aceeași grafică față/spate",
    framed: "Șasiu",
    sizeKey: "Dimensiune preset",
    mode: "Mod canvas",
    orderNotes: "Observații",
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
    if (k === "materialId")
      return v === "frontlit_510"
        ? "Frontlit 510g"
        : v === "frontlit_440"
        ? "Frontlit 440g"
        : String(v);
    if (k === "productType")
      return v === "alucobond"
        ? "Alucobond"
        : v === "opal"
        ? "Opal"
        : v === "backlit"
        ? "Backlit"
        : v === "pp"
        ? "Polipropilenă"
        : v === "pvc-forex"
        ? "PVC Forex"
        : String(v);
    if (k === "designOption")
      return v === "pro"
        ? "Pro"
        : v === "basic"
        ? "Basic"
        : v === "upload"
        ? "Am fișier"
        : v === "text_only"
        ? "Text"
        : String(v);
    if (typeof v === "boolean") return formatYesNo(v);
    return String(v);
  }

  function renderDetails(item: any) {
    const meta = item.metadata ?? {};
    const details: Array<{ label: string; value: string }> = [];

    const width = item.width ?? item.width_cm ?? meta.width_cm ?? meta.width;
    const height =
      item.height ?? item.height_cm ?? meta.height_cm ?? meta.height;
    if (width || height)
      details.push({
        label: "Dimensiune",
        value: `${width ?? "—"} x ${height ?? "—"} cm`,
      });

    const isFonduri =
      item?.slug === "fonduri-eu" || item?.productId === "fonduri-eu";
    if (
      isFonduri &&
      typeof meta.selectedReadable === "string" &&
      meta.selectedReadable.trim().length > 0
    ) {
      details.push({
        label: "Opțiuni selectate",
        value: String(meta.selectedReadable),
      });
    }

    const knownKeys = Object.keys(labelForKey).filter(
      (k) => meta[k] !== undefined
    );
    knownKeys.forEach((k) => {
      if (k === "proDesignFee") {
        const num = Number(meta[k]);
        if (!isFinite(num) || num <= 0) return;
      }
      details.push({
        label: labelForKey[k],
        value: prettyValue(k, meta[k]),
      });
    });

    ["sqmPerUnit", "totalSqm", "pricePerSqm"].forEach((k) => {
      if (!knownKeys.includes(k) && meta[k] !== undefined)
        details.push({
          label: (labelForKey as any)[k] || k,
          value: String(meta[k]),
        });
    });

    const exclude = new Set([
      "price",
      "totalAmount",
      "qty",
      "quantity",
      "width",
      "height",
      "width_cm",
      "height_cm",
      "totalSqm",
      "sqmPerUnit",
      "pricePerSqm",
      "unitAmount",
      "productId",
      "slug",
      "image",
      "imageUrl",
      "artworkUrl",
      "previewUrl",
      "artwork",
      "internalNotes",
      "adminNotes",
      "cartItemId",
      "userId",
      "designId",
      "textDesign",
      "selectedReadable",
      "selections",
      "title",
      "name",
    ]);
    Object.keys(meta)
      .filter((k) => !knownKeys.includes(k) && !exclude.has(k))
      .forEach((k) => {
        const v = meta[k];
        if (k === "proDesignFee") {
          const num = Number(v);
          if (!isFinite(num) || num <= 0) return;
        }
        if (v === null || v === undefined) return;
        if (typeof v === "number" && v === 0) return;
        if (typeof v === "string" && v.trim() === "") return;
        details.push({ label: k, value: String(v) });
      });

    if (details.length === 0) return null;

    return (
      <div className="mt-2 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs text-slate-950 dark:text-slate-300">
        {details.map((d, idx) => (
          <div key={idx} className="flex gap-2 py-0.5">
            <span className="opacity-90 font-medium">{d.label}:</span>
            <span className="font-bold text-slate-950 dark:text-white">
              {d.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-black sm:text-slate-900 dark:text-white">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Package
          size={20}
          className="text-indigo-600 dark:text-indigo-400"
        />
        Produse în coș
      </h2>
      <ul className="divide-y divide-slate-200 dark:divide-slate-700">
        {(items ?? []).map((item) => {
          const anyItem: any = item as any;
          const title =
            item.title ??
            anyItem.name ??
            anyItem.productName ??
            item.slug ??
            item.metadata?.title ??
            "Produs";
          const qty = Number(item.quantity ?? 1) || 1;
          const unit =
            Number(item.price ?? item.unitAmount ?? 0) || 0;

          return (
            <li key={item.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                  {item.metadata?.artworkUrl ||
                  (item as any).artworkUrl ||
                  (item as any).image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        item.metadata?.artworkUrl ||
                        (item as any).artworkUrl ||
                        (item as any).image
                      }
                      alt={title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold text-center px-1">
                      Fără previzualizare
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex gap-2 justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-slate-400 hover:text-red-500 transition shrink-0"
                        aria-label="Șterge produs"
                      >
                        <X size={16} />
                      </button>
                      <p
                        className="font-bold text-[15px] sm:text-base text-black sm:text-slate-950 dark:text-white leading-snug flex-1 min-w-0"
                        style={{
                          wordBreak: "break-word",
                          overflow: "visible",
                        }}
                      >
                        {title}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="inline-flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, qty - 1))
                          }
                          className="px-2 py-1 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                          aria-label="Scade cantitatea"
                        >
                          <Minus size={14} />
                        </button>
                        <div className="px-3 text-sm font-bold text-slate-950 dark:text-white">
                          {qty}
                        </div>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, qty + 1)
                          }
                          className="px-2 py-1 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                          aria-label="Crește cantitatea"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  {renderDetails(item)}
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      Preț unitar
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {fmt(unit)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600 dark:text-slate-300">
                      Total produs
                    </span>
                    <span className="text-base font-bold text-slate-950 dark:text-white">
                      {fmt(unit * qty)}
                    </span>
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
