"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

function AddCardForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (stripeError) throw new Error(stripeError.message);

      // Save to backend
      const response = await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Eroare la salvarea cardului");
      }

      onSuccess();
      cardElement.clear();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800/50">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#18181b",
                "::placeholder": {
                  color: "#a1a1aa",
                },
              },
              invalid: {
                color: "#ef4444",
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full px-4 py-3 bg-linear-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Se salvează..." : "Adaugă card"}
      </button>
    </form>
  );
}

export default function PaymentMethodsManager() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);

  const fetchPaymentMethods = async () => {
    try {
      const response = await fetch("/api/payment-methods");
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods || []);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Sigur doriți să ștergeți acest card?")) return;

    try {
      const response = await fetch(`/api/payment-methods?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPaymentMethods();
      } else {
        const data = await response.json();
        alert(data.error || "Eroare la ștergerea cardului");
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
      alert("Eroare la ștergerea cardului");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch("/api/payment-methods", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId: id }),
      });

      if (response.ok) {
        fetchPaymentMethods();
      } else {
        const data = await response.json();
        alert(data.error || "Eroare la setarea cardului implicit");
      }
    } catch (error) {
      console.error("Error setting default payment method:", error);
      alert("Eroare la setarea cardului implicit");
    }
  };

  const getCardIcon = (brand: string) => {
    const brandLower = brand.toLowerCase();
    if (brandLower === "visa") {
      return (
        <svg className="w-8 h-6" viewBox="0 0 48 32" fill="none">
          <rect width="48" height="32" rx="4" fill="#1A1F71" />
          <text x="24" y="20" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">VISA</text>
        </svg>
      );
    } else if (brandLower === "mastercard") {
      return (
        <svg className="w-8 h-6" viewBox="0 0 48 32" fill="none">
          <rect width="48" height="32" rx="4" fill="#EB001B" />
          <circle cx="18" cy="16" r="8" fill="#FF5F00" opacity="0.8" />
          <circle cx="30" cy="16" r="8" fill="#F79E1B" opacity="0.8" />
        </svg>
      );
    }
    return (
      <svg className="w-8 h-6" viewBox="0 0 48 32" fill="none">
        <rect width="48" height="32" rx="4" fill="#6B7280" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Metode de plată</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Gestionează cardurile tale salvate pentru plăți rapide
          </p>
        </div>
        <button
          onClick={() => setShowAddCard(!showAddCard)}
          className="px-4 py-2 bg-linear-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
        >
          {showAddCard ? "Anulează" : "Adaugă card"}
        </button>
      </div>

      {/* Add Card Form */}
      {showAddCard && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Adaugă un card nou</h3>
          <Elements stripe={stripePromise}>
            <AddCardForm
              onSuccess={() => {
                setShowAddCard(false);
                fetchPaymentMethods();
              }}
            />
          </Elements>
        </div>
      )}

      {/* Payment Methods List */}
      {paymentMethods.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Niciun card salvat</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Adaugă un card pentru plăți mai rapide în viitor
          </p>
          <button
            onClick={() => setShowAddCard(true)}
            className="px-6 py-3 bg-linear-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
          >
            Adaugă primul card
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg shadow-zinc-200/50 dark:shadow-black/50 border border-zinc-200 dark:border-zinc-800 p-6 transition-all duration-200 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getCardIcon(method.brand)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-zinc-900 dark:text-white capitalize">
                        {method.brand} •••• {method.last4}
                      </p>
                      {method.isDefault && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                          Implicit
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Expiră {method.expMonth.toString().padStart(2, "0")}/{method.expYear}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="px-3 py-1.5 text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors"
                    >
                      Setează implicit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
        <div className="flex gap-3">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="space-y-2 text-sm text-blue-900 dark:text-blue-100">
            <p className="font-semibold">Securitate și confidențialitate</p>
            <ul className="space-y-1 text-blue-800 dark:text-blue-200">
              <li>• Cardurile sunt stocate securizat prin Stripe</li>
              <li>• Nu stocăm informații complete ale cardului</li>
              <li>• Toate tranzacțiile sunt criptate</li>
              <li>• Poți șterge cardurile oricând</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
