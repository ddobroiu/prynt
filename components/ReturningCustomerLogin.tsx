"use client";
import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';

export default function ReturningCustomerLogin() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const loggedIn = !!session?.user;

  async function passwordLogin() {
    if (!email || !password || loading) return;
    setLoading(true);
    try {
      await signIn('credentials', { email, password, callbackUrl: '/checkout' });
    } finally {
      setLoading(false);
    }
  }

  async function googleLogin() {
    await signIn('google', { callbackUrl: '/checkout' });
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
      {!loggedIn ? (
        <>
          <div className="text-sm font-semibold text-ui">Autentificare</div>
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-md border border-[--border] bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-ui"
              autoComplete="email"
            />
            <input
              type="password"
              placeholder="Parolă"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 rounded-md border border-[--border] bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-ui"
              autoComplete="current-password"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={passwordLogin}
              disabled={!email || !password || loading}
              className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-60"
            >{loading ? 'Se verifică...' : 'Autentificare'}</button>
            <button
              onClick={googleLogin}
              type="button"
              className="flex-1 rounded-md border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20"
            >Autentificare Google</button>
          </div>
        </>
      ) : (
        <div className="text-xs text-emerald-400">Autentificat ca <strong>{session.user?.email}</strong>.</div>
      )}
    </div>
  );
}
