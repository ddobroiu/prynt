"use client";
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';

export default function ReturningCustomerLogin() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'password' | 'magic'>('password');
  const [sending, setSending] = useState(false);
  const loggedIn = !!session?.user;

  async function sendMagicLink() {
    if (!email || sending) return;
    setSending(true);
    try {
      await signIn('email', { email, callbackUrl: '/checkout' });
    } finally {
      setSending(false);
    }
  }

  async function passwordLogin() {
    if (!email || !password || sending) return;
    setSending(true);
    try {
      await signIn('credentials', { email, password, callbackUrl: '/checkout' });
    } finally {
      setSending(false);
    }
  }

  async function googleLogin() {
    await signIn('google', { callbackUrl: '/checkout' });
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
      {!loggedIn && (
        <>
          <div className="text-sm font-semibold text-ui">Client existent?</div>
          <p className="text-xs text-muted">Autentifică-te pentru a completa automat datele de livrare și facturare.</p>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => setMode('password')}
              className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold border ${mode==='password' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
            >Parolă</button>
            <button
              type="button"
              onClick={() => setMode('magic')}
              className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold border ${mode==='magic' ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
            >Link email</button>
            <button
              type="button"
              onClick={googleLogin}
              className="flex-1 rounded-md px-2 py-1.5 text-xs font-semibold border border-white/10 bg-white/5 hover:bg-white/10"
            >Google</button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-md border border-[--border] bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-ui"
              autoComplete="email"
            />
            {mode === 'password' && (
              <input
                type="password"
                placeholder="Parolă"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 rounded-md border border-[--border] bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-ui"
                autoComplete="current-password"
              />
            )}
          </div>
          <div className="mt-2">
            {mode === 'magic' ? (
              <button
                onClick={sendMagicLink}
                disabled={!email || sending}
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-60"
              >{sending ? 'Se trimite...' : 'Trimite link de login'}</button>
            ) : (
              <button
                onClick={passwordLogin}
                disabled={!email || !password || sending}
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-60"
              >{sending ? 'Se verifică...' : 'Autentificare'}</button>
            )}
          </div>
          {mode === 'password' && (
            <p className="mt-1 text-[10px] text-muted">Nu ai cont? Poți bifa "Creează cont" la plasarea comenzii.</p>
          )}
        </>
      )}
      {loggedIn && (
        <div className="text-xs text-emerald-400">Autentificat ca <strong>{session.user?.email}</strong>. Datele de livrare/facturare au fost precompletate.</div>
      )}
    </div>
  );
}
