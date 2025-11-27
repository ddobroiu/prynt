"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function AccountDetailsForm() {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!name) {
      setMessage("Numele este obligatoriu.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/account/details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name })
      });

      const data = await res.json();
      if (res.status === 401) {
        setMessage(data?.error || 'Nu ești autentificat. Te rog autentifică-te.');
      } else if (!res.ok) {
        setMessage(data?.error || 'A apărut o eroare.');
      } else {
        setMessage('Numele a fost actualizat. Reîncarc pagina...');
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
        <label className="block text-sm text-gray-500">E-mail</label>
        <div className="mt-1 text-sm text-gray-700">{session?.user?.email || '—'}</div>
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
          {loading ? 'Salvez...' : 'Salvează numele'}
        </button>
      </div>
    </form>
  );
}
