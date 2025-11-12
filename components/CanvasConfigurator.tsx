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
  "30x40": 89,
  "30x50": 99,
  "40x60": 119,
  "50x70": 169,
  "60x90": 199,
  "80x100": 249,
  "80x120": 299,
  "100x120": 369,
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
  initialWidth?: number;   // NEW: accept initial values (in cm)
  initialHeight?: number;  // NEW: accept initial values (in cm)
};

/* Responsive selector component embedded to avoid extra file */
function ResponsiveShapeFrameSelector({
  shape,
  setShape,
  framed,
  setFramed,
}: {
  shape: "rect" | "square";
  setShape: (s: "rect" | "square") => void;
  framed: boolean;
  setFramed: (b: boolean) => void;
}) {
  return (
    <div className="card p-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Shape selector */}
        <div>
          <div className="text-sm font-semibold text-ui mb-2">Formă</div>
          <div className="inline-flex w-full rounded-md bg-white/5 p-1 gap-2">
            <button
              type="button"
              onClick={() => setShape("rect")}
              className={`flex-1 px-3 py-1 rounded-md text-sm text-center ${shape === "rect" ? "bg-indigo-600 text-white" : "text-muted hover:bg-white/5"}`}
            >
              Dreptunghi
            </button>
            <button
              type="button"
              onClick={() => setShape("square")}
              className={`flex-1 px-3 py-1 rounded-md text-sm text-center ${shape === "square" ? "bg-indigo-600 text-white" : "text-muted hover:bg-white/5"}`}
            >
              Pătrat
            </button>
          </div>
        </div>

        {/* Framed selector - occupies remaining columns on md+ and full width below */}
        <div className="md:col-span-2">
          <div className="text-sm font-semibold text-ui mb-2">Șasiu</div>

          {/* Desktop: inline segmented; Mobile: stacked full-width */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFramed(false)}
              className={`w-full px-3 py-2 rounded-md text-sm text-left ${!framed ? "bg-indigo-600 text-white" : "text-muted hover:bg-white/5"}`}
            >
              <div className="font-medium">Fără șasiu</div>
              <div className="text-xs text-muted">Personalizat, calcul pe m²</div>
            </button>

            <button
              type="button"
              onClick={() => setFramed(true)}
              className={`w-full px-3 py-2 rounded-md text-sm text-left ${framed ? "bg-indigo-600 text-white" : "text-muted hover:bg-white/5"}`}
            >
              <div className="font-medium">Cu șasiu (pre-set)</div>
              <div className="text-xs text-muted">Dimensiuni preset cu preț fix</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CanvasConfigurator({ productSlug, initialWidth, initialHeight }: Props) {
  const { addItem } = useCart();

  // defaults: framed true, shape rect, and preset auto-selected
  const [framed, setFramed] = useState<boolean>(true);
  const [shape, setShape] = useState<"rect" | "square">("rect");
  const [selectedSizeKey, setSelectedSizeKey] = useState<string | null>(() => RECT_SIZES[0]?.key ?? null);

  // custom sizes when no-frame (cm)
  const [customWidthCm, setCustomWidthCm] = useState<number | "">("");
  const [customHeightCm, setCustomHeightCm] = useState<number | "">("");

  // if initialWidth/initialHeight are passed, apply them once on mount
  useEffect(() => {
    if (typeof initialWidth === "number" && initialWidth > 0) {
      setCustomWidthCm(initialWidth);
    }
    if (typeof initialHeight === "number" && initialHeight > 0) {
      setCustomHeightCm(initialHeight);
    }
  }, [initialWidth, initialHeight]);

  // quantity and artwork
  const [quantity, setQuantity] = useState<number>(1);
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [artworkLink, setArtworkLink] = useState<string>("");

  // add-text option + text content
  const [addTextOption, setAddTextOption] = useState<boolean>(false);
  const [textDesign, setTextDesign] = useState<string>("");

  // UI states
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // errors visible when trying to add to cart
  const [errors, setErrors] = useState<string[]>([]);

  // gallery
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);

  // refs
  const graphicsRef = useRef<HTMLDivElement | null>(null);

  // keep preset selection in sync
  useEffect(() => {
    if (framed) {
      if (!selectedSizeKey) {
        const first = shape === "rect" ? RECT_SIZES[0] : SQUARE_SIZES[0];
        setSelectedSizeKey(first?.key ?? null);
      } else {
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

  // server / calc UX
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
      setUploadError(null);
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
    } finally {
      setCalcLoading(false);
    }
  }

  // validate and add to cart with visible reasons why it failed
  function handleAddToCart() {
    const nextErrors: string[] = [];

    // artwork optional — warn if uploadError exists
    if (uploadError) nextErrors.push("Eroare la upload: " + uploadError);

    // framed vs no-frame validations
    if (framed) {
      if (!selectedSizeKey) nextErrors.push("Nu ai selectat o dimensiune preset (cu șasiu).");
    } else {
      if (!customWidthCm || Number(customWidthCm) <= 0) nextErrors.push("Nu ai introdus lățimea (cm) pentru varianta fără șasiu.");
      if (!customHeightCm || Number(customHeightCm) <= 0) nextErrors.push("Nu ai introdus lungimea (cm) pentru varianta fără șasiu.");
      if (customWidthCm && Number(customWidthCm) > MAX_WIDTH_CM_NO_FRAME)
        nextErrors.push(`Lățimea maximă permisă fără șasiu este ${MAX_WIDTH_CM_NO_FRAME / 100} m.`);
      if (customHeightCm && Number(customHeightCm) > MAX_LENGTH_CM_NO_FRAME)
        nextErrors.push(`Lungimea maximă permisă fără șasiu este ${MAX_LENGTH_CM_NO_FRAME / 100} m.`);
    }

    // quantity
    if (!quantity || quantity <= 0) nextErrors.push("Cantitate invalidă.");

    // if errors, set visible errors and focus
    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      const el = document.querySelector("#config-errors");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // passed validation — clear errors
    setErrors([]);

    // determine dims
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

    // Build a clear title that includes whether it has frame or not
    const frameText = framed ? "Cu șasiu" : "Fără șasiu";
    const title = `Canvas Fine Art - ${width_cm}x${height_cm} cm (${frameText})`;

    const uniqueId = ["canvas", framed ? "framed" : "noframe", sizeLabel].join("-");

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
        framed_label: frameText,
        shape,
        artworkUrl,
        artworkLink,
        addText: addTextOption && textDesign.trim() !== "",
        textDesign: addTextOption && textDesign.trim() !== "" ? textDesign.trim() : null,
        basePricePerUnit: framed ? basePricePerUnitPreset : pricePerSqmTier,
        pricePerUnit: unitPrice,
        totalPrice: serverPrice ?? totalPrice,
        qty: quantity,
      },
    });

    // success feedback
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1500);

    // reset server price so user recalculates if they change something
    setServerPrice(null);
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

  // pretty visual markers
  const FilePreview = () => {
    if (!artworkUrl) return null;
    return (
      <div className="mt-2 flex items-center gap-3">
        <img src={artworkUrl} alt="uploaded" className="h-12 w-12 object-cover rounded-md border" />
        <div>
          <div className="text-sm font-medium text-white">Fișier încărcat</div>
          <div className="text-xs text-white/60">Poți schimba sau să adaugi link alternativ.</div>
        </div>
      </div>
    );
  };

  // canAdd used by MobilePriceBar
  const canAdd =
    quantity > 0 &&
    ((framed && Boolean(selectedSizeKey)) || (!framed && customWidthCm && customHeightCm && Number(customWidthCm) > 0 && Number(customHeightCm) > 0));

  return (
    <main className="min-h-screen">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">
        Produs adăugat în coș
      </div>

      <div className="page py-10 pb-24 lg:pb-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Configurator Canvas</h1>
            <p className="mt-2 text-muted">Canvas Fine Art — bumbac + poliester, 330 g/mp.</p>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline text-sm">
              <Info size={18} />
              <span className="ml-2">Detalii</span>
            </button>
          </div>
        </header>

        {/* ERROR PANEL */}
        {errors.length > 0 && (
          <div id="config-errors" className="mb-4 card p-3 border-l-4 border-red-500 bg-black/40">
            <div className="font-semibold text-red-400 mb-2">Nu s-a putut adăuga în coș</div>
            <ul className="list-disc pl-5 text-sm text-white/80">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="order-2 lg:order-1 lg:col-span-3 space-y-6">
            {/* REPLACED: responsive shape + framed selector */}
            <ResponsiveShapeFrameSelector shape={shape} setShape={setShape} framed={framed} setFramed={setFramed} />

            {/* presets / custom inputs */}
            {framed ? (
              <div className="card p-4">
                <div className="text-sm text-muted mb-3">{shape === "rect" ? "Dimensiuni preset — Dreptunghi" : "Dimensiuni preset — Pătrat"}</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(shape === "rect" ? RECT_SIZES : SQUARE_SIZES).map((s) => (
                    <button key={s.key} onClick={() => setSelectedSizeKey(s.key)} className={`p-3 rounded-md text-left border ${selectedSizeKey === s.key ? "border-indigo-500 bg-indigo-900/20" : "border-white/10 hover:bg-white/5"}`}>
                      <div className="font-semibold text-ui">{s.label}</div>
                      <div className="text-sm text-muted">{s.price} RON</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card p-4">
                <div className="text-sm text-muted mb-3">Introdu dimensiunile (cm). Limite: lățime ≤ 3.10 m, lungime ≤ 50 m.</div>

                {shape === "square" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="field-label">Latura (cm)</label>
                      <input type="number" min={1} max={MAX_WIDTH_CM_NO_FRAME} value={customWidthCm as number | ""} onChange={(e) => { const v = e.target.value === "" ? "" : Math.max(0, Number(e.target.value)); setCustomWidthCm(v); setCustomHeightCm(v); }} className="input" placeholder="Ex: 50" />
                      <div className="text-xs text-muted mt-1">Max lățime: {MAX_WIDTH_CM_NO_FRAME / 100} m, max lungime: {MAX_LENGTH_CM_NO_FRAME / 100} m</div>
                    </div>

                    <div>
                      <NumberInput label="Cantitate" value={quantity} onChange={(v) => setQty(v)} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="field-label">Lățime (cm)</label>
                      <input type="number" min={1} max={MAX_WIDTH_CM_NO_FRAME} value={customWidthCm as number | ""} onChange={(e) => { const v = e.target.value === "" ? "" : Math.max(0, Number(e.target.value)); setCustomWidthCm(v); }} className="input" placeholder="Ex: 100" />
                      <div className="text-xs text-muted mt-1">Max: {MAX_WIDTH_CM_NO_FRAME / 100} m</div>
                    </div>

                    <div>
                      <label className="field-label">Lungime (cm)</label>
                      <input type="number" min={1} max={MAX_LENGTH_CM_NO_FRAME} value={customHeightCm as number | ""} onChange={(e) => { const v = e.target.value === "" ? "" : Math.max(0, Number(e.target.value)); setCustomHeightCm(v); }} className="input" placeholder="Ex: 150" />
                      <div className="text-xs text-muted mt-1">Max: {MAX_LENGTH_CM_NO_FRAME / 100} m</div>
                    </div>

                    <div>
                      <NumberInput label="Cantitate" value={quantity} onChange={(v) => setQty(v)} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Grafică */}
            <div className="card p-4" ref={graphicsRef}>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-indigo-400"><CheckCircle /></div>
                <h2 className="text-lg font-bold text-ui">Grafică</h2>
              </div>

              <div className="panel p-3 space-y-2">
                <div>
                  <label className="field-label">Încarcă fișier</label>
                  <input type="file" accept=".pdf,.ai,.psd,.jpg,.jpeg,.png" onChange={(e) => handleArtworkFileInput(e.target.files?.[0] || null)} className="block w-full text-white file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-1 file:text-white hover:file:bg-indigo-500" />
                </div>

                <div>
                  <label className="field-label">Link descărcare (opțional)</label>
                  <input type="url" value={artworkLink} onChange={(e) => setArtworkLink(e.target.value)} placeholder="Ex: https://.../fisier.pdf" className="input" />
                  <div className="text-xs text-white/60 mt-1">Ex: https://.../fisier.pdf — Încarcă fișier sau folosește link — alege doar una dintre opțiuni.</div>
                </div>

                <FilePreview />

                <div className="flex items-start gap-3 mt-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={addTextOption} onChange={(e) => setAddTextOption(e.target.checked)} />
                    <span className="text-sm text-muted">Adaugă text pe canvas</span>
                  </label>
                </div>

                {addTextOption && (
                  <div className="mt-2">
                    <label className="field-label">Text pentru canvas</label>
                    <input type="text" value={textDesign} onChange={(e) => setTextDesign(e.target.value)} placeholder="Ex: Nume / Mesaj scurt" className="input" />
                    <div className="text-xs text-muted mt-1">Textul nu apare pe previzualizare, dar va fi trimis cu comanda dacă este bifat.</div>
                  </div>
                )}

                <div className="text-xs text-muted">
                  {uploading && "Se încarcă…"}
                  {uploadError && <span className="text-red-400">Eroare upload: {uploadError}</span>}
                  {artworkUrl && <span className="text-green-400">Fișier disponibil</span>}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT - summary + preview (NO uploaded override of gallery) */}
          <aside id="order-summary" className="order-1 lg:order-2 lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              <div className="card p-4 relative">
                <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black relative">
                  {/* keep gallery images only here; do NOT show uploaded artwork over gallery */}
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
                <div className="space-y-2 text-muted text-sm">
                  <p>Forma: <span className="text-ui font-semibold">{shape === "rect" ? "Dreptunghi" : "Pătrat"}</span></p>
                  <p>Dimensiune: <span className="text-ui font-semibold">{framed ? (selectedSizeKey ?? "—") : `${customWidthCm || "—"} x ${customHeightCm || "—"} cm`}</span></p>
                  <p>Șasiu: <span className="text-ui font-semibold">{framed ? "Da" : "Nu"}</span></p>
                  <p>Cantitate: <span className="text-ui font-semibold">{quantity}</span></p>
                  <p>Preț per unitate: <span className="text-ui font-semibold">{formatMoneyDisplay(unitPrice)} RON</span></p>
                  <p className="text-2xl font-extrabold text-ui">Total: {formatMoneyDisplay(serverPrice ?? totalPrice)} RON</p>
                  {addTextOption && textDesign.trim() !== "" && <div className="text-sm text-muted">Text pe comandă: "{textDesign.trim()}"</div>}
                  {/* show uploaded file info only in summary (thumb + label) */}
                  {artworkUrl && (
                    <div className="mt-2 flex items-center gap-3">
                      <img src={artworkUrl} alt="uploaded-thumb" className="h-12 w-12 object-cover rounded-md border" />
                      <div>
                        <div className="text-sm font-medium text-ui">Fișier încărcat</div>
                        <div className="text-xs text-muted">Fișierul va fi folosit la imprimare.</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="hidden lg:block mt-4">
                  <button onClick={calculateServer} disabled={calcLoading} className="btn-secondary mr-2">Calculează</button>
                  <button onClick={handleAddToCart} disabled={!canAdd} className="btn-primary w-full mt-3 py-2">
                    <ShoppingCart size={18} /><span className="ml-2">Adaugă</span>
                  </button>
                </div>
              </div>

              <div className="card-muted p-3 text-xs text-muted">Canvas Fine Art 330 g/mp, șasiu lemn, finisaje profesionale.</div>
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
              <p>- Trimite poza sau linkul paginii. Vom imprima imaginea primită. Textul introdus (dacă ai bifat opțiunea) nu este afișat pe previzualizare, dar este trimis în comandă.</p>
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => setDetailsOpen(false)} className="btn-primary py-2 px-4">Închide</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastVisible && (
        <div className="fixed left-1/2 bottom-6 z-50 -translate-x-1/2 rounded-md bg-green-600 px-4 py-2 text-sm text-white">
          Produs adăugat în coș
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