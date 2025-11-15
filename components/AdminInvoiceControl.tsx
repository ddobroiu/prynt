"use client";

import { useState } from "react";

type Props = {
  id: string;
  invoiceLink?: string | null;
  billing?: any;
};

export default function AdminInvoiceControl({ id, invoiceLink: initialLink, billing: initialBilling }: Props) {
  const [link, setLink] = useState<string>(initialLink || "");
  const [cui, setCui] = useState<string>(initialBilling?.cui || "");
  const [name, setName] = useState<string>(initialBilling?.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function saveLink() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/order/${encodeURIComponent(id)}/invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceLink: link, billing: { cui, name } }),
      });
      const txt = await res.text();
      if (!res.ok) throw new Error(txt || res.statusText);
      setMessage("Link salvat și client anunțat.");
    } catch (err: any) {
      setMessage("Eroare: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  async function generateInvoice() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/order/${encodeURIComponent(id)}/invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generate: true, billing: { cui, name } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || res.statusText);
      const newLink = data.invoiceLink || '';
      setLink(newLink);
      setMessage("Factura generată și trimisă clientului.");
    } catch (err: any) {
      setMessage("Eroare generare: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-muted">Factură</div>
      <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Link factură (paste)" className="rounded-md border px-2 py-1 bg-white/5" />
      <div className="flex gap-2">
        <input value={cui} onChange={(e) => setCui(e.target.value)} placeholder="CUI (opțional)" className="rounded-md border px-2 py-1 bg-white/5" />
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Denumire firmă" className="rounded-md border px-2 py-1 bg-white/5" />
      </div>
      <div className="flex items-center gap-2">
        <button onClick={saveLink} disabled={loading} className="inline-block rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1">Salvează link</button>
        <button onClick={generateInvoice} disabled={loading || !cui} className="inline-block rounded-md bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1">Generează Oblio (dacă CUI)</button>
        {loading ? <span className="text-xs text-muted">Se procesează…</span> : null}
      </div>
      {message ? <div className="text-sm text-muted">{message}</div> : null}
    </div>
  );
}
