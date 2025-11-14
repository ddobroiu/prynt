"use client";
import { useState } from 'react';

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    if (next.length < 8 || next !== confirm) return;
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current || undefined, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Eroare');
      setMsg('Parola a fost actualizată.');
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (e: any) {
      setErr(e?.message || 'Eroare');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-md border border-[--border] p-4 space-y-3">
      <div className="font-semibold">Schimbă parola</div>
      <p className="text-xs text-muted">Dacă ai primit o parolă generată, o poți modifica aici.</p>
      <input
        type="password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        placeholder="Parola curentă (lasă gol dacă nu ai)"
        className="w-full rounded-md border border-[--border] bg-surface px-3 py-2 text-sm"
        autoComplete="current-password"
      />
      <input
        type="password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        placeholder="Parola nouă"
        className="w-full rounded-md border border-[--border] bg-surface px-3 py-2 text-sm"
        autoComplete="new-password"
      />
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Confirmă parola nouă"
        className="w-full rounded-md border border-[--border] bg-surface px-3 py-2 text-sm"
        autoComplete="new-password"
      />
      <button
        disabled={loading || next.length < 8 || next !== confirm}
        onClick={submit}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 hover:bg-indigo-500"
      >{loading ? 'Se procesează...' : 'Salvează parola'}</button>
      {err && <p className="text-red-400 text-xs">{err}</p>}
      {msg && <p className="text-emerald-400 text-xs">{msg}</p>}
    </div>
  );
}