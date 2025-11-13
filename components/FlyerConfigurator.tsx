"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { CheckCircle, Plus, Minus, ShoppingCart, Info } from "lucide-react";
import MobilePriceBar from "./MobilePriceBar";

/* Gallery images (placeholder) */
const GALLERY = ["/products/flyere/1.webp", "/products/flyere/2.webp", "/products/flyere/3.webp", "/products/flyere/4.webp"] as const;

/* Sizes & pricing (values doubled from screenshot per request) */
type PriceBracket = { max: number; oneSided: number; twoSided: number };
type SizeDef = { key: string; label: string; dims: string; brackets: PriceBracket[] };

const SIZES: SizeDef[] = [
  {
    key: "A6",
    label: "A6",
    dims: "105 × 148 mm",
    brackets: [
      { max: 100, oneSided: 0.5, twoSided: 0.96 },
      { max: 500, oneSided: 0.46, twoSided: 0.88 },
      { max: 1000, oneSided: 0.3, twoSided: 0.6 },
      { max: 2000, oneSided: 0.28, twoSided: 0.46 },
      { max: 3000, oneSided: 0.26, twoSided: 0.4 },
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
      { max: 100, oneSided: 1.0, twoSided: 1.92 },
      { max: 500, oneSided: 0.92, twoSided: 1.76 },
      { max: 1000, oneSided: 0.6, twoSided: 1.2 },
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
      { max: 100, oneSided: 0.76, twoSided: 1.4 },
      { max: 500, oneSided: 0.68, twoSided: 1.2 },
      { max: 1000, oneSided: 0.54, twoSided: 1.0 },
      { max: 2000, oneSided: 0.4, twoSided: 0.64 },
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

const PRO_FEE_PER_FACE = 50; // 50 RON per face when pro graphic

function findBracket(sizeKey: string, qty: number) {
  const s = SIZES.find((x) => x.key === sizeKey);
  if (!s) return null;
  return s.brackets.find((b) => qty <= b.max) ?? null;
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

type FlyerConfiguratorProps = {
  productSlug?: string | null;
  initialWidth?: number | null | undefined;
  initialHeight?: number | null | undefined;
};

export default function FlyerConfigurator({ productSlug, initialWidth, initialHeight }: FlyerConfiguratorProps) {
  const { addItem } = useCart();
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // UI states
  const [sizeKey, setSizeKey] = useState<string>(SIZES[0].key);
  const [qty, setQty] = useState<number>(initialWidth && initialWidth > 0 ? Math.max(1, Math.round(initialWidth)) : 100);
  const [twoSided, setTwoSided] = useState<boolean>(false);
  const [sameDesignForBoth, setSameDesignForBoth] = useState<boolean>(true);
  const [paperWeightKey, setPaperWeightKey] = useState<string>(PAPER_WEIGHTS[0].key);

  // gallery
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);

  // graphics mode: "client" or "pro" (no "none")
  const [graphicsMode, setGraphicsMode] = useState<"client" | "pro">("client");

  // artwork storage
  const [artworkFaceUrl, setArtworkFaceUrl] = useState<string | null>(null);
  const [artworkFaceLink, setArtworkFaceLink] = useState<string>("");
  const [artworkVersoUrl, setArtworkVersoUrl] = useState<string | null>(null);
  const [artworkVersoLink, setArtworkVersoLink] = useState<string>("");

  const [uploadingFace, setUploadingFace] = useState(false);
  const [uploadingVerso, setUploadingVerso] = useState(false);
  const [uploadErrorFace, setUploadErrorFace] = useState<string | null>(null);
  const [uploadErrorVerso, setUploadErrorVerso] = useState<string | null>(null);

  // text fallback option (client may enter text instead of upload)
  const [textFace, setTextFace] = useState<string>("");
  const [textVerso, setTextVerso] = useState<string>("");

  // open/close graphics panel and refs for scrolling
  const [graphicsOpen, setGraphicsOpen] = useState(false);
  const graphicsRef = useRef<HTMLDivElement | null>(null);

  // pricing
  const bracket = useMemo(() => findBracket(sizeKey, qty), [sizeKey, qty]);
  const baseUnit = useMemo(() => (bracket ? (twoSided ? bracket.twoSided : bracket.oneSided) : 0), [bracket, twoSided]);
  const paperMultiplier = useMemo(() => PAPER_WEIGHTS.find((p) => p.key === paperWeightKey)?.multiplier ?? 1, [paperWeightKey]);
  const pricePerUnit = useMemo(() => round2(baseUnit * paperMultiplier), [baseUnit, paperMultiplier]);
  const subtotal = useMemo(() => round2(pricePerUnit * qty), [pricePerUnit, qty]);

  const proFee = useMemo(() => (sameDesignForBoth ? PRO_FEE_PER_FACE : PRO_FEE_PER_FACE * 2), [sameDesignForBoth]);
  const differentGraphicsFee = 100;
  const graphicsFee = useMemo(() => (graphicsMode === "pro" ? proFee : graphicsMode === "client" && !sameDesignForBoth ? differentGraphicsFee : 0), [
    graphicsMode,
    sameDesignForBoth,
    proFee,
  ]);

  const total = round2(subtotal + graphicsFee);

  // helpers
  function uploadFile(file: File | null, side: "face" | "verso") {
    if (!file) return;
    const setUploading = side === "face" ? setUploadingFace : setUploadingVerso;
    const setError = side === "face" ? setUploadErrorFace : setUploadErrorVerso;
    const setUrl = side === "face" ? setArtworkFaceUrl : setArtworkVersoUrl;
    const setLink = side === "face" ? setArtworkFaceLink : setArtworkVersoLink;

    setUrl(null);
    setError(null);
    setLink("");
    (async () => {
      try {
        setUploading(true);
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        setUrl(data.url);
      } catch (e: any) {
        try {
          setUrl(file ? URL.createObjectURL(file) : null);
        } catch {}
        setError(e?.message ?? "Eroare la upload");
      } finally {
        setUploading(false);
      }
    })();
  }

  // when user chooses an option open graphics panel and scroll there (like Banner)
  useEffect(() => {
    setGraphicsOpen(true);
    if (graphicsRef.current) {
      graphicsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [graphicsMode]);

  // gallery auto-advance
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

  // validations before add
  function validateBeforeAdd() {
    if (!bracket) return "Cantitate/variantă invalidă (verifică pragurile).";
    // Grafica nu este obligatorie: nu mai blocăm adăugarea în coș
    return null;
  }

  function handleAddToCart() {
    const err = validateBeforeAdd();
    if (err) {
      setErrorToast(err);
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }
    const unitPrice = round2(total / Math.max(1, qty));
    const title = `Flyer ${sizeKey} ${SIZES.find((s) => s.key === sizeKey)?.dims} - ${twoSided ? "Față‑Verso" : "Față"}`;
    const id = ["flyer", sizeKey, twoSided ? "2s" : "1s", sameDesignForBoth ? "same" : "diff", graphicsMode, qty].join("-");
    addItem({
      id,
      productId: "flyer",
      slug: productSlug ?? "flyer",
      title,
      width: initialWidth ?? 0,
      height: initialHeight ?? 0,
      price: unitPrice,
      quantity: qty,
      currency: "RON",
      metadata: {
        sizeKey,
        dims: SIZES.find((s) => s.key === sizeKey)?.dims,
        qty,
        twoSided,
        sameDesignForBoth,
        paperWeight: PAPER_WEIGHTS.find((p) => p.key === paperWeightKey)?.label,
        graphicsMode,
        proFee: graphicsMode === "pro" ? proFee : 0,
        differentGraphicsFee: graphicsMode === "client" && !sameDesignForBoth ? differentGraphicsFee : 0,
        artworkFaceUrl,
        artworkFaceLink,
        textFace,
        artworkVersoUrl: sameDesignForBoth ? artworkFaceUrl : artworkVersoUrl,
        artworkVersoLink: sameDesignForBoth ? artworkFaceLink : artworkVersoLink,
        textVerso: sameDesignForBoth ? textFace : textVerso,
        subtotal,
        total,
      },
    });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1600);
  }

  return (
    <main className="min-h-screen">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">Produs adăugat în coș</div>
      {errorToast && (
        <div className={`toast-success opacity-100 translate-y-0`} aria-live="assertive">{errorToast}</div>
      )}
      <div className="page py-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold">Configurator Flyere</h1>
            <p className="mt-2 text-muted">Alege dimensiunea și opțiunile, apoi încarcă grafică sau selectează grafică profesională.</p>
          </div>
          <div />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="order-2 lg:order-1 lg:col-span-3 space-y-6">
            {/* size + qty */}
            <div className="card p-4">
              <div className="text-sm text-muted mb-2">Dimensiune</div>
              <div className="grid grid-cols-3 gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSizeKey(s.key)}
                    className={`p-3 rounded-md text-left border ${sizeKey === s.key ? "border-indigo-500 bg-indigo-900/20" : "border-white/10 hover:bg-white/5"}`}
                  >
                    <div className="font-semibold text-ui">{s.label}</div>
                    <div className="text-xs text-muted">{s.dims}</div>
                  </button>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="field-label">Cantitate</label>
                  <div className="flex items-center">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 bg-white/10 rounded-l-md">
                      <Minus size={14} />
                    </button>
                    <input className="input text-center" type="number" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} />
                    <button onClick={() => setQty(qty + 1)} className="p-2 bg-white/10 rounded-r-md">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="field-label">Față / Față‑Verso</label>
                  <div className="inline-flex rounded-md bg-white/5 p-1">
                    <button
                      onClick={() => {
                        setTwoSided(false);
                        setSameDesignForBoth(true);
                      }}
                      className={`px-3 py-1 rounded-md ${!twoSided ? "bg-indigo-600 text-white" : "text-white/80"}`}
                    >
                      Față
                    </button>
                    <button onClick={() => setTwoSided(true)} className={`ml-1 px-3 py-1 rounded-md ${twoSided ? "bg-indigo-600 text-white" : "text-white/80"}`}>
                      Față‑Verso
                    </button>
                  </div>
                </div>

                <div>
                  <label className="field-label">Hârtie</label>
                  <div className="flex gap-2 mt-2">
                    {PAPER_WEIGHTS.map((p) => (
                      <button key={p.key} onClick={() => setPaperWeightKey(p.key)} className={`px-3 py-2 rounded-md ${paperWeightKey === p.key ? "bg-indigo-600 text-white" : "bg-white/5"}`}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* same/different design toggle */}
            {twoSided && (
              <div className="card p-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={sameDesignForBoth} onChange={(e) => setSameDesignForBoth(e.target.checked)} />
                  <span className="text-sm text-muted">Aceeași grafică pe ambele fețe (folosește un singur fișier)</span>
                </label>
              </div>
            )}

            {/* Graphics: two stacked cards like Banner (client / pro) */}
            <div className="card p-4" ref={graphicsRef}>
              <div className="text-lg font-bold text-ui mb-3">Grafică</div>

              <div className="space-y-3">
                <SelectCardSmall active={graphicsMode === "client"} onClick={() => setGraphicsMode("client")} title="Am grafică — încarc / adaug link" subtitle={sameDesignForBoth ? "Un singur fișier pentru față = spate" : "Încarcă separat pentru față și spate"} />

                <SelectCardSmall active={graphicsMode === "pro"} onClick={() => setGraphicsMode("pro")} title="Vreau grafică profesională" subtitle={sameDesignForBoth ? `Cost fix: ${PRO_FEE_PER_FACE} RON` : `Cost: ${PRO_FEE_PER_FACE} RON/față (până la 2 fețe)`} />
              </div>

              {/* controls open only for chosen mode */}
              <div className="mt-4">
                {graphicsMode === "client" && sameDesignForBoth && (
                  <div className="panel p-3 space-y-2">
                    <label className="field-label">Încarcă fișier (față = spate)</label>
                    <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => uploadFile(e.target.files?.[0] || null, "face")} className="block w-full file:rounded file:bg-indigo-600 file:text-white" />
                    <label className="field-label mt-2">Link descărcare (opțional)</label>
                    <input type="url" value={artworkFaceLink} onChange={(e) => setArtworkFaceLink(e.target.value)} className="input" />
                    <div className="text-xs text-muted">{uploadingFace ? "Se încarcă…" : uploadErrorFace ? `Eroare: ${uploadErrorFace}` : artworkFaceUrl ? "Fișier pregătit" : "Niciun fișier"}</div>
                  </div>
                )}

                {graphicsMode === "client" && !sameDesignForBoth && (
                  <>
                    <div className="panel p-3 space-y-2">
                      <div className="font-semibold text-ui">Față</div>
                      <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => uploadFile(e.target.files?.[0] || null, "face")} className="block w-full file:rounded file:bg-indigo-600 file:text-white" />
                      <input type="url" value={artworkFaceLink} onChange={(e) => setArtworkFaceLink(e.target.value)} className="input mt-2" />
                      <div className="text-xs text-muted">{uploadingFace ? "Se încarcă…" : uploadErrorFace ? `Eroare: ${uploadErrorFace}` : artworkFaceUrl ? "Fișier pregătit" : "Niciun fișier"}</div>
                    </div>

                    <div className="panel p-3 space-y-2 mt-3">
                      <div className="font-semibold text-ui">Spate</div>
                      <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => uploadFile(e.target.files?.[0] || null, "verso")} className="block w-full file:rounded file:bg-indigo-600 file:text-white" />
                      <input type="url" value={artworkVersoLink} onChange={(e) => setArtworkVersoLink(e.target.value)} className="input mt-2" />
                      <div className="text-xs text-muted">{uploadingVerso ? "Se încarcă…" : uploadErrorVerso ? `Eroare: ${uploadErrorVerso}` : artworkVersoUrl ? "Fișier pregătit" : "Niciun fișier"}</div>
                    </div>
                  </>
                )}

                {graphicsMode === "pro" && (
                  <div className="panel p-3">
                    <div className="text-sm text-muted">Am selectat grafică profesională — cost afișat în sumar.</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* summary */}
          <aside id="order-summary" className="order-1 lg:order-2 lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              <div className="card p-4">
                <div className="aspect-square overflow-hidden rounded border bg-black">
                  <img src={activeImage} alt="preview" className="h-full w-full object-cover" />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {GALLERY.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => {
                        setActiveImage(src);
                        setActiveIndex(i);
                      }}
                      className={`rounded-md overflow-hidden border aspect-square ${activeIndex === i ? "border-indigo-500" : "border-white/10"}`}
                    >
                      <img src={src} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="card p-4">
                <h3 className="font-bold mb-3">Sumar</h3>
                <div className="text-sm text-muted space-y-2">
                  <div>
                    Dimensiune: <strong>{SIZES.find((s) => s.key === sizeKey)?.label}</strong>
                  </div>
                  <div>
                    Cantitate: <strong>{qty}</strong>
                  </div>
                  <div>
                    Față‑verso: <strong>{twoSided ? "Da" : "Nu"}</strong>
                  </div>
                  <div>
                    Hârtie: <strong>{PAPER_WEIGHTS.find((p) => p.key === paperWeightKey)?.label}</strong>
                  </div>
                  <div className="text-2xl font-extrabold">Total: {total.toFixed(2)} RON</div>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => {
                      /* calc server if needed */
                    }}
                    className="btn-secondary mr-2"
                  >
                    Calculează
                  </button>
                  <button onClick={handleAddToCart} className="btn-primary w-full mt-3 py-2">
                    <ShoppingCart size={18} /> <span className="ml-2">Adaugă</span>
                  </button>
                </div>
              </div>

              <div className="card-muted p-3 text-xs text-muted">Prețurile afișate includ opțiuni selectate.</div>
            </div>
          </aside>
        </div>
      </div>

      <MobilePriceBar
        total={total}
        disabled={false}
        onAddToCart={handleAddToCart}
        onShowSummary={() => document.getElementById("order-summary")?.scrollIntoView({ behavior: "smooth" })}
      />
    </main>
  );
}

/* small helpers */
function SelectCardSmall({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string }) {
  return (
    <button onClick={onClick} className={`w-full rounded-md p-3 text-left transition flex items-start gap-3 ${active ? "border-2 border-indigo-500 bg-indigo-900/20" : "border border-white/10 hover:bg-white/5"}`}>
      <div className={`h-4 w-4 mt-1 rounded-full border ${active ? "bg-indigo-500 border-indigo-500" : "bg-transparent border-white/20"}`} />
        <div>
        <div className="text-sm text-ui font-semibold">{title}</div>
        {subtitle && <div className="text-xs text-muted mt-1">{subtitle}</div>}
      </div>
    </button>
  );
}