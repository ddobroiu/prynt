"use client";
import { useState } from "react";

export default function RequestPasswordReset({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    if (!email) return;
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Nu s-a putut trimite emailul.");
      setMessage("Dacă există cont pe acest email, vei primi un link de resetare.");
    } catch (e: any) {
      setError(e?.message || "Eroare");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-md border border-[--border] p-4 space-y-2">
      <div className="font-semibold">Resetare parolă</div>
      <p className="text-xs text-muted">Primești un link pe email pentru a seta o parolă nouă.</p>
      <button
        onClick={send}
        disabled={loading || !email}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 hover:bg-indigo-500"
      >{loading ? "Se trimite..." : "Trimite link de resetare"}</button>
      {message && <p className="text-emerald-400 text-xs">{message}</p>}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
