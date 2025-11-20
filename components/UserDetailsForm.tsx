"use client";

import { useState } from "react";
import { Session } from "next-auth";

type UserDetailsFormProps = {
  session: Session;
};

export default function UserDetailsForm({ session }: UserDetailsFormProps) {
  const [name, setName] = useState(session.user?.name || "");
  const [email, setEmail] = useState(session.user?.email || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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

      setSuccess("Detaliile au fost actualizate cu succes!");
      // Optional: update session client-side if needed, or trigger a session reload
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Stilul modernizat pentru input (vizibil în ambele teme)
  const inputCls = "w-full rounded-lg border border-gray-600 dark:border-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition";
  const btnPrimaryCls = "w-full rounded-lg px-4 py-2 bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition";

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      <h2 className="text-xl font-semibold mb-6 pb-4 border-b dark:border-gray-700 text-gray-900 dark:text-white">Detaliile contului</h2>
      
      <div>
        {/* FIX CONTRAST: text-gray-900 (negru) în Light Mode, dark:text-white în Dark Mode */}
        <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
          Nume
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls} 
          required
        />
      </div>
      <div>
        {/* FIX CONTRAST: text-gray-900 (negru) în Light Mode, dark:text-white în Dark Mode */}
        <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
          Adresă de e-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls} 
          required
        />
      </div>
      
      {/* Mesaje */}
      {success && <div className="text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 p-3 rounded-lg border border-emerald-500/20">{success}</div>}
      {error && <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/40 p-3 rounded-lg border border-red-500/20">{error}</div>}

      <div>
        <button type="submit" className={btnPrimaryCls} disabled={loading}>
          {loading ? "Se salvează..." : "Salvează modificările"}
        </button>
      </div>
    </form>
  );
}