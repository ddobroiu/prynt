"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, CheckCircle, Plus, Minus, ShoppingCart, Info, X } from "lucide-react";
import MobilePriceBar from "./MobilePriceBar";

/* GALLERY */
const GALLERY = [
  "/products/canvas/1.jpg",
  "/products/canvas/2.jpg",
  "/products/canvas/3.jpg",
  "/products/canvas/4.jpg",
] as const;

/* Prețuri fixe pentru dimensiuni (RON) — pentru variante cu șasiu (fixed sizes) */
const SIZE_PRICE_MAP: Record<string, number> = {
  // rectangular (w x h)
  "30x40": 89,
  "30x50": 99,
  "40x60": 119,
  "50x70": 169,
  "60x90": 199,
  "80x100": 249,
  "80x120": 299,
  "100x120": 369,
  // squares
  "30x30": 79,
  "40x40": 99,
  "50x50": 129,
  "60x60": 149,
  "70x70": 189,
  "80x80": 219,
  "90x90": 299,
  "100x100": 389,
};

type SizeOption = { w: number; h: number; key: string; price: number; label: string };

const RECT_SIZES: SizeOption[] = [
  { w: 30, h: 40, key: "30x40", price: SIZE_PRICE_MAP["30x40"], label: "30 × 40 cm" },
  { w: 30, h: 50, key: "30x50", price: SIZE_PRICE_MAP["30x50"], label: "30 × 50 cm" },
  { w: 40, h: 60, key: "40x60", price: SIZE_PRICE_MAP["40x60"], label: "40 × 60 cm" },
  { w: 50, h: 70, key: "50x70", price: SIZE_PRICE_MAP["50x70"], label: "50 × 70 cm" },
  { w: 60, h: 90, key: "60x90", price: SIZE_PRICE_MAP["60x90"], label: "60 × 90 cm" },
  { w: 80, h: 100, key: "80x100", price: SIZE_PRICE_MAP["80x100"], label: "80 × 100 cm" },
  { w: 80, h: 120, key: "80x120", price: SIZE_PRICE_MAP["80x120"], label: "80 × 120 cm" },
  { w: 100, h: 120, key: "100x120", price: SIZE_PRICE_MAP["100x120"], label: "100 × 120 cm" },
];

const SQUARE_SIZES: SizeOption[] = [
  { w: 30, h: 30, key: "30x30", price: SIZE_PRICE_MAP["30x30"], label: "30 × 30 cm" },
  { w: 40, h: 40, key: "40x40", price: SIZE_PRICE_MAP["40x40"], label: "40 × 40 cm" },
  { w: 50, h: 50, key: "50x50", price: SIZE_PRICE_MAP["50x50"], label: "50 × 50 cm" },
  { w: 60, h: 60, key: "60x60", price: SIZE_PRICE_MAP["60x60"], label: "60 × 60 cm" },
  { w: 70, h: 70, key: "70x70", price: SIZE_PRICE_MAP["70x70"], label: "70 × 70 cm" },
  { w: 80, h: 80, key: "80x80", price: SIZE_PRICE_MAP["80x80"], label: "80 × 80 cm" },
  { w: 90, h: 90, key: "90x90", price: SIZE_PRICE_MAP["90x90"], label: "90 × 90 cm" },
  { w: 100, h: 100, key: "100x100", price: SIZE_PRICE_MAP["100x100"], label: "100 × 100 cm" },
];

/* Helpers for money/formatting */
const roundMoney = (n: number) => Math.round(n * 100) / 100;
const formatMoneyDisplay = (n: number) => (n && n > 0 ? n.toFixed(2) : "0");

/* Pricing tiers per m² for "fără șasiu" (no frame) */
function pricePerSqmForTotalArea(totalSqm: number) {
  if (totalSqm <= 0) return 0;
  if (totalSqm < 1) return 175;
  if (totalSqm <= 5) return 150;
  if (totalSqm <= 20) return 130;
  if (totalSqm <= 50) return 100;
  return 80;
}

const MAX_WIDTH_CM_NO_FRAME = 310; // 3.10 m
const MAX_LENGTH_CM_NO_FRAME = 5000; // 50 m
const MATERIAL_LABEL = "Canvas Fine Art — bumbac + poliester, 330 g/mp";

type Props = {
  productSlug?: string;
};

export default function CanvasConfigurator({ productSlug }: Props) {
  const { addItem } = useCart();

  // defaults: framed true, shape rect, and preset auto-selected
  const [framed, setFramed] = useState<boolean>(true);
  const [shape, setShape] = useState<"rect" | "square">("rect");

  // preset selected when framed; default to first rect preset
  const [selectedSizeKey, setSelectedSizeKey] = useState<string | null>(() => RECT_SIZES[0]?.key ?? null);

  // custom sizes when no-frame
  const [customWidthCm, setCustomWidthCm] = useState<number | "">("");
  const [customHeightCm, setCustomHeightCm] = useState<number | "">("");

  // qty and artwork
  const [quantity, setQuantity] = useState<number>(1);
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [artworkLink, setArtworkLink] = useState<string>("");

  // UI states
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // gallery
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);

  // refs (graphics panel)
  const graphicsRef = useRef<HTMLDivElement | null>(null);

  // keep preset selection in sync when shape changes or framed toggled on
  useEffect(() => {
    if (framed) {
      // ensure a preset is selected; prefer first of current shape list
      if (!selectedSizeKey) {
        const first = shape === "rect" ? RECT_SIZES[0] : SQUARE_SIZES[0];
        setSelectedSizeKey(first?.key ?? null);
      } else {
        // if selected key doesn't match shape (e.g., square selected but shape switched to rect), reset to first of new shape
        const currentList = shape === "rect" ? RECT_SIZES : SQUARE_SIZES;
        if (!currentList.find((s) => s.key === selectedSizeKey)) {
          setSelectedSizeKey(currentList[0]?.key ?? null);
        }
      }
    }
  }, [shape, framed, selectedSizeKey]);

  // pricing logic
  const basePricePerUnitPreset = useMemo(() => {
    if (!selectedSizeKey) return 0;
    return SIZE_PRICE_MAP[selectedSizeKey] ?? 0;
  }, [selectedSizeKey]);

  const customAreaPerUnit = useMemo(() => {
    if (!customWidthCm || !customHeightCm) return 0;
    return (Number(customWidthCm) / 100) * (Number(customHeightCm) / 100); // m²
  }, [customWidthCm, customHeightCm]);

  const pricePerSqmTier = useMemo(() => {
    if (!customAreaPerUnit || customAreaPerUnit <= 0) return 0;
    const totalArea = customAreaPerUnit * quantity;
    return pricePerSqmForTotalArea(totalArea);
  }, [customAreaPerUnit, quantity]);

  const unitPriceNoFrame = useMemo(() => {
    if (!customAreaPerUnit || customAreaPerUnit <= 0) return 0;
    const price = customAreaPerUnit * pricePerSqmTier;
    return roundMoney(price);
  }, [customAreaPerUnit, pricePerSqmTier]);

  const unitPrice = useMemo(() => (framed ? basePricePerUnitPreset : unitPriceNoFrame), [framed, basePricePerUnitPreset, unitPriceNoFrame]);
  const totalPrice = useMemo(() => roundMoney(unitPrice * quantity), [unitPrice, quantity]);

  // server/calc UX
  const [serverPrice, setServerPrice] = useState<number | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);

  const setQty = (v: number) => setQuantity(Math.max(1, Math.floor(v)));

  // upload handling
  const handleArtworkFileInput = async (file: File | null) => {
    setArtworkUrl(null);
    setUploadError(null);
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
      setServerPrice(totalPrice);
    } catch (err) {
      console.error("calc error", err);
      alert("Eroare la calcul preț");
    } finally {
      setCalcLoading(false);
    }
  }

  function handleAddToCart() {
    if (!artworkUrl && !artworkLink) {
      alert("Încarcă poza sau pune linkul paginii înainte de a adăuga în coș.");
      return;
    }

    if (framed) {
      if (!selectedSizeKey) {
        alert("Selectează o dimensiune preset (cu șasiu) înainte de a adăuga în coș.");
        return;
      }
    } else {
      if (!customWidthCm || !customHeightCm || Number(customWidthCm) <= 0 || Number(customHeightCm) <= 0) {
        alert("Completează lățimea și înălțimea (în cm) pentru varianta fără șasiu.");
        return;
      }
      if (Number(customWidthCm) > MAX_WIDTH_CM_NO_FRAME) {
        alert(`Lățimea maximă permisă fără șasiu este ${MAX_WIDTH_CM_NO_FRAME / 100} m (${MAX_WIDTH_CM_NO_FRAME} cm).`);
        return;
      }
      if (Number(customHeightCm) > MAX_LENGTH_CM_NO_FRAME) {
        alert(`Lungimea maximă permisă fără șasiu este ${MAX_LENGTH_CM_NO_FRAME / 100} m (${MAX_LENGTH_CM_NO_FRAME} cm).`);
        return;
      }
    }

    const totalForOrder = serverPrice ?? totalPrice;
    if (!totalForOrder || totalForOrder <= 0) {
      alert("Calculează prețul înainte de a adăuga în coș");
      return;
    }

    let width_cm = 0;
    let height_cm = 0;
    let sizeLabel = "";

    if (framed) {
      const [wStr, hStr] = (selectedSizeKey || "").split("x");
      width_cm = parseInt(wStr || "0", 10);
      height_cm = parseInt(hStr || "0", 10);
      sizeLabel = selectedSizeKey ?? "";
    } else {
      width_cm = Number(customWidthCm);
      height_cm = Number(customHeightCm);
      sizeLabel = `${width_cm}x${height_cm}`;
    }

    const uniqueId = ["canvas", framed ? "framed" : "noframe", sizeLabel].join("-");
    const title = `Canvas Fine Art - ${width_cm}x${height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "canvas-generic",
      slug: productSlug ?? "canvas-generic",
      title,
      width: width_cm,
      height: height_cm,
      price: roundMoney((serverPrice ?? totalPrice) / quantity),
      quantity,
      currency: "RON",
      metadata: {
        material: MATERIAL_LABEL,
        framed,
        shape,
        artworkUrl,
        artworkLink,
        basePricePerUnit: framed ? basePricePerUnitPreset : pricePerSqmTier,
        pricePerUnit: unitPrice,
        totalPrice: serverPrice ?? totalPrice,
        qty: quantity,
      },
    });

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1600);
  }

  // auto gallery advance
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

  const canAdd = Boolean(artworkUrl || artworkLink) && quantity > 0 && (serverPrice ?? totalPrice) > 0;

  return (
    <main className="min-h-screen">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">
        Produs adăugat în coș
      </div>

      <div className="page py-10 pb-24 lg:pb-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Configurator Canvas</h1>
            <p className="mt-2 text-white/70">Canvas Fine Art — bumbac + poliester, 330 g/mp. Trimite poza sau linkul paginii (nu trimite text).</p>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline text-sm">
              <Info size={18} />
              <span className="ml-2">Detalii</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* chenar with shape + framed toggles */}
            <div className="card p-3 flex items-center gap-4">
              <div className="text-sm font-semibold text-white">Formă</div>

              <div className="inline-flex rounded-md bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => setShape("rect")}
                  className={`px-3 py-1 rounded-md text-sm ${shape === "rect" ? "bg-indigo-600 text-white" : "text-white/80 hover:bg-white/5"}`}
                >
                  Dreptunghi
                </button>
                <button
                  type="button"
                  onClick={() => setShape("square")}
                  className={`ml-2 px-3 py-1 rounded-md text-sm ${shape === "square" ? "bg-indigo-600 text-white" : "text-white/80 hover:bg-white/5"}`}
                >
                  Pătrat
                </button>
              </div>

              <div className="ml-4 inline-flex rounded-lg border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => setFramed(false)}
                  className={`px-3 py-1 rounded-md text-sm ${!framed ? "bg-indigo-600 text-white" : "text-white/80 hover:bg-white/5"}`}
                >
                  Fără șasiu
                </button>
                <button
                  type="button"
                  onClick={() => setFramed(true)}
                  className={`ml-2 px-3 py-1 rounded-md text-sm ${framed ? "bg-indigo-600 text-white" : "text-white/80 hover:bg-white/5"}`}
                >
                  Cu șasiu (pre-set)
                </button>
              </div>
            </div>

            {/* If framed: show the relevant preset list (no collapse) */}
            {framed ? (
              <div className="card p-4">
                <div className="text-sm text-white/70 mb-3">{shape === "rect" ? "Dimensiuni preset — Dreptunghi" : "Dimensiuni preset — Pătrat"}</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(shape === "rect" ? RECT_SIZES : SQUARE_SIZES).map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setSelectedSizeKey(s.key)}
                      className={`p-3 rounded-md text-left border ${selectedSizeKey === s.key ? "border-indigo-500 bg-indigo-900/20" : "border-white/10 hover:bg-white/5"}`}
                    >
                      <div className="font-semibold text-white">{s.label}</div>
                      <div className="text-sm text-white/60">{s.price} RON</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card p-4">
                <div className="text-sm text-white/70 mb-3">Introdu dimensiunile (cm). Limite: lățime ≤ 3.10 m, lungime ≤ 50 m.</div>
                {shape === "square" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="field-label">Latura (cm)</label>
                      <input
                        type="number"
                        min={1}
                        max={MAX_WIDTH_CM_NO_FRAME}
                        value={customWidthCm as number | ""}
                        onChange={(e) => {
                          const v = e.target.value === "" ? "" : Math.max(0, Number(e.target.value));
                          setCustomWidthCm(v);
                          setCustomHeightCm(v);
                        }}
                        className="input"
                        placeholder="Ex: 50"
                      />
                      <div className="text-xs text-white/60 mt-1">Max lățime: {MAX_WIDTH_CM_NO_FRAME / 100} m, max lungime: {MAX_LENGTH_CM_NO_FRAME / 100} m</div>
                    </div>
                    <div>
                      <NumberInput label="Cantitate" value={quantity} onChange={(v) => setQty(v)} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="field-label">Lățime (cm)</label>
                      <input
                        type="number"
                        min={1}
                        max={MAX_WIDTH_CM_NO_FRAME}
                        value={customWidthCm as number | ""}
                        onChange={(e) => {
                          const v = e.target.value === "" ? "" : Math.max(0, Number(e.target.value));
                          setCustomWidthCm(v);
                        }}
                        className="input"
                        placeholder="Ex: 100"
                      />
                      <div className="text-xs text-white/60 mt-1">Max: {MAX_WIDTH_CM_NO_FRAME / 100} m</div>
                    </div>
                    <div>
                      <label className="field-label">Lungime (cm)</label>
                      <input
                        type="number"
                        min={1}
                        max={MAX_LENGTH_CM_NO_FRAME}
                        value={customHeightCm as number | ""}
                        onChange={(e) => {
                          const v = e.target.value === "" ? "" : Math.max(0, Number(e.target.value));
                          setCustomHeightCm(v);
                        }}
                        className="input"
                        placeholder="Ex: 150"
                      />
                      <div className="text-xs text-white/60 mt-1">Max: {MAX_LENGTH_CM_NO_FRAME / 100} m</div>
                    </div>
                    <div>
                      <NumberInput label="Cantitate" value={quantity} onChange={(v) => setQty(v)} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Grafică (upload/link) */}
            <div className="card p-4" ref={graphicsRef}>
              <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><CheckCircle /></div><h2 className="text-lg font-bold text-white">Grafică</h2></div>
              <div className="panel p-3 space-y-2">
                <div>
                  <label className="field-label">Încarcă poza</label>
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => handleArtworkFileInput(e.target.files?.[0] || null)} className="block w-full text-white file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-1 file:text-white hover:file:bg-indigo-500" />
                </div>
                <div>
                  <label className="field-label">Link (opțional)</label>
                  <input type="url" value={artworkLink} onChange={(e) => setArtworkLink(e.target.value)} placeholder="https://..." className="input" />
                  <div className="text-xs text-white/60 mt-1">Trimite poza sau linkul paginii; noi imprimăm imaginea primită.</div>
                </div>
                <div className="text-xs text-white/60">
                  {uploading && "Se încarcă…"}
                  {uploadError && "Eroare upload"}
                  {artworkUrl && "Fișier încărcat"}
                  {!artworkUrl && artworkLink && "Link salvat"}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - summary */}
          <aside id="order-summary" className="lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              <div className="card p-4">
                <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img src={activeImage} alt="Canvas preview" className="h-full w-full object-cover" loading="eager" />
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
                  <p>Forma: <span className="text-white font-semibold">{shape === "rect" ? "Dreptunghi" : "Pătrat"}</span></p>
                  <p>Dimensiune: <span className="text-white font-semibold">{framed ? (selectedSizeKey ?? "—") : `${customWidthCm || "—"} x ${customHeightCm || "—"} cm`}</span></p>
                  <p>Cantitate: <span className="text-white font-semibold">{quantity}</span></p>
                  <p>Preț per unitate: <span className="text-white font-semibold">{formatMoneyDisplay(unitPrice)} RON</span></p>
                  <p className="text-2xl font-extrabold text-white">Total: {formatMoneyDisplay(serverPrice ?? totalPrice)} RON</p>
                </div>

                <div className="hidden lg:block mt-4">
                  <button onClick={calculateServer} disabled={calcLoading} className="btn-secondary mr-2">Calculează</button>
                  <button onClick={handleAddToCart} disabled={!canAdd} className="btn-primary w-full mt-3 py-2">
                    <ShoppingCart size={18} /><span className="ml-2">Adaugă</span>
                  </button>
                </div>
              </div>

              <div className="card-muted p-3 text-xs text-white/60">Canvas Fine Art 330 g/mp, șasiu lemn, finisaje profesionale.</div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile price bar */}
      <MobilePriceBar total={serverPrice ?? totalPrice} disabled={!canAdd} onAddToCart={handleAddToCart} onShowSummary={() => document.getElementById("order-summary")?.scrollIntoView({ behavior: "smooth" })} />

      {/* Details modal */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDetailsOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl bg-[#0b0b0b] rounded-md border border-white/10 p-6">
            <button className="absolute right-3 top-3 p-1" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={18} className="text-white/80" />
            </button>
            <h3 className="text-xl font-bold text-white mb-3">Detalii comandă - Canvas</h3>
            <div className="text-sm text-white/70 space-y-2">
              <p>- Material: Canvas Fine Art (bumbac + poliester), 330 g/mp — nu se cutează, tăiere sigură.</p>
              <p>- Șasiu: lemn (montaj profesional) — pentru preseturi (cu șasiu) prețurile sunt fixe.</p>
              <p>- Varianta fără șasiu se calculează pe mp conform tarifelor: &lt;1 mp = 175 RON/m²; 1–5 = 150 RON/m²; 5–20 = 130 RON/m²; 20–50 = 100 RON/m²; &gt;50 = 80 RON/m².</p>
              <p>- Trimite poza sau linkul paginii. Vom imprima imaginea primită (fără adăugare de text).</p>
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
        <input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-lg font-semibold text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-y-0 rounded-none" />
        <button onClick={() => inc(1)} className="p-2 bg-white/10 rounded-r-md hover:bg-white/15" aria-label="Increment">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function SelectCardSmall({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string }) {
  return (
    <button type="button" onClick={onClick} className={`w-full rounded-md p-2 text-left transition flex items-center gap-3 ${active ? "border-2 border-indigo-500 bg-indigo-900/20" : "border border-white/10 bg-transparent hover:bg-white/5"}`}>
      <span className={`h-3 w-3 rounded-full border ${active ? "bg-indigo-500 border-indigo-500" : "bg-transparent border-white/20"}`} />
      <div>
        <div className="text-sm text-white">{title}</div>
        {subtitle && <div className="text-xs text-white/60">{subtitle}</div>}
      </div>
    </button>
  );
}