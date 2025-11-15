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
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => update(e.target.value)}
        disabled={loading}
        className="rounded-md border px-2 py-1 bg-white/5"
      >
        <option value="in_progress">În lucru</option>
        <option value="fulfilled">Finalizată</option>
        <option value="canceled">Anulată</option>
      </select>
      {loading ? <span className="text-xs text-muted">Se actualizează…</span> : null}
      {error ? <div className="text-xs text-red-400">Eroare</div> : null}
    </div>
  );
}
