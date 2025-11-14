"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [mode, setMode] = useState<'magic' | 'password'>('password');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      if (mode === 'magic') {
        await signIn("email", { email, redirect: true, callbackUrl: "/account" });
      } else {
        await signIn("credentials", { email, password, redirect: true, callbackUrl: "/account" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">Autentificare</h1>
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setMode('password')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold border ${mode==='password' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
        >Email + Parolă</button>
        <button
          type="button"
          onClick={() => setMode('magic')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold border ${mode==='magic' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
        >Link pe Email</button>
      </div>
      <div className="space-y-6">
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border px-3 py-2 bg-surface border-[--border]"
              placeholder="email@exemplu.ro"
              required
              autoComplete="email"
            />
          </div>
          {mode === 'password' && (
            <div>
              <label className="block text-sm mb-1">Parolă</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border px-3 py-2 bg-surface border-[--border]"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !email || (mode==='password' && !password)}
            className="w-full rounded-md px-4 py-2 bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? 'Se procesează...' : mode === 'magic' ? 'Trimite link de login' : 'Autentifică-te'}
          </button>
          <div className="flex justify-between items-center mt-1">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); if (email) requestReset(email); }}
              className="text-[11px] text-indigo-300 hover:underline"
            >Resetare parolă</a>
          </div>
          {mode === 'password' && (
            <p className="text-xs text-muted">Nu ai cont? Îl poți crea rapid la checkout bifând "Creează cont".</p>
          )}
        </form>
        <div className="relative text-center">
          <span className="text-sm text-muted">sau</span>
        </div>
        <button
          onClick={() => signIn("google", { callbackUrl: "/account" })}
          className="w-full rounded-md px-4 py-2 bg-white text-black border border-[--border] font-semibold hover:bg-gray-50"
          type="button"
        >
          Continuă cu Google
        </button>
      </div>
    </div>
  );
}

  async function requestReset(emailValue: string) {
    try {
      const res = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue }),
      });
      // Silent success/fail UI minimal
      if (res.ok) {
        alert('Dacă există cont pe acest email, vei primi un link de resetare.');
      } else {
        alert('Nu s-a putut trimite resetarea.');
      }
    } catch {}
  }
