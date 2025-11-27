"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function UserDetailsForm() {
  const { data: session, update } = useSession();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Sincronizăm starea locală cu sesiunea atunci când aceasta se încarcă
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/account/details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "A apărut o eroare.");
      }

      // Actualizăm sesiunea client-side pentru a reflecta noul nume imediat în tot site-ul
      await update({
        ...session,
        user: {
          ...session?.user,
          name: name,
          email: email
        }
      });

      setSuccess("Detaliile contului au fost actualizate cu succes!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Informații Personale
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Actualizează numele și adresa de email asociate contului tău.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Câmp Nume */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nume complet
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors py-2.5"
                placeholder="Numele tău"
                required
              />
            </div>
          </div>

          {/* Câmp Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Adresă de e-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors py-2.5"
                placeholder="adresa@email.com"
                required
              />
            </div>
          </div>
        </div>

        {/* Zona de mesaje */}
        {success && (
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-4 border border-emerald-200 dark:border-emerald-800/30 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
            <svg className="h-5 w-5 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">{success}</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800/30 flex items-start gap-3 animate-in fade-in slide-in-from-top-1">
            <svg className="h-5 w-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Se salvează...
              </>
            ) : (
              "Salvează modificările"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}