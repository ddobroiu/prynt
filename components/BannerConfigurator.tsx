"use client";
import React, { useMemo, useState } from "react";
import { useCart } from "./CartContext"; // asigură calea corectă
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart, Info } from "lucide-react";
import BannerModeSwitch from "./BannerModeSwitch";
import MobilePriceBar from "./MobilePriceBar";

/* GALLERY (exemplu) */
const GALLERY = [
  "/products/banner/1.jpg",
  "/products/banner/2.jpg",
  "/products/banner/3.jpg",
  "/products/banner/4.jpg",
] as const;

/* LOGICA PREȚ LOCAL (păstreaz-o pentru preview instant) */
type BannerMaterial = "frontlit_440" | "frontlit_510";
type PriceInput = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: BannerMaterial;
  want_wind_holes: boolean;
  want_hem_and_grommets: boolean;
};
const MINIMUM_AREA_PER_ORDER = 1.0;
const PRICING_TIERS = [
  { maxSqm: 5, price: 35.0 },
  { maxSqm: 10, price: 32.0 },
  { maxSqm: 20, price: 30.0 },
  { maxSqm: 50, price: 28.0 },
  { maxSqm: Infinity, price: 26.0 },
];
const SURCHARGES = { frontlit_510: 1.15, wind_holes: 1.05, hem_and_grommets: 1.10 };
const roundMoney = (n: number) => Math.round(n * 100) / 100;
const localCalculatePrice = (input: PriceInput) => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) {
    return { sqm_per_unit: 0, total_sqm_taxable: 0, pricePerSqmBase: 0, finalPrice: 0 };
  }
  const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
  const total_sqm = sqm_per_unit * input.quantity;
  const total_sqm_taxable = Math.max(total_sqm, MINIMUM_AREA_PER_ORDER);
  let base = PRICING_TIERS.find((t) => total_sqm_taxable <= t.maxSqm)?.price ?? PRICING_TIERS.at(-1)!.price;
  let mult = 1;
  if (input.material === "frontlit_510") mult *= SURCHARGES.frontlit_510;
  if (input.want_wind_holes) mult *= SURCHARGES.wind_holes;
  if (input.want_hem_and_grommets) mult *= SURCHARGES.hem_and_grommets;
  const adj = base * mult;
  const final = total_sqm_taxable * adj;
  return {
    sqm_per_unit: roundMoney(sqm_per_unit),
    total_sqm_taxable: roundMoney(total_sqm_taxable),
    pricePerSqmBase: roundMoney(adj),
    finalPrice: roundMoney(final),
  };
};

/* GRAFICĂ */
type DesignOption = "upload" | "pro" | "text_only";
const PRO_DESIGN_FEE = 50;

type Props = {
  productSlug?: string; // pass from page.tsx if you want server calc with slug
  initialWidth?: number;
  initialHeight?: number;
};

export default function BannerConfigurator({ productSlug, initialWidth: initW, initialHeight: initH }: Props) {
  const { addItem, items } = useCart();

  const [input, setInput] = useState<PriceInput>({
    width_cm: initW ?? 120,
    height_cm: initH ?? 60,
    quantity: 1,
    material: "frontlit_440",
    want_wind_holes: false,
    want_hem_and_grommets: true,
  });

  const [lengthText, setLengthText] = useState(String(initW ?? ""));
  const [heightText, setHeightText] = useState(String(initH ?? ""));
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
  const [designOption, setDesignOption] = useState<DesignOption>("upload");

  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [textDesign, setTextDesign] = useState<string>("");

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const hasProDesign = items.some((i) => i.id === "design-pro");

  // Local preview price
  const priceDetailsLocal = useMemo(() => localCalculatePrice(input), [input]);
  const pricePerUnitLocal =
    input.quantity > 0 && priceDetailsLocal.finalPrice > 0
      ? roundMoney(priceDetailsLocal.finalPrice / input.quantity)
      : 0;

  // Server-calculated price (preferred) - set after fetch
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

  // Upload handler: if you have /api/upload implemented, keep it; otherwise set artworkUrl to preview blob
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
    } catch (e: any) {
      // fallback: create local preview URL so user sees it even if no server upload
      try {
        const preview = file ? URL.createObjectURL(file) : null;
        setArtworkUrl(preview);
      } catch {}
      setUploadError(e?.message ?? "Eroare la upload");
    } finally {
      setUploading(false);
    }
  };

  // Server calculation - recommended
  async function calculateServer() {
    setCalcLoading(true);
    setServerPrice(null);
    try {
      const res = await fetch("/api/calc-price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          widthCm: input.width_cm,
          heightCm: input.height_cm,
          slug: productSlug ?? undefined,
          materialId: input.material === "frontlit_510" ? "frontlit_510" : "frontlit_440",
          side: "single",
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setServerPrice(data.price);
      } else {
        alert(data.message || "Eroare calcul server");
      }
    } catch (e) {
      alert("Eroare de rețea");
    } finally {
      setCalcLoading(false);
    }
  }

  // Adapter: map configurator fields to CartContext item shape
  function handleAddToCart() {
    // prefer serverPrice if available; fallback to local preview
    const finalUnit = serverPrice ?? pricePerUnitLocal;
    if (!finalUnit || finalUnit <= 0) {
      alert("Calculează prețul înainte de a adăuga în coș");
      return;
    }

    const uniqueId = [
      "banner",
      input.material,
      input.width_cm,
      input.height_cm,
      input.want_wind_holes ? "g" : "f",
      input.want_hem_and_grommets ? "c" : "f",
      designOption,
    ].join("-");

    const title = `Banner ${input.material === "frontlit_510" ? "Frontlit 510g/mp" : "Frontlit 440g/mp"} - ${input.width_cm}x${input.height_cm}cm`;

    // Map to CartItem shape used by CartContext (id, productId, slug, title, width, height, price, quantity)
    addItem({
      id: uniqueId,
      productId: productSlug ?? "banner-generic",
      slug: productSlug ?? "generic-banner",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: finalUnit, // price per unit; CartContext computes total = price*quantity
      quantity: input.quantity,
      currency: "RON",
      // If CartContext supports metadata, add it; otherwise ignore
      // metadata: { artworkUrl, designOption, textDesign }
    } as any); // as any if CartItem type not yet extended

    // add optional design service item (keep backward compatibility)
    if (designOption === "pro" && !hasProDesign) {
      addItem({
        id: "design-pro",
        productId: "design-service",
        slug: "design-pro",
        title: "Serviciu grafică profesională",
        width: 0,
        height: 0,
        price: PRO_DESIGN_FEE,
        quantity: 1,
        currency: "RON",
      } as any);
    }

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1600);
  }

  return (
    <main className="min-h-screen">
      {/* toast */}
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">
        Produs adăugat în coș
      </div>

      <div className="page py-10 pb-24 lg:pb-10">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="mb-2"><BannerModeSwitch /></div>
            <h1 className="text-3xl md:text-4xl font-extrabold">Configurator Banner</h1>
            <p className="mt-2 text-white/70">Alege lungimea, înălțimea, materialul, finisajele și partea de grafică.</p>
          </div>
          <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline text-sm self-start">
            <Info size={18} />
            <span className="ml-2">Mai multe detalii</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* left configurator (same as your file) */}
          <div className="lg:col-span-3 space-y-8">
            {/* ... put the rest of your configurator markup (inputs, material, finishes, graphic upload) here,
                 but keep event handlers bound to the updateInput, onChangeLength, onChangeHeight, handleArtworkFileInput, etc. */}
            {/* For brevity I'm omitting repeated markup here — paste the corresponding blocks from your original file */}
          </div>

          {/* right summary (same as original) */}
          <aside id="order-summary" className="lg:col-span-2">
            {/* summary card, gallery and price display */}
            <div className="space-y-6 lg:sticky lg:top-6">
              <div className="card p-4">
                <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img src={activeImage} alt="Banner preview" className="h-full w-full object-cover" loading="eager" />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {GALLERY.map((src) => (
                    <button key={src} onClick={() => setActiveImage(src)} className={`relative overflow-hidden rounded-md border transition ${ activeImage === src ? "border-indigo-500 ring-2 ring-indigo-500/40" : "border-white/10 hover:border-white/30" }`} aria-label="Previzualizare">
                      <img src={src} alt="Thumb" className="h-20 w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-bold border-b border-white/10 pb-4 mb-4">Sumar Comandă</h2>

                <div className="space-y-2 text-white/80 text-sm">
                  <p>Dimensiuni: <span className="text-white font-semibold">{lengthText || "—"} x {heightText || "—"} cm</span></p>
                  <p>Cantitate: <span className="text-white font-semibold">{input.quantity} buc</span></p>
                  <p>Material: <span className="text-white font-semibold">{input.material === "frontlit_510" ? "Frontlit 510g/mp" : "Frontlit 440g/mp"}</span></p>
                  {artworkUrl && (
                    <p className="text-xs">Fișier: <a className="underline text-indigo-300" href={artworkUrl} target="_blank" rel="noreferrer">deschide</a></p>
                  )}
                </div>

                <div className="hidden lg:block">
                  <div className="border-t border-white/10 mt-4 pt-4">
                    <p className="text-white/60 text-sm">Preț total</p>
                    <p className="text-4xl font-extrabold text-white my-2">{(serverPrice ?? priceDetailsLocal.finalPrice).toFixed(2)} RON</p>
                    { (serverPrice ?? pricePerUnitLocal) > 0 && <p className="text-xs text-white/60">{((serverPrice ?? pricePerUnitLocal)).toFixed(2)} RON / buc</p> }
                  </div>

                  <div className="mt-4">
                    <button onClick={calculateServer} disabled={calcLoading} className="btn-secondary mr-2">Calculează server</button>
                    <button onClick={handleAddToCart} disabled={(serverPrice ?? priceDetailsLocal.finalPrice) <= 0} className="btn-primary w-full mt-6 py-3 text-lg">
                      <ShoppingCart size={20} /><span className="ml-2">Adaugă în coș</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="card-muted p-4 text-xs text-white/60">Print durabil. Livrare rapidă. Suport: contact@prynt.ro</div>
            </div>
          </aside>
        </div>
      </div>

      <MobilePriceBar total={(serverPrice ?? priceDetailsLocal.finalPrice)} disabled={(serverPrice ?? priceDetailsLocal.finalPrice) <= 0} onAddToCart={handleAddToCart} onShowSummary={() => document.getElementById("order-summary")?.scrollIntoView({ behavior: "smooth" })} />
    </main>
  );
}