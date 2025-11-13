"use client";

import React, { useMemo, useState } from "react";
import { useCart } from "@/components/CartContext";
import { CheckCircle, Info, ShoppingCart, X } from "lucide-react";
import MobilePriceBar from "./MobilePriceBar";

type Option = { id: string; label: string; price: number };

// Simple gallery images (reuse existing assets to avoid missing files)
const GALLERY = [
  "/products/banner/1.webp",
  "/products/afise/1.webp",
  "/products/autocolante/1.webp",
  "/products/canvas/1.webp",
] as const;

// Groups and options (prices in RON)
const GROUPS = {
  comunicat: {
    title: "Comunicat",
    options: [
      { id: "none", label: "Fără comunicat", price: 0 },
      { id: "start", label: "Începere proiect", price: 247 },
      { id: "final", label: "Finalizare proiect", price: 247 },
      { id: "start+final", label: "Începere și finalizare proiect", price: 494 },
    ] as Option[],
  },
  bannerSite: {
    title: "Banner site",
    options: [
      { id: "none", label: "Fără banner", price: 0 },
      { id: "with", label: "Banner site", price: 100 },
    ] as Option[],
  },
  afisInformativ: {
    title: "Afiș informativ",
    options: [
      { id: "none", label: "Fără afiș informativ", price: 0 },
      { id: "A2", label: "A2", price: 79 },
      { id: "A3", label: "A3", price: 49 },
      { id: "A4", label: "A4", price: 19 },
    ] as Option[],
  },
  autoMici: {
    title: "Autocolante mici",
    options: [
      { id: "none", label: "Fără autocolante mici", price: 0 },
      { id: "10x10-20", label: "10×10 cm — set 20 buc", price: 49 },
      { id: "15x15-10", label: "15×15 cm — set 10 buc", price: 49 },
      { id: "15x21-5", label: "15×21 cm — set 5 buc", price: 49 },
    ] as Option[],
  },
  autoMari: {
    title: "Autocolante mari",
    options: [
      { id: "none", label: "Fără autocolante mari", price: 0 },
      { id: "30x30-3", label: "30×30 cm — set 3 buc", price: 49 },
      { id: "40x40", label: "40×40 cm", price: 49 },
    ] as Option[],
  },
  panouTemporar: {
    title: "Panou temporar",
    options: [
      { id: "none", label: "Fără panou temporar", price: 0 },
      { id: "A2", label: "A2", price: 200 },
      { id: "80x50", label: "80×50 cm", price: 290 },
      { id: "200x300", label: "200×300 cm", price: 1190 },
      { id: "200x150", label: "200×150 cm", price: 700 },
    ] as Option[],
  },
  placaPermanenta: {
    title: "Placă permanentă",
    options: [
      { id: "none", label: "Fără placă permanentă", price: 0 },
      { id: "A2", label: "A2", price: 200 },
      { id: "80x50", label: "80×50 cm", price: 290 },
      { id: "200x300", label: "200×300 cm", price: 1190 },
      { id: "200x150", label: "200×150 cm", price: 700 },
    ] as Option[],
  },
};

type Selected = {
  comunicat?: string | null;
  bannerSite?: string | null;
  afisInformativ?: string | null;
  autoMici?: string | null;
  autoMari?: string | null;
  panouTemporar?: string | null;
  placaPermanenta?: string | null;
};

export default function FonduriEUConfigurator() {
  const { addItem } = useCart();

  const [sel, setSel] = useState<Selected>({
    comunicat: "none",
    bannerSite: "none", // explicit 0 RON default
    afisInformativ: "none",
    autoMici: "none",
    autoMari: "none",
    panouTemporar: "none",
    placaPermanenta: "none",
  });

  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState<string>("");

  // Artwork upload (optional)
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [artworkLink, setArtworkLink] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // No tabs (single page). We use compact dropdown selects to save vertical space.

  const sum = useMemo(() => {
    const priceOf = (groupKey: keyof typeof GROUPS, id?: string | null) => {
      if (!id) return 0;
      const opt = GROUPS[groupKey].options.find((o) => o.id === id);
      return opt?.price ?? 0;
    };
    return (
      priceOf("comunicat", sel.comunicat) +
      priceOf("bannerSite", sel.bannerSite) +
      priceOf("afisInformativ", sel.afisInformativ) +
      priceOf("autoMici", sel.autoMici) +
      priceOf("autoMari", sel.autoMari) +
      priceOf("panouTemporar", sel.panouTemporar) +
      priceOf("placaPermanenta", sel.placaPermanenta)
    );
  }, [sel]);

  const canAdd = sum > 0;

  function choose(group: keyof Selected, id: string) {
    setSel((s) => ({ ...s, [group]: s[group] === id ? null : id }));
  }

  function handleAdd() {
    if (!canAdd) {
      setErrorToast("Selectează cel puțin o opțiune înainte de a adăuga în coș.");
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }

    const selectedReadable = Object.entries(sel)
      .filter(([, v]) => !!v && v !== "none")
      .map(([k, v]) => {
        const g = GROUPS[k as keyof typeof GROUPS];
        const o = g?.options.find((x) => x.id === v);
        return `${g?.title}: ${o?.label} (${o?.price} RON)`;
      })
      .join(" • ");

    addItem({
      id: `fonduri-eu-${Object.values(sel).filter(Boolean).join("_")}-${sum}`,
      productId: "fonduri-eu",
      slug: "fonduri-eu",
      title: `Fonduri EU — pachet personalizat`,
      price: sum,
      quantity: 1,
      currency: "RON",
      metadata: {
        selections: sel,
        selectedReadable,
        artworkUrl,
        artworkLink,
        orderNotes,
      },
    });

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1400);
  }

  // Compact group select

  const Group = ({
    groupKey,
  }: {
    groupKey: keyof typeof GROUPS;
  }) => {
    const g = GROUPS[groupKey];
    const selected = sel[groupKey as keyof Selected] ?? null;
    return (
      <div className="card p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3"><div className="text-indigo-400"><CheckCircle /></div><h2 className="text-lg font-bold text-ui">{g.title}</h2></div>
          <div className="text-sm text-muted">{(() => {
            const o = g.options.find((x) => x.id === selected);
            return o ? `${o.price} RON` : "0 RON";
          })()}</div>
        </div>

        <label className="field-label mb-2 block">Alege opțiunea</label>
        <select
          className="input w-full"
          value={selected ?? "none"}
          onChange={(e) => choose(groupKey as keyof Selected, e.target.value)}
        >
          {g.options.map((o) => (
            <option key={o.id} value={o.id}>{o.label} — {o.price} RON</option>
          ))}
        </select>
      </div>
    );
  };

  return (
    <main className="min-h-screen">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">
        Produs adăugat în coș
      </div>
      {errorToast && (
        <div className={`toast-success opacity-100 translate-y-0`} aria-live="assertive">{errorToast}</div>
      )}

      <div className="page py-10 pb-24 lg:pb-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Configurator Fonduri EU</h1>
            <p className="mt-2 text-muted">Alege opțiunile dorite; totalul se calculează automat.</p>
          </div>
          <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline text-sm self-start">
            <Info size={18} />
            <span className="ml-2">Detalii</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT - options (single page, compact selects) */}
          <div className="order-2 lg:order-1 lg:col-span-3">
            {/* Comunicat full width first */}
              <div className="card p-4">
                <div className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-black">
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Group groupKey="bannerSite" />
              <Group groupKey="afisInformativ" />
                    <button
              <Group groupKey="autoMari" />
                      className={`relative overflow-hidden rounded-md border transition aspect-square ${activeIndex === i ? "border-indigo-500 ring-2 ring-indigo-500/40" : "border-white/10 hover:border-white/30"}`}
              <Group groupKey="placaPermanenta" />
            </div>

            {/* Grafică (opțional) */}
            <div className="card p-4 mt-4">
              <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><CheckCircle /></div><h2 className="text-lg font-bold text-ui">Grafică (opțional)</h2></div>
                      <img src={src} alt={`thumb-${i + 1}`} className="w-full h-full object-cover" />
                <div>
                  <label className="field-label">Încarcă fișier</label>
                  <input
                    type="file"
                    accept=".pdf,.ai,.psd,.jpg,.jpeg,.png"
                    onChange={async (e) => {
                      const file = e.target.files?.[0] || null;
                      setUploadError(null);
                      setArtworkUrl(null);
                      if (!file) return;
                      try {
                        setUploading(true);
                        const form = new FormData();
                        form.append("file", file);
                        const res = await fetch("/api/upload", { method: "POST", body: form });
                        if (!res.ok) throw new Error("Upload eșuat");
                        const data = await res.json();
                        setArtworkUrl(data.url);
                        setArtworkLink("");
                      } catch (err: any) {
                        try {
                          const preview = URL.createObjectURL(file);
                          setArtworkUrl(preview);
                        } catch {}
                        setUploadError(err?.message ?? "Eroare la upload");
                      } finally {
                        setUploading(false);
                      }
                    }}
                    className="block w-full text-white file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-1 file:text-white hover:file:bg-indigo-500"
                  />
                  <div className="text-xs text-muted mt-1">sau</div>
                </div>

                <div>
                  <label className="field-label">Link descărcare (opțional)</label>
                  <input type="url" value={artworkLink} onChange={(e) => setArtworkLink(e.target.value)} placeholder="Ex: https://.../fisier.pdf" className="input" />
                </div>
              </div>
              <div className="text-xs text-muted mt-2">
                {uploading && "Se încarcă…"}
                {uploadError && "Eroare upload"}
                {artworkUrl && "Fișier încărcat"}
                {!artworkUrl && artworkLink && "Link salvat"}
              </div>
            </div>

            {/* Detalii comandă */}
            <div className="card p-4 mt-4">
              <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><CheckCircle /></div><h2 className="text-lg font-bold text-ui">Detalii comandă</h2></div>
              <label htmlFor="order-notes" className="field-label mb-2 block">Note pentru comandă (opțional)</label>
              <textarea
                id="order-notes"
                className="input min-h-24"
                placeholder="Ex: termene, instrucțiuni de montaj, poziționări, persoană de contact etc."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
              <div className="mt-2 text-xs text-muted">Aceste detalii vor fi trimise împreună cu comanda.</div>
            </div>
          </div>

          {/* RIGHT - gallery + summary */}
          <aside id="order-summary" className="order-1 lg:order-2 lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              <div className="card p-4">
                <div className="aspect-square overflow-hidden rounded border bg-black">
                  <img src={activeImage} alt="Previzualizare" className="h-full w-full object-cover" />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {GALLERY.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => { setActiveImage(src); setActiveIndex(i); }}
                      className={`rounded-md overflow-hidden border aspect-square ${activeIndex === i ? "border-indigo-500" : "border-white/10"}`}
                      aria-label={`Imagine ${i + 1}`}
                    >
                      <img src={src} alt={`thumb-${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="card p-4">
                <h2 className="text-lg font-bold border-b border-white/10 pb-3 mb-3">Sumar</h2>
                <div className="space-y-2 text-muted text-sm">
                  {Object.entries(sel).filter(([, v]) => !!v && v !== "none").length === 0 ? (
                    <p>Nicio opțiune selectată încă.</p>
                  ) : (
                    Object.entries(sel).map(([k, v]) => {
                      if (!v) return null;
                      if (v === "none") return null;
                      const g = GROUPS[k as keyof typeof GROUPS];
                      const o = g.options.find((x) => x.id === v);
                      return (
                        <p key={k}>{g.title}: <span className="text-ui font-semibold">{o?.label}</span> — {o?.price} RON</p>
                      );
                    })
                  )}
                  {orderNotes && (
                    <p className="pt-2 border-t border-white/10 text-ui/80"><span className="font-semibold text-ui">Detalii:</span> {orderNotes}</p>
                  )}
                  <p className="text-xl font-bold">Total: <span className="text-indigo-400">{sum.toFixed(2)} RON</span></p>
                </div>

                <div className="hidden lg:block mt-4">
                  <button onClick={handleAdd} disabled={!canAdd} className="btn-primary w-full flex items-center justify-center">
                    <ShoppingCart size={16} />
                    <span className="ml-2">Adaugă în coș</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <MobilePriceBar total={sum} disabled={!canAdd} onAddToCart={handleAdd} onShowSummary={() => document.getElementById("order-summary")?.scrollIntoView({ behavior: "smooth" })} />

      {/* Details modal */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDetailsOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl bg-[#0b0b0b] rounded-md border border-white/10 p-6">
            <button className="absolute right-3 top-3 p-1" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={18} className="text-ui" />
            </button>
            <h3 className="text-xl font-bold text-ui mb-3">Detalii comandă - Fonduri UE</h3>
            <div className="text-sm text-muted space-y-2">
              <p>- Selectează elementele necesare (comunicat, bannere, printuri etc.). Fiecare opțiune are preț fix.</p>
              <p>- Poți încărca grafică sau să trimiți un link de descărcare (opțional).</p>
              <p>- Totalul se calculează automat; elementele "Fără …" nu adaugă cost.</p>
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => setDetailsOpen(false)} className="btn-primary py-2 px-4">Închide</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
