"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function AccountDetailsForm() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!name || !email) {
      setMessage("Numele și email-ul sunt obligatorii.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/account/details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.error || 'A apărut o eroare.');
      } else {
        setMessage('Datele au fost actualizate cu succes. Reîncarc pagina...');
        // Reîncarcă pentru a actualiza session-ul afișat în UI
        setTimeout(() => window.location.reload(), 900);
      }
    } catch (e) {
      setMessage('Eroare la comunicarea cu serverul.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Detalii cont</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nume</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-mail</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="mt-1 block w-full rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 shadow-sm"
        />
      </div>

      {message && (
        <div className="text-sm text-gray-700 dark:text-gray-300">{message}</div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Salvez...' : 'Salvează modificările'}
        </button>
      </div>
    </form>
  );
}
