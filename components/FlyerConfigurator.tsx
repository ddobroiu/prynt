"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { CheckCircle, Plus, Minus, ShoppingCart, Info } from "lucide-react";
import MobilePriceBar from "./MobilePriceBar";

/* Gallery images (same pattern as Banner) */
const GALLERY = ["/products/flyer/1.jpg", "/products/flyer/2.jpg", "/products/flyer/3.jpg", "/products/flyer/4.jpg"] as const;

/* Price tables (doubled from screenshot as requested) */
type PriceBracket = { max: number; oneSided: number; twoSided: number };
type SizeDef = { key: string; label: string; dims: string; brackets: PriceBracket[] };

const SIZES: SizeDef[] = [
  {
    key: "A6",
    label: "A6",
    dims: "105 × 148 mm",
    brackets: [
      { max: 100, oneSided: 0.50, twoSided: 0.96 },
      { max: 500, oneSided: 0.46, twoSided: 0.88 },
      { max: 1000, oneSided: 0.30, twoSided: 0.60 },
      { max: 2000, oneSided: 0.28, twoSided: 0.46 },
      { max: 3000, oneSided: 0.26, twoSided: 0.40 },
      { max: 4000, oneSided: 0.24, twoSided: 0.36 },
      { max: 5000, oneSided: 0.22, twoSided: 0.28 },
      { max: Infinity, oneSided: 0.22, twoSided: 0.28 },
    ],
  },
  {
    key: "A5",
    label: "A5",
    dims: "148 × 210 mm",
    brackets: [
      { max: 100, oneSided: 1.00, twoSided: 1.92 },
      { max: 500, oneSided: 0.92, twoSided: 1.76 },
      { max: 1000, oneSided: 0.60, twoSided: 1.20 },
      { max: 2000, oneSided: 0.52, twoSided: 0.64 },
      { max: 3000, oneSided: 0.38, twoSided: 0.44 },
      { max: 4000, oneSided: 0.32, twoSided: 0.38 },
      { max: 5000, oneSided: 0.28, twoSided: 0.32 },
      { max: Infinity, oneSided: 0.28, twoSided: 0.32 },
    ],
  },
  {
    key: "21x10",
    label: "21 × 10 cm",
    dims: "210 × 100 mm",
    brackets: [
      { max: 100, oneSided: 0.76, twoSided: 1.40 },
      { max: 500, oneSided: 0.68, twoSided: 1.20 },
      { max: 1000, oneSided: 0.54, twoSided: 1.00 },
      { max: 2000, oneSided: 0.40, twoSided: 0.64 },
      { max: 3000, oneSided: 0.36, twoSided: 0.52 },
      { max: 4000, oneSided: 0.28, twoSided: 0.38 },
      { max: 5000, oneSided: 0.22, twoSided: 0.28 },
      { max: Infinity, oneSided: 0.22, twoSided: 0.28 },
    ],
  },
];

const PAPER_WEIGHTS = [
  { key: "135", label: "135 g/mp", multiplier: 1.0 },
  { key: "250", label: "250 g/mp (+20%)", multiplier: 1.2 },
];

const PRO_GRAPHIC_FEE_PER_FACE = 50; // RON per face for pro graphic

function findBracket(sizeKey: string, qty: number): PriceBracket | null {
  const s = SIZES.find((x) => x.key === sizeKey);
  if (!s) return null;
  return s.brackets.find((b) => qty <= b.max) ?? null;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export default function FlyerConfigurator() {
  const { addItem } = useCart();

  // states (same as Canvas/Banner pattern)
  const [sizeKey, setSizeKey] = useState<string>(SIZES[0].key);
  const [qty, setQty] = useState<number>(100);
  const [twoSided, setTwoSided] = useState<boolean>(false);
  const [sameDesignForBoth, setSameDesignForBoth] = useState<boolean>(true); // if two-sided and same design, single upload
  const [paperWeightKey, setPaperWeightKey] = useState<string>(PAPER_WEIGHTS[0].key);

  // artwork for face/verso (if sameDesignForBoth=true, only face is used)
  const [artworkFaceUrl, setArtworkFaceUrl] = useState<string | null>(null);
  const [artworkVersoUrl, setArtworkVersoUrl] = useState<string | null>(null);
  const [artworkFaceLink, setArtworkFaceLink] = useState<string>("");
  const [artworkVersoLink, setArtworkVersoLink] = useState<string>("");

  const [uploadingFace, setUploadingFace] = useState(false);
  const [uploadErrorFace, setUploadErrorFace] = useState<string | null>(null);
  const [uploadingVerso, setUploadingVerso] = useState(false);
  const [uploadErrorVerso, setUploadErrorVerso] = useState<string | null>(null);

  // graphic option: "none" | "client" | "pro"
  const [graphicMode, setGraphicMode] = useState<"none" | "client" | "pro">("none");

  // UI
  const [errors, setErrors] = useState<string[]>([]);
  const [toastVisible, setToastVisible] = useState(false);

  // gallery
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);

  // refs for scrolling
  const graphicsRef = useRef<HTMLDivElement | null>(null);

  // pricing logic
  const bracket = useMemo(() => findBracket(sizeKey, qty), [sizeKey, qty]);
  const baseUnit = useMemo(() => (bracket ? (twoSided ? bracket.twoSided : bracket.oneSided) : 0), [bracket, twoSided]);
  const paperMultiplier = useMemo(() => PAPER_WEIGHTS.find((p) => p.key === paperWeightKey)?.multiplier ?? 1, [paperWeightKey]);

  const pricePerUnit = useMemo(() => round2(baseUnit * paperMultiplier), [baseUnit, paperMultiplier]);
  const subtotal = useMemo(() => round2(pricePerUnit * qty), [pricePerUnit, qty]);

  // proGraphicFee rules implemented as requested:
  // - graphicMode !== "pro" => 0
  // - graphicMode === "pro":
  //    - if twoSided == false => 50
  //    - if twoSided == true && sameDesignForBoth == true => 50 (one pro covers both faces)
  //    - if twoSided == true && sameDesignForBoth == false => 100 (pro for both faces)
  const proGraphicFee = useMemo(() => {
    if (graphicMode !== "pro") return 0;
    if (!twoSided) return PRO_GRAPHIC_FEE_PER_FACE;
    return sameDesignForBoth ? PRO_GRAPHIC_FEE_PER_FACE : PRO_GRAPHIC_FEE_PER_FACE * 2;
  }, [graphicMode, twoSided, sameDesignForBoth]);

  const totalPrice = useMemo(() => round2(subtotal + proGraphicFee), [subtotal, proGraphicFee]);

  const canAdd = Boolean(qty > 0 && bracket);

  // scroll to graphics panel when user picks client/pro options (behavior like Banner)
  useEffect(() => {
    if (graphicMode === "client" || graphicMode === "pro") {
      graphicsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [graphicMode]);

  // file upload helpers: attempt /api/upload and fallback to preview URL
  async function uploadFile(file: File | null, setUrl: (u: string | null) => void, setUploading: (v: boolean) => void, setError: (m: string | null) => void) {
    setUrl(null);
    setError(null);
    if (!file) return;
    try {
      setUploading(true);
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload eșuat");
      const data = await res.json();
      setUrl(data.url);
    } catch (e: any) {
      try {
        const preview = file ? URL.createObjectURL(file) : null;
        setUrl(preview);
      } catch {}
      setError(e?.message ?? "Eroare la upload");
    } finally {
      setUploading(false);
    }
  }

  async function handleFileFace(file: File | null) {
    await uploadFile(file, setArtworkFaceUrl, setUploadingFace, setUploadErrorFace);
    // if sameDesignForBoth and twoSided, mirror the URL immediately
    if (twoSided && sameDesignForBoth) {
      setArtworkVersoUrl(artworkFaceUrl ?? null);
      setArtworkVersoLink("");
      setUploadErrorVerso(null);
    }
  }

  async function handleFileVerso(file: File | null) {
    await uploadFile(file, setArtworkVersoUrl, setUploadingVerso, setUploadErrorVerso);
  }

  // add to cart
  function handleAddToCart() {
    const next: string[] = [];
    if (!qty || qty <= 0) next.push("Completează o cantitate validă (>0).");
    if (!bracket) next.push("Cantitate în afara limitelor pentru această dimensiune.");
    if (uploadErrorFace) next.push("Eroare upload (față): " + uploadErrorFace);
    if (uploadErrorVerso) next.push("Eroare upload (verso): " + uploadErrorVerso);
    if (next.length) {
      setErrors(next);
      document.getElementById("flyer-errors")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors([]);

    const size = SIZES.find((s) => s.key === sizeKey)!;
    const paper = PAPER_WEIGHTS.find((p) => p.key === paperWeightKey)!;
    const faceText = twoSided ? "Față‑Verso" : "Față";
    const title = `Flyer - ${size.label} (${size.dims}) - ${faceText} - ${paper.label}${graphicMode === "pro" ? " - Grafică Pro" : ""}`;
    const uniqueId = ["flyer", sizeKey, twoSided ? "2s" : "1s", paper.key, graphicMode === "pro" ? (sameDesignForBoth ? "pro-1" : "pro-2") : "std", qty].join("-");

    addItem({
      id: uniqueId,
      productId: "flyer",
      slug: "flyer",
      title,
      width: 0,
      height: 0,
      price: round2(totalPrice / Math.max(1, qty)),
      quantity: qty,
      currency: "RON",
      metadata: {
        sizeKey,
        sizeLabel: size.label,
        dims: size.dims,
        qty,
        twoSided,
        sameDesignForBoth,
        paperWeight: paper.label,
        basePricePerUnit: round2(baseUnit),
        pricePerUnit,
        subtotal,
        graphicMode,
        proGraphic: graphicMode === "pro",
        proGraphicFee,
        totalPrice,
        artworkFaceUrl,
        artworkVersoUrl: twoSided ? artworkVersoUrl : null,
        artworkFaceLink,
        artworkVersoLink: twoSided ? artworkVersoLink : null,
      },
    });

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1400);
  }

  // small file preview component
  const FilePreview = ({ url, label }: { url: string | null; label: string }) => {
    if (!url) return null;
    return (
      <div className="mt-2 flex items-center gap-3">
        <img src={url} alt={label} className="h-12 w-12 object-cover rounded-md border" />
        <div>
          <div className="text-sm font-medium text-white">{label}</div>
          <div className="text-xs text-white/60">Fișier încărcat</div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">
        Produs adăugat în coș
      </div>

      <div className="page py-10 pb-24 lg:pb-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Configurator Flyere</h1>
            <p className="mt-2 text-white/70">Configurează flyere — upload grafică (față / verso), hârtie, față‑verso și grafică profesională.</p>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" className="btn-outline text-sm">
              <Info size={18} />
              <span className="ml-2">Detalii</span>
            </button>
          </div>
        </header>

        {errors.length > 0 && (
          <div id="flyer-errors" className="mb-4 card p-3 border-l-4 border-red-500 bg-black/40">
            <div className="font-semibold text-red-400 mb-2">Trebuie corectat</div>
            <ul className="list-disc pl-5 text-sm text-white/80">
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* Sizes */}
            <div className="card p-4">
              <div className="text-sm text-white/70 mb-3">Dimensiune</div>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map((s) => (
                  <button key={s.key} onClick={() => setSizeKey(s.key)} className={`p-3 rounded-md text-left border ${sizeKey === s.key ? "border-indigo-500 bg-indigo-900/20" : "border-white/10 hover:bg-white/5"}`}>
                    <div className="font-semibold text-white">{s.label}</div>
                    <div className="text-xs text-white/60">{s.dims}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + one/two sided */}
            <div className="card p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Cantitate</label>
                  <div className="flex items-center">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 bg-white/10 rounded-l-md"><Minus size={14} /></button>
                    <input type="number" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="input text-center" />
                    <button onClick={() => setQty(qty + 1)} className="p-2 bg-white/10 rounded-r-md"><Plus size={14} /></button>
                  </div>
                </div>

                <div>
                  <label className="field-label">Față / Față‑Verso</label>
                  <div className="inline-flex rounded-md bg-white/5 p-1">
                    <button onClick={() => { setTwoSided(false); setSameDesignForBoth(true); }} className={`px-3 py-1 rounded-md text-sm ${!twoSided ? "bg-indigo-600 text-white" : "text-white/80 hover:bg-white/10"}`}>Față</button>
                    <button onClick={() => setTwoSided(true)} className={`ml-1 px-3 py-1 rounded-md text-sm ${twoSided ? "bg-indigo-600 text-white" : "text-white/80 hover:bg_white/10"}`}>Față‑Verso</button>
                  </div>
                </div>
              </div>
            </div>

            {/* same design toggle (only when twoSided) */}
            {twoSided && (
              <div className="card p-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={sameDesignForBoth} onChange={(e) => setSameDesignForBoth(e.target.checked)} />
                  <span className="text-sm text-white/80">Aceeași grafică pentru față și verso (folosește un singur fișier)</span>
                </label>
              </div>
            )}

            {/* Paper */}
            <div className="card p-4">
              <label className="field-label">Hârtie</label>
              <div className="flex gap-2 mt-2">
                {PAPER_WEIGHTS.map((p) => (
                  <button key={p.key} onClick={() => setPaperWeightKey(p.key)} className={`px-3 py-2 rounded-md ${paperWeightKey === p.key ? "bg-indigo-600 text-white" : "bg-white/5 text-white/80 hover:bg-white/10"}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Graphics mode selector (radio group like Banner) */}
            <div className="card p-4" ref={graphicsRef}>
              <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><CheckCircle /></div><h2 className="text-lg font-bold text-white">Grafică</h2></div>

              <div className="panel p-3 space-y-3">
                <div>
                  <label className="field-label">Alege opțiunea pentru grafică</label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center gap-3">
                      <input type="radio" name="graphicMode" checked={graphicMode === "none"} onChange={() => setGraphicMode("none")} />
                      <span className="text-sm text-white/80">Nu trimit grafică acum</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input type="radio" name="graphicMode" checked={graphicMode === "client"} onChange={() => setGraphicMode("client")} />
                      <span className="text-sm text-white/80">Am grafică — încarc / adaug link</span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input type="radio" name="graphicMode" checked={graphicMode === "pro"} onChange={() => setGraphicMode("pro")} />
                      <span className="text-sm text-white/80">Vreau grafică profesională ({twoSided ? (sameDesignForBoth ? `${PRO_GRAPHIC_FEE_PER_FACE} RON` : `${PRO_GRAPHIC_FEE_PER_FACE * 2} RON`) : `${PRO_GRAPHIC_FEE_PER_FACE} RON`})</span>
                    </label>
                  </div>
                </div>

                {/* If client provides graphic (or pro graphic) show uploads/links */}
                {(graphicMode === "client" || graphicMode === "pro") && (
                  <>
                    <div>
                      <label className="field-label">Încarcă grafică - Față</label>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileFace(e.target.files?.[0] || null)} className="block w-full text-white file:rounded-md file:bg-indigo-600 file:px-3 file:py-1" />
                      <input type="url" value={artworkFaceLink} onChange={(e) => { setArtworkFaceLink(e.target.value); setArtworkFaceUrl(null); }} placeholder="Link descărcare - Față (opțional)" className="input mt-2" />
                      {uploadingFace && <div className="text-xs text-white/60">Se încarcă…</div>}
                      {uploadErrorFace && <div className="text-xs text-red-400">{uploadErrorFace}</div>}
                    </div>

                    {/* verso upload shown only when twoSided and not sameDesignForBoth */}
                    {twoSided && !sameDesignForBoth && (
                      <div>
                        <label className="field-label">Încarcă grafică - Verso</label>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleFileVerso(e.target.files?.[0] || null)} className="block w-full text-white file:rounded-md file:bg-indigo-600 file:px-3 file:py-1" />
                        <input type="url" value={artworkVersoLink} onChange={(e) => { setArtworkVersoLink(e.target.value); setArtworkVersoUrl(null); }} placeholder="Link descărcare - Verso (opțional)" className="input mt-2" />
                        {uploadingVerso && <div className="text-xs text-white/60">Se încarcă…</div>}
                        {uploadErrorVerso && <div className="text-xs text-red-400">{uploadErrorVerso}</div>}
                      </div>
                    )}

                    <div className="text-xs text-white/60">Dacă nu încarci acum, poți trimite grafică ulterior — dar menționează ce ai ales în observații.</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT - summary */}
          <aside id="order-summary" className="lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              <div className="card p-4">
                <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img src={activeImage} alt="Flyer preview" className="h-full w-full object-cover" />
                </div>

                <div className="mt-3 grid grid-cols-4 gap-3">
                  {GALLERY.map((src, i) => (
                    <button key={src} onClick={() => { setActiveImage(src); setActiveIndex(i); }} className={`relative overflow-hidden rounded-md border transition ${activeIndex === i ? "border-indigo-500 ring-2 ring-indigo-500/40" : "border-white/10 hover:border-white/30"}`} aria-label="Previzualizare">
                      <img src={src} alt="Thumb" className="h-20 w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="card p-4">
                <h2 className="text-lg font-bold border-b border-white/10 pb-3 mb-3">Sumar</h2>
                <div className="space-y-2 text-white/80 text-sm">
                  <p>Dimensiune: <span className="text-white font-semibold">{SIZES.find((s) => s.key === sizeKey)?.label}</span></p>
                  <p>Dimensiune (mm): <span className="text-white font-semibold">{SIZES.find((s) => s.key === sizeKey)?.dims}</span></p>
                  <p>Cantitate: <span className="text-white font-semibold">{qty}</span></p>
                  <p>Față‑verso: <span className="text-white font-semibold">{twoSided ? "Da" : "Nu"}</span></p>
                  {twoSided && <p>Aceeași grafică pe ambele fețe: <span className="text-white font-semibold">{sameDesignForBoth ? "Da" : "Nu"}</span></p>}
                  <p>Hârtie: <span className="text-white font-semibold">{PAPER_WEIGHTS.find((p) => p.key === paperWeightKey)?.label}</span></p>
                  <p>Preț per unitate: <span className="text-white font-semibold">{pricePerUnit.toFixed(2)} RON</span></p>
                  <p>Subtotal: <span className="text-white font-semibold">{subtotal.toFixed(2)} RON</span></p>
                  {graphicMode === "pro" && <p>Grafică profesională: <span className="text-white font-semibold">{proGraphicFee.toFixed(2)} RON</span></p>}
                  <p className="text-2xl font-extrabold text-white">Total: {totalPrice.toFixed(2)} RON</p>

                  <FilePreview url={artworkFaceUrl} label="Grafică - Față" />
                  {twoSided && !sameDesignForBoth && <FilePreview url={artworkVersoUrl} label="Grafică - Verso" />}
                </div>

                <div className="mt-4">
                  <button onClick={() => { /* server calculate if needed */ }} className="btn-secondary mr-2">Calculează</button>
                  <button onClick={handleAddToCart} disabled={!canAdd} className="btn-primary w-full mt-3 py-2">
                    <ShoppingCart size={18} /><span className="ml-2">Adaugă în coș</span>
                  </button>
                </div>
              </div>

              <div className="card-muted p-3 text-xs text-white/60">Flyere — opțiuni profesionale disponibile. După adăugare în coș vei vedea toate detaliile comenzii în metadata.</div>
            </div>
          </aside>
        </div>
      </div>

      <MobilePriceBar total={totalPrice} disabled={!canAdd} onAddToCart={handleAddToCart} onShowSummary={() => document.getElementById("order-summary")?.scrollIntoView({ behavior: "smooth" })} />
    </main>
  );
}