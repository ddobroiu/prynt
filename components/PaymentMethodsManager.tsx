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
  nickname?: string;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

function AddCardForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nickname, setNickname] = useState("");

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
        body: JSON.stringify({ 
          paymentMethodId: paymentMethod.id,
          nickname: nickname.trim() || undefined
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Eroare la salvarea cardului");
      }

      onSuccess();
      cardElement.clear();
      setNickname("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Nume card (opțional)
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="ex: Cardul meu personal"
          maxLength={30}
          className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Detalii card
        </label>
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
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full px-4 py-3 bg-linear-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Se salvează...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Adaugă card
          </>
        )}
      </button>
    </form>
  );
}

export default function PaymentMethodsManager() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [editingNickname, setEditingNickname] = useState<string | null>(null);
  const [nicknameValue, setNicknameValue] = useState("");

  const showToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

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
        showToast("Card șters cu succes", "success");
        fetchPaymentMethods();
      } else {
        const data = await response.json();
        showToast(data.error || "Eroare la ștergerea cardului", "error");
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
      showToast("Eroare la ștergerea cardului", "error");
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
        showToast("Card implicit actualizat", "success");
        fetchPaymentMethods();
      } else {
        const data = await response.json();
        showToast(data.error || "Eroare la setarea cardului implicit", "error");
      }
    } catch (error) {
      console.error("Error setting default payment method:", error);
      showToast("Eroare la setarea cardului implicit", "error");
    }
  };

  const handleUpdateNickname = async (paymentMethodId: string, newNickname: string) => {
    try {
      const response = await fetch("/api/payment-methods", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId, nickname: newNickname }),
      });

      if (response.ok) {
        showToast("Nume card actualizat", "success");
        setEditingNickname(null);
        setNicknameValue("");
        fetchPaymentMethods();
      } else {
        const data = await response.json();
        showToast(data.error || "Eroare la actualizarea numelui", "error");
      }
    } catch (error) {
      console.error("Error updating nickname:", error);
      showToast("Eroare la actualizarea numelui", "error");
    }
  };

  const isExpiringSoon = (expMonth: number, expYear: number) => {
    const now = new Date();
    const expDate = new Date(expYear, expMonth - 1);
    const monthsUntilExpiry = (expDate.getFullYear() - now.getFullYear()) * 12 + (expDate.getMonth() - now.getMonth());
    return monthsUntilExpiry <= 2 && monthsUntilExpiry >= 0;
  };

  const isExpired = (expMonth: number, expYear: number) => {
    const now = new Date();
    const expDate = new Date(expYear, expMonth);
    return expDate < now;
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
    <div className="space-y-6 relative">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in slide-in-from-right ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {toast.type === "success" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

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
          className="px-4 py-2 bg-linear-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          {showAddCard ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Anulează
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Adaugă card
            </>
          )}
        </button>
      </div>

      {/* Add Card Form */}
      {showAddCard && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border border-zinc-200 dark:border-zinc-800 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Adaugă un card nou</h3>
          <Elements stripe={stripePromise}>
            <AddCardForm
              onSuccess={() => {
                setShowAddCard(false);
                showToast("Card adăugat cu succes!", "success");
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
          {paymentMethods.map((method) => {
            const expired = isExpired(method.expMonth, method.expYear);
            const expiringSoon = isExpiringSoon(method.expMonth, method.expYear);
            
            return (
              <div
                key={method.id}
                className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-lg shadow-zinc-200/50 dark:shadow-black/50 border transition-all duration-200 hover:shadow-xl ${
                  expired 
                    ? "border-red-300 dark:border-red-800" 
                    : expiringSoon 
                    ? "border-amber-300 dark:border-amber-800"
                    : "border-zinc-200 dark:border-zinc-800"
                } p-6`}
              >
                {/* Expiry Warning */}
                {(expired || expiringSoon) && (
                  <div className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${
                    expired 
                      ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" 
                      : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                  }`}>
                    <svg className={`w-5 h-5 shrink-0 mt-0.5 ${expired ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${expired ? "text-red-900 dark:text-red-100" : "text-amber-900 dark:text-amber-100"}`}>
                        {expired ? "Card expirat" : "Cardul expiră în curând"}
                      </p>
                      <p className={`text-xs mt-1 ${expired ? "text-red-700 dark:text-red-300" : "text-amber-700 dark:text-amber-300"}`}>
                        {expired 
                          ? "Acest card nu mai poate fi folosit. Te rugăm să îl ștergi și să adaugi unul nou."
                          : "Cardul tău expiră în următoarele 2 luni. Actualizează-l pentru a evita întreruperi."}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {getCardIcon(method.brand)}
                    <div className="flex-1">
                      {/* Nickname or Card info */}
                      {editingNickname === method.id ? (
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="text"
                            value={nicknameValue}
                            onChange={(e) => setNicknameValue(e.target.value)}
                            placeholder="Nume card"
                            maxLength={30}
                            className="flex-1 px-2 py-1 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleUpdateNickname(method.id, nicknameValue);
                              } else if (e.key === "Escape") {
                                setEditingNickname(null);
                                setNicknameValue("");
                              }
                            }}
                          />
                          <button
                            onClick={() => {
                              handleUpdateNickname(method.id, nicknameValue);
                            }}
                            className="p-1 text-green-600 hover:text-green-700 dark:text-green-400"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setEditingNickname(null);
                              setNicknameValue("");
                            }}
                            className="p-1 text-zinc-600 hover:text-zinc-700 dark:text-zinc-400"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-1">
                          {method.nickname ? (
                            <p className="font-semibold text-zinc-900 dark:text-white">{method.nickname}</p>
                          ) : (
                            <p className="font-semibold text-zinc-900 dark:text-white capitalize">
                              {method.brand} •••• {method.last4}
                            </p>
                          )}
                          <button
                            onClick={() => {
                              setEditingNickname(method.id);
                              setNicknameValue(method.nickname || "");
                            }}
                            className="p-1 text-zinc-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                            title="Editează nume"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      )}
                      
                      {method.nickname && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 capitalize">
                          {method.brand} •••• {method.last4}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          Expiră {method.expMonth.toString().padStart(2, "0")}/{method.expYear}
                        </p>
                        {method.isDefault && (
                          <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                            Implicit
                          </span>
                        )}
                      </div>
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
            );
          })}
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
