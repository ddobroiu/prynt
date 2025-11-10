"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart, Info, X } from "lucide-react";
import MobilePriceBar from "./MobilePriceBar";

/* GALLERY (adjust images if needed) */
const GALLERY = [
  "/products/polipropilena/1.jpg",
  "/products/polipropilena/2.jpg",
  "/products/polipropilena/3.jpg",
] as const;

/* HELPERS */
const roundMoney = (n: number) => Math.round(n * 100) / 100;
const formatMoneyDisplay = (n: number) => (n && n > 0 ? n.toFixed(2) : "0");
const formatAreaDisplay = (n: number) => (n && n > 0 ? String(n) : "0");

/* TYPES */
type DesignOption = "upload" | "pro";
type PriceInput = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  thickness_mm: number;
  designOption?: DesignOption;
  artworkUrl?: string | null;
  artworkLink?: string;
};

type LocalPriceOutput = {
  sqm_per_unit: number;
  total_sqm: number;
  pricePerSqm: number;
  finalPrice: number;
};

/* PRESETS / LIMITS */
const PRESETS = [
  { w: 300, h: 150 },
  { w: 400, h: 150 },
  { w: 300, h: 200 },
];

const MAX_WIDTH_CM = 400;
const MAX_HEIGHT_CM = 200;

/* MATERIAL DATA (Akyplac Alb) */
/* Prices (RON / m²) and gramaj (g/mp) */
const AKYPLAC_PRICE: Record<number, number> = {
  3: 160, // 3.0 mm — 450 g/mp
  5: 200, // 5.0 mm — 1050 g/mp
};

const AKYPLAC_GRAMAJ: Record<number, number> = {
  3: 450,
  5: 1050,
};

const AVAILABLE_THICKNESS = [3, 5];

/* LOCAL CALC */
const localCalculatePrice = (input: PriceInput): LocalPriceOutput => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
    return { sqm_per_unit: 0, total_sqm: 0, pricePerSqm: 0, finalPrice: 0 };
  }

  const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
  const total_sqm = roundMoney(sqm_per_unit * input.quantity);
  const pricePerSqm = AKYPLAC_PRICE[input.thickness_mm] ?? 0;
  const finalPrice = roundMoney(total_sqm * pricePerSqm);

  return {
    sqm_per_unit: roundMoney(sqm_per_unit),
    total_sqm,
    pricePerSqm: roundMoney(pricePerSqm),
    finalPrice,
  };
};

/* Props */
type Props = {
  productSlug?: string;
  initialWidth?: number;
  initialHeight?: number;
};

export default function ConfiguratorPolipropilena({ productSlug, initialWidth: initW, initialHeight: initH }: Props) {
  const { addItem } = useCart();

  const [input, setInput] = useState<PriceInput>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    thickness_mm: AVAILABLE_THICKNESS[0],
    designOption: "upload",
    artworkUrl: null,
    artworkLink: "",
  });

  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");
  const [usePreset, setUsePreset] = useState(true);
  const [presetIndex, setPresetIndex] = useState(0);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);

  const [serverPrice, setServerPrice] = useState<number | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const materialRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (usePreset) {
      const p = PRESETS[presetIndex];
      setLengthText(String(p.w));
      setHeightText(String(p.h));
      setInput((s) => ({ ...s, width_cm: p.w, height_cm: p.h }));
    }
  }, [usePreset, presetIndex]);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => {
        const next = (i + 1) % GALLERY.length;
        setActiveImage(GALLERY[next]);
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const priceDetailsLocal = useMemo(() => localCalculatePrice(input), [input]);
  const displayedTotal = useMemo(() => serverPrice ?? priceDetailsLocal.finalPrice, [serverPrice, priceDetailsLocal]);

  const updateInput = <K extends keyof PriceInput>(k: K, v: PriceInput[K]) => setInput((p) => ({ ...p, [k]: v }));

  const onChangeLength = (v: string) => {
    const d = v.replace(/\D/g, "");
    setLengthText(d);
    updateInput("width_cm", d === "" ? 0 : parseInt(d, 10));
  };
  const onChangeHeight = (v: string) => {
    const d = v.replace(/\D/g, "");
    setHeightText(d);
    updateInput("height_cm", d === "" ? 0 : parseInt(d, 10));
  };

  const handleArtworkFileInput = async (file: File | null) => {
    updateInput("artworkUrl", null);
    updateInput("artworkLink", "");
    setUploadError(null);
    if (!file) return;
    try {
      setUploading(true);
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload eșuat");
      const data = await res.json();
      updateInput("artworkUrl", data.url);
      setUploading(false);
    } catch (e: any) {
      try {
        const preview = file ? URL.createObjectURL(file) : null;
        updateInput("artworkUrl", preview);
      } catch {}
      setUploadError(e?.message ?? "Eroare la upload");
      setUploading(false);
    }
  };

  async function calculateServer() {
    setCalcLoading(true);
    setServerPrice(null);
    try {
      const result = localCalculatePrice(input);
      setServerPrice(result.finalPrice);
    } catch (err) {
      console.error(err);
      alert("Eroare la calcul preț");
    } finally {
      setCalcLoading(false);
    }
  }

  function handleAddToCart() {
    if (!input.width_cm || !input.height_cm) {
      alert("Completează lățimea și înălțimea (în cm) înainte de a adăuga în coș.");
      return;
    }
    if (input.width_cm > MAX_WIDTH_CM || input.height_cm > MAX_HEIGHT_CM) {
      alert(`Dimensiunile maxime suportate sunt ${MAX_WIDTH_CM} x ${MAX_HEIGHT_CM} cm.`);
      return;
    }

    const totalForOrder = serverPrice ?? priceDetailsLocal.finalPrice;
    if (!totalForOrder || totalForOrder <= 0) {
      alert("Calculează prețul înainte de a adăuga în coș");
      return;
    }

    const unitPrice = roundMoney(totalForOrder / input.quantity);

    const uniqueId = [
      "polipropilena",
      input.thickness_mm,
      input.width_cm,
      input.height_cm,
      input.designOption ?? "upload",
    ].join("-");

    const title = `Akyplac Alb ${input.thickness_mm}mm ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "polipropilena-akyplac",
      slug: productSlug ?? "polipropilena-akyplac",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        totalSqm: priceDetailsLocal.total_sqm,
        pricePerSqm: priceDetailsLocal.pricePerSqm,
        thickness_mm: input.thickness_mm,
        gramaj_gmp: AKYPLAC_GRAMAJ[input.thickness_mm] ?? null,
        designOption: input.designOption ?? "upload",
        artworkUrl: input.artworkUrl ?? null,
        artworkLink: input.artworkLink ?? "",
      },
    });

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1400);
  }

  const totalShown = displayedTotal;
  const canAdd = totalShown > 0 && input.width_cm > 0 && input.height_cm > 0 && input.width_cm <= MAX_WIDTH_CM && input.height_cm <= MAX_HEIGHT_CM;

  return (
    <main className="min-h-screen">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">
        Produs adăugat în coș
      </div>

      <div className="page py-10 pb-24 lg:pb-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Configurator Polipropilenă (Akyplac Alb)</h1>
            <p className="mt-2 text-white/70">Alege grosimea (3mm / 5mm), dimensiunile și încarcă grafică. Opțiunea "Pro" se stabilește după comandă.</p>
          </div>
          <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline text-sm self-start">
            <Info size={18} />
            <span className="ml-2">Detalii</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* 1. Dimensiuni */}
            <div className="card p-4">
              <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><Ruler /></div><h2 className="text-lg font-bold text-white">1. Dimensiuni & cantitate</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="field-label">Lățime (cm)</label>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="ex: 100" className="input text-lg font-semibold" />
                </div>
                <div>
                  <label className="field-label">Înălțime (cm)</label>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="ex: 100" className="input text-lg font-semibold" />
                </div>
                <div>
                  <label className="field-label">Cantitate</label>
                  <div className="flex items-center">
                    <button onClick={() => updateInput("quantity", Math.max(1, input.quantity - 1))} className="p-2 bg-white/10 rounded-l-md hover:bg-white/15"><Minus size={14} /></button>
                    <input type="number" value={input.quantity} onChange={(e) => updateInput("quantity", Math.max(1, parseInt(e.target.value || "1")))} className="input text-lg font-semibold text-center" />
                    <button onClick={() => updateInput("quantity", input.quantity + 1)} className="p-2 bg-white/10 rounded-r-md hover:bg-white/15"><Plus size={14} /></button>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-white/60">Preseturi: {PRESETS.map(p => `${p.w}x${p.h} cm`).join(" • ")}</div>
            </div>

            {/* 2. Grosime */}
            <div className="card p-4" ref={materialRef}>
              <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><Layers /></div><h2 className="text-lg font-bold text-white">2. Grosime material (mm)</h2></div>

              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_THICKNESS.map((t) => (
                  <button key={t} onClick={() => updateInput("thickness_mm", t)} className={`p-2 text-left rounded-md ${input.thickness_mm === t ? "border border-indigo-500 bg-indigo-900/10" : "border border-white/10 hover:bg-white/5"}`}>
                    {t} mm
                  </button>
                ))}
              </div>

              <div className="mt-3 text-xs text-white/60">
                Gramaj: <strong>{AKYPLAC_GRAMAJ[input.thickness_mm]} g/mp</strong>
              </div>
            </div>

            {/* 4. Grafică */}
            <div className="card p-4">
              <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><Info /></div><h2 className="text-lg font-bold text-white">3. Grafică</h2></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button onClick={() => updateInput("designOption", "upload")} className={`p-3 rounded-lg border ${input.designOption === "upload" ? "border-indigo-500 bg-indigo-900/10" : "border-white/10 hover:bg-white/5"}`}>Încarcă grafică</button>
                <button onClick={() => updateInput("designOption", "pro")} className={`p-3 rounded-lg border ${input.designOption === "pro" ? "border-indigo-500 bg-indigo-900/10" : "border-white/10 hover:bg-white/5"}`}>Pro (preț stabilit după comandă)</button>
              </div>

              {input.designOption === "upload" && (
                <div className="panel p-3 mt-3 space-y-2 border-t border-white/5">
                  <div>
                    <label className="field-label">Încarcă fișier</label>
                    <input
                      type="file"
                      accept=".pdf,.ai,.psd,.jpg,.jpeg,.png"
                      onChange={(e) => handleArtworkFileInput(e.target.files?.[0] || null)}
                      className="block w-full text-white file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-1 file:text-white hover:file:bg-indigo-500"
                    />
                    <div className="text-xs text-white/60 mt-1">sau</div>
                  </div>

                  <div>
                    <label className="field-label">Link descărcare (opțional)</label>
                    <input
                      type="url"
                      value={input.artworkLink ?? ""}
                      onChange={(e) => updateInput("artworkLink", e.target.value)}
                      placeholder="Ex: https://.../fisier.pdf"
                      className="input"
                    />
                    <div className="text-xs text-white/60 mt-1">Încarcă fișier sau folosește link — alege doar una dintre opțiuni.</div>
                  </div>

                  <div className="text-xs text-white/60">
                    {uploading && "Se încarcă…"}
                    {uploadError && "Eroare upload"}
                    {input.artworkUrl && "Fișier încărcat"}
                    {!input.artworkUrl && input.artworkLink && "Link salvat"}
                  </div>
                </div>
              )}

              {input.designOption === "pro" && (
                <div className="panel p-3 mt-3 border-t border-white/5">
                  <div className="text-sm text-white/80">Serviciu grafic profesional — prețul se stabilește după comandă și evaluare.</div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - summary */}
          <aside id="order-summary" className="lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              <div className="card p-4">
                <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img src={activeImage} alt="Polipropilena preview" className="h-full w-full object-cover" loading="eager" />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {GALLERY.map((src, i) => (
                    <button key={src} onClick={() => { setActiveImage(src); setActiveIndex(i); }} className={`relative overflow-hidden rounded-md border transition ${activeIndex === i ? "border-indigo-500 ring-2 ring-indigo-500/40" : "border-white/10 hover:border-white/30"}`} aria-label="Previzualizare">
                      <img src={src} alt="Thumb" className="h-20 w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="card p-4">
                <h2 className="text-lg font-bold border-b border-white/10 pb-3 mb-3">Sumar</h2>
                <div className="space-y-2 text-white/80 text-sm">
                  <p>Suprafață: <span className="text-white font-semibold">{formatAreaDisplay(priceDetailsLocal.total_sqm)} m²</span></p>
                  <p>Preț: <span className="text-2xl font-extrabold text-white">{formatMoneyDisplay(totalShown)} RON</span></p>
                  <p className="text-xs text-white/60">Preț / m²: <strong>{priceDetailsLocal.pricePerSqm > 0 ? `${priceDetailsLocal.pricePerSqm} RON` : "—"}</strong></p>
                  <p className="text-xs text-white/60">Gramaj: <strong>{AKYPLAC_GRAMAJ[input.thickness_mm]} g/mp</strong></p>
                  <p className="text-xs text-white/60">Grafică: <strong>{input.designOption === "pro" ? "Pro (preț la comandă)" : input.artworkUrl ? "Fișier încărcat" : input.artworkLink ? "Link salvat" : "Nedefinit"}</strong></p>
                </div>

                <div className="hidden lg:block mt-4">
                  <button onClick={calculateServer} disabled={calcLoading} className="btn-secondary mr-2">Calculează</button>
                  <button onClick={handleAddToCart} disabled={!canAdd} className="btn-primary w-full mt-3 py-2">
                    <ShoppingCart size={18} /><span className="ml-2">Adaugă</span>
                  </button>
                </div>
              </div>

              <div className="card-muted p-3 text-xs text-white/60">
                Dimensiuni maxime suportate: 300x150 cm; 400x150 cm; 300x200 cm. Prețurile afișate sunt orientative.
              </div>
            </div>
          </aside>
        </div>
      </div>

      <MobilePriceBar total={totalShown} disabled={!canAdd} onAddToCart={handleAddToCart} onShowSummary={() => document.getElementById("order-summary")?.scrollIntoView({ behavior: "smooth" })} />

      {/* Details modal */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDetailsOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl bg-[#0b0b0b] rounded-md border border-white/10 p-6">
            <button className="absolute right-3 top-3 p-1" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={18} className="text-white/80" />
            </button>
            <h3 className="text-xl font-bold text-white mb-3">Detalii Akyplac Alb (Polipropilenă)</h3>
            <div className="text-sm text-white/70 space-y-3">
              <p>
                Akyplac Alb — plăci din polipropilenă. Suprafețele albe și gramajele specificate fac materialul potrivit pentru aplicații ușoare, imprimare digitală și elemente expuse la manipulare.
              </p>
              <p>
                Grosimi disponibile: 3.0 mm (gramaj {AKYPLAC_GRAMAJ[3]} g/mp) și 5.0 mm (gramaj {AKYPLAC_GRAMAJ[5]} g/mp).
              </p>
              <p>
                Prețurile sunt folosite în calculul din configurator; detaliile de gramaj sunt afișate pentru referință. Pentru servicii grafice "Pro" prețul se stabilește după comandă.
              </p>
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

/* small UI helpers */

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const inc = (d: number) => onChange(Math.max(1, value + d));
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex items-center">
        <button onClick={() => inc(-1)} className="p-2 bg-white/10 rounded-l-md hover:bg-white/15" aria-label="Decrement">
          <Minus size={14} />
        </button>
        <input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value || "1")))} className="input text-lg font-semibold text-center" />
        <button onClick={() => inc(1)} className="p-2 bg-white/10 rounded-r-md hover:bg-white/15" aria-label="Increment">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}