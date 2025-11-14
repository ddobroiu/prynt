"use client";
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-6 py-16">Se încarcă...</div>}>
      <ResetPasswordInner />
    </Suspense>
  );
}

function ResetPasswordInner() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!token || password.length < 8 || password !== confirm) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Resetare eșuată');
      }
      setMessage('Parola a fost schimbată. Te poți autentifica acum.');
    } catch (e: any) {
      setError(e?.message || 'Eroare');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">Resetare parolă</h1>
      {!token && <p className="text-red-400 text-sm">Token lipsă.</p>}
      {token && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Parolă nouă</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 bg-surface border-[--border]"
              placeholder="Minim 8 caractere"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirmă parola</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-md border px-3 py-2 bg-surface border-[--border]"
              placeholder="Repetă parola"
            />
          </div>
          <button
            disabled={loading || password.length < 8 || password !== confirm}
            onClick={submit}
            className="w-full rounded-md px-4 py-2 bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:opacity-60"
          >{loading ? 'Se procesează...' : 'Resetează parola'}</button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {message && <p className="text-emerald-400 text-sm">{message} <a href="/login" className="underline">Login</a></p>}
        </div>
      )}
    </div>
  );
}