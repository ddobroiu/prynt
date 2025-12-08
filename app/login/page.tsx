"use client";

import { FormEvent, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

// Componente simple pentru iconițe (SVG)
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
  const [isResetView, setIsResetView] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

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

  async function handleResetRequest(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (res.ok) {
        setSuccess('Dacă există un cont cu acest email, vei primi instrucțiunile de resetare.');
      } else {
        setError(data.message || 'Nu s-a putut trimite cererea.');
      }
    } catch (err) {
      setError('Eroare de conexiune.');
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [tab, isResetView]);

  // Aplicăm stilul modern (centrat, card închis, margini rotunjite)
  return (
    <div className="flex min-h-[calc(100vh-100px)] items-center justify-center py-12 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-800 p-8 shadow-2xl">
        <div className="flex justify-center mb-4">
          <Link href="/">
            <img 
              src="/logo.jpg" 
              alt="Prynt.ro" 
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>
        <h1 className="text-3xl font-extrabold text-black dark:text-white text-center">
          {isResetView ? 'Resetare Parolă' : 'Contul Meu'}
        </h1>
        
        {/* Tab-uri Principale */}
        {!isResetView && (
          <div className="flex gap-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-700/50 shadow-inner">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                tab==='login' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-black dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/70'
              }`}
            >Autentificare</button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                tab==='register' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-black dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/70'
              }`}
            >Creează cont</button>
          </div>
        )}

        <div className="space-y-5">
          
          {/* --- LOGIN FORM --- */}
          {tab === 'login' && !isResetView && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-black dark:text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="email@exemplu.ro"
                required
                autoComplete="email"
              />
            </div>
            
            {mode === 'password' && (
              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300 mb-1">Parolă</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-black dark:text-white placeholder-gray-400 pr-10 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {showLoginPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || (mode==='password' && !password)}
              className="w-full rounded-lg px-4 py-2 bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Se procesează...' : mode === 'magic' ? 'Trimite link de login' : 'Autentifică-te'}
            </button>

            {/* Acțiuni Secundare */}
            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-200 hover:underline transition-colors"
                onClick={() => setMode(m => m === 'password' ? 'magic' : 'password')}
              >
                {mode === 'password' ? 'Login cu link pe email' : 'Login cu parolă'}
              </button>

              <button
                type="button"
                onClick={() => { setError(null); setSuccess(null); setIsResetView(true); }}
                className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:underline transition-colors"
              >
                Resetare parolă
              </button>
            </div>
          </form>
          )}

          {/* --- RESET PASSWORD FORM --- */}
          {isResetView && (
            <form onSubmit={handleResetRequest} className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-center">
                  <p className="text-sm text-black dark:text-gray-300 mb-4">Introdu adresa de email și îți vom trimite un link pentru a seta o parolă nouă.</p>
                  
                  <div className="text-left mb-4">
                    <label className="block text-sm font-medium text-black dark:text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-black dark:text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      placeholder="email@exemplu.ro"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full rounded-lg px-4 py-2 bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-500 disabled:opacity-50 transition"
                  >
                    {loading ? 'Se trimite...' : 'Trimite link resetare'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsResetView(false)}
                    className="mt-4 text-xs text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:underline"
                  >
                    ← Înapoi la autentificare
                  </button>
              </div>
            </form>
          )}

          {/* --- REGISTER FORM --- */}
          {tab === 'register' && !isResetView && (
            <form onSubmit={onRegister} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300 mb-1">Nume (opțional)</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-black dark:text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="Nume și prenume"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-black dark:text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="email@exemplu.ro"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300 mb-1">Parolă</label>
                <div className="relative">
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-black dark:text-white placeholder-gray-400 pr-10 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Minim 8 caractere"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {showRegisterPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-gray-300 mb-1">Confirmă parola</label>
                <div className="relative">
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-black dark:text-white placeholder-gray-400 pr-10 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Repetă parola"
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {showRegisterPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !email || password.length < 8 || password !== regConfirm}
                className="w-full rounded-lg px-4 py-2 bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-500 disabled:opacity-50 transition"
              >{loading ? 'Se procesează...' : 'Creează cont'}</button>
            </form>
          )}

          {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
          {success && <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">{success}</div>}

          {/* Social Login / Separator */}
          {!isResetView && (
            <>
              <div className="relative text-center py-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 relative z-10">sau continuă cu</span>
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-700"></div></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => signIn("google", { callbackUrl: "/account" })}
                    className="flex-1 rounded-lg px-4 py-2 bg-white text-black border border-gray-300 font-semibold shadow-sm hover:bg-gray-100 transition"
                    type="button"
                  >
                    Google
                  </button>
                  <button
                    onClick={() => signIn("facebook", { callbackUrl: "/account" })}
                    className="flex-1 rounded-lg px-4 py-2 bg-blue-600 text-white border border-blue-600 font-semibold shadow-sm hover:bg-blue-700 transition"
                    type="button"
                  >
                    Facebook
                  </button>
              </div>
            </>
          )}
           {!isResetView && tab === 'login' && mode === 'password' && (
             <p className="text-xs text-gray-600 dark:text-gray-400 text-center pt-2">Nu ai cont? Îl poți crea rapid aici sau la checkout.</p>
           )}
        </div>
      </div>
    </div>
  );
}