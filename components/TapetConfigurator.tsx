"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart, Info, X } from "lucide-react";
import MobilePriceBar from "./MobilePriceBar";
import DeliveryInfo from "@/components/DeliveryInfo";
import { usePathname, useRouter } from "next/navigation";

/* GALLERY — folosește public/products/wallpaper/<n>.webp */
const GALLERY = [
  "/products/wallpaper/1.webp",
  "/products/wallpaper/2.webp",
  "/products/wallpaper/3.webp",
  "/products/wallpaper/4.webp",
] as const;

/* TIPURI */
type WallpaperMaterial = "dreamscape_vinilic" | "dreamscape_vinilic_adeziv";
type PriceInput = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: WallpaperMaterial;
  want_adhesive: boolean;
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

/*
 Pricing rules (conform specificațiilor):
 - total area < 1 m²: 180 RON / m²
 - 1 <= total area < 5 m²: 170 RON / m²
 - 5 <= total area < 20 m²: 160 RON / m²
 - total area >= 20 m²: 150 RON / m²
 Surcharges:
 - variantă cu adeziv: +10% (multiplicativ)
 Design:
 - Grafică profesională (pro) => +200 RON (adăugat separat la total)
 Text-only: NU există
*/

const localCalculatePrice = (input: PriceInput): LocalPriceOutput => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
    return { sqm_per_unit: 0, total_sqm: 0, pricePerSqmBand: 0, pricePerSqmAfterSurcharges: 0, finalPrice: 0 };
  }

  const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
  const total_sqm = sqm_per_unit * input.quantity;

  let pricePerSqmBand = 180;
  if (total_sqm >= 20) pricePerSqmBand = 150;
  else if (total_sqm >= 5) pricePerSqmBand = 160;
  else if (total_sqm >= 1) pricePerSqmBand = 170;
  else pricePerSqmBand = 180;

  const multiplier = input.want_adhesive ? 1.1 : 1.0;
  const pricePerSqmAfterSurcharges = roundMoney(pricePerSqmBand * multiplier);
  const finalPrice = roundMoney(total_sqm * pricePerSqmAfterSurcharges);

  return {
    sqm_per_unit: roundMoney(sqm_per_unit),
    total_sqm: roundMoney(total_sqm),
    pricePerSqmBand: roundMoney(pricePerSqmBand),
    pricePerSqmAfterSurcharges,
    finalPrice,
  };
};

type DesignOption = "upload" | "pro";
const PRO_DESIGN_FEE = 200;

type Props = {
  productSlug?: string;
  initialWidth?: number;
  initialHeight?: number;
};

export default function TapetConfigurator({ productSlug, initialWidth: initW, initialHeight: initH }: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [input, setInput] = useState<PriceInput>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    material: "dreamscape_vinilic",
    want_adhesive: false,
  });

  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
  const [designOption, setDesignOption] = useState<DesignOption>("upload");

  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [artworkLink, setArtworkLink] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const [materialOpen, setMaterialOpen] = useState<boolean>(false);
  const [graphicsOpen, setGraphicsOpen] = useState<boolean>(false);

  const priceDetailsLocal = useMemo(() => localCalculatePrice(input), [input]);

  // displayed total includes pro fee if selected
  const displayedTotal = useMemo(() => {
    const base = priceDetailsLocal.finalPrice || 0;
    return designOption === "pro" ? roundMoney(base + PRO_DESIGN_FEE) : base;
  }, [priceDetailsLocal, designOption]);

  // serverPrice simulation (authoritative calc triggered by user)
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

  async function handleArtworkFileInput(file: File | null) {
    setArtworkUrl(null);
    setUploadError(null);
    if (!file) return;
    try {
      setUploading(true);
      // For parity with banner, attempt real upload to /api/upload; fallback to objectURL preview
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
  }

  async function calculateServer() {
    setCalcLoading(true);
    setServerPrice(null);
    try {
      const result = localCalculatePrice(input);
      const total = designOption === "pro" ? roundMoney(result.finalPrice + PRO_DESIGN_FEE) : result.finalPrice;
      // simulate server delay
      await new Promise((r) => setTimeout(r, 300));
      setServerPrice(total);
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

    const totalForOrder = serverPrice ?? displayedTotal;
    if (!totalForOrder || totalForOrder <= 0) {
      setErrorToast("Calculează prețul înainte de a adăuga în coș.");
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }

    const unitPrice = roundMoney(totalForOrder / input.quantity);

    const uniqueId = [
      "tapet",
      input.material,
      input.width_cm,
      input.height_cm,
      input.want_adhesive ? "adeziv" : "fara-adeziv",
      designOption,
    ].join("-");

    const title = `Tapet Dreamscape Vinilic - ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "tapet-dreamscape-vinilic",
      slug: productSlug ?? "tapet-dreamscape-vinilic",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        artworkUrl,
        artworkLink,
        designOption,
        proDesignFee: designOption === "pro" ? PRO_DESIGN_FEE : 0,
        totalSqm: priceDetailsLocal.total_sqm,
        pricePerSqm: priceDetailsLocal.pricePerSqmAfterSurcharges,
        want_adhesive: input.want_adhesive,
      },
    });

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1600);
  }

  // click outside handlers for dropdowns
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

  // auto-cycle gallery like banner
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
      {errorToast && (
        <div className={`toast-success opacity-100 translate-y-0`} aria-live="assertive">{errorToast}</div>
      )}

      <div className="page py-10 pb-24 lg:pb-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Configurator Tapet</h1>
            <p className="mt-2 text-muted">
              Tapet Dreamscape Vinilic — ideal pentru design interior, artă murală sau bannere cu efecte deosebite. 400 g/m²,
              țesătură poliester, coating vinilic. Recomandat indoor și aplicații outdoor pe termen scurt.
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
              <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><Ruler /></div><h2 className="text-lg font-bold text-ui">1. Dimensiuni & cantitate</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="field-label">Lățime (cm)</label>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="ex: 100" className="input text-lg font-semibold" />
                </div>
                <div>
                  <label className="field-label">Înălțime (cm)</label>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="ex: 270" className="input text-lg font-semibold" />
                </div>
                <NumberInput label="Cantitate" value={input.quantity} onChange={(v) => setQty(v)} />
              </div>
            </div>

            {/* 2. Material & 3. Finisaje compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-4" ref={materialRef}>
                <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><Layers /></div><h2 className="text-lg font-bold text-ui">2. Material</h2></div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMaterialOpen((s) => !s)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5"
                    aria-expanded={materialOpen}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted">{input.want_adhesive ? "Dreamscape Vinilic (cu adeziv)" : "Dreamscape Vinilic (fără adeziv)"}</div>
                    </div>
                    <div className="text-xs text-muted">{materialOpen ? "Închide" : "Schimbă"}</div>
                  </button>

                  {materialOpen && (
                    <div className="mt-2 p-2 bg-black/60 rounded-md border border-white/10 space-y-2">
                      <MaterialOptionDropdown checked={!input.want_adhesive} onSelect={() => { updateInput("material", "dreamscape_vinilic"); updateInput("want_adhesive", false); setMaterialOpen(false); }} title="Dreamscape Vinilic — fără adeziv" subtitle="400 g/m² — standard" />
                      <MaterialOptionDropdown checked={input.want_adhesive} onSelect={() => { updateInput("material", "dreamscape_vinilic_adeziv"); updateInput("want_adhesive", true); setMaterialOpen(false); }} title="Dreamscape Vinilic — cu adeziv" subtitle="+10% la preț" />
                      <div className="text-sm text-muted">Tapet din țesătură pe bază de poliester cu coating vinilic. Recomandat indoor.</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><CheckCircle /></div><h2 className="text-lg font-bold text-ui">3. Opțiuni</h2></div>
                <div className="flex flex-col gap-2">
                  <div className="text-sm text-muted">Grosime: 400 g/m² (12oz/m²)</div>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="checkbox" checked={input.want_adhesive} onChange={(e) => updateInput("want_adhesive", e.target.checked)} />
                    <span className="text-sm">Variantă cu adeziv (+10%)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 4. Grafică */}
            <div className="card p-4" ref={graphicsRef}>
              <div className="flex items-center gap-3 mb-3"><div className="text-indigo-400"><CheckCircle /></div><h2 className="text-lg font-bold text-ui">4. Grafică</h2></div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setGraphicsOpen((s) => !s)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5"
                  aria-expanded={graphicsOpen}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-muted">{designOption === "upload" ? (artworkUrl || artworkLink ? "Am grafică" : "Am grafică (select)") : "Pro (+200 RON)"}</div>
                  </div>
                  <div className="text-xs text-muted">{graphicsOpen ? "Închide" : "Alege"}</div>
                </button>

                {graphicsOpen && (
                  <div className="mt-2 p-2 bg-black/60 rounded-md border border-white/10 space-y-2">
                    <SelectCardSmall active={designOption === "upload"} onClick={() => { setDesignOption("upload"); setGraphicsOpen(false); }} title="Am grafică" subtitle="Upload / link" />
                    <SelectCardSmall active={designOption === "pro"} onClick={() => { setDesignOption("pro"); setGraphicsOpen(false); }} title="Pro" subtitle={`+${PRO_DESIGN_FEE} RON`} />
                  </div>
                )}
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
                  <div className="text-sm text-muted">Grafică profesională (+{PRO_DESIGN_FEE} RON)</div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - preview + summary */}
          <aside id="order-summary" className="order-1 lg:order-2 lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              <div className="card p-4">
                <div className="aspect-square overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img src={activeImage} alt="Tapet preview" className="h-full w-full object-cover" loading="eager" />
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
                </div>

                <div className="mt-4">
                  <DeliveryInfo className="hidden lg:block" variant="minimal" icon="📦" showCod={false} showShippingFrom={false} />
                </div>

                <div className="hidden lg:block mt-4">
                  <button onClick={handleAddToCart} disabled={!canAdd} className="btn-primary w-full py-2">
                    <ShoppingCart size={18} /><span className="ml-2">Adaugă</span>
                  </button>
                </div>
              </div>

              <div className="card-muted p-3 text-xs text-white/60">Print durabil. Livrare rapidă.</div>
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
              <X size={18} className="text-ui" />
            </button>
            <h3 className="text-xl font-bold text-ui mb-3">Detalii Tapet Dreamscape Vinilic</h3>
            <div className="text-sm text-muted space-y-2">
              <p>- Grosime: 400 g/m²</p>
              <p>- Tapet din țesătură pe bază de poliester cu coating vinilic. Printuri de calitate, recomandat interior; poate fi folosit și outdoor pe termen scurt.</p>
              <p>- Variantă cu adeziv: +10% la prețul de bază.</p>
              <p>- Grafică profesională: +{PRO_DESIGN_FEE} RON.</p>
              <p>- Recomandare: încărcați fișiere la rezoluție mare; pentru pattern-uri încărcați fișier repetabil.</p>
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
          Tapet adăugat în coș
        </div>
      )}
    </main>
  );
}

/* small UI helpers (copiate similar cu BannerConfigurator) */

function MaterialOptionDropdown({ checked, onSelect, title, subtitle }: { checked: boolean; onSelect: () => void; title: string; subtitle?: string }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-3 p-2 rounded-md ${checked ? "bg-indigo-900/30 border border-indigo-500" : "hover:bg-white/5"}`}
    >
      <span className={`h-3 w-3 rounded-full border ${checked ? "bg-indigo-500 border-indigo-500" : "bg-transparent border-white/20"}`} />
      <div className="text-left">
        <div className="text-sm text-ui">{title}</div>
        {subtitle && <div className="text-xs text-muted">{subtitle}</div>}
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

function SelectCardSmall({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string }) {
  return (
    <button type="button" onClick={onClick} className={`w-full rounded-md p-2 text-left transition flex items-center gap-3 ${active ? "border-2 border-indigo-500 bg-indigo-900/20" : "border border-white/10 bg-transparent hover:bg-white/5"}`}>
      <span className={`h-3 w-3 rounded-full border ${active ? "bg-indigo-500 border-indigo-500" : "bg-transparent border-white/20"}`} />
      <div>
        <div className="text-sm text-ui">{title}</div>
        {subtitle && <div className="text-xs text-muted">{subtitle}</div>}
      </div>
    </button>
  );
}