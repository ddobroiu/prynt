"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function LoginInner() {
  const sp = useSearchParams();
  const err = sp.get('err');
  return (
    <main className="min-h-screen flex items-center justify-center bg-ui p-6">
      <div className="w-full max-w-sm rounded-2xl border card-bg p-6 text-ui">
        <h1 className="text-xl font-bold mb-4">Autentificare Admin</h1>
        {err ? (
          <div className="mb-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-200 px-3 py-2 text-sm">
            Parolă invalidă.
          </div>
        ) : null}
        <form method="post" action="/api/admin/login" className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Parolă</label>
            <input
              type="password"
              name="password"
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-indigo-400"
              placeholder="Parola admin"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 transition px-3 py-2 font-semibold text-white"
          >
            Intră în panou
          </button>
        </form>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center bg-ui p-6"></main>}>
      <LoginInner />
    </Suspense>
  );
}
