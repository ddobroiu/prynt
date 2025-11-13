"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart, Info, X } from "lucide-react";
import MobilePriceBar from "./MobilePriceBar";
import DeliveryInfo from "@/components/DeliveryInfo";

/* GALLERY (example images - adjust paths) */
const GALLERY = [
  "/products/carton/1.webp",
  "/products/carton/2.webp",
  "/products/carton/3.webp",
  "/products/carton/4.webp",
] as const;

/* HELPERS */
const roundMoney = (n: number) => Math.round(n * 100) / 100;
const formatMoneyDisplay = (n: number) => (n && n > 0 ? n.toFixed(2) : "0");
const formatAreaDisplay = (n: number) => (n && n > 0 ? String(n) : "0");

/* TYPES */
type MaterialType = "ondulat" | "reciclat";
type OndulaOption = "E" | "3B" | "3C" | "5BC";
type ReciclatOption = "board16" | "board10";
type DesignOption = "upload" | "pro";

type PriceInput = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: MaterialType;
  ondula?: OndulaOption;
  printDouble?: boolean;
  reciclatBoard?: ReciclatOption;
  // accessories
  edgePerimeter_m?: number; // metri de cant
  edgeType?: ReciclatOption | null; // which band price to use
  // graphics
  designOption?: DesignOption;
  artworkUrl?: string | null;
  artworkLink?: string;
};

type LocalPriceOutput = {
  sqm_per_unit: number;
  total_sqm: number;
  pricePerSqm: number;
  finalPrice: number;
  accessoryCost: number;
};

/* PRESETS / LIMITS */
const PRESETS = [
  { w: 300, h: 150 },
  { w: 400, h: 150 },
  { w: 300, h: 200 },
];

const MAX_WIDTH_CM = 400;
const MAX_HEIGHT_CM = 200;

/*
  PRICE MAP (RON / m²)
  - ondulat single-side and double-side explicit maps (values supplied)
  - reciclat boards prices supplied
*/
const ONDULAT_PRICE_SINGLE: Record<OndulaOption, number> = {
  E: 80,   // Micro Ondula E - 1 mm
  "3B": 85, // Tip 3 Ondula B - 2 mm
  "3C": 90, // Tip 3 Ondula C - 3 mm
  "5BC": 100, // Tip 5 Ondula B+C - 5 mm
};

const ONDULAT_PRICE_DOUBLE: Record<OndulaOption, number> = {
  E: 120,
  "3B": 130,
  "3C": 135,
  "5BC": 150,
};

const RECICLAT_PRICE: Record<ReciclatOption, number> = {
  board10: 200, // Eco Board 10 mm
  board16: 250, // Board 16 mm
};

/* ACCESSORIES - cant (RON / ml) */
const EDGE_PRICE_PER_ML: Record<ReciclatOption, number> = {
  board10: 15,
  board16: 17,
};

/* LOCAL CALC */
const localCalculatePrice = (input: PriceInput): LocalPriceOutput => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
    return { sqm_per_unit: 0, total_sqm: 0, pricePerSqm: 0, finalPrice: 0, accessoryCost: 0 };
  }

  const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
  const total_sqm = roundMoney(sqm_per_unit * input.quantity);

  let pricePerSqm = 0;
  if (input.material === "ondulat" && input.ondula) {
    pricePerSqm = input.printDouble ? ONDULAT_PRICE_DOUBLE[input.ondula] : ONDULAT_PRICE_SINGLE[input.ondula];
  } else if (input.material === "reciclat" && input.reciclatBoard) {
    pricePerSqm = RECICLAT_PRICE[input.reciclatBoard];
  }

  const baseFinal = roundMoney(total_sqm * pricePerSqm);

  // accessories (edge band) cost - perimetru in metri * price per ml
  const accessoryCost = (() => {
    const m = input.edgePerimeter_m ?? 0;
    const t = input.edgeType ?? null;
    if (m > 0 && t && (t === "board10" || t === "board16")) {
      return roundMoney(m * EDGE_PRICE_PER_ML[t]);
    }
    return 0;
  })();

  const finalPrice = roundMoney(baseFinal + accessoryCost);

  return {
    sqm_per_unit: roundMoney(sqm_per_unit),
    total_sqm,
    pricePerSqm: roundMoney(pricePerSqm),
    finalPrice,
    accessoryCost,
  };
};

/* Props */
type Props = {
  productSlug?: string;
  initialWidth?: number;
  initialHeight?: number;
};

export default function ConfiguratorCarton({ productSlug, initialWidth: initW, initialHeight: initH }: Props) {
  const { addItem } = useCart();

  const [input, setInput] = useState<PriceInput>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    material: "ondulat",
    ondula: "E",
    printDouble: false,
    reciclatBoard: "board16",
    edgePerimeter_m: 0,
    edgeType: "board16",
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
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [materialOpen, setMaterialOpen] = useState(false);
  const [variantOpen, setVariantOpen] = useState(false);
  const materialRef = useRef<HTMLDivElement | null>(null);
  const variantRef = useRef<HTMLDivElement | null>(null);

  /* Artwork upload state */
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
      if (variantRef.current && !variantRef.current.contains(e.target as Node)) setVariantOpen(false);
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
    }, 3500);
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
      // endpoint placeholder - adapt to actual upload route on your backend
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload eșuat");
      const data = await res.json();
      updateInput("artworkUrl", data.url);
      setUploading(false);
    } catch (e: any) {
      // fallback to local preview
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
      // Placeholder for server calculation. For now use local calc.
      const result = localCalculatePrice(input);
      setServerPrice(result.finalPrice);
    } catch (err) {
      console.error("calc error", err);
      setErrorToast("Eroare la calcul preț");
      setTimeout(() => setErrorToast(null), 1600);
    } finally {
      setCalcLoading(false);
    }
  }

  function handleAddToCart() {
    if (!input.width_cm || !input.height_cm) {
      setErrorToast("Te rugăm să completezi lățimea și înălțimea (cm) înainte de a adăuga în coș.");
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }
    if (input.width_cm > MAX_WIDTH_CM || input.height_cm > MAX_HEIGHT_CM) {
      setErrorToast(`Dimensiunile maxime sunt ${MAX_WIDTH_CM} x ${MAX_HEIGHT_CM} cm.`);
      setTimeout(() => setErrorToast(null), 2000);
      return;
    }

    const totalForOrder = serverPrice ?? priceDetailsLocal.finalPrice;
    if (!totalForOrder || totalForOrder <= 0) {
      setErrorToast("Calculează prețul înainte de a adăuga în coș.");
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }

    const unitPrice = roundMoney(totalForOrder / input.quantity);

    const uniqueId = [
      "carton",
      input.material,
      input.material === "ondulat" ? input.ondula : input.reciclatBoard,
      input.printDouble ? "dublu" : "fata",
      input.width_cm,
      input.height_cm,
      input.designOption ?? "upload",
    ].join("-");

    const title =
      input.material === "ondulat"
        ? `Carton ondulat ${input.ondula} ${input.width_cm}x${input.height_cm} cm`
        : `Carton reciclat ${input.reciclatBoard} ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "carton-generic",
      slug: productSlug ?? "carton",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        totalSqm: priceDetailsLocal.total_sqm,
        pricePerSqm: priceDetailsLocal.pricePerSqm,
        material: input.material,
        ondula: input.ondula,
        reciclatBoard: input.reciclatBoard,
        printDouble: input.printDouble,
        accessoryCost: priceDetailsLocal.accessoryCost,
        edgePerimeter_m: input.edgePerimeter_m ?? 0,
        edgeType: input.edgeType ?? null,
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
      {errorToast && (
        <div className={`toast-success opacity-100 translate-y-0`} aria-live="assertive">{errorToast}</div>
      )}

      <div className="page py-10 pb-24 lg:pb-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Configurator Carton</h1>
            <p className="mt-2 text-muted">Alege tipul de carton, dimensiuni, print și încarcă grafică. Opțiunea "Pro" pentru grafică se stabilește după comandă.</p>
          </div>
          <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline text-sm self-start">
            <Info size={18} />
            <span className="ml-2">Detalii</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="order-2 lg:order-1 lg:col-span-3 space-y-6">
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

            {/* 2. Material */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-4" ref={materialRef}>
                <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><Layers /></div><h2 className="text-lg font-bold text-ui">2. Tip material</h2></div>

                <div className="relative">
                  <button type="button" onClick={() => setMaterialOpen((s) => !s)} className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5" aria-expanded={materialOpen}>
                    <div className="text-sm text-white/80">{input.material === "ondulat" ? "Carton ondulat" : "Carton reciclat"}</div>
                    <div className="text-xs text-white/60">{materialOpen ? "Închide" : "Schimbă"}</div>
                  </button>

                  {materialOpen && (
                    <div className="mt-2 p-2 bg-black/60 rounded-md border border-white/10 space-y-2">
                      <button onClick={() => { setInput({ ...input, material: "ondulat", ondula: "E", reciclatBoard: undefined, edgeType: null }); setMaterialOpen(false); }} className="w-full text-left p-2 rounded-md hover:bg-white/5">Carton ondulat</button>
                      <button onClick={() => { setInput({ ...input, material: "reciclat", reciclatBoard: "board16", ondula: undefined, edgeType: "board16" }); setMaterialOpen(false); }} className="w-full text-left p-2 rounded-md hover:bg-white/5">Carton reciclat</button>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Variant (thickness / board type / print) */}
              <div className="card p-4" ref={variantRef}>
                <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><CheckCircle /></div><h2 className="text-lg font-bold text-ui">3. Variantă & print</h2></div>

                {input.material === "ondulat" ? (
                  <div className="space-y-2">
                    <div className="text-xs text-white/60">Grosime material (mm)</div>
                    <div className="grid grid-cols-1 gap-2">
                      <button className={`p-2 text-left rounded-md ${input.ondula === "E" ? "border border-indigo-500 bg-indigo-900/10" : "border border-white/10 hover:bg-white/5"}`} onClick={() => updateInput("ondula", "E")}>Micro Ondula E - 1 mm</button>
                      <button className={`p-2 text-left rounded-md ${input.ondula === "3B" ? "border border-indigo-500 bg-indigo-900/10" : "border border-white/10 hover:bg-white/5"}`} onClick={() => updateInput("ondula", "3B")}>Tip 3 Ondula B - 2 mm</button>
                      <button className={`p-2 text-left rounded-md ${input.ondula === "3C" ? "border border-indigo-500 bg-indigo-900/10" : "border border-white/10 hover:bg-white/5"}`} onClick={() => updateInput("ondula", "3C")}>Tip 3 Ondula C - 3 mm</button>
                      <button className={`p-2 text-left rounded-md ${input.ondula === "5BC" ? "border border-indigo-500 bg-indigo-900/10" : "border border-white/10 hover:bg-white/5"}`} onClick={() => updateInput("ondula", "5BC")}>Tip 5 Ondula B+C - 5 mm</button>
                    </div>

                    <div className="mt-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" checked={!!input.printDouble} onChange={(e) => updateInput("printDouble", e.target.checked)} className="checkbox" />
                        <span className="text-sm">Print față-verso (preț separat)</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xs text-white/60">Tip Board (dimensiuni/gramaj)</div>
                    <div className="grid grid-cols-1 gap-2">
                      <button className={`p-2 text-left rounded-md ${input.reciclatBoard === "board16" ? "border border-indigo-500 bg-indigo-900/10" : "border border-white/10 hover:bg-white/5"}`} onClick={() => updateInput("reciclatBoard", "board16")}>
                        Board 16 mm — Gramaj (g/mp): 450
                      </button>
                      <button className={`p-2 text-left rounded-md ${input.reciclatBoard === "board10" ? "border border-indigo-500 bg-indigo-900/10" : "border border-white/10 hover:bg-white/5"}`} onClick={() => updateInput("reciclatBoard", "board10")}>
                        Eco Board 10 mm — Gramaj (g/mp): 1050
                      </button>
                    </div>

                    <div className="mt-3 text-xs text-white/60">Accesorii: protejare margini (cant) — selectează tip bandă și introdu lungimea perimetrală (ml) pentru calcul.</div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <label className="text-xs">
                        Tip bandă:
                        <select value={input.edgeType ?? ""} onChange={(e) => updateInput("edgeType", (e.target.value as ReciclatOption) || null)} className="input mt-1">
                          <option value="board16">Bandă pentru Board 16 mm</option>
                          <option value="board10">Bandă pentru Eco Board 10 mm</option>
                        </select>
                      </label>
                      <label className="text-xs">
                        Lungime cant (ml)
                        <input type="number" min={0} value={input.edgePerimeter_m ?? 0} onChange={(e) => updateInput("edgePerimeter_m", Math.max(0, parseFloat(e.target.value || "0")))} className="input mt-1" />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Grafică */}
            <div className="card p-4">
              <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><Info /></div><h2 className="text-lg font-bold text-ui">4. Grafică</h2></div>

              <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button onClick={() => updateInput("designOption", "upload")} className={`p-3 rounded-lg border ${input.designOption === "upload" ? "border-indigo-500 bg-indigo-900/10" : "border-white/10 hover:bg-white/5"}`}>Încarcă grafică</button>
                  <button onClick={() => updateInput("designOption", "pro")} className={`p-3 rounded-lg border ${input.designOption === "pro" ? "border-indigo-500 bg-indigo-900/10" : "border-white/10 hover:bg-white/5"}`}>Pro (preț stabilit după comandă)</button>
                </div>
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
                  <div className="text-sm text-white/80">Serviciu grafic profesional — prețul se stabilește după comandă. Vom discuta cerințele și livrăm oferta.</div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - summary */}
          <aside id="order-summary" className="order-1 lg:order-2 lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              <div className="card p-4">
                <div className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img src={activeImage} alt="Carton preview" className="h-full w-full object-cover" loading="eager" />
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
                  <p className="flex items-center gap-2 flex-wrap">
                    <span>Total:</span>
                    <span className="text-2xl font-extrabold text-ui">{formatMoneyDisplay(totalShown)} RON</span>
                    <span className="text-xs text-white whitespace-nowrap">• Livrare de la 19,99 RON</span>
                  </p>
                  <p className="text-xs text-muted">Preț / m²: <strong>{priceDetailsLocal.pricePerSqm > 0 ? `${priceDetailsLocal.pricePerSqm} RON` : "—"}</strong></p>
                  {priceDetailsLocal.accessoryCost > 0 && <p className="text-xs text-muted">Cost accesorii (cant): <strong>{priceDetailsLocal.accessoryCost} RON</strong></p>}
                  <p className="text-xs text-muted">Grafică: <strong>{input.designOption === "pro" ? "Pro (preț la comandă)" : input.artworkUrl ? "Fișier încărcat" : input.artworkLink ? "Link salvat" : "Nedefinit"}</strong></p>
                </div>

                <div className="mt-3">
                  <DeliveryInfo className="hidden lg:block" variant="minimal" icon="📦" showCod={false} showShippingFrom={false} />
                </div>

                <div className="hidden lg:block mt-4">
                  <button onClick={handleAddToCart} disabled={!canAdd} className="btn-primary w-full py-2">
                    <ShoppingCart size={18} /><span className="ml-2">Adaugă</span>
                  </button>
                </div>
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
            <h3 className="text-xl font-bold text-white mb-3">Detalii Carton</h3>
            <div className="text-sm text-white/70 space-y-3">
              <div>
                <strong>Carton ondulat</strong>
                <p>Grosimi disponibile:</p>
                <ul className="list-disc ml-5">
                  <li>Micro Ondula E - 1 mm</li>
                  <li>Tip 3 Ondula B - 2 mm</li>
                  <li>Tip 3 Ondula C - 3 mm</li>
                  <li>Tip 5 Ondula B+C - 5 mm</li>
                </ul>
                <p>Opțiuni de print: Print față (implicit) sau print față-verso (preț separat, calculat automat în configurator când selectați față-verso).</p>
              </div>

              <div>
                <strong>Carton reciclat</strong>
                <p>Tipuri (exemplu):</p>
                <ul className="list-disc ml-5">
                  <li>Eco Board 10 mm — Gramaj (g/mp): 1050</li>
                  <li>Board 16 mm — Gramaj (g/mp): 450</li>
                </ul>
                <p>
                  Noile plăci din carton reciclat, cu feţe albe şi miez tip "fagure", pot fi prelucrate cu uşurinţă pe router. Protejarea marginilor se face cu o bandă adezivă specială, flexibilă, de culoare albă. Suprafaţa albă şi netedă este ideală pentru serigrafie şi tiparire digitală.
                </p>
              </div>

              <div>
                <strong>Accesorii</strong>
                <ul className="list-disc ml-5">
                  <li>Cant Eco Board 10 mm — {EDGE_PRICE_PER_ML.board10} RON / ml</li>
                  <li>Cant Board 16 mm — {EDGE_PRICE_PER_ML.board16} RON / ml</li>
                </ul>
                <p>Introduceţi lungimea perimetrală (ml) pentru a calcula costul cantului; costul este adăugat la totalul comenzii.</p>
              </div>

              <div>
                <strong>Grafică (upload / Pro)</strong>
                <p>Încărcaţi fişierul grafic sau trimiteţi link. Dacă doriţi serviciu grafic profesional ("Pro"), preţul nu este afișat în configurator — va fi stabilit după evaluarea comenzii și comunicat separat.</p>
              </div>
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