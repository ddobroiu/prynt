"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await signIn("email", { email, redirect: true, callbackUrl: "/account" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">Autentificare</h1>
      <div className="space-y-6">
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border px-3 py-2 bg-surface border-[--border]"
            placeholder="email@exemplu.ro"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md px-4 py-2 bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:opacity-60"
          >
            Trimite link de login
          </button>
        </form>
        <div className="relative text-center">
          <span className="text-sm text-muted">sau</span>
        </div>
        <button
          onClick={() => signIn("google", { callbackUrl: "/account" })}
          className="w-full rounded-md px-4 py-2 bg-white text-black border border-[--border] font-semibold hover:bg-gray-50"
        >
          Continuă cu Google
        </button>
      </div>
    </div>
  );
}
