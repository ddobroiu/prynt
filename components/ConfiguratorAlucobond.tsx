"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart, Info, X } from "lucide-react";
import MobilePriceBar from "./MobilePriceBar";
import DeliveryInfo from "@/components/DeliveryInfo";
import { usePathname, useRouter } from "next/navigation";

/* GALLERY */
const GALLERY = [
  "/products/alucobond/1.webp",
  "/products/alucobond/2.webp",
  "/products/alucobond/3.webp",
  "/products/alucobond/4.webp",
] as const;

/* HELPERS */
const roundMoney = (n: number) => Math.round(n * 100) / 100;
const formatMoneyDisplay = (n: number) => (n && n > 0 ? n.toFixed(2) : "0");
const formatAreaDisplay = (n: number) => (n && n > 0 ? String(n) : "0");

/* TYPES */
type MaterialType = "PE" | "PVDF";
type PriceInput = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: MaterialType;
  color: string;
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

/* PRICE MAP & THICKNESS */
const MATERIAL_INFO: Record<MaterialType, { thickness_mm: number; label: string }> = {
  PE: { thickness_mm: 3, label: "Visual Bond PE - Interior" },
  PVDF: { thickness_mm: 4, label: "Visual Bond PVDF - Exterior" },
};

const PRICE_MAP: Record<MaterialType, Record<string, number>> = {
  PE: { Alb: 250, Argintiu: 250, Negru: 250 },
  PVDF: { Alb: 350 },
};

/* DESIGN FEE */
const PRO_DESIGN_FEE = 100; // RON

/* LOCAL CALC */
const localCalculatePrice = (input: PriceInput): LocalPriceOutput => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
    return { sqm_per_unit: 0, total_sqm: 0, pricePerSqm: 0, finalPrice: 0 };
  }

  const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
  const total_sqm = sqm_per_unit * input.quantity;

  const pricePerSqm = PRICE_MAP[input.material]?.[input.color] ?? 0;
  const finalPrice = roundMoney(total_sqm * pricePerSqm);

  return {
    sqm_per_unit: roundMoney(sqm_per_unit),
    total_sqm: roundMoney(total_sqm),
    pricePerSqm: pricePerSqm,
    finalPrice,
  };
};

/* Props */
type Props = {
  productSlug?: string;
  initialWidth?: number;
  initialHeight?: number;
};

export default function ConfiguratorAlucobond({ productSlug, initialWidth: initW, initialHeight: initH }: Props) {
  const { addItem } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const [input, setInput] = useState<PriceInput>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    material: "PE",
    color: "Alb",
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

  const [materialOpen, setMaterialOpen] = useState(false);
  const [colorsOpen, setColorsOpen] = useState(false);
  const materialRef = useRef<HTMLDivElement | null>(null);
  const colorsRef = useRef<HTMLDivElement | null>(null);

  /* GRAFICA (no text-only option) */
  type DesignOption = "upload" | "pro";
  const [designOption, setDesignOption] = useState<DesignOption>("upload");
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [artworkLink, setArtworkLink] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const availableColors = useMemo(() => {
    return input.material === "PE" ? ["Alb", "Argintiu", "Negru"] : ["Alb"];
  }, [input.material]);

  useEffect(() => {
    if (!availableColors.includes(input.color)) {
      setInput((s) => ({ ...s, color: availableColors[0] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.material]);

  useEffect(() => {
    if (usePreset) {
      const p = PRESETS[presetIndex];
      setLengthText(String(p.w));
      setHeightText(String(p.h));
      setInput((s) => ({ ...s, width_cm: p.w, height_cm: p.h }));
    }
  }, [usePreset, presetIndex]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (materialRef.current && !materialRef.current.contains(e.target as Node)) setMaterialOpen(false);
      if (colorsRef.current && !colorsRef.current.contains(e.target as Node)) setColorsOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

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

  const displayedTotal = useMemo(() => {
    const base = serverPrice ?? priceDetailsLocal.finalPrice;
    return designOption === "pro" ? roundMoney(base + PRO_DESIGN_FEE) : base;
  }, [serverPrice, priceDetailsLocal, designOption]);

  const pricePerUnitLocal = input.quantity > 0 && displayedTotal > 0 ? roundMoney(displayedTotal / input.quantity) : 0;

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
    setArtworkUrl(null);
    setUploadError(null);
    if (!file) return;
    try {
      setUploading(true);
      const form = new FormData();
      form.append("file", file);
      // endpoint placeholder - adapt to actual upload route
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload eșuat");
      const data = await res.json();
      setArtworkUrl(data.url);
      setArtworkLink("");
    } catch (e: any) {
      try {
        const preview = file ? URL.createObjectURL(file) : null;
        setArtworkUrl(preview);
      } catch {}
      setUploadError(e?.message ?? "Eroare la upload");
    } finally {
      setUploading(false);
    }
  };

  async function calculateServer() {
    setCalcLoading(true);
    setServerPrice(null);
    try {
      // For now server price is same as local; placeholder for future API
      const result = localCalculatePrice(input);
      const base = result.finalPrice;
      setServerPrice(base);
    } catch (err) {
      console.error("calc error", err);
      alert("Eroare la calcul preț");
    } finally {
      setCalcLoading(false);
    }
  }

  function handleAddToCart() {
    // basic validation
    if (!input.width_cm || !input.height_cm) {
      alert("Completează lățimea și înălțimea (în cm) înainte de a adăuga în coș.");
      return;
    }
    if (input.width_cm > MAX_WIDTH_CM || input.height_cm > MAX_HEIGHT_CM) {
      alert(`Dimensiunile maxime suportate sunt ${MAX_WIDTH_CM} x ${MAX_HEIGHT_CM} cm.`);
      return;
    }

    const totalForOrder = serverPrice ?? priceDetailsLocal.finalPrice;
    const totalWithDesign = designOption === "pro" ? roundMoney(totalForOrder + PRO_DESIGN_FEE) : totalForOrder;
    if (!totalWithDesign || totalWithDesign <= 0) {
      alert("Calculează prețul înainte de a adăuga în coș");
      return;
    }

    const unitPrice = roundMoney(totalWithDesign / input.quantity);

    const uniqueId = [
      "alucobond",
      input.material,
      input.color,
      input.width_cm,
      input.height_cm,
      designOption,
      artworkUrl ? "art" : artworkLink ? "link" : "nod",
    ].join("-");

    const title = `Alucobond ${input.material} - ${input.color} ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "alucobond-generic",
      slug: productSlug ?? "alucobond",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        totalSqm: priceDetailsLocal.total_sqm,
        pricePerSqm: priceDetailsLocal.pricePerSqm,
        thickness_mm: MATERIAL_INFO[input.material].thickness_mm,
        designOption,
        proDesignFee: designOption === "pro" ? PRO_DESIGN_FEE : 0,
        artworkUrl,
        artworkLink,
      },
    });

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1600);
  }

  const totalShown = displayedTotal;
  const canAdd =
    totalShown > 0 &&
    input.width_cm > 0 &&
    input.height_cm > 0 &&
    input.width_cm <= MAX_WIDTH_CM &&
    input.height_cm <= MAX_HEIGHT_CM;

  return (
    <main className="min-h-screen">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">
        Produs adăugat în coș
      </div>

      <div className="page py-10 pb-24 lg:pb-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Configurator Alucobond</h1>
            <p className="mt-2 text-muted">Alege tip, culoare, dimensiuni și încarcă grafică. Calcul instant și adaugă în coș.</p>
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
              <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><Ruler /></div><h2 className="text-lg font-bold text-ui">1. Dimensiuni & cantitate</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="field-label">Lățime (cm)</label>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="ex: 300" className="input text-lg font-semibold" />
                </div>
                <div>
                  <label className="field-label">Înălțime (cm)</label>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="ex: 150" className="input text-lg font-semibold" />
                </div>
                <NumberInput label="Cantitate" value={input.quantity} onChange={(v) => updateInput("quantity", Math.max(1, Math.floor(v)))} />
              </div>
              <div className="mt-2 text-xs text-muted">Dimensiuni maxime suportate: 400 x 200 cm. Preseturi rapide disponibile.</div>
            </div>

            {/* 2. Material & Culori */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-4" ref={materialRef}>
                <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><Layers /></div><h2 className="text-lg font-bold text-ui">2. Tip material</h2></div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMaterialOpen((s) => !s)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5"
                    aria-expanded={materialOpen}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted">
                        {MATERIAL_INFO[input.material].label} — {MATERIAL_INFO[input.material].thickness_mm}mm
                      </div>
                    </div>
                    <div className="text-xs text-muted">{materialOpen ? "Închide" : "Schimbă"}</div>
                  </button>

                  {materialOpen && (
                    <div className="mt-2 p-2 bg-black/60 rounded-md border border-white/10 space-y-2">
                      <MaterialOptionDropdown checked={input.material === "PE"} onSelect={() => { updateInput("material", "PE"); setMaterialOpen(false); }} title="Visual Bond PE" subtitle="3mm — Interior" />
                      <MaterialOptionDropdown checked={input.material === "PVDF"} onSelect={() => { updateInput("material", "PVDF"); setMaterialOpen(false); }} title="Visual Bond PVDF" subtitle="4mm — Exterior" />
                    </div>
                  )}
                </div>
              </div>

              <div className="card p-4" ref={colorsRef}>
                <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><CheckCircle /></div><h2 className="text-lg font-bold text-ui">3. Culoare</h2></div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setColorsOpen((s) => !s)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5"
                    aria-expanded={colorsOpen}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted">{input.color}</div>
                    </div>
                    <div className="text-xs text-muted">{colorsOpen ? "Închide" : "Schimbă"}</div>
                  </button>

                  {colorsOpen && (
                    <div className="mt-2 p-2 bg-black/60 rounded-md border border-white/10 space-y-2">
                      {availableColors.map((c) => (
                        <button key={c} onClick={() => { updateInput("color", c); setColorsOpen(false); }} className={`w-full text-left p-2 rounded-md ${c === input.color ? "bg-indigo-900/30 border border-indigo-500" : "hover:bg-white/5"}`}>
                          <div className="text-sm text-white">{c}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-2 text-xs text-muted">Culori disponibile pentru tipul ales.</div>
              </div>
            </div>

            {/* 4. Grafică */}
            <div className="card p-4">
              <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><Info /></div><h2 className="text-lg font-bold text-ui">4. Grafică</h2></div>

              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button onClick={() => setDesignOption("upload")} className={`p-3 rounded-lg border ${designOption === "upload" ? "border-indigo-500 bg-indigo-900/10" : "border-white/10 hover:bg-white/5"}`}>Încarcă grafică</button>
                  <button onClick={() => setDesignOption("pro")} className={`p-3 rounded-lg border ${designOption === "pro" ? "border-indigo-500 bg-indigo-900/10" : "border-white/10 hover:bg-white/5"}`}>Pro (+{PRO_DESIGN_FEE} RON)</button>
                </div>
              </div>

              {designOption === "upload" && (
                <div className="panel p-3 mt-3 space-y-2 border-t border-white/5">
                  <div>
                    <label className="field-label">Încarcă fișier</label>
                    <input
                      type="file"
                      accept=".pdf,.ai,.psd,.jpg,.jpeg,.png"
                      onChange={(e) => handleArtworkFileInput(e.target.files?.[0] || null)}
                      className="block w-full text-white file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-1 file:text-white hover:file:bg-indigo-500"
                    />
                    <div className="text-xs text-muted mt-1">sau</div>
                  </div>

                  <div>
                    <label className="field-label">Link descărcare (opțional)</label>
                    <input
                      type="url"
                      value={artworkLink}
                      onChange={(e) => setArtworkLink(e.target.value)}
                      placeholder="Ex: https://.../fisier.pdf"
                      className="input"
                    />
                    <div className="text-xs text-muted mt-1">Încarcă fișier sau folosește link — alege doar una dintre opțiuni.</div>
                  </div>

                  <div className="text-xs text-muted">
                    {uploading && "Se încarcă…"}
                    {uploadError && "Eroare upload"}
                    {artworkUrl && "Fișier încărcat"}
                    {!artworkUrl && artworkLink && "Link salvat"}
                  </div>
                </div>
              )}

              {designOption === "pro" && (
                <div className="panel p-3 mt-3 border-t border-white/5">
                  <div className="text-sm text-muted">Serviciu grafic profesional — includem fișier sursă și corecții minore.</div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - summary */}
          <aside id="order-summary" className="lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              <div className="card p-4">
                <div className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img src={activeImage} alt="Alucobond preview" className="h-full w-full object-cover" loading="eager" />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {GALLERY.map((src, i) => (
                    <button key={src} onClick={() => { setActiveImage(src); setActiveIndex(i); }} className={`relative overflow-hidden rounded-md border transition aspect-square ${activeIndex === i ? "border-indigo-500 ring-2 ring-indigo-500/40" : "border-white/10 hover:border-white/30"}`} aria-label="Previzualizare">
                      <img src={src} alt="Thumb" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="card p-4">
                <h2 className="text-lg font-bold border-b border-white/10 pb-3 mb-3">Sumar</h2>
                <div className="space-y-2 text-muted text-sm">
                  <p>Suprafață: <span className="text-ui font-semibold">{formatAreaDisplay(priceDetailsLocal.total_sqm)} m²</span></p>
                  <p>Preț: <span className="text-2xl font-extrabold text-ui">{formatMoneyDisplay(totalShown)} RON</span></p>
                  <p className="text-xs text-muted">Preț / m²: <strong>{priceDetailsLocal.pricePerSqm} RON</strong></p>
                  {designOption === "pro" && <p className="text-xs text-muted">Taxă design pro: <strong>{PRO_DESIGN_FEE} RON</strong></p>}
                </div>

                <div className="mt-3">
                  <DeliveryInfo variant="minimal" showCod={false} showShippingFrom={false} />
                </div>

                <div className="hidden lg:block mt-4">
                  <button onClick={calculateServer} disabled={calcLoading} className="btn-secondary mr-2">Calculează</button>
                  <button onClick={handleAddToCart} disabled={!canAdd} className="btn-primary w-full mt-3 py-2">
                    <ShoppingCart size={18} /><span className="ml-2">Adaugă</span>
                  </button>
                </div>
              </div>

              <div className="card-muted p-3 text-xs text-muted">Dimensiuni maxime: 300x150 cm; 400x150 cm; 300x200 cm. Prețurile afișate sunt orientative.</div>
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
            <h3 className="text-xl font-bold text-white mb-3">Detalii Alucobond</h3>
            <div className="text-sm text-white/70 space-y-2">
              <p>
                Plăcile de alucobond sunt realizate dintr-un strat interior de polietilenă, îmbrăcat în 2 feţe de aluminiu cu o acoperire specială care conferă acestui tip de plăci un aspect deosebit. Materialul are suprafaţa albă, perfect plană şi netedă, este uşor şi rezistent în timp.
              </p>
              <p>
                O caracteristică deosebită a acestui tip de material, cu suprafaţa netedă şi albă, este aceea că oferă un print de înaltă calitate şi culori vii.
              </p>
              <p>
                Dimensiunile maxime ale plăcilor pot fi: 300 x 150 cm; 400 x 150 cm; 300 x 200 cm.
              </p>
              <p>
                Tipuri disponibile:
                <ul className="list-disc ml-5 mt-1">
                  <li>Visual Bond PE — Interior, grosime 3mm — culori: Alb, Argintiu, Negru — 250 RON / m²</li>
                  <li>Visual Bond PVDF — Exterior, grosime 4mm — culoare: Alb — 350 RON / m²</li>
                </ul>
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

function MaterialOptionDropdown({ checked, onSelect, title, subtitle }: { checked: boolean; onSelect: () => void; title: string; subtitle?: string }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-3 p-2 rounded-md ${checked ? "bg-indigo-900/30 border border-indigo-500" : "hover:bg-white/5"}`}
    >
      <span className={`h-3 w-3 rounded-full border ${checked ? "bg-indigo-500 border-indigo-500" : "bg-transparent border-white/20"}`} />
      <div className="text-left">
        <div className="text-sm text-white">{title}</div>
        {subtitle && <div className="text-xs text-white/60">{subtitle}</div>}
      </div>
    </button>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const inc = (d: number) => onChange(Math.max(1, value + d));
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex items-center">
        <button onClick={() => inc(-1)} className="p-2 bg-white/10 rounded-l-md hover:bg-white/15" aria-label="Decrement">
          <Minus size={14} />
        </button>
        <input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-lg font-semibold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-y-0 rounded-none" />
        <button onClick={() => inc(1)} className="p-2 bg-white/10 rounded-r-md hover:bg-white/15" aria-label="Increment">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}