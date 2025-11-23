"use client";
import { useState, MouseEvent } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Eye, EyeOff } from 'lucide-react';

export default function ReturningCustomerLogin() {
  const { data: session } = useSession();
  
  // Stări pentru Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Stări pentru UI (Login vs Reset)
  const [view, setView] = useState<'login' | 'reset'>('login'); 
  const [loading, setLoading] = useState(false);
  
  // Stări mesaje Resetare
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [resetErr, setResetErr] = useState<string | null>(null);

  const loggedIn = !!session?.user;

  // --- Funcții Login ---
  async function passwordLogin(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault(); 
    if (!email || !password || loading) return;
    setLoading(true);
    try {
      await signIn('credentials', { email, password, callbackUrl: '/checkout' });
    } finally {
      setLoading(false);
    }
  }

  async function googleLogin(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault(); 
    await signIn('google', { callbackUrl: '/checkout' });
  }
  
  // --- Functie NOUA pentru Facebook ---
  async function facebookLogin(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    await signIn('facebook', { callbackUrl: '/checkout' });
  }
  // ------------------------------------

  // --- Funcții Resetare Parolă ---
  async function sendResetLink(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault(); 
    if (!email) return;
    setLoading(true);
    setResetMsg(null);
    setResetErr(null);
    try {
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) throw new Error(data.message || "Nu s-a putut trimite emailul.");
      setResetMsg("Link-ul de resetare a fost trimis pe email.");
    } catch (e: any) {
      setResetErr(e?.message || "Eroare la trimitere.");
    } finally {
      setLoading(false);
    }
  }

  // --- UI Render ---

  if (loggedIn) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
        <div className="text-xs text-emerald-400">
          Autentificat ca <strong>{session.user?.email}</strong>.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
      
      {/* Header dinamic - Butonul de resetare este aliniat la dreapta */}
      <div className="flex justify-between items-center">
        <div className="text-sm font-semibold text-ui">
          {view === 'login' ? 'Autentificare' : 'Resetare Parolă'}
        </div>
        
        {/* Butoane Toggle View - CU TYPE="BUTTON" OBLIGATORIU */}
        {view === 'login' ? (
           <button 
             type="button" 
             onClick={(e) => { e.preventDefault(); setView('reset'); }}
             className="text-xs text-indigo-300 hover:text-indigo-200 underline underline-offset-2"
           >
             Ai uitat parola?
           </button>
        ) : (
           <button 
             type="button"
             onClick={(e) => {
               e.preventDefault();
               setView('login');
               setResetMsg(null);
               setResetErr(null);
             }}
             className="text-xs text-gray-400 hover:text-white underline underline-offset-2"
           >
             Înapoi la autentificare
           </button>
        )}
      </div>

      {/* VIEW: LOGIN */}
      {view === 'login' && (
        <>
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-md border border-[--border] bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-ui"
              autoComplete="email"
            />
            
            <div className="relative flex-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Parolă"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-[--border] bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-ui pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button" 
              onClick={passwordLogin}
              disabled={!email || !password || loading}
              className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-60"
            >
              {loading ? 'Se verifică...' : 'Autentificare'}
            </button>
          </div>
          
          {/* Social Login Section */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={googleLogin}
              type="button"
              className="flex-1 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20"
            >
              Autentificare Google
            </button>
            <button
              onClick={facebookLogin}
              type="button"
              className="flex-1 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20"
            >
              Autentificare Facebook
            </button>
          </div>
        </>
      )}

      {/* VIEW: RESET */}
      {view === 'reset' && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">
            Introdu adresa de email pentru a primi instrucțiunile de resetare.
          </p>
          <input
            type="email"
            placeholder="Adresa de email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-[--border] bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-ui"
          />
          
          <button
            type="button" 
            onClick={sendResetLink}
            disabled={!email || loading}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-60"
          >
            {loading ? 'Se trimite...' : 'Trimite link resetare'}
          </button>

          {resetMsg && <p className="text-emerald-400 text-xs">{resetMsg}</p>}
          {resetErr && <p className="text-red-400 text-xs">{resetErr}</p>}
        </div>
      )}
    </div>
  );
}