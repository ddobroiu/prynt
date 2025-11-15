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
    <div className="flex flex-col gap-2 max-w-[260px]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-50 rounded flex items-center justify-center text-indigo-600">📄</div>
        <div>
          <div className="text-sm font-medium">Factură</div>
          <div className="text-xs text-muted">Încarcă PDF — va fi salvat și trimis clientului</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <label className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 cursor-pointer">
          Încarcă PDF
          <input type="file" accept="application/pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadInvoice(f); }} style={{ display: 'none' }} />
        </label>
        <div className="flex-1 text-sm">
          {uploadedName ? <div className="text-sm font-medium">{uploadedName}</div> : <div className="text-xs text-muted">Niciun fișier încă</div>}
        </div>
        {loading ? <div className="text-xs text-muted">Se încarcă…</div> : null}
      </div>
      {message ? <div className="text-sm text-muted">{message}</div> : null}
    </div>
  );
}
