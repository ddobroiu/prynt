"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart, Info, X } from "lucide-react";
import MobilePriceBar from "./MobilePriceBar";
import DeliveryInfo from "@/components/DeliveryInfo";
import DeliveryEstimation from "./DeliveryEstimation";

/* GALLERY (adjust image paths if needed) */
const GALLERY = [
  "/products/plexiglass/1.webp",
  "/products/plexiglass/2.webp",
  "/products/plexiglass/3.webp",
  "/products/plexiglass/4.webp",
] as const;

/* HELPERS */
const roundMoney = (n: number) => Math.round(n * 100) / 100;
const formatMoneyDisplay = (n: number) => (n && n > 0 ? n.toFixed(2) : "0");
const formatAreaDisplay = (n: number) => (n && n > 0 ? String(n) : "0");

/* TYPES */
type MaterialType = "alb" | "transparent";
type PriceInput = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: MaterialType;
  thickness_mm: number;
  printDouble?: boolean;
  designOption?: "upload" | "pro";
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

/* PRICE MAPS (RON / m²) */
const PLEXI_ALB_PRICE: Record<number, number> = {
  2: 200,
  3: 250,
  4: 300,
  5: 350,
};

const PLEXI_TRANSPARENT_SINGLE: Record<number, number> = {
  2: 280,
  3: 350,
  4: 410,
  5: 470,
  6: 700,
  8: 1100,
  10: 1450,
};

const PLEXI_TRANSPARENT_DOUBLE: Record<number, number> = {
  2: 380,
  3: 450,
  4: 510,
  5: 570,
  6: 800,
  8: 1200,
  10: 1650,
};

/* AVAILABLE THICKNESSES (explicit per cerere) */
const AVAILABLE_THICKNESS_ALB = [2, 3, 4, 5];
const AVAILABLE_THICKNESS_TRANSPARENT = [2, 3, 4, 5, 6, 8, 10];

/* LOCAL CALC */
const localCalculatePrice = (input: PriceInput): LocalPriceOutput => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
    return { sqm_per_unit: 0, total_sqm: 0, pricePerSqm: 0, finalPrice: 0 };
  }

  const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
  const total_sqm = roundMoney(sqm_per_unit * input.quantity);

  let pricePerSqm = 0;

  if (input.material === "alb") {
    pricePerSqm = PLEXI_ALB_PRICE[input.thickness_mm] ?? 0;
  } else if (input.material === "transparent") {
    pricePerSqm = input.printDouble
      ? PLEXI_TRANSPARENT_DOUBLE[input.thickness_mm] ?? 0
      : PLEXI_TRANSPARENT_SINGLE[input.thickness_mm] ?? 0;
  }

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

export default function ConfiguratorPlexiglass({ productSlug, initialWidth: initW, initialHeight: initH }: Props) {
  const { addItem } = useCart();

  const [input, setInput] = useState<PriceInput>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    material: "alb",
    thickness_mm: 2,
    printDouble: false,
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
  const [thicknessOpen, setThicknessOpen] = useState(false);
  const materialRef = useRef<HTMLDivElement | null>(null);
  const thicknessRef = useRef<HTMLDivElement | null>(null);

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
      if (thicknessRef.current && !thicknessRef.current.contains(e.target as Node)) setThicknessOpen(false);
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

  const availableThickness = useMemo(() => {
    return input.material === "alb" ? AVAILABLE_THICKNESS_ALB : AVAILABLE_THICKNESS_TRANSPARENT;
  }, [input.material]);

  useEffect(() => {
    if (!availableThickness.includes(input.thickness_mm)) {
      setInput((s) => ({ ...s, thickness_mm: availableThickness[0] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.material]);

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
      "plexiglass",
      input.material,
      input.thickness_mm,
      input.printDouble ? "duplex" : "simple",
      input.width_cm,
      input.height_cm,
      input.designOption ?? "upload",
    ].join("-");

    const title = `Plexiglass ${input.material === "alb" ? "alb" : "transparent"} ${input.thickness_mm}mm ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "plexiglass-generic",
      slug: productSlug ?? "plexiglass",
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
        thickness_mm: input.thickness_mm,
        printDouble: input.printDouble,
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
            <h1 className="text-3xl md:text-4xl font-extrabold">Configurator Plexiglass</h1>
            <p className="mt-2 text-muted">Alege tipul, grosimea, dimensiunile și încarcă grafică. Opțiunea "Pro" se stabilește după comandă.</p>
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
              <div className="mt-2 text-xs text-muted">Preseturi: {PRESETS.map(p => `${p.w}x${p.h} cm`).join(" • ")}</div>
            </div>

            {/* 2. Material & thickness */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-4" ref={materialRef}>
                <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><Layers /></div><h2 className="text-lg font-bold text-ui">2. Material</h2></div>

                <div className="relative">
                  <button type="button" onClick={() => setMaterialOpen((s) => !s)} className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5" aria-expanded={materialOpen}>
                    <div className="text-sm text-muted">{input.material === "alb" ? "Plexiglass alb" : "Plexiglass transparent"}</div>
                    <div className="text-xs text-muted">{materialOpen ? "Închide" : "Schimbă"}</div>
                  </button>

                  {materialOpen && (
                    <div className="mt-2 p-2 bg-black/60 rounded-md border border-white/10 space-y-2">
                      <button onClick={() => { updateInput("material", "alb"); updateInput("printDouble", false); setMaterialOpen(false); }} className="w-full text-left p-2 rounded-md hover:bg-white/5">Plexiglass alb</button>
                      <button onClick={() => { updateInput("material", "transparent"); setMaterialOpen(false); }} className="w-full text-left p-2 rounded-md hover:bg-white/5">Plexiglass transparent</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="card p-4" ref={thicknessRef}>
                <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><CheckCircle /></div><h2 className="text-lg font-bold text-ui">3. Grosime & print</h2></div>

                <div className="space-y-2">
                  <div className="text-xs text-muted">Grosime (mm)</div>
                  <div className="grid grid-cols-2 gap-2">
                    {availableThickness.map((t) => (
                      <button key={t} onClick={() => updateInput("thickness_mm", t)} className={`p-2 text-left rounded-md ${input.thickness_mm === t ? "border border-indigo-500 bg-indigo-900/10" : "border border-white/10 hover:bg-white/5"}`}>
                        {t} mm
                      </button>
                    ))}
                  </div>

                  {input.material === "transparent" && (
                    <div className="mt-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" checked={!!input.printDouble} onChange={(e) => updateInput("printDouble", e.target.checked)} className="checkbox" />
                        <span className="text-sm">Print față-verso (dacă doriți)</span>
                      </label>
                    </div>
                  )}

                  <div className="mt-2 text-xs text-muted">Notă: prețurile sunt calculate automat în funcție de grosime și opțiunea față/verso.</div>
                </div>
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
                    <div className="text-xs text-muted mt-1">sau</div>
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
                  <div className="text-sm text-muted">Serviciu grafic profesional — prețul se stabilește după comandă și comunicare cu clientul.</div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - summary */}
          <aside id="order-summary" className="order-1 lg:order-2 lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              <div className="card p-4">
                <div className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img src={activeImage} alt="Plexiglass preview" className="h-full w-full object-cover" loading="eager" />
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
                  <div className="my-2">
                    <DeliveryEstimation />
                  </div>
                  <p className="text-xs text-muted">Preț / m²: <strong>{priceDetailsLocal.pricePerSqm > 0 ? `${priceDetailsLocal.pricePerSqm} RON` : "—"}</strong></p>
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
            <h3 className="text-xl font-bold text-white mb-3">Detalii Plexiglass</h3>
            <div className="text-sm text-white/70 space-y-3">
              <p>
                Plexiglassul alb și plexiglassul transparent sunt materiale durabile, ușor de prelucrat și folosite frecvent pentru panouri, display-uri și aplicații de protecție. Grosimea și tipul (alb/transparent) influențează rezistența și aspectul.
              </p>
              <p>
                Opțiunea de print față-verso este disponibilă pentru plexiglass transparent; pentru plexiglass alb se recomandă print față (verifică cu echipa tehnică pentru lucrări față-verso).
              </p>
              <p>
                Pentru grafică: încărcați fișierul sau alegeți serviciul grafic profesional (Pro). Pentru Pro nu afișăm un tarif în configurator — prețul se stabilește după evaluarea cerințelor și comunicare.
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