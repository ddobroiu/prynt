"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart, Info, X } from "lucide-react";
import MobilePriceBar from "./MobilePriceBar";
import { usePathname, useRouter } from "next/navigation";

/* GALLERY (exemplu pentru verso) */
const GALLERY = [
  "/products/banner/verso/1.jpg",
  "/products/banner/verso/2.jpg",
  "/products/banner/verso/3.jpg",
  "/products/banner/verso/4.jpg",
] as const;

/* HELPERS & TYPES */
type PriceInput = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  want_wind_holes: boolean;
  want_hem_and_grommets: boolean;
  sameGraphicFrontBack: boolean;
};
type LocalPriceOutput = {
  sqm_per_unit: number;
  total_sqm: number;
  pricePerSqmBand: number;
  pricePerSqmAfterSurcharges: number;
  finalPrice: number;
};

const roundMoney = (n: number) => Math.round(n * 100) / 100;
const formatMoneyDisplay = (n: number) => (n && n > 0 ? n.toFixed(2) : "0");
const formatAreaDisplay = (n: number) => (n && n > 0 ? String(n) : "0");

/* local price for Blockout 610 */
const localCalculatePrice = (input: PriceInput): LocalPriceOutput => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
    return { sqm_per_unit: 0, total_sqm: 0, pricePerSqmBand: 0, pricePerSqmAfterSurcharges: 0, finalPrice: 0 };
  }
  const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
  const total_sqm = sqm_per_unit * input.quantity;

  let pricePerSqmBand = 55;
  if (total_sqm < 1) pricePerSqmBand = 165;
  else if (total_sqm <= 5) pricePerSqmBand = 120;
  else if (total_sqm <= 20) pricePerSqmBand = 99;
  else if (total_sqm <= 50) pricePerSqmBand = 75;
  else pricePerSqmBand = 55;

  let multiplier = 1;
  if (input.want_wind_holes) multiplier *= 1.10;

  const pricePerSqmAfterSurcharges = roundMoney(pricePerSqmBand * multiplier);
  const final = roundMoney(total_sqm * pricePerSqmAfterSurcharges);

  return {
    sqm_per_unit: roundMoney(sqm_per_unit),
    total_sqm: roundMoney(total_sqm),
    pricePerSqmBand: roundMoney(pricePerSqmBand),
    pricePerSqmAfterSurcharges,
    finalPrice: final,
  };
};

/* GRAFICĂ / FEES */
const DIFFERENT_GRAPHICS_FEE = 100;
type DesignOption = "upload" | "text_only" | "pro";

type Props = {
  productSlug?: string;
  initialWidth?: number;
  initialHeight?: number;
};

/* Inline ModeSwitch - integrat */
function BannerModeSwitchInline() {
  const pathname = usePathname();
  const router = useRouter();

  const isDouble = pathname?.startsWith("/banner-verso");

  const goSingle = () => {
    if (isDouble) router.push("/banner");
  };
  const goDouble = () => {
    if (!isDouble) router.push("/banner-verso");
  };

  return (
    <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-1">
      <button
        type="button"
        onClick={goSingle}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
          !isDouble ? "bg-indigo-600 text-white" : "text-muted hover:bg-white/10"
        }`}
        aria-pressed={!isDouble}
      >
        O față
      </button>
      <button
        type="button"
        onClick={goDouble}
        className={`ml-1 px-3 py-1.5 rounded-md text-sm font-medium transition ${
          isDouble ? "bg-indigo-600 text-white" : "text-muted hover:bg-white/10"
        }`}
        aria-pressed={isDouble}
      >
        Față-verso
      </button>
    </div>
  );
}

export default function BannerVersoConfigurator({ productSlug, initialWidth: initW, initialHeight: initH }: Props) {
  const { addItem } = useCart();

  const [input, setInput] = useState<PriceInput>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    want_wind_holes: false,
    want_hem_and_grommets: true,
    sameGraphicFrontBack: true,
  });

  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);

  // design state for front/back
  const [designOption, setDesignOption] = useState<DesignOption>("upload");
  const [artworkUrlFront, setArtworkUrlFront] = useState<string | null>(null);
  const [artworkLinkFront, setArtworkLinkFront] = useState<string>("");
  const [artworkUrlBack, setArtworkUrlBack] = useState<string | null>(null);
  const [artworkLinkBack, setArtworkLinkBack] = useState<string>("");
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [uploadErrorFront, setUploadErrorFront] = useState<string | null>(null);
  const [uploadErrorBack, setUploadErrorBack] = useState<string | null>(null);
  const [textDesignFront, setTextDesignFront] = useState<string>("");
  const [textDesignBack, setTextDesignBack] = useState<string>("");

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // dropdowns
  const [materialOpen, setMaterialOpen] = useState<boolean>(false);
  const [graphicsOpen, setGraphicsOpen] = useState<boolean>(false);

  const priceDetailsLocal = useMemo(() => localCalculatePrice(input), [input]);

  // pro fee depends on sameGraphic flag
  const proFee = input.sameGraphicFrontBack ? 50 : 100;

  const displayedTotal = useMemo(() => {
    const base = priceDetailsLocal.finalPrice || 0;
    let total = base;
    if (input.sameGraphicFrontBack) {
      if (designOption === "pro") total = roundMoney(base + proFee);
    } else {
      total = roundMoney(base + DIFFERENT_GRAPHICS_FEE);
      if (designOption === "pro") total = roundMoney(base + proFee);
    }
    return total;
  }, [priceDetailsLocal, designOption, input.sameGraphicFrontBack, proFee]);

  const [serverPrice, setServerPrice] = useState<number | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);

  const updateInput = <K extends keyof PriceInput>(k: K, v: PriceInput[K]) => setInput((p) => ({ ...p, [k]: v }));
  const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));

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

  const handleArtworkFileInput = async (file: File | null, side: "front" | "back") => {
    if (!file) return;
    const setUploading = side === "front" ? setUploadingFront : setUploadingBack;
    const setUploadError = side === "front" ? setUploadErrorFront : setUploadErrorBack;
    const setArtworkUrl = side === "front" ? setArtworkUrlFront : setArtworkUrlBack;
    const setArtworkLink = side === "front" ? setArtworkLinkFront : setArtworkLinkBack;

    setArtworkUrl(null);
    setUploadError(null);
    setArtworkLink("");
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
      const result = localCalculatePrice(input);
      let total = result.finalPrice;
      if (input.sameGraphicFrontBack) {
        if (designOption === "pro") total = roundMoney(total + proFee);
      } else {
        total = roundMoney(total + DIFFERENT_GRAPHICS_FEE);
        if (designOption === "pro") total = roundMoney(result.finalPrice + proFee);
      }
      setServerPrice(total);
    } catch (err) {
      console.error("calc error", err);
      alert("Eroare la calcul preț");
    } finally {
      setCalcLoading(false);
    }
  }

  function handleAddToCart() {
    if (!input.width_cm || !input.height_cm) {
      alert("Completează lungimea și înălțimea (în cm) înainte de a adăuga în coș.");
      return;
    }

    const totalForOrder = serverPrice ?? displayedTotal;
    if (!totalForOrder || totalForOrder <= 0) {
      alert("Calculează prețul înainte de a adăuga în coș");
      return;
    }

    // validation for graphics:
    if (input.sameGraphicFrontBack) {
      const hasFront = artworkUrlFront || artworkLinkFront || textDesignFront;
      if (designOption !== "pro" && !hasFront) {
        alert("Încarcă sau adaugă link/text pentru grafică (față = spate) sau alege opțiunea Pro.");
        return;
      }
    } else {
      if (designOption !== "pro") {
        const hasFront = artworkUrlFront || artworkLinkFront || textDesignFront;
        const hasBack = artworkUrlBack || artworkLinkBack || textDesignBack;
        if (!hasFront || !hasBack) {
          alert("Când grafica nu este identică, completează grafică pentru față și pentru spate (upload/link/text) sau alege Pro.");
          return;
        }
      }
    }

    const unitPrice = roundMoney((serverPrice ?? displayedTotal) / input.quantity);

    const uniqueId = [
      "banner-verso",
      "blockout_610",
      input.width_cm,
      input.height_cm,
      input.want_wind_holes ? "g" : "f",
      input.want_hem_and_grommets ? "c" : "f",
      input.sameGraphicFrontBack ? "same" : "diff",
      designOption === "pro" ? `pro${proFee}` : "std",
    ].join("-");

    const title = `Banner verso personalizat - ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "banner-verso-generic",
      slug: productSlug ?? "generic-banner-verso",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        material: "Blockout 610 (pretensionat)",
        sameGraphicFrontBack: input.sameGraphicFrontBack,
        designOption,
        proFeeApplied: designOption === "pro" ? proFee : 0,
        differentGraphicsFee: !input.sameGraphicFrontBack && designOption !== "pro" ? DIFFERENT_GRAPHICS_FEE : 0,
        artworkUrlFront,
        artworkLinkFront,
        textDesignFront,
        artworkUrlBack: input.sameGraphicFrontBack ? artworkUrlFront : artworkUrlBack,
        artworkLinkBack: input.sameGraphicFrontBack ? artworkLinkFront : artworkLinkBack,
        textDesignBack: input.sameGraphicFrontBack ? textDesignFront : textDesignBack,
        totalSqm: priceDetailsLocal.total_sqm,
        pricePerSqm: priceDetailsLocal.pricePerSqmAfterSurcharges,
      },
    });

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1600);
  }

  // click outside to close dropdowns
  const materialRef = useRef<HTMLDivElement | null>(null);
  const graphicsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (materialRef.current && !materialRef.current.contains(e.target as Node)) setMaterialOpen(false);
      if (graphicsRef.current && !graphicsRef.current.contains(e.target as Node)) setGraphicsOpen(false);
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

  const totalShown = serverPrice ?? displayedTotal;
  const canAdd = totalShown > 0 && input.width_cm > 0 && input.height_cm > 0;

  return (
    <main className="min-h-screen">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">
        Produs adăugat în coș
      </div>

      <div className="page py-10 pb-24 lg:pb-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="mb-2"><BannerModeSwitchInline /></div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Configurator Banner Verso</h1>
            <p className="mt-2 text-muted">Material: Blockout 610 (pretensionat)</p>
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
                  <label className="field-label">Lungime (cm)</label>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="ex: 100" className="input text-lg font-semibold" />
                </div>
                <div>
                  <label className="field-label">Înălțime (cm)</label>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="ex: 100" className="input text-lg font-semibold" />
                </div>
                <NumberInput label="Cantitate" value={input.quantity} onChange={(v) => setQty(v)} />
              </div>
            </div>

            {/* 2 + 3. Material și Finisaje pe același rând */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-4" ref={materialRef}>
                <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><Layers /></div><h2 className="text-lg font-bold text-ui">2. Material</h2></div>
                  <div className="text-sm text-muted">
                    <div className="font-semibold">Blockout 610 (pretensionat)</div>
                  </div>
                  <div className="mt-2 text-xs text-muted">Tiv & capse incluse.</div>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><CheckCircle /></div><h2 className="text-lg font-bold text-ui">3. Finisaje</h2></div>
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-muted">Tiv & capse — inclus</div>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="checkbox" checked={input.want_wind_holes} onChange={(e) => updateInput("want_wind_holes", e.target.checked)} />
                    <span className="text-sm">Găuri pentru vânt (+10%)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 4. Grafică - compact dropdown like single-face configurator */}
            <div className="card p-4" ref={graphicsRef}>
              <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><CheckCircle /></div><h2 className="text-lg font-bold text-ui">4. Grafică</h2></div>

              <label className="flex items-center gap-3 mb-3">
                <input type="checkbox" className="checkbox" checked={input.sameGraphicFrontBack} onChange={(e) => updateInput("sameGraphicFrontBack", e.target.checked)} />
                <span className="text-sm">Grafică față = spate (aceeași)</span>
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setGraphicsOpen((s) => !s)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5"
                  aria-expanded={graphicsOpen}
                >
                  <div className="text-sm text-muted">
                    {designOption === "upload" ? (input.sameGraphicFrontBack ? (artworkUrlFront || artworkLinkFront ? "Am grafică" : "Am grafică (select)") : (artworkUrlFront || artworkUrlBack || artworkLinkFront || artworkLinkBack ? "Am grafică" : "Am grafică (select)")) : designOption === "text_only" ? (input.sameGraphicFrontBack ? "Text (gratis)" : "Text (față + spate)") : `Pro (+${proFee} RON)`}
                  </div>
                  <div className="text-xs text-muted">{graphicsOpen ? "Închide" : "Alege"}</div>
                </button>

                {graphicsOpen && (
                  <div className="mt-2 p-2 bg-black/60 rounded-md border border-white/10 space-y-2">
                    <SelectCardSmall active={designOption === "upload"} onClick={() => { setDesignOption("upload"); setGraphicsOpen(false); }} title="Am grafică" subtitle="Upload / link" />
                    <SelectCardSmall active={designOption === "text_only"} onClick={() => { setDesignOption("text_only"); setGraphicsOpen(false); }} title="Text" subtitle="Gratis" />
                    <SelectCardSmall active={designOption === "pro"} onClick={() => { setDesignOption("pro"); setGraphicsOpen(false); }} title="Pro" subtitle={`+${proFee} RON`} />
                  </div>
                )}
              </div>

              {/* show controls depending on selection and sameGraphic flag */}
              {input.sameGraphicFrontBack ? (
                <>
                  {designOption === "upload" && (
                    <div className="panel p-3 mt-3 space-y-2 border-t border-white/5">
                      <div>
                        <label className="field-label">Încarcă fișier</label>
                        <input type="file" accept=".pdf,.ai,.psd,.jpg,.jpeg,.png" onChange={(e) => handleArtworkFileInput(e.target.files?.[0] || null, "front")} className="block w-full text-white file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-1 file:text-white hover:file:bg-indigo-500" />
                        <div className="text-xs text-muted mt-1">sau</div>
                      </div>
                      <div>
                        <label className="field-label">Link descărcare (opțional)</label>
                        <input type="url" value={artworkLinkFront} onChange={(e) => setArtworkLinkFront(e.target.value)} placeholder="Ex: https://.../fisier.pdf" className="input" />
                      </div>
                    </div>
                  )}

                  {designOption === "text_only" && (
                    <div className="panel p-3 mt-3 border-t border-white/5">
                      <textarea value={textDesignFront} onChange={(e) => setTextDesignFront(e.target.value)} rows={3} placeholder="Text pentru față (= spate)" className="input resize-y min-h-[80px]" />
                    </div>
                  )}

                  {designOption === "pro" && (
                    <div className="panel p-3 mt-3 border-t border-white/5">
                      <div className="text-sm text-muted">Grafică profesională (+{proFee} RON)</div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* when different: two sets (front + back) - upload or text or pro */}
                  {designOption === "upload" && (
                    <>
                      <div className="panel p-3 mt-3 border-t border-white/5">
                        <div className="text-sm font-semibold text-ui mb-2">Față</div>
                        <div className="space-y-2">
                          <div>
                            <label className="field-label">Încarcă fișier (față)</label>
                            <input type="file" accept=".pdf,.ai,.psd,.jpg,.jpeg,.png" onChange={(e) => handleArtworkFileInput(e.target.files?.[0] || null, "front")} className="block w-full text-white file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-1 file:text-white hover:file:bg-indigo-500" />
                          </div>
                          <div>
                            <label className="field-label">Link descărcare (față) — opțional</label>
                            <input type="url" value={artworkLinkFront} onChange={(e) => setArtworkLinkFront(e.target.value)} className="input" />
                          </div>
                        </div>
                        <div className="text-xs text-muted mt-2">{uploadingFront && "Se încarcă…"} {uploadErrorFront && "Eroare upload"} {artworkUrlFront && "Fișier încărcat"}</div>
                      </div>

                      <div className="panel p-3 mt-3 border-t border-white/5">
                        <div className="text-sm font-semibold text-ui mb-2">Spate</div>
                        <div className="space-y-2">
                          <div>
                            <label className="field-label">Încarcă fișier (spate)</label>
                            <input type="file" accept=".pdf,.ai,.psd,.jpg,.jpeg,.png" onChange={(e) => handleArtworkFileInput(e.target.files?.[0] || null, "back")} className="block w-full text-white file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-1 file:text-white hover:file:bg-indigo-500" />
                          </div>
                          <div>
                            <label className="field-label">Link descărcare (spate) — opțional</label>
                            <input type="url" value={artworkLinkBack} onChange={(e) => setArtworkLinkBack(e.target.value)} className="input" />
                          </div>
                        </div>
                        <div className="text-xs text-muted mt-2">{uploadingBack && "Se încarcă…"} {uploadErrorBack && "Eroare upload"} {artworkUrlBack && "Fișier încărcat"}</div>
                      </div>
                    </>
                  )}

                  {designOption === "text_only" && (
                    <>
                      <div className="panel p-3 mt-3 border-t border-white/5">
                        <textarea rows={3} value={textDesignFront} onChange={(e) => setTextDesignFront(e.target.value)} className="input" placeholder="Text pentru față" />
                      </div>
                      <div className="panel p-3 mt-3 border-t border-white/5">
                        <textarea rows={3} value={textDesignBack} onChange={(e) => setTextDesignBack(e.target.value)} className="input" placeholder="Text pentru spate" />
                      </div>
                    </>
                  )}

                  {designOption === "pro" && (
                    <div className="panel p-3 mt-3 border-t border-white/5">
                      <div className="text-sm text-muted">Grafică profesională (+{proFee} RON)</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* RIGHT - summary */}
          <aside id="order-summary" className="lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              <div className="card p-4">
                <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img src={activeImage} alt="Banner verso preview" className="h-full w-full object-cover" loading="eager" />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {GALLERY.map((src, i) => (
                    <button key={src} onClick={() => { setActiveImage(src); setActiveIndex(i); }} className={`relative overflow-hidden rounded-md border transition ${activeIndex === i ? "border-indigo-500" : "border-white/10"}`}>
                      <img src={src} alt="Thumb" className="h-20 w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>

                <div className="card p-4">
                <h2 className="text-lg font-bold border-b border-white/10 pb-3 mb-3">Sumar</h2>
                <div className="space-y-2 text-muted text-sm">
                  <p>Suprafață: <span className="text-ui font-semibold">{formatAreaDisplay(priceDetailsLocal.total_sqm)} m²</span></p>
                  <p>Preț: <span className="text-2xl font-extrabold text-ui">{formatMoneyDisplay(totalShown)} RON</span></p>
                </div>

                <div className="hidden lg:block mt-4">
                  <button onClick={calculateServer} disabled={calcLoading} className="btn-secondary mr-2">Calculează</button>
                  <button onClick={handleAddToCart} disabled={!canAdd} className="btn-primary w-full mt-3 py-2">
                    <ShoppingCart size={18} /><span className="ml-2">Adaugă</span>
                  </button>
                </div>
              </div>

              <div className="card-muted p-3 text-xs text-muted">Print durabil. Livrare rapidă.</div>
            </div>
          </aside>
        </div>
      </div>

      <MobilePriceBar total={totalShown} disabled={!canAdd} onAddToCart={handleAddToCart} onShowSummary={() => document.getElementById("order-summary")?.scrollIntoView({ behavior: "smooth" })} />

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDetailsOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl bg-[#0b0b0b] rounded-md border border-white/10 p-6">
            <button className="absolute right-3 top-3 p-1" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={18} className="text-muted" />
            </button>
            <h3 className="text-xl font-bold text-ui mb-3">Detalii comandă - Banner Verso</h3>
            <div className="text-sm text-muted space-y-2">
              <p>- Material: Blockout 610 (pretensionat). Tiv și capse incluse.</p>
              <p>- Găuri pentru vânt (+10%) — opțional.</p>
              <p>- Pro: 50 RON când grafică identică, 100 RON când grafică diferită.</p>
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
        <input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-lg font-semibold text-center w-full" />
        <button onClick={() => inc(1)} className="p-2 bg-white/10 rounded-r-md hover:bg-white/15" aria-label="Increment">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

function SelectCardSmall({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string }) {
  return (
    <button type="button" onClick={onClick} className={`w-full rounded-md p-2 text-left transition flex items-center gap-3 ${active ? "border-2 border-indigo-500 bg-indigo-900/20" : "border border-white/10 hover:bg-white/5"}`}>
      <span className={`h-3 w-3 rounded-full border ${active ? "bg-indigo-500 border-indigo-500" : "bg-transparent border-white/20"}`} />
      <div>
        <div className="text-sm text-ui">{title}</div>
        {subtitle && <div className="text-xs text-muted">{subtitle}</div>}
      </div>
    </button>
  );
}