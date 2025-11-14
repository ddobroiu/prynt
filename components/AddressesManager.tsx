"use client";

import { useEffect, useState } from "react";

type Address = {
  id?: string;
  type?: "shipping" | "billing" | null;
  label?: string | null;
  nume?: string | null;
  telefon?: string | null;
  judet: string;
  localitate: string;
  strada_nr: string;
  postCode?: string | null;
  bloc?: string | null;
  scara?: string | null;
  etaj?: string | null;
  ap?: string | null;
  interfon?: string | null;
  isDefault?: boolean;
};

export default function AddressesManager() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Address>({ type: "shipping", judet: "", localitate: "", strada_nr: "" });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/account/addresses", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Eroare la încărcarea adreselor");
      setAddresses(data.addresses || []);
    } catch (e: any) {
      setError(e?.message || "Eroare");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function onForm<K extends keyof Address>(k: K, v: Address[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  async function saveNew() {
    setSaving(true);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data?.error || "Nu s-a putut salva adresa");
      setForm({ type: "shipping", judet: "", localitate: "", strada_nr: "" });
      await load();
    } catch (e: any) {
      alert(e?.message || "Eroare la salvare");
    } finally {
      setSaving(false);
    }
  }

  async function update(id: string, patch: Partial<Address>) {
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data?.error || "Nu s-a putut actualiza adresa");
      setEditingId(null);
      await load();
    } catch (e: any) {
      alert(e?.message || "Eroare la actualizare");
    }
  }

  async function remove(id: string) {
    if (!confirm("Ștergi această adresa?")) return;
    try {
      const res = await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data?.error || "Nu s-a putut șterge");
      await load();
    } catch (e: any) {
      alert(e?.message || "Eroare la ștergere");
    }
  }

  return (
    <div className="space-y-6">
      <div className="panel p-4">
        <div className="font-semibold mb-3">Adaugă adresă</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select className="select" value={form.type || "shipping"} onChange={(e) => onForm("type", e.target.value as any)}>
            <option value="shipping">Livrare</option>
            <option value="billing">Facturare</option>
          </select>
          <input className="input" placeholder="Etichetă (ex: Acasă)" value={form.label || ""} onChange={(e) => onForm("label", e.target.value)} />
          <input className="input" placeholder="Nume" value={form.nume || ""} onChange={(e) => onForm("nume", e.target.value)} />
          <input className="input" placeholder="Telefon" value={form.telefon || ""} onChange={(e) => onForm("telefon", e.target.value)} />
          <input className="input" placeholder="Județ" value={form.judet} onChange={(e) => onForm("judet", e.target.value)} />
          <input className="input" placeholder="Localitate" value={form.localitate} onChange={(e) => onForm("localitate", e.target.value)} />
          <input className="input md:col-span-2" placeholder="Stradă, număr" value={form.strada_nr} onChange={(e) => onForm("strada_nr", e.target.value)} />
          <input className="input" placeholder="Cod poștal" value={form.postCode || ""} onChange={(e) => onForm("postCode", e.target.value)} />
          <input className="input" placeholder="Bloc" value={form.bloc || ""} onChange={(e) => onForm("bloc", e.target.value)} />
          <input className="input" placeholder="Scară" value={form.scara || ""} onChange={(e) => onForm("scara", e.target.value)} />
          <input className="input" placeholder="Etaj" value={form.etaj || ""} onChange={(e) => onForm("etaj", e.target.value)} />
          <input className="input" placeholder="Ap." value={form.ap || ""} onChange={(e) => onForm("ap", e.target.value)} />
          <input className="input" placeholder="Interfon" value={form.interfon || ""} onChange={(e) => onForm("interfon", e.target.value)} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.isDefault} onChange={(e) => onForm("isDefault", e.target.checked)} />
            <span>Setează ca implicit (doar Livrare)</span>
          </label>
          <button onClick={saveNew} disabled={saving} className="btn-primary">{saving ? 'Se salvează...' : 'Adaugă adresă'}</button>
        </div>
      </div>

      <div className="panel">
        <div className="p-4 font-semibold">Adresele tale</div>
        {loading ? (
          <div className="p-4 text-sm text-muted">Se încarcă...</div>
        ) : error ? (
          <div className="p-4 text-sm text-red-400">{error}</div>
        ) : addresses.length === 0 ? (
          <div className="p-4 text-sm text-muted">Nu ai adrese salvate.</div>
        ) : (
          <ul className="divide-y divide-white/10">
            {addresses.map((a) => (
              <li key={a.id} className="p-4">
                {editingId === a.id ? (
                  <EditRow a={a} onCancel={() => setEditingId(null)} onSave={(patch) => update(a.id!, patch)} />
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium">
                        {(a.label || (a.type === 'billing' ? 'Facturare' : 'Livrare'))} {a.isDefault ? <span className="ml-2 badge badge-success">Implicit</span> : null}
                      </div>
                      <div className="text-xs text-muted">{a.nume || ''}{a.telefon ? ` • ${a.telefon}` : ''}</div>
                      <div className="text-sm">{a.strada_nr}, {a.localitate}, {a.judet}{a.postCode ? `, ${a.postCode}` : ''}</div>
                      {(a.bloc || a.scara || a.etaj || a.ap || a.interfon) && (
                        <div className="text-xs text-muted">{[a.bloc ? `Bloc ${a.bloc}` : '', a.scara ? `Sc. ${a.scara}` : '', a.etaj ? `Et. ${a.etaj}` : '', a.ap ? `Ap. ${a.ap}` : '', a.interfon ? `Interfon ${a.interfon}` : ''].filter(Boolean).join(', ')}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {a.type === 'shipping' && !a.isDefault && (
                        <button className="btn-outline" onClick={() => update(a.id!, { isDefault: true })}>Setează implicit</button>
                      )}
                      <button className="btn-outline" onClick={() => setEditingId(a.id!)}>Editează</button>
                      <button className="btn-danger" onClick={() => remove(a.id!)}>Șterge</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function EditRow({ a, onCancel, onSave }: { a: Address; onCancel: () => void; onSave: (patch: Partial<Address>) => void }) {
  const [f, setF] = useState<Address>({ ...a });
  const [saving, setSaving] = useState(false);
  function on<K extends keyof Address>(k: K, v: Address[K]) { setF((p) => ({ ...p, [k]: v })); }
  async function submit() { setSaving(true); try { await onSave({ ...f }); } finally { setSaving(false); } }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <input className="input" placeholder="Etichetă" value={f.label || ''} onChange={(e) => on('label', e.target.value)} />
      <input className="input" placeholder="Nume" value={f.nume || ''} onChange={(e) => on('nume', e.target.value)} />
      <input className="input" placeholder="Telefon" value={f.telefon || ''} onChange={(e) => on('telefon', e.target.value)} />
      <input className="input" placeholder="Județ" value={f.judet} onChange={(e) => on('judet', e.target.value)} />
      <input className="input" placeholder="Localitate" value={f.localitate} onChange={(e) => on('localitate', e.target.value)} />
      <input className="input md:col-span-2" placeholder="Stradă, nr." value={f.strada_nr} onChange={(e) => on('strada_nr', e.target.value)} />
      <input className="input" placeholder="Cod poștal" value={f.postCode || ''} onChange={(e) => on('postCode', e.target.value)} />
      <input className="input" placeholder="Bloc" value={f.bloc || ''} onChange={(e) => on('bloc', e.target.value)} />
      <input className="input" placeholder="Scară" value={f.scara || ''} onChange={(e) => on('scara', e.target.value)} />
      <input className="input" placeholder="Etaj" value={f.etaj || ''} onChange={(e) => on('etaj', e.target.value)} />
      <input className="input" placeholder="Ap." value={f.ap || ''} onChange={(e) => on('ap', e.target.value)} />
      <input className="input" placeholder="Interfon" value={f.interfon || ''} onChange={(e) => on('interfon', e.target.value)} />
      {a.type === 'shipping' && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!f.isDefault} onChange={(e) => on('isDefault', e.target.checked)} />
          <span>Implicit (Livrare)</span>
        </label>
      )}
      <div className="flex gap-2">
        <button className="btn-primary" onClick={submit} disabled={saving}>{saving ? 'Se salvează...' : 'Salvează'}</button>
        <button className="btn-outline" onClick={onCancel}>Anulează</button>
      </div>
    </div>
  );
}
