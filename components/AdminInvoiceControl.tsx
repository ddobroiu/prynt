"use client";

import { useState } from "react";

type Props = {
  id: string;
  invoiceLink?: string | null;
};

export default function AdminInvoiceControl({ id, invoiceLink: initialLink }: Props) {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(initialLink || null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [showLink, setShowLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const MAX_BYTES = 10 * 1024 * 1024; // 10MB
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Note: Removed "saveLink" and "generateInvoice" actions per UX request.
  // Admin now only uploads PDF or views existing invoice link.

  async function uploadInvoice(file?: File) {
    setLoading(true);
    setMessage(null);
    try {
      const fd = new FormData();
      if (file) {
        if (file.size && file.size > MAX_BYTES) throw new Error('Fișier prea mare (max 10MB)');
        if (file.type && file.type !== 'application/pdf') throw new Error('Acceptăm doar PDF');
        fd.append('file', file, file.name);
      }
      // ensure cookies are sent so server can verify admin session
      const res = await fetch(`/api/admin/order/${encodeURIComponent(id)}/upload-invoice`, {
        method: 'POST',
        body: fd,
        credentials: 'same-origin',
      });

      const ct = (res.headers.get('content-type') || '').toLowerCase();
      let data: any = null;
      if (ct.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        try { data = JSON.parse(text); } catch { data = { message: text }; }
      }
      if (!res.ok) throw new Error(data?.message || res.statusText || 'Upload failed');
      const url = data.url || data.link || data.invoiceLink || null;
      setUploadedUrl(url);
      setUploadedName(file?.name || null);
      setMessage('Factura încărcată cu succes. Clientul a fost anunțat.');
    } catch (err: any) {
      setMessage('Eroare upload: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!uploadedUrl || copied) return;
    try {
      await navigator.clipboard.writeText(uploadedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err: any) {
      setMessage('Nu am putut copia linkul: ' + (err?.message || err));
    }
  }

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-black/30 p-4 text-sm text-white shadow-inner shadow-black/40">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:scale-[1.01]">
          Încarcă PDF
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadInvoice(f);
            }}
            style={{ display: 'none' }}
          />
        </label>
        {uploadedUrl ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLink((s) => !s)}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/5"
            >
              {showLink ? 'Ascunde link' : 'Vizualizează'}
            </button>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/5"
            >
              {copied ? 'Copiat' : 'Copiază link'}
            </button>
          </div>
        ) : null}
      </div>
      {uploadedUrl && showLink ? (
        <div className="mt-3 text-xs">
          <a href={uploadedUrl} target="_blank" rel="noreferrer" className="text-indigo-200 underline">
            Descarcă factura
          </a>
        </div>
      ) : null}
      {uploadedName ? <div className="mt-2 text-xs text-muted">Ultimul fișier: {uploadedName}</div> : null}
      <div className="mt-2 min-h-[1.25rem] text-xs text-muted">
        {loading ? 'Se încarcă…' : message}
      </div>
    </div>
  );
}