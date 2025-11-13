"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart, Info, X } from "lucide-react";
import MobilePriceBar from "./MobilePriceBar";
import DeliveryInfo from "@/components/DeliveryInfo";

/* Default GALLERIES */
const GALLERY_PVC = [
  "/products/pvc-forex/1.webp",
  "/products/pvc-forex/2.webp",
  "/products/pvc-forex/3.webp",
  "/products/pvc-forex/4.webp",
] as const;
const GALLERY_ALU = [
  "/products/alucobond/1.webp",
  "/products/alucobond/2.webp",
  "/products/alucobond/3.webp",
] as const;
const GALLERY_PP = [
  "/products/polipropilena/1.webp",
  "/products/polipropilena/2.webp",
] as const;

/* HELPERS */
const roundMoney = (n: number) => Math.round(n * 100) / 100;
const formatMoneyDisplay = (n: number) => (n && n > 0 ? n.toFixed(2) : "0");
const formatAreaDisplay = (n: number) => (n && n > 0 ? String(n) : "0");

/* PRESETS / LIMITS */
const PRESETS = [
  { w: 100, h: 100 },
  { w: 120, h: 80 },
  { w: 200, h: 100 },
];

const DEFAULT_MAX_WIDTH_CM = 200;
const DEFAULT_MAX_HEIGHT_CM = 300;

/* PRICE MAPS (RON / m²) */
const PVC_FOREX_PRICE: Record<number, number> = {
  1: 120,
  2: 150,
  3: 180,
  4: 210,
  5: 240,
  6: 270,
  8: 300,
  10: 400,
};

const ALU_PRICE: Record<number, number> = {
  3: 350,
  4: 450,
};

const PP_PRICE: Record<number, number> = {
  3: 110,
  5: 120,
};

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

/* Props */
type Props = {
  productSlug?: string;
  initialWidth?: number;
  initialHeight?: number;
  productType?: "pvc-forex" | "alucobond" | "polipropilena" | string;
};

/* Utility: returns config based on productType */
function getProductConfig(productType?: string) {
  const type = String(productType || "pvc-forex").toLowerCase();
  if (type === "alucobond") {
    return {
      title: "Configurator Alucobond",
      gallery: GALLERY_ALU,
      priceMap: ALU_PRICE,
      availableThickness: Object.keys(ALU_PRICE).map((k) => Number(k)).sort((a, b) => a - b),
      maxWidth: 3000,
      maxHeight: 1500,
      defaultSlug: "alucobond",
    };
  }
  if (type === "polipropilena" || type === "pp" || type === "polipropilenă") {
    return {
      title: "Configurator Polipropilenă",
      gallery: GALLERY_PP,
      priceMap: PP_PRICE,
      availableThickness: Object.keys(PP_PRICE).map((k) => Number(k)).sort((a, b) => a - b),
      maxWidth: 2000,
      maxHeight: 1000,
      defaultSlug: "polipropilena",
    };
  }
  // default PVC-Forex
  return {
    title: "Configurator PVC Forex",
    gallery: GALLERY_PVC,
    priceMap: PVC_FOREX_PRICE,
    availableThickness: Object.keys(PVC_FOREX_PRICE).map((k) => Number(k)).sort((a, b) => a - b),
    maxWidth: DEFAULT_MAX_WIDTH_CM,
    maxHeight: DEFAULT_MAX_HEIGHT_CM,
    defaultSlug: "pvc-forex",
  };
}

/* Component */
export default function ConfiguratorPVCForex({
  productSlug,
  initialWidth: initW,
  initialHeight: initH,
  productType,
}: Props) {
  const { addItem } = useCart();

  // derive product-specific config
  const config = useMemo(() => getProductConfig(productType), [productType]);

  const GALLERY = config.gallery;

  const [input, setInput] = useState<PriceInput>(() => ({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    thickness_mm: config.availableThickness[0] ?? 1,
    designOption: "upload",
    artworkUrl: null,
    artworkLink: "",
  }));

  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");
  const [usePreset, setUsePreset] = useState(true);
  const [presetIndex, setPresetIndex] = useState(0);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0] ?? "");

  const [serverPrice, setServerPrice] = useState<number | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const materialRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (usePreset) {
      const p = PRESETS[presetIndex] ?? PRESETS[0];
      setLengthText(String(p.w));
      setHeightText(String(p.h));
      setInput((s) => ({ ...s, width_cm: p.w, height_cm: p.h }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [GALLERY]);

  // ensure thickness stays valid if productType changes
  useEffect(() => {
    if (!config.availableThickness.includes(input.thickness_mm)) {
      setInput((s) => ({ ...s, thickness_mm: config.availableThickness[0] ?? s.thickness_mm }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productType]);

  // local price calculation using product-specific price map
  const localCalculatePrice = (inp: PriceInput): LocalPriceOutput => {
    if (inp.width_cm <= 0 || inp.height_cm <= 0 || inp.quantity <= 0) {
      return { sqm_per_unit: 0, total_sqm: 0, pricePerSqm: 0, finalPrice: 0 };
    }
    const sqm_per_unit = (inp.width_cm / 100) * (inp.height_cm / 100);
    const total_sqm = roundMoney(sqm_per_unit * inp.quantity);
    const pricePerSqm = config.priceMap[inp.thickness_mm] ?? 0;
    const finalPrice = roundMoney(total_sqm * pricePerSqm);
    return {
      sqm_per_unit: roundMoney(sqm_per_unit),
      total_sqm,
      pricePerSqm: roundMoney(pricePerSqm),
      finalPrice,
    };
  };

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
      // In this example we do a local calc; replace with server API call if needed
      const result = localCalculatePrice(input);
      setServerPrice(result.finalPrice);
    } catch (err) {
      console.error(err);
      setErrorToast("Eroare la calcul preț");
      setTimeout(() => setErrorToast(null), 1600);
    } finally {
      setCalcLoading(false);
    }
  }

  function handleAddToCart() {
    const MAX_WIDTH_CM = config.maxWidth;
    const MAX_HEIGHT_CM = config.maxHeight;

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

    const priceDetailsLocal = localCalculatePrice(input);
    const totalForOrder = serverPrice ?? priceDetailsLocal.finalPrice;
    if (!totalForOrder || totalForOrder <= 0) {
      setErrorToast("Calculează prețul înainte de a adăuga în coș.");
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }

    const unitPrice = roundMoney(totalForOrder / input.quantity);

    const uniqueId = [
      productType ?? "material",
      productSlug ?? config.defaultSlug,
      input.thickness_mm,
      input.width_cm,
      input.height_cm,
      input.designOption ?? "upload",
    ].join("-");

    const title = `${(productType ?? config.defaultSlug).replace("-", " ")} ${input.thickness_mm}mm ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? config.defaultSlug,
      slug: productSlug ?? config.defaultSlug,
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
        designOption: input.designOption ?? "upload",
        artworkUrl: input.artworkUrl ?? null,
        artworkLink: input.artworkLink ?? "",
        productType: productType ?? config.defaultSlug,
      },
    });

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1400);
  }

  const priceDetailsLocal = useMemo(() => localCalculatePrice(input), [input, productType]);
  const displayedTotal = useMemo(() => serverPrice ?? priceDetailsLocal.finalPrice, [serverPrice, priceDetailsLocal]);

  const totalShown = displayedTotal;
  const canAdd =
    totalShown > 0 &&
    input.width_cm > 0 &&
    input.height_cm > 0 &&
    input.width_cm <= config.maxWidth &&
    input.height_cm <= config.maxHeight;

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
            <h1 className="text-3xl md:text-4xl font-extrabold">{config.title}</h1>
            <p className="mt-2 text-muted">
              {productType === "alucobond"
                ? "Panou compozit Alucobond — alege grosimea și dimensiunile."
                : productType === "polipropilena"
                ? "Placă din polipropilenă — alege dimensiunea și finisajele."
                : "Plăci rigide din spumă PVC — alege grosimea, dimensiunile și încarcă grafică. Opțiunea \"Pro\" se stabilește după comandă."}
            </p>
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
              <div className="flex items-center gap-3 mb-3">
                <div className="text-indigo-400">
                  <Ruler />
                </div>
                <h2 className="text-lg font-bold text-ui">1. Dimensiuni & cantitate</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="field-label">Lățime (cm)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={lengthText}
                    onChange={(e) => onChangeLength(e.target.value)}
                    placeholder="ex: 100"
                    className="input text-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="field-label">Înălțime (cm)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={heightText}
                    onChange={(e) => onChangeHeight(e.target.value)}
                    placeholder="ex: 100"
                    className="input text-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="field-label">Cantitate</label>
                  <div className="flex items-center">
                    <button onClick={() => updateInput("quantity", Math.max(1, input.quantity - 1))} className="p-2 bg-white/10 rounded-l-md hover:bg-white/15">
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      value={input.quantity}
                      onChange={(e) => updateInput("quantity", Math.max(1, parseInt(e.target.value || "1")))}
                      className="input text-lg font-semibold text-center"
                    />
                    <button onClick={() => updateInput("quantity", input.quantity + 1)} className="p-2 bg-white/10 rounded-r-md hover:bg-white/15">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted">Dimensiune maximă a plăcii: {config.maxWidth} x {config.maxHeight} cm. Preseturi rapide disponibile.</div>
            </div>

            {/* 2. Grosime */}
            <div className="card p-4" ref={materialRef}>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-indigo-400">
                  <Layers />
                </div>
                <h2 className="text-lg font-bold text-ui">2. Grosime material (mm)</h2>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {config.availableThickness.map((t) => (
                  <button
                    key={t}
                    onClick={() => updateInput("thickness_mm", t)}
                    className={`p-2 text-left rounded-md ${input.thickness_mm === t ? "border border-indigo-500 bg-indigo-900/10" : "border border-white/10 hover:bg-white/5"}`}
                  >
                    {t} mm
                  </button>
                ))}
              </div>
              <div className="mt-2 text-xs text-muted">Prețul se calculează automat pe baza grosimii și suprafeței.</div>
            </div>

            {/* 3. Grafică */}
            <div className="card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-indigo-400">
                  <Info />
                </div>
                <h2 className="text-lg font-bold text-ui">3. Grafică</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button onClick={() => updateInput("designOption", "upload")} className={`p-3 rounded-lg border ${input.designOption === "upload" ? "border-indigo-500 bg-indigo-900/10" : "border-white/10 hover:bg-white/5"}`}>
                  Încarcă grafică
                </button>
                <button onClick={() => updateInput("designOption", "pro")} className={`p-3 rounded-lg border ${input.designOption === "pro" ? "border-indigo-500 bg-indigo-900/10" : "border-white/10 hover:bg-white/5"}`}>
                  Pro (preț stabilit după comandă)
                </button>
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
                    <div className="text-xs text-muted mt-1">sau</div>
                  </div>

                  <div>
                    <label className="field-label">Link descărcare (opțional)</label>
                    <input type="url" value={input.artworkLink ?? ""} onChange={(e) => updateInput("artworkLink", e.target.value)} placeholder="Ex: https://.../fisier.pdf" className="input" />
                    <div className="text-xs text-muted mt-1">Încarcă fișier sau folosește link — alege doar una dintre opțiuni.</div>
                  </div>

                  <div className="text-xs text-muted">
                    {uploading && "Se încarcă…"}
                    {uploadError && "Eroare upload"}
                    {input.artworkUrl && "Fișier încărcat"}
                    {!input.artworkUrl && input.artworkLink && "Link salvat"}
                  </div>
                </div>
              )}

              {input.designOption === "pro" && (
                <div className="panel p-3 mt-3 border-t border-white/5">
                  <div className="text-sm text-muted">Serviciu grafic profesional — prețul se stabilește după comandă.</div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - summary */}
          <aside id="order-summary" className="order-1 lg:order-2 lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              <div className="card p-4">
                <div className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img src={activeImage} alt="preview" className="h-full w-full object-cover" loading="eager" />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {GALLERY.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => {
                        setActiveImage(src);
                        setActiveIndex(i);
                      }}
                      className={`relative overflow-hidden rounded-md border transition aspect-square ${activeIndex === i ? "border-indigo-500 ring-2 ring-indigo-500/40" : "border-white/10 hover:border-white/30"}`}
                      aria-label="Previzualizare"
                    >
                      <img src={src} alt="Thumb" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="card p-4">
                <h2 className="text-lg font-bold border-b border-white/10 pb-3 mb-3">Sumar</h2>
                <div className="space-y-2 text-muted text-sm">
                  <p>
                    Suprafață: <span className="text-ui font-semibold">{formatAreaDisplay(priceDetailsLocal.total_sqm)} m²</span>
                  </p>
                  <p className="flex items-center gap-2 flex-wrap">
                    <span>Total:</span>
                    <span className="text-2xl font-extrabold text-ui">{formatMoneyDisplay(totalShown)} RON</span>
                    <span className="text-xs text-white whitespace-nowrap">• Livrare de la 19,99 RON</span>
                  </p>
                  <p className="text-xs text-muted">
                    Preț / m²: <strong>{priceDetailsLocal.pricePerSqm > 0 ? `${priceDetailsLocal.pricePerSqm} RON` : "—"}</strong>
                  </p>
                  <p className="text-xs text-muted">
                    Grafică: <strong>{input.designOption === "pro" ? "Pro (preț la comandă)" : input.artworkUrl ? "Fișier încărcat" : input.artworkLink ? "Link salvat" : "Nedefinit"}</strong>
                  </p>
                </div>

                <div className="mt-3">
                  <DeliveryInfo className="hidden lg:block" variant="minimal" icon="📦" showCod={false} showShippingFrom={false} />
                </div>

                <div className="hidden lg:block mt-4">
                  <button onClick={handleAddToCart} disabled={!canAdd} className="btn-primary w-full py-2">
                    <ShoppingCart size={18} />
                    <span className="ml-2">Adaugă</span>
                  </button>
                </div>
              </div>

              
            </div>
          </aside>
        </div>
      </div>

      <MobilePriceBar
        total={totalShown}
        disabled={!canAdd}
        onAddToCart={handleAddToCart}
        onShowSummary={() => document.getElementById("order-summary")?.scrollIntoView({ behavior: "smooth" })}
      />

      {/* Details modal */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDetailsOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl bg-[#0b0b0b] rounded-md border border-white/10 p-6">
            <button className="absolute right-3 top-3 p-1" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={18} className="text-white/80" />
            </button>
            <h3 className="text-xl font-bold text-white mb-3">{config.title} - Detalii</h3>
            <div className="text-sm text-white/70 space-y-3">
              <p>{productType === "alucobond" ? "Panou compozit din aluminiu (Alucobond)." : productType === "polipropilena" ? "Placă din polipropilenă celulară." : "Plăci rigide din spumă PVC."}</p>
              <p>Aplicații uzuale: decorări, litere volumetrice, panouri publicitare, afișaje și display-uri.</p>
              <p>Serviciu grafic profesional (Pro) — prețul se stabilește după evaluarea comenzii.</p>
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => setDetailsOpen(false)} className="btn-primary py-2 px-4">
                Închide
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}