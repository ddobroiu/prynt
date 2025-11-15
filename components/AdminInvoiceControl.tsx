"use client";

import { useState } from "react";

type Props = {
  id: string;
  invoiceLink?: string | null;
  billing?: any;
};

export default function AdminInvoiceControl({ id, invoiceLink: initialLink, billing: initialBilling }: Props) {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(initialLink || null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [showLink, setShowLink] = useState(false);
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
      const url = data.url || data.url || null;
      setUploadedUrl(url);
      setUploadedName(file?.name || null);
      setMessage('Factura încărcată cu succes. Clientul a fost anunțat.');
    } catch (err: any) {
      setMessage('Eroare upload: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-[320px] w-full rounded-lg border border-gray-200/70 dark:border-slate-800/70 bg-white/60 dark:bg-slate-950/60 p-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-indigo-50 rounded-md flex items-center justify-center text-indigo-600 text-lg">📄</div>
        <div className="flex-1">
          <div className="text-sm font-semibold">Factură</div>
          <div className="text-xs text-muted">Încarcă PDF — fișierul va fi salvat și notifică clientul</div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <label className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 cursor-pointer text-sm">
          Încarcă PDF
          <input type="file" accept="application/pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadInvoice(f); }} style={{ display: 'none' }} />
        </label>

        <div className="flex-1">
          {uploadedName ? <div className="text-sm font-medium">{uploadedName}</div> : <div className="text-xs text-muted">Niciun fișier încă</div>}
          {uploadedUrl && showLink ? (
            <div className="mt-1 text-xs break-all"><a href={uploadedUrl} target="_blank" rel="noreferrer" className="text-indigo-600 underline">Descarcă factura</a></div>
          ) : null}
        </div>

        {loading ? <div className="text-xs text-muted">Se încarcă…</div> : null}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          {uploadedUrl ? (
            <button onClick={() => setShowLink((s) => !s)} className="text-sm text-indigo-600 underline">{showLink ? 'Ascunde link' : 'Arată link'}</button>
          ) : null}
        </div>
        <div>
          {message ? (
            <div className={`text-sm ${message.startsWith('Eroare') ? 'text-red-600' : 'text-green-600'}`}>{message}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
