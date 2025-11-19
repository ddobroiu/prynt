"use client";

import { FormEvent, useState, useEffect } from "react";
import { signIn } from "next-auth/react";

// Componente simple pentru iconițe (SVG) pentru a nu depinde de o librărie externă
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [mode, setMode] = useState<'magic' | 'password'>('password');
  
  // State-uri pentru input-uri
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  // State-uri pentru vizibilitate parolă
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (mode === 'magic') {
        const res = await signIn("email", { email, redirect: false, callbackUrl: "/account" });
        if ((res as any)?.error) {
          setError('Nu s-a putut trimite linkul.');
        } else {
          setSuccess('Verifică emailul pentru link de autentificare.');
        }
      } else {
        const res = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/account" });
        if ((res as any)?.error) {
          setError('Email sau parolă incorecte.');
        } else if ((res as any)?.ok) {
          window.location.href = '/account';
        } else {
          setError('Autentificare eșuată.');
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function requestReset(emailValue: string) {
    try {
      const res = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue }),
      });
      if (res.ok) {
        alert('Dacă există cont pe acest email, vei primi un link de resetare.');
      } else {
        alert('Nu s-a putut trimite resetarea.');
      }
    } catch {}
  }

  async function onRegister(e: FormEvent) {
    e.preventDefault();
    if (!email || password.length < 8 || password !== regConfirm) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: regName }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        setError(data?.message || 'Crearea contului a eșuat');
        return;
      }
      const loginRes = await signIn('credentials', { email, password, redirect: false, callbackUrl: '/account?welcome=1' });
      if ((loginRes as any)?.error) {
        setError('Cont creat dar autentificarea automată a eșuat — încearcă să te loghezi.');
      } else {
        window.location.href = '/account?welcome=1';
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">Cont</h1>
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setTab('login')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold border ${tab==='login' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
        >Autentificare</button>
        <button
          type="button"
          onClick={() => setTab('register')}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold border ${tab==='register' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
        >Creează cont</button>
      </div>
      <div className="space-y-6">
        {tab === 'login' && (
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
              <div className="relative">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 bg-surface border-[--border] pr-10"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showLoginPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !email || (mode==='password' && !password)}
            className="w-full rounded-md px-4 py-2 bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:opacity-60"
          >
            {loading ? 'Se procesează...' : mode === 'magic' ? 'Trimite link de login' : 'Autentifică-te'}
          </button>
          <div className="flex items-center justify-between text-[11px]">
            <button
              type="button"
              className="text-indigo-300 hover:underline"
              onClick={() => setMode(m => m === 'password' ? 'magic' : 'password')}
            >{mode === 'password' ? 'Login cu link pe email' : 'Login cu parolă'}</button>
          </div>
          <div className="flex justify-between items-center mt-1">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); if (email) requestReset(email); }}
              className="text-[11px] text-indigo-300 hover:underline"
            >Resetare parolă</a>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          {success && <p className="text-emerald-400 text-xs">{success}</p>}
          {mode === 'password' && (
            <p className="text-xs text-muted">Nu ai cont? Îl poți crea rapid la checkout bifând "Creează cont".</p>
          )}
        </form>
        )}
        {tab === 'register' && (
          <form onSubmit={onRegister} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Nume (opțional)</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full rounded-md border px-3 py-2 bg-surface border-[--border]"
                placeholder="Nume și prenume"
                autoComplete="name"
              />
            </div>
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
            <div>
              <label className="block text-sm mb-1">Parolă</label>
              <div className="relative">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 bg-surface border-[--border] pr-10"
                  placeholder="Minim 8 caractere"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showRegisterPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Confirmă parola</label>
              <div className="relative">
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 bg-surface border-[--border] pr-10"
                  placeholder="Repetă parola"
                  required
                  autoComplete="new-password"
                />
                {/* Folosim același switch pentru confirmare pentru a nu aglomera UI-ul, 
                    dar poți adăuga un state separat dacă dorești */}
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showRegisterPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !email || password.length < 8 || password !== regConfirm}
              className="w-full rounded-md px-4 py-2 bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:opacity-60"
            >{loading ? 'Se procesează...' : 'Creează cont'}</button>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            {success && <p className="text-emerald-400 text-xs">{success}</p>}
          </form>
        )}
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