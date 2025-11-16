"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Plus, Minus, ShoppingCart, Info, X, ChevronDown, UploadCloud } from "lucide-react";
import MobilePriceBar from "./MobilePriceBar";
import DeliveryInfo from "@/components/DeliveryInfo";
import DeliveryEstimation from "./DeliveryEstimation";

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
type DesignOption = "upload" | "text_only" | "pro";

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

  /* Artwork upload state */
  const [activeStep, setActiveStep] = useState(1);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [textDesign, setTextDesign] = useState<string>("");

  const [serverData, setServerData] = useState<any>(null);

  useEffect(() => {
    if (usePreset) {
      const p = PRESETS[presetIndex];
      setLengthText(String(p.w));
      setHeightText(String(p.h));
      setInput((s) => ({ ...s, width_cm: p.w, height_cm: p.h }));
    }
  }, [usePreset, presetIndex]);

  useEffect(() => {
    calculateServer();
  }, [input]);

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
    setServerData(null);
    try {
      const materialId = input.material === "ondulat" 
        ? `ondulat_${input.ondula}` 
        : `reciclat_${input.reciclatBoard}`;

      const res = await fetch("/api/calc-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          widthCm: input.width_cm,
          heightCm: input.height_cm,
          quantity: input.quantity,
          materialId,
          designOption: input.designOption,
          printDouble: input.printDouble,
          edgePerimeter_m: input.edgePerimeter_m,
          edgeType: input.edgeType,
        }),
      });

      if (!res.ok) throw new Error("Eroare la calcul preț");

      const data = await res.json();
      if (data.ok) {
        setServerPrice(data.price);
        setServerData(data);
      } else {
        throw new Error(data.message || "Eroare necunoscută");
      }
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
        totalSqm: serverData?.totalSqm ?? priceDetailsLocal.total_sqm,
        pricePerSqm: serverData?.pricePerSqm ?? priceDetailsLocal.pricePerSqm,
        material: input.material,
        ondula: input.ondula,
        reciclatBoard: input.reciclatBoard,
        printDouble: input.printDouble,
        accessoryCost: serverData?.accessoryCost ?? priceDetailsLocal.accessoryCost,
        edgePerimeter_m: input.edgePerimeter_m ?? 0,
        edgeType: input.edgeType ?? null,
        designOption: input.designOption ?? "upload",
        artworkUrl: input.artworkUrl ?? null,
        artworkLink: input.artworkLink ?? "",
        ...(input.designOption === 'text_only' && { "Text": textDesign }),
      },
    });

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1400);
  }

  const totalShown = displayedTotal;
  const canAdd = totalShown > 0 && input.width_cm > 0 && input.height_cm > 0 && input.width_cm <= MAX_WIDTH_CM && input.height_cm <= MAX_HEIGHT_CM;

  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
  const summaryStep2 = input.material === "ondulat" ? "Carton ondulat" : "Carton reciclat";
  const summaryStep3 = input.material === "ondulat" ? `${input.ondula}, ${input.printDouble ? "față-verso" : "față"}` : `${input.reciclatBoard}, ${input.edgePerimeter_m ? `cant ${input.edgePerimeter_m}ml` : "fără cant"}`;
  const summaryStep4 = input.designOption === "upload" ? "Grafică proprie" : input.designOption === "text_only" ? "Doar text" : "Design Pro";

  return (
    <main className="bg-gray-50 min-h-screen">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">
        Produs adăugat în coș
      </div>
      {errorToast && (
        <div className={`toast-success opacity-100 translate-y-0`} aria-live="assertive">{errorToast}</div>
      )}

      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Carton preview" className="h-full w-full object-cover" loading="eager" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => (
                  <button key={src} onClick={() => { setActiveImage(src); setActiveIndex(i); }} className={`relative overflow-hidden rounded-lg border transition aspect-square ${activeIndex === i ? "border-indigo-500 ring-2 ring-indigo-500/40" : "border-gray-300 hover:border-gray-400"}`} aria-label="Previzualizare">
                    <img src={src} alt="Thumb" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              {/* Placeholder for tabs or additional content */}
            </div>
          </div>
          <div>
            <header className="mb-6">
              <h1 className="text-3xl font-extrabold text-gray-900">Configurator Carton</h1>
              <p className="mt-2 text-gray-600">Alege tipul de carton, dimensiuni, print și încarcă grafică. Opțiunea "Pro" pentru grafică se stabilește după comandă.</p>
              <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5 mt-3">
                <Info size={16} />
                <span className="ml-2">Detalii</span>
              </button>
            </header>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiuni & cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="field-label">Lățime (cm)</label>
                    <input type="text" inputMode="numeric" pattern="[0-9]*" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="ex: 300" className="input" />
                  </div>
                  <div>
                    <label className="field-label">Înălțime (cm)</label>
                    <input type="text" inputMode="numeric" pattern="[0-9]*" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="ex: 150" className="input" />
                  </div>
                  <div>
                    <label className="field-label">Cantitate</label>
                    <div className="flex items-center">
                      <button onClick={() => updateInput("quantity", Math.max(1, input.quantity - 1))} className="p-2 bg-gray-100 rounded-l-md hover:bg-gray-200"><Minus size={14} /></button>
                      <input type="number" value={input.quantity} onChange={(e) => updateInput("quantity", Math.max(1, parseInt(e.target.value || "1")))} className="input text-lg font-semibold text-center" />
                      <button onClick={() => updateInput("quantity", input.quantity + 1)} className="p-2 bg-gray-100 rounded-r-md hover:bg-gray-200"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">Preseturi: {PRESETS.map(p => `${p.w}x${p.h} cm`).join(" • ")}</div>
              </AccordionStep>
              <AccordionStep stepNumber={2} title="Tip material" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="grid grid-cols-2 gap-2">
                  <OptionButton active={input.material === "ondulat"} onClick={() => setInput({ ...input, material: "ondulat", ondula: "E", reciclatBoard: undefined, edgeType: null })} title="Carton ondulat" />
                  <OptionButton active={input.material === "reciclat"} onClick={() => setInput({ ...input, material: "reciclat", reciclatBoard: "board16", ondula: undefined, edgeType: "board16" })} title="Carton reciclat" />
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={3} title="Variantă & print" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)}>
                {input.material === "ondulat" ? (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">Grosime material (mm)</div>
                    <div className="grid grid-cols-1 gap-2">
                      <OptionButton active={input.ondula === "E"} onClick={() => updateInput("ondula", "E")} title="Micro Ondula E - 1 mm" />
                      <OptionButton active={input.ondula === "3B"} onClick={() => updateInput("ondula", "3B")} title="Tip 3 Ondula B - 2 mm" />
                      <OptionButton active={input.ondula === "3C"} onClick={() => updateInput("ondula", "3C")} title="Tip 3 Ondula C - 3 mm" />
                      <OptionButton active={input.ondula === "5BC"} onClick={() => updateInput("ondula", "5BC")} title="Tip 5 Ondula B+C - 5 mm" />
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
                    <div className="text-xs text-gray-500">Tip Board (dimensiuni/gramaj)</div>
                    <div className="grid grid-cols-1 gap-2">
                      <OptionButton active={input.reciclatBoard === "board16"} onClick={() => updateInput("reciclatBoard", "board16")} title="Board 16 mm — Gramaj (g/mp): 450" />
                      <OptionButton active={input.reciclatBoard === "board10"} onClick={() => updateInput("reciclatBoard", "board10")} title="Eco Board 10 mm — Gramaj (g/mp): 1050" />
                    </div>

                    <div className="mt-3 text-xs text-gray-500">Accesorii: protejare margini (cant) — selectează tip bandă și introdu lungimea perimetrală (ml) pentru calcul.</div>

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
              </AccordionStep>
              <AccordionStep stepNumber={4} title="Grafică" summary={summaryStep4} isOpen={activeStep === 4} onClick={() => setActiveStep(4)} isLast={true}>
                <div>
                  <div className="mb-4 border-b border-gray-200">
                    <div className="flex -mb-px">
                      <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", "upload")}>Am Grafică</TabButton>
                      <TabButton active={input.designOption === 'text_only'} onClick={() => updateInput("designOption", "text_only")}>Doar Text</TabButton>
                      <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", "pro")}>Vreau Grafică</TabButton>
                    </div>
                  </div>

                  {input.designOption === 'upload' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Încarcă fișierul tău (PDF, JPG, TIFF, etc.).</p>
                      <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <span className="flex items-center space-x-2">
                          <UploadCloud className="w-6 h-6 text-gray-600" />
                          <span className="font-medium text-gray-600">Apasă pentru a încărca</span>
                        </span>
                        <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                      </label>
                      <div className="text-xs text-gray-500">sau</div>
                      <div>
                        <label className="field-label">Link descărcare (opțional)</label>
                        <input
                          type="url"
                          value={input.artworkLink ?? ""}
                          onChange={(e) => updateInput("artworkLink", e.target.value)}
                          placeholder="Ex: https://.../fisier.pdf"
                          className="input"
                        />
                        <div className="text-xs text-gray-500 mt-1">Încarcă fișier sau folosește link — alege doar una dintre opțiuni.</div>
                      </div>
                      {uploading && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                      {input.artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Fișier încărcat</p>}
                      {!input.artworkUrl && input.artworkLink && <p className="text-sm text-green-600 font-semibold">Link salvat</p>}
                    </div>
                  )}

                  {input.designOption === 'text_only' && (
                    <div className="space-y-3">
                      <label className="field-label">Introdu textul dorit</label>
                      <textarea className="input" rows={3} value={textDesign} onChange={e => setTextDesign(e.target.value)} placeholder="ex: PROMOTIE, REDUCERI, etc."></textarea>
                    </div>
                  )}

                  {input.designOption === 'pro' && (
                    <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
                      <p className="font-semibold">Serviciu de Grafică Profesională</p>
                      <p>O echipă de designeri va crea o propunere grafică pentru tine. Vei primi pe email o simulare pentru confirmare. Cost: <strong>{formatMoneyDisplay(50)}</strong>.</p>
                    </div>
                  )}
                </div>
              </AccordionStep>
            </div>

            <div className="sticky bottom-0 lg:static bg-white/80 lg:bg-white backdrop-blur-sm lg:backdrop-blur-none border-t-2 lg:border lg:rounded-2xl lg:shadow-lg border-gray-200 py-4 lg:p-6 lg:mt-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-3xl font-extrabold text-gray-900">{formatMoneyDisplay(totalShown)}</p>
                <button onClick={handleAddToCart} disabled={!canAdd} className="btn-primary w-1/2 py-3 text-base font-bold"><ShoppingCart size={20} /><span className="ml-2">Adaugă</span></button>
              </div>
              <DeliveryEstimation />
            </div>
          </div>
          <div className="lg:hidden col-span-1">
            {/* Placeholder for mobile tabs */}
          </div>
        </div>
      </div>

      <MobilePriceBar total={totalShown} disabled={!canAdd} onAddToCart={handleAddToCart} onShowSummary={() => document.getElementById("order-summary")?.scrollIntoView({ behavior: "smooth" })} />

      {/* Details modal */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDetailsOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-md border border-gray-200 p-6">
            <button className="absolute right-3 top-3 p-1" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={18} className="text-gray-600" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Detalii Carton</h3>
            <div className="text-sm text-gray-700 space-y-3">
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

const AccordionStep = ({ stepNumber, title, summary, isOpen, onClick, children, isLast = false }: { stepNumber: number; title: string; summary: string; isOpen: boolean; onClick: () => void; children: React.ReactNode; isLast?: boolean; }) => (
  <div className="relative pl-12">
    <div className="absolute top-5 left-0 flex flex-col items-center h-full">
      <span className={`flex items-center justify-center w-8 h-8 rounded-full text-md font-bold transition-colors ${isOpen ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{stepNumber}</span>
      {!isLast && <div className="w-px grow bg-gray-200 mt-2"></div>}
    </div>
    <div className="flex-1">
      <button type="button" className="w-full flex items-center justify-between py-5 text-left" onClick={onClick}>
        <div>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          {!isOpen && <p className="text-sm text-gray-500 truncate">{summary}</p>}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  </div>
);

const OptionButton = ({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) => (
  <button type="button" onClick={onClick} className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${active ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-white hover:border-gray-400"}`}>
    <div className="font-bold text-gray-800">{title}</div>
    {subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}
  </button>
);

const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>
);

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