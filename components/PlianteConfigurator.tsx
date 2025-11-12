"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/CartContext";
import { CheckCircle, Plus, Minus, ShoppingCart, Info, X } from "lucide-react";
import MobilePriceBar from "./MobilePriceBar";

type Props = {
  productSlug?: string;
  initialWidth?: number;
  initialHeight?: number;
};

type FoldType = "simplu" | "fereastra" | "paralel" | "fluture";
type WeightKey = "115" | "170" | "250";

/* Gallery images (follow repo convention; adjust paths if you place images elsewhere) */
const GALLERY = [
  "/products/pliante/1.jpg",
  "/products/pliante/2.jpg",
  "/products/pliante/3.jpg",
  "/products/pliante/4.jpg",
] as const;

/* Fold types and sizes (keeps same structure/pattern as other configurators) */
const FOLDS: Record<FoldType, { label: string; open: string; closed: string; index: number }> = {
  simplu: { label: "1 big (Simplu)", open: "297 × 210 mm", closed: "148.5 × 210 mm", index: 0 },
  fereastra: { label: "2 biguri (Fereastra)", open: "297 × 210 mm", closed: "148.5 × 210 mm", index: 1 },
  paralel: { label: "3 biguri (Paralel)", open: "297 × 210 mm", closed: "75 × 210 mm", index: 2 },
  fluture: { label: "4 biguri (Fluture)", open: "297 × 210 mm", closed: "74.25 × 210 mm", index: 3 },
};

/* Inline price table (embedded in component file as requested).
   Thresholds defined as "minimum quantity for that price" and evaluated descending.
*/
const PRICE_TABLE: Record<WeightKey, { min: number; price: number }[]> = {
  "115": [
    { min: 10000, price: 0.5 },
    { min: 5000, price: 0.6 },
    { min: 2500, price: 0.8 },
    { min: 1000, price: 1.4 },
    { min: 500, price: 2.0 },
    { min: 100, price: 3.2 },
    { min: 1, price: 3.2 },
  ],
  "170": [
    { min: 10000, price: 0.8 },
    { min: 5000, price: 0.9 },
    { min: 2500, price: 1.1 },
    { min: 1000, price: 1.7 },
    { min: 500, price: 2.3 },
    { min: 100, price: 3.5 },
    { min: 1, price: 3.5 },
  ],
  "250": [
    { min: 10000, price: 1.0 },
    { min: 5000, price: 1.1 },
    { min: 2500, price: 1.3 },
    { min: 1000, price: 1.9 },
    { min: 500, price: 2.5 },
    { min: 100, price: 3.7 },
    { min: 1, price: 3.7 },
  ],
};

function getUnitPrice(weight: WeightKey, qty: number) {
  const tiers = PRICE_TABLE[weight].slice().sort((a, b) => b.min - a.min);
  for (const t of tiers) {
    if (qty >= t.min) return t.price;
  }
  return tiers[tiers.length - 1].price;
}

/* PRO design fees depending on number of biguri */
const PRO_FEES: Record<FoldType, number> = {
  simplu: 100,
  fereastra: 135,
  paralel: 175,
  fluture: 200,
};

/* small UI helper - matches pattern used in FlyerConfigurator/Autocolante */
function SelectCardSmall({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string }) {
  return (
    <button onClick={onClick} className={`w-full rounded-md p-3 text-left transition flex items-start gap-3 ${active ? "border-2 border-indigo-500 bg-indigo-900/20" : "border border-white/10 hover:bg-white/5"}`}>
      <div className={`h-4 w-4 mt-1 rounded-full border ${active ? "bg-indigo-500 border-indigo-500" : "bg-transparent border-white/20"}`} />
      <div>
        <div className="text-sm text-ui font-semibold">{title}</div>
        {subtitle && <div className="text-xs text-muted mt-1">{subtitle}</div>}
      </div>
    </button>
  );
}

export default function PlianteConfigurator({ productSlug, initialWidth, initialHeight }: Props) {
  const { addItem } = useCart();

  const [weight, setWeight] = useState<WeightKey>("115");
  const [quantity, setQuantity] = useState<number>(100);
  const [fold, setFold] = useState<FoldType>("simplu");
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // design options: upload / pro (text-only removed)
  const [designOption, setDesignOption] = useState<"upload" | "pro">("upload");

  // ensure gallery follows fold selection: when fold changes, show corresponding biguri image
  useEffect(() => {
    const idx = FOLDS[fold].index;
    setActiveIndex(idx);
    setActiveImage(GALLERY[idx]);
  }, [fold]);

  const unitBasePrice = useMemo(() => getUnitPrice(weight, Math.max(1, Math.floor(quantity))), [weight, quantity]);
  const subtotal = useMemo(() => Math.round(unitBasePrice * Math.max(1, Math.floor(quantity)) * 100) / 100, [unitBasePrice, quantity]);

  const proFee = useMemo(() => (designOption === "pro" ? PRO_FEES[fold] : 0), [designOption, fold]);

  const displayedTotal = Math.round((subtotal + proFee) * 100) / 100;
  const pricePerUnitDisplayed = Math.round((displayedTotal / Math.max(1, Math.floor(quantity))) * 100) / 100;

  const canAdd = quantity > 0;

  function handleAddToCart() {
    if (!canAdd) return;
    const unitPrice = pricePerUnitDisplayed;
    const id = `pliante-${productSlug ?? "generic"}-${weight}-${fold}-${Math.floor(quantity)}`;
    addItem({
      id,
      productId: productSlug,
      slug: productSlug,
      title: `Pliante — ${FOLDS[fold].label} — ${weight}g`,
      price: unitPrice,
      quantity: Math.max(1, Math.floor(quantity)),
      metadata: {
        weight,
        fold,
        designOption,
        proDesignFee: proFee,
      },
    });
    // feedback similar to other configurators
    alert("Produs adăugat în coș");
  }

  return (
    <main className="min-h-screen">
      <div id="added-toast" className={`toast-success`} aria-live="polite" style={{ display: "none" }} />
      <div className="page py-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Configurator Pliante</h1>
            {/* Detalii sus ca la celelalte */}
            <p className="mt-2 text-muted">Alege hârtia, tirajul și tipul de pliere. Prețul este calculat instant în componentă. Detaliile complete sunt disponibile mai jos.</p>
          </div>
          <div>
            <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline text-sm self-start">
              <Info size={18} />
              <span className="ml-2">Detalii</span>
            </button>
          </div>
        </header>

        <div className="lg:container mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* 1. Specificații */}
            <div className="card p-4">
              <div className="text-sm text-muted mb-2">Specificații</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="field-label">Hartie (g/mp)</label>
                  <div className="mt-2 space-y-2">
                    <SelectCardSmall active={weight === "115"} onClick={() => setWeight("115")} title="115 g/mp" />
                    <SelectCardSmall active={weight === "170"} onClick={() => setWeight("170")} title="170 g/mp" />
                    <SelectCardSmall active={weight === "250"} onClick={() => setWeight("250")} title="250 g/mp" />
                  </div>
                </div>

                <div>
                  <label className="field-label">Tiraj (buc)</label>
                  <div className="mt-2 flex items-center gap-2">
                    <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="btn-outline"><Minus size={14} /></button>
                    <input className="input text-center" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))} />
                    <button type="button" onClick={() => setQuantity((q) => q + 1)} className="btn-outline"><Plus size={14} /></button>
                  </div>
                </div>

                <div>
                  <label className="field-label">Tip pliere</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(Object.keys(FOLDS) as FoldType[]).map((k) => (
                      <button key={k} onClick={() => setFold(k)} className={`rounded-md p-3 text-left ${fold === k ? "border-2 border-indigo-500 bg-indigo-900/20" : "border border-white/10 hover:bg-white/5"}`}>
                        <div className="text-sm font-semibold">{FOLDS[k].label}</div>
                        <div className="text-xs text-muted mt-1">{FOLDS[k].open} → {FOLDS[k].closed}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Grafică (upload / pro). text-only removed */}
            <div className="card p-4">
              <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><CheckCircle /></div><h2 className="text-lg font-bold text-ui">Grafică</h2></div>

              <div className="mt-2 p-2 bg-black/60 rounded-md border border-white/10 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <SelectCardSmall active={designOption === "upload"} onClick={() => setDesignOption("upload")} title="Am grafică (upload/link)" />
                  <SelectCardSmall active={designOption === "pro"} onClick={() => setDesignOption("pro")} title="Pro" subtitle={`+${PRO_FEES[fold]} RON`} />
                </div>
              </div>

              {designOption === "upload" && (
                <div className="panel p-3 mt-3 border-t border-white/5">
                  <label className="field-label">Încarcă fișier</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="block w-full text-white file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-1 file:text-white hover:file:bg-indigo-500" />
                  <div className="text-xs text-muted mt-1">PDF sau JPG, 300dpi recomandat</div>
                </div>
              )}

              {designOption === "pro" && (
                <div className="panel p-3 mt-3 border-t border-white/5">
                  <div className="text-sm text-muted">Grafică profesională — tarif: <span className="font-semibold">{PRO_FEES[fold]} RON</span> (variază în funcție de numărul de biguri)</div>
                </div>
              )}
            </div>

            {/* 3. Info / Detalii */}
            <div className="card p-4">
              <h2 className="text-lg font-bold text-ui">Informații</h2>
              <div className="text-sm text-muted mt-2">
                <p>- Formatele afișate sunt estimative; pentru artă finală respectați bleed 3 mm.</p>
                <p>- Timp producție standard: 2–5 zile lucrătoare (depinde de tiraj).</p>
                <p>- Pentru tiraje mari sau finisări speciale cere o ofertă personalizată.</p>
              </div>
            </div>
          </div>

          {/* RIGHT - gallery + summary */}
          <aside className="lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              <div className="card p-4">
                <div className="aspect-video overflow-hidden rounded border bg-black">
                  <img src={activeImage} alt="preview" className="h-full w-full object-cover" />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {GALLERY.map((src, i) => (
                    <button key={src} onClick={() => { setActiveImage(src); setActiveIndex(i); }} className={`rounded-md overflow-hidden border ${activeIndex === i ? "border-indigo-500" : "border-white/10"}`}>
                      <img src={src} alt={`thumb-${i}`} className="h-20 w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="card p-4">
                <h2 className="text-lg font-bold border-b border-white/10 pb-3 mb-3">Sumar</h2>
                <div className="space-y-2 text-muted text-sm">
                  <p>Hârtie: <span className="text-ui font-semibold">{weight} g/mp</span></p>
                  <p>Tiraj: <span className="text-ui font-semibold">{quantity} buc</span></p>
                  <p>Tip pliere: <span className="text-ui font-semibold">{FOLDS[fold].label}</span></p>
                  <p>Preț bază/unitate: <span className="text-ui font-semibold">{unitBasePrice.toFixed(2)} RON</span></p>
                  {designOption === "pro" && <p>Taxă grafică Pro: <span className="text-ui font-semibold">{proFee} RON</span></p>}
                  <p className="text-xl font-bold">Total: <span className="text-indigo-400">{displayedTotal.toFixed(2)} RON</span></p>
                  <p className="text-sm text-muted">Preț per bucată: {pricePerUnitDisplayed.toFixed(2)} RON</p>
                </div>

                <div className="mt-4">
                  <button onClick={handleAddToCart} className="btn-primary w-full flex items-center justify-center" disabled={!canAdd}>
                    <ShoppingCart size={16} />
                    <span className="ml-2">Adaugă în coș</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <MobilePriceBar total={displayedTotal} disabled={!canAdd} onAddToCart={handleAddToCart} onShowSummary={() => document.getElementById("order-summary")?.scrollIntoView({ behavior: "smooth" })} />

        {/* Details modal (triggered by header button) */}
        {detailsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setDetailsOpen(false)} />
            <div className="relative z-10 w-full max-w-2xl bg-[#0b0b0b] rounded-md border border-white/10 p-6">
              <button className="absolute right-3 top-3 p-1" onClick={() => setDetailsOpen(false)} aria-label="Închide">
                <X size={18} className="text-ui" />
              </button>
              <h3 className="text-xl font-bold text-ui mb-3">Detalii comandă - Pliante</h3>
              <div className="text-sm text-muted space-y-2">
                <p>- Formatele afișate sunt estimative; pentru artă finală, includeți bleed 3 mm.</p>
                <p>- Timp producție standard: 2–5 zile lucrătoare (depinde de tiraj).</p>
                <p>- Pentru tiraje mari sau finisări speciale cere o ofertă personalizată.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}