"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { ShoppingCart, Plus, Minus, Info, X } from "lucide-react";
import MobilePriceBar from "./MobilePriceBar";
import DeliveryInfo from "@/components/DeliveryInfo";

type SizeKey = "A3" | "A2" | "A1" | "A0" | "S5" | "S7";
type MaterialKey =
  | "blueback_115"
  | "whiteback_150_material"
  | "satin_170"
  | "foto_220"
  | "paper_150_lucioasa"
  | "paper_150_mata"
  | "paper_300_lucioasa"
  | "paper_300_mata";

const SIZES: { key: SizeKey; label: string; dims: string }[] = [
  { key: "A3", label: "A3", dims: "297 × 420 mm" },
  { key: "A2", label: "A2", dims: "420 × 594 mm" },
  { key: "A1", label: "A1", dims: "594 × 841 mm" },
  { key: "A0", label: "A0", dims: "841 × 1189 mm" },
  { key: "S5", label: "S5", dims: "500 × 700 mm" },
  { key: "S7", label: "S7", dims: "700 × 1000 mm" },
];

const MATERIALS: { key: MaterialKey; label: string; gramaj?: string }[] = [
  { key: "paper_150_lucioasa", label: "Hârtie 150 g/mp • Lucioasă", gramaj: "150" },
  { key: "paper_150_mata", label: "Hârtie 150 g/mp • Mată", gramaj: "150" },
  { key: "paper_300_lucioasa", label: "Hârtie 300 g/mp • Lucioasă", gramaj: "300" },
  { key: "paper_300_mata", label: "Hârtie 300 g/mp • Mată", gramaj: "300" },

  { key: "blueback_115", label: "Hârtie Blueback • 115 g/mp", gramaj: "115" },
  { key: "whiteback_150_material", label: "Hârtie Whiteback • 150 g/mp", gramaj: "150" },
  { key: "satin_170", label: "Hârtie Satin • 170 g/mp", gramaj: "170" },
  { key: "foto_220", label: "Hârtie Foto • 220 g/mp", gramaj: "220" },
];

/* Price table (populated from the values you provided earlier).
   paper_300 keys are computed at runtime as 2x the 150g base.
*/
const PRICE_TABLE: Record<
  MaterialKey,
  Partial<Record<SizeKey, { min: number; price: number }[]>>
> = {
  paper_150_lucioasa: {
    A3: [
      { min: 1000, price: 1.2 },
      { min: 500, price: 1.6 },
      { min: 400, price: 1.88 },
      { min: 300, price: 1.98 },
      { min: 200, price: 2.2 },
      { min: 100, price: 2.3 },
      { min: 51, price: 2.5 },
      { min: 1, price: 3.0 },
    ],
    A2: [
      { min: 1000, price: 3.12 },
      { min: 500, price: 3.74 },
      { min: 400, price: 4.37 },
      { min: 300, price: 4.99 },
      { min: 200, price: 6.24 },
      { min: 100, price: 7.48 },
      { min: 51, price: 8.73 },
      { min: 1, price: 9.98 },
    ],
    A1: [
      { min: 1000, price: 12.48 },
      { min: 500, price: 14.98 },
      { min: 400, price: 17.48 },
      { min: 300, price: 19.98 },
      { min: 200, price: 24.98 },
      { min: 100, price: 29.98 },
      { min: 51, price: 34.96 },
      { min: 1, price: 39.96 },
    ],
    A0: [
      { min: 1000, price: 25.0 },
      { min: 500, price: 30.0 },
      { min: 400, price: 35.0 },
      { min: 300, price: 40.0 },
      { min: 200, price: 50.0 },
      { min: 100, price: 60.0 },
      { min: 51, price: 70.0 },
      { min: 1, price: 80.0 },
    ],
    S5: [
      { min: 1000, price: 8.76 },
      { min: 500, price: 10.5 },
      { min: 400, price: 12.26 },
      { min: 300, price: 14.0 },
      { min: 200, price: 17.5 },
      { min: 100, price: 21.0 },
      { min: 51, price: 24.5 },
      { min: 1, price: 28.0 },
    ],
    S7: [
      { min: 1000, price: 17.5 },
      { min: 500, price: 21.0 },
      { min: 400, price: 24.5 },
      { min: 300, price: 28.0 },
      { min: 200, price: 35.0 },
      { min: 100, price: 42.0 },
      { min: 51, price: 49.0 },
      { min: 1, price: 56.0 },
    ],
  },
  paper_150_mata: {}, // copied below
  paper_300_lucioasa: {},
  paper_300_mata: {},

  blueback_115: {
    A0: [
      { min: 1000, price: 20.0 },
      { min: 500, price: 23.0 },
      { min: 400, price: 25.0 },
      { min: 300, price: 30.0 },
      { min: 200, price: 40.0 },
      { min: 100, price: 50.0 },
      { min: 51, price: 60.0 },
      { min: 1, price: 70.0 },
    ],
    A1: [
      { min: 1000, price: 5.0 },
      { min: 500, price: 5.74 },
      { min: 400, price: 6.24 },
      { min: 300, price: 7.49 },
      { min: 200, price: 9.99 },
      { min: 100, price: 12.49 },
      { min: 51, price: 14.99 },
      { min: 1, price: 17.48 },
    ],
    A2: [
      { min: 1000, price: 4.98 },
      { min: 500, price: 5.74 },
      { min: 400, price: 6.24 },
      { min: 300, price: 7.48 },
      { min: 200, price: 9.98 },
      { min: 100, price: 12.48 },
      { min: 51, price: 14.96 },
      { min: 1, price: 17.46 },
    ],
    S5: [
      { min: 1000, price: 7.0 },
      { min: 500, price: 8.06 },
      { min: 400, price: 8.76 },
      { min: 300, price: 10.5 },
      { min: 200, price: 14.0 },
      { min: 100, price: 17.5 },
      { min: 51, price: 21.0 },
      { min: 1, price: 24.5 },
    ],
    S7: [
      { min: 1000, price: 14.0 },
      { min: 500, price: 16.1 },
      { min: 400, price: 17.5 },
      { min: 300, price: 21.0 },
      { min: 200, price: 28.0 },
      { min: 100, price: 35.0 },
      { min: 51, price: 42.0 },
      { min: 1, price: 49.0 },
    ],
  },

  whiteback_150_material: {
    A0: [
      { min: 1000, price: 25.0 },
      { min: 500, price: 30.0 },
      { min: 400, price: 35.0 },
      { min: 300, price: 40.0 },
      { min: 200, price: 50.0 },
      { min: 100, price: 60.0 },
      { min: 51, price: 70.0 },
      { min: 1, price: 80.0 },
    ],
    A1: [
      { min: 1000, price: 12.48 },
      { min: 500, price: 14.98 },
      { min: 400, price: 17.48 },
      { min: 300, price: 19.98 },
      { min: 200, price: 24.98 },
      { min: 100, price: 29.98 },
      { min: 51, price: 34.96 },
      { min: 1, price: 39.96 },
    ],
    A2: [
      { min: 1000, price: 4.98 },
      { min: 500, price: 5.74 },
      { min: 400, price: 6.24 },
      { min: 300, price: 7.48 },
      { min: 200, price: 9.98 },
      { min: 100, price: 12.48 },
      { min: 51, price: 14.96 },
      { min: 1, price: 17.46 },
    ],
    S5: [
      { min: 1000, price: 8.76 },
      { min: 500, price: 10.5 },
      { min: 400, price: 12.26 },
      { min: 300, price: 14.0 },
      { min: 200, price: 17.5 },
      { min: 100, price: 21.0 },
      { min: 51, price: 24.5 },
      { min: 1, price: 28.0 },
    ],
    S7: [
      { min: 1000, price: 17.5 },
      { min: 500, price: 21.0 },
      { min: 400, price: 24.5 },
      { min: 300, price: 28.0 },
      { min: 200, price: 35.0 },
      { min: 100, price: 42.0 },
      { min: 51, price: 49.0 },
      { min: 1, price: 56.0 },
    ],
  },

  satin_170: {
    A0: [
      { min: 1000, price: 33.0 },
      { min: 500, price: 35.0 },
      { min: 400, price: 40.0 },
      { min: 300, price: 50.0 },
      { min: 200, price: 60.0 },
      { min: 100, price: 70.0 },
      { min: 51, price: 80.0 },
      { min: 1, price: 90.0 },
    ],
    A1: [
      { min: 1000, price: 16.48 },
      { min: 500, price: 17.48 },
      { min: 400, price: 19.98 },
      { min: 300, price: 24.98 },
      { min: 200, price: 29.98 },
      { min: 100, price: 34.96 },
      { min: 51, price: 39.96 },
      { min: 1, price: 44.96 },
    ],
    A2: [
      { min: 1000, price: 8.24 },
      { min: 500, price: 8.74 },
      { min: 400, price: 9.98 },
      { min: 300, price: 12.48 },
      { min: 200, price: 14.96 },
      { min: 100, price: 17.46 },
      { min: 51, price: 19.96 },
      { min: 1, price: 22.46 },
    ],
    S5: [
      { min: 1000, price: 11.56 },
      { min: 500, price: 12.26 },
      { min: 400, price: 14.0 },
      { min: 300, price: 17.5 },
      { min: 200, price: 21.0 },
      { min: 100, price: 24.5 },
      { min: 51, price: 28.0 },
      { min: 1, price: 31.5 },
    ],
    S7: [
      { min: 1000, price: 23.1 },
      { min: 500, price: 24.5 },
      { min: 400, price: 28.0 },
      { min: 300, price: 35.0 },
      { min: 200, price: 42.0 },
      { min: 100, price: 49.0 },
      { min: 51, price: 56.0 },
      { min: 1, price: 63.0 },
    ],
  },

  foto_220: {
    A0: [
      { min: 1000, price: 40.0 },
      { min: 500, price: 50.0 },
      { min: 400, price: 60.0 },
      { min: 300, price: 70.0 },
      { min: 200, price: 80.0 },
      { min: 100, price: 90.0 },
      { min: 51, price: 100.0 },
      { min: 1, price: 120.0 },
    ],
    A1: [
      { min: 1000, price: 19.98 },
      { min: 500, price: 24.98 },
      { min: 400, price: 29.98 },
      { min: 300, price: 34.96 },
      { min: 200, price: 39.96 },
      { min: 100, price: 44.96 },
      { min: 51, price: 49.96 },
      { min: 1, price: 59.94 },
    ],
    A2: [
      { min: 1000, price: 9.98 },
      { min: 500, price: 12.48 },
      { min: 400, price: 14.96 },
      { min: 300, price: 17.46 },
      { min: 200, price: 19.96 },
      { min: 100, price: 22.46 },
      { min: 51, price: 24.94 },
      { min: 1, price: 29.94 },
    ],
    S5: [
      { min: 1000, price: 14.0 },
      { min: 500, price: 17.5 },
      { min: 400, price: 21.0 },
      { min: 300, price: 24.5 },
      { min: 200, price: 28.0 },
      { min: 100, price: 31.5 },
      { min: 51, price: 35.0 },
      { min: 1, price: 42.0 },
    ],
    S7: [
      { min: 1000, price: 28.0 },
      { min: 500, price: 35.0 },
      { min: 400, price: 42.0 },
      { min: 300, price: 49.0 },
      { min: 200, price: 56.0 },
      { min: 100, price: 63.0 },
      { min: 51, price: 70.0 },
      { min: 1, price: 84.0 },
    ],
  },
};

/* copy paper_150_lucioasa into paper_150_mata (same prices) */
PRICE_TABLE.paper_150_mata = PRICE_TABLE.paper_150_lucioasa;

/* Helpers */
function findTiersFor(material: MaterialKey, size: SizeKey) {
  const mat = PRICE_TABLE[material];
  if (mat && mat[size]) return mat[size]!;
  if (material === "paper_300_lucioasa" || material === "paper_300_mata") {
    const baseKey: MaterialKey = material === "paper_300_lucioasa" ? "paper_150_lucioasa" : "paper_150_mata";
    return PRICE_TABLE[baseKey][size];
  }
  return undefined;
}

function getUnitFromTiers(tiers: { min: number; price: number }[], qty: number) {
  const sorted = tiers.slice().sort((a, b) => b.min - a.min);
  for (const t of sorted) if (qty >= t.min) return t.price;
  return sorted[sorted.length - 1].price;
}

/* PRO fee constant */
const PRO_DESIGN_FEE = 100;

/* small UI helper */
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

export default function AfiseConfigurator({ productSlug, initialWidth, initialHeight }: { productSlug?: string; initialWidth?: number; initialHeight?: number }) {
  const { addItem } = useCart();

  const [size, setSize] = useState<SizeKey>("A2");
  const [material, setMaterial] = useState<MaterialKey>("whiteback_150_material");
  const [quantity, setQuantity] = useState<number>(50);
  const [toastVisible, setToastVisible] = useState(false);

  // design: upload / pro
  const [designOption, setDesignOption] = useState<"upload" | "pro">("upload");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  useEffect(() => {
    setQuantity((q) => Math.max(1, Math.floor(q)));
  }, []);

  // When size changes, ensure selected material is available for that size.
  useEffect(() => {
    const dedicatedMaterials: MaterialKey[] = ["blueback_115", "whiteback_150_material", "satin_170", "foto_220"];
    // If current material is a dedicated one and it has no tiers for the selected size, switch to paper_150_lucioasa
    if (dedicatedMaterials.includes(material)) {
      const matTiers = PRICE_TABLE[material];
      if (!matTiers || !matTiers[size]) {
        setMaterial("paper_150_lucioasa");
      }
    }
  }, [size, material]);

  const baseUnit = useMemo(() => {
    const tiers = findTiersFor(material, size);
    if (!tiers) return 0;
    return getUnitFromTiers(tiers, Math.max(1, Math.floor(quantity)));
  }, [material, size, quantity]);

  const unitPrice = useMemo(() => {
    if (material === "paper_300_lucioasa" || material === "paper_300_mata") {
      const baseTiers = PRICE_TABLE[material === "paper_300_lucioasa" ? "paper_150_lucioasa" : "paper_150_mata"][size];
      if (!baseTiers) return Math.round(baseUnit * 100) / 100;
      const base = getUnitFromTiers(baseTiers, Math.max(1, Math.floor(quantity)));
      return Math.round(base * 2 * 100) / 100;
    }
    return Math.round(baseUnit * 100) / 100;
  }, [material, baseUnit, size, quantity]);

  const proFee = designOption === "pro" ? PRO_DESIGN_FEE : 0;
  const total = useMemo(() => Math.round((unitPrice * Math.max(1, Math.floor(quantity)) + proFee) * 100) / 100, [unitPrice, quantity, proFee]);
  const pricePerUnitDisplayed = Math.round((total / Math.max(1, Math.floor(quantity))) * 100) / 100;

  const canAdd = quantity > 0;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setUploadedFileName(f.name);
  }

  // determine whether the material option should be shown for currently selected size
  function isMaterialVisibleForSize(m: MaterialKey, s: SizeKey) {
    // paper_* variants are available for all sizes for which paper_150 has data
    if (m.startsWith("paper_")) {
      return !!PRICE_TABLE.paper_150_lucioasa[s];
    }
    // dedicated materials only if they have explicit entry for that size
    const mat = PRICE_TABLE[m];
    return !!(mat && mat[s]);
  }

  function handleAddToCart() {
    if (!canAdd) return;
    const qty = Math.max(1, Math.floor(quantity));
    const id = `afise-${productSlug ?? "generic"}-${size}-${material}-${designOption}-${qty}`;
    addItem({
      id,
      productId: productSlug,
      slug: productSlug,
      title: `Afiș ${size} • ${MATERIALS.find((m) => m.key === material)?.label}`,
      price: pricePerUnitDisplayed,
      quantity: qty,
      metadata: { size, material, quantity: qty, designOption, proFee, uploadedFileName },
    });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1600);
  }

  return (
    <main className="page py-10">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">
        Produs adăugat în coș
      </div>
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Afișe — Print digital</h1>
          <p className="mt-2 text-muted">Alege dimensiunea, materialul, tirajul și grafica. Prețul se calculează instant.</p>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center">
            <Info size={16} />
            <span className="ml-2">Detalii</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="order-2 lg:order-1 lg:col-span-3 space-y-6">
          {/* Top: dimensiune + cantitate on same line */}
          <div className="card p-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div className="flex-1">
                <label className="field-label">Dimensiune</label>
                {/* improved select contrast so text is visible */}
                <select value={size} onChange={(e) => setSize(e.target.value as SizeKey)} className="input w-full mt-2 bg-[#0a1624] text-white">
                  {SIZES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label} — {s.dims}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ minWidth: 220 }}>
                <label className="field-label">Tiraj (buc)</label>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="btn-outline"><Minus size={14} /></button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                    className="input text-center w-24 bg-[#071024] text-white"
                  />
                  <button onClick={() => setQuantity((q) => q + 1)} className="btn-outline"><Plus size={14} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Material selection */}
          <div className="card p-4">
            <div className="text-sm text-muted mb-2">Material / Hârtie</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {MATERIALS.filter((m) => isMaterialVisibleForSize(m.key, size)).map((m) => (
                <button key={m.key} onClick={() => setMaterial(m.key)} className={`rounded-md p-3 text-left ${material === m.key ? "border-2 border-indigo-500 bg-indigo-900/20" : "border border-white/10 hover:bg-white/5"}`}>
                  <div className="text-sm text-ui font-semibold">{m.label}</div>
                  {m.gramaj && <div className="text-xs text-muted mt-1">{m.gramaj} g/mp</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Graphics options */}
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-3"><h2 className="text-lg font-bold text-ui">Grafică</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <button onClick={() => setDesignOption("upload")} className={`rounded-md p-3 text-left ${designOption === "upload" ? "border-2 border-indigo-500 bg-indigo-900/20" : "border border-white/10 hover:bg-white/5"}`}>
                <div className="text-sm text-ui font-semibold">Am fișier / Upload</div>
                <div className="text-xs text-muted mt-1">Încarcă PDF / JPG (300 dpi recomandat)</div>
              </button>
              <button onClick={() => setDesignOption("pro")} className={`rounded-md p-3 text-left ${designOption === "pro" ? "border-2 border-indigo-500 bg-indigo-900/20" : "border border-white/10 hover:bg-white/5"}`}>
                <div className="text-sm text-ui font-semibold">Grafică profesională</div>
                <div className="text-xs text-muted mt-1">Tarif fix: <span className="font-semibold">100 RON</span></div>
              </button>
            </div>

            {designOption === "upload" && (
              <div className="panel p-3 mt-3 border-t border-white/5">
                <label className="field-label">Încarcă fișier</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="block w-full text-white file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-1 file:text-white hover:file:bg-indigo-500" />
                {uploadedFileName && <div className="text-xs text-muted mt-2">Fișier: {uploadedFileName}</div>}
              </div>
            )}

            {designOption === "pro" && (
              <div className="panel p-3 mt-3 border-t border-white/5">
                <div className="text-sm text-muted">Comandă grafică profesională. Tarif fix: <span className="font-semibold">{PRO_DESIGN_FEE} RON</span>.</div>
              </div>
            )}
          </div>
        </div>

        {/* right column: preview + summary */}
  <aside id="order-summary" className="order-1 lg:order-2 lg:col-span-2">
          <div className="space-y-6 lg:sticky lg:top-6">
            <div className="card p-4">
              <div className="aspect-square rounded overflow-hidden bg-black">
                <img src="/products/afise/1.webp" alt="preview" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="card p-4">
              <h2 className="text-lg font-bold border-b border-white/10 pb-3 mb-3">Sumar</h2>
              <div className="space-y-2 text-muted text-sm">
                <p>Dimensiune: <span className="text-ui font-semibold">{size}</span></p>
                <p>Material: <span className="text-ui font-semibold">{MATERIALS.find((m) => m.key === material)?.label}</span></p>
                <p>Tiraj: <span className="text-ui font-semibold">{quantity} buc</span></p>
                <p>Preț/unitate: <span className="text-white font-semibold">{unitPrice.toFixed(2)} RON</span></p>
                {designOption === "pro" && <p>Taxă grafică Pro: <span className="text-white font-semibold">{PRO_DESIGN_FEE} RON</span></p>}
                <p className="text-xl font-bold flex items-center gap-2 flex-wrap">
                  <span>Total:</span>
                  <span className="text-indigo-400">{total.toFixed(2)} RON</span>
                  <span className="text-xs text-white whitespace-nowrap">• Livrare de la 19,99 RON</span>
                </p>
                <p className="text-sm text-white/60">Preț per bucată: {pricePerUnitDisplayed.toFixed(2)} RON</p>
              </div>

              <div className="mt-4">
                <DeliveryInfo className="hidden lg:block" variant="minimal" icon="📦" showCod={false} showShippingFrom={false} />
              </div>

              <div className="mt-4">
                <button onClick={handleAddToCart} className="btn-primary w-full flex items-center justify-center" disabled={!canAdd}>
                  <ShoppingCart size={16} /><span className="ml-2">Adaugă în coș</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <MobilePriceBar total={total} disabled={!canAdd} onAddToCart={handleAddToCart} onShowSummary={() => document.getElementById("order-summary")?.scrollIntoView({ behavior: "smooth" })} />

      {/* Details modal (moved info here) */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDetailsOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl bg-[#0b0b0b] rounded-md border border-white/10 p-6">
            <button className="absolute right-3 top-3 p-1" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={18} className="text-white/80" />
            </button>
            <h3 className="text-xl font-bold text-white mb-3">Detalii comandă - Afișe</h3>
            <div className="text-sm text-white/70 space-y-3">
              <p>- Tipar policromie (color) — 1 față.</p>
              <p>- Pentru artă finală: include bleed 3 mm; rezoluție recomandată 300 dpi.</p>
              <p>- Termen realizare: 1–5 zile lucrătoare (în funcție de cantitate).</p>
              <hr className="border-white/5 my-2" />
              <h4 className="font-semibold text-white">Opțiuni grafică</h4>
              <div className="space-y-2 text-white/70">
                <p>- Am fișier: încarcă PDF/JPG (300 dpi recomandat).</p>
                <p>- Grafică profesională: tarif fix <span className="font-semibold">100 RON</span>.</p>
              </div>
              <hr className="border-white/5 my-2" />
              <div className="text-sm text-white/70">
                <p>- Pentru întrebări despre fișiere sau specificații, contactează suportul.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}