"use client";

import { useState } from "react";

type Props = {
  id: string;
  status?: string | null;
};

export default function AdminOrderStatusControl({ id, status: initialStatus }: Props) {
  const [status, setStatus] = useState<string>(initialStatus || "in_progress");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(newStatus: string) {
    if (newStatus === status) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/order/${encodeURIComponent(id)}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus(newStatus);
    } catch (err: any) {
      setError(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1 text-left text-white">
      <div className="text-[10px] uppercase tracking-[0.4em] text-white/50">Status</div>
      <div className="relative">
        <select
          value={status}
          onChange={(e) => update(e.target.value)}
          disabled={loading}
          className="w-full appearance-none rounded-2xl border border-white/15 bg-black/30 px-4 py-2 text-sm font-semibold text-white shadow-inner shadow-black/30 focus:border-indigo-400 focus:outline-none disabled:opacity-70"
        >
          <option value="in_progress">În lucru</option>
          <option value="fulfilled">Finalizată</option>
          <option value="canceled">Anulată</option>
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-white/60">⌄</span>
      </div>
      <div className="text-xs text-muted min-h-[1rem]">
        {loading ? 'Se actualizează…' : error ? 'Eroare la salvare' : ''}
      </div>
    </div>
  );
}