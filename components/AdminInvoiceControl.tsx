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

  // Note: Removed "saveLink" and "generateInvoice" actions per UX request.
  // Admin now only uploads PDF or views existing invoice link.

  async function uploadInvoice(file?: File) {
    setLoading(true);
    setMessage(null);
    try {
      const fd = new FormData();
      if (file) fd.append('file', file, file.name);
      fd.append('billing', JSON.stringify({ cui, name }));
      const res = await fetch(`/api/admin/order/${encodeURIComponent(id)}/upload-invoice`, {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || res.statusText);
      const url = data.url || '';
      setLink(url);
      setMessage('Factura încărcată și salvată. Clientul a fost anunțat.');
    } catch (err: any) {
      setMessage('Eroare upload: ' + (err?.message || err));
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
        <label className="inline-flex items-center gap-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="16" height="16"><path d="M12 3v9" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 7l4-4 4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Încarcă PDF
          <input type="file" accept="application/pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadInvoice(f); }} style={{ display: 'none' }} />
        </label>
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" className="text-indigo-400 underline text-sm">Descarcă</a>
        ) : (
          <div className="text-xs text-muted">Fără factură</div>
        )}
        {loading ? <span className="text-xs text-muted">Se procesează…</span> : null}
      </div>
      {message ? <div className="text-sm text-muted">{message}</div> : null}
    </div>
  );
}
