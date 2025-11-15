"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart, Info, X } from "lucide-react";
import MobilePriceBar from "./MobilePriceBar";
import DeliveryInfo from "@/components/DeliveryInfo";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

/* GALLERY (exemplu) */
const GALLERY = [
  "/products/banner/1.webp",
  "/products/banner/2.webp",
  "/products/banner/3.webp",
  "/products/banner/4.webp",
] as const;

/* FUNCTII UTILE */
function roundMoney(num: number) {
  return Math.round(num * 100) / 100;
}

function formatMoneyDisplay(amount: number) {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatAreaDisplay(area: number) {
  return new Intl.NumberFormat("ro-RO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(area);
}

/* CALCULARE PRETURI (exemplu) */
type PriceInput = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: "frontlit_440" | "frontlit_510";
  want_wind_holes: boolean;
  want_hem_and_grommets: boolean;
};

type LocalPriceOutput = {
  finalPrice: number;
  total_sqm: number;
  pricePerSqmAfterSurcharges: number;
};

const PRO_DESIGN_FEE = 50; // Exemplu de taxă pentru design profesional

const localCalculatePrice = (input: PriceInput): LocalPriceOutput => {
  const basePrice = 100; // Preț de bază pentru calcul
  const sqm = (input.width_cm * input.height_cm) / 10000; // Conversie la metri pătrați
  const materialCost = input.material === "frontlit_510" ? 10 : 0; // Cost suplimentar pentru materialul premium
  const windHoleCost = input.want_wind_holes ? 10 : 0;
  const hemAndGrommetsCost = input.want_hem_and_grommets ? 5 : 0;
  const totalPrice = basePrice + materialCost + windHoleCost + hemAndGrommetsCost;
  return {
    finalPrice: totalPrice * sqm,
    total_sqm: sqm,
    pricePerSqmAfterSurcharges: totalPrice,
  };
};

/* NOU: Componentă pentru un pas de configurare */
const ConfigStep = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
    <div className="p-5 border-b border-gray-200 flex items-center gap-4">
      <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 rounded-full">
        <Icon className="w-6 h-6 text-indigo-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

export default function BannerConfigurator({
  productSlug,
  initialWidth: initW,
  initialHeight: initH,
  productImage,
  renderOnlyConfigurator = false,
}: Props) {
  const { addItem } = useCart();

  const [input, setInput] = useState<PriceInput>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    material: "frontlit_440",
    want_wind_holes: false,
    want_hem_and_grommets: true,
  });

  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");
  const galleryImages = productImage
    ? [productImage, "/products/banner/1.webp", "/products/banner/2.webp", "/products/banner/3.webp"]
    : ["/products/banner/1.webp", "/products/banner/2.webp", "/products/banner/3.webp"];
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(galleryImages[0]);
  const [designOption, setDesignOption] = useState<DesignOption>("upload");
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [artworkLink, setArtworkLink] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [textDesign, setTextDesign] = useState<string>("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const priceDetailsLocal = useMemo(() => localCalculatePrice(input), [input]);
  const displayedTotal = useMemo(() => {
    const base = priceDetailsLocal.finalPrice || 0;
    return designOption === "pro" ? roundMoney(base + PRO_DESIGN_FEE) : base;
  }, [priceDetailsLocal, designOption]);

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

  function handleAddToCart() {
    if (!input.width_cm || !input.height_cm) {
      setErrorToast("Te rugăm să completezi lungimea și înălțimea.");
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }
    const totalForOrder = serverPrice ?? displayedTotal;
    if (!totalForOrder || totalForOrder <= 0) {
      setErrorToast("Prețul trebuie calculat înainte de a adăuga în coș.");
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }
    const unitPrice = roundMoney(totalForOrder / input.quantity);
    const uniqueId = ["banner", input.material, input.width_cm, input.height_cm, input.want_wind_holes ? "g" : "f", designOption].join("-");
    const title = `Banner personalizat - ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "banner-generic",
      slug: productSlug ?? "generic-banner",
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
        textDesign,
        proDesignFee: designOption === "pro" ? PRO_DESIGN_FEE : 0,
        totalSqm: priceDetailsLocal.total_sqm,
        pricePerSqm: priceDetailsLocal.pricePerSqmAfterSurcharges,
      },
    });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1600);
  }

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => {
        const next = (i + 1) % galleryImages.length;
        setActiveImage(galleryImages[next]);
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, [galleryImages]);

  const totalShown = serverPrice ?? displayedTotal;
  const canAdd = totalShown > 0 && input.width_cm > 0 && input.height_cm > 0;

  const gridContent = (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Coloana Dreapta: Sumar & Galerie - Prima in DOM pentru mobil */}
          <aside className="lg:col-span-2 order-1 lg:order-2">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="aspect-square">
                  <img src={activeImage} alt="Banner preview" className="h-full w-full object-cover transition-all duration-300" />
                </div>
                <div className="p-2 grid grid-cols-4 gap-2">
                  {galleryImages.map((src, i) => (
                    <button
                      key={src}
                      onClick={() => { setActiveImage(src); setActiveIndex(i); }}
                      className={`relative overflow-hidden rounded-lg transition aspect-square ${
                        activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"
                      }`}
                    >
                      <img src={src} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
                <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-3 mb-4">Sumar Comandă</h2>
                <div className="space-y-3 text-gray-600">
                   <p className="flex justify-between">Suprafață totală: <span className="font-semibold text-gray-800">{formatAreaDisplay(priceDetailsLocal.total_sqm)} m²</span></p>
                   <div className="border-t border-gray-200 pt-4 mt-4">
                     <p className="flex justify-between items-center text-3xl font-extrabold text-gray-900">
                       <span>Total:</span>
                       <span>{formatMoneyDisplay(totalShown)}</span>
                     </p>
                   </div>
                </div>
                <DeliveryInfo className="mt-4" />
                <div className="mt-6">
                  <button onClick={handleAddToCart} disabled={!canAdd} className="btn-primary w-full py-3 text-base font-bold">
                    <ShoppingCart size={20} /><span className="ml-2">Adaugă în Coș</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>
          
          {/* Coloana Stânga: Header & Pași de configurare */}
          <div className="lg:col-span-3 space-y-6 order-2 lg:order-1">
            <header>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Configurator Banner</h1>
                  <BannerModeSwitchInline />
              </div>
              <div className="flex items-center justify-between bg-white/50 p-3 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">Personalizează opțiunile de mai jos.</p>
                <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline text-sm">
                    <Info size={16} />
                    <span className="ml-2 hidden sm:inline">Detalii</span>
                </button>
              </div>
            </header>

            <ConfigStep icon={Ruler} title="1. Dimensiuni & Cantitate">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="field-label">Lungime (cm)</label>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="ex: 200" className="input text-lg font-semibold" />
                </div>
                <div>
                  <label className="field-label">Înălțime (cm)</label>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="ex: 100" className="input text-lg font-semibold" />
                </div>
                <NumberInput label="Cantitate" value={input.quantity} onChange={setQty} />
              </div>
            </ConfigStep>

            <ConfigStep icon={Layers} title="2. Material & Finisaje">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-gray-700">Material</h3>
                  <div className="space-y-2">
                    <RadioCard
                      checked={input.material === "frontlit_440"}
                      onSelect={() => updateInput("material", "frontlit_440")}
                      title="Frontlit 440g"
                      subtitle="Standard, uz general"
                    />
                    <RadioCard
                      checked={input.material === "frontlit_510"}
                      onSelect={() => updateInput("material", "frontlit_510")}
                      title="Frontlit 510g"
                      subtitle="Premium (+10%)"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-gray-700">Finisaje</h3>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-700 bg-gray-100 p-3 rounded-lg border border-gray-200 font-medium">Tiv & capse — incluse</div>
                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer border border-transparent">
                      <input type="checkbox" className="checkbox" checked={input.want_wind_holes} onChange={(e) => updateInput("want_wind_holes", e.target.checked)} />
                      <span className="text-sm font-medium text-gray-700">Găuri pentru vânt (+10%)</span>
                    </label>
                  </div>
                </div>
              </div>
            </ConfigStep>

            <ConfigStep icon={CheckCircle} title="3. Grafică">
              <div className="space-y-4">
                <RadioCard
                  checked={designOption === "upload"}
                  onSelect={() => setDesignOption("upload")}
                  title="Am grafică"
                  subtitle="Încarcă fișierul sau trimite un link."
                />
                 {designOption === "upload" && (
                  <div className="p-4 bg-gray-100 rounded-lg space-y-4 border border-gray-200">
                    <div>
                      <label className="field-label">Încarcă fișier</label>
                      <input
                        type="file"
                        accept=".pdf,.ai,.psd,.jpg,.jpeg,.png"
                        onChange={(e) => handleArtworkFileInput(e.target.files?.[0] || null)}
                        className="input-file"
                      />
                    </div>
                    <div>
                      <label className="field-label">Sau adaugă un link de descărcare</label>
                      <input
                        type="url"
                        value={artworkLink}
                        onChange={(e) => setArtworkLink(e.target.value)}
                        placeholder="https://..."
                        className="input"
                      />
                    </div>
                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                      Nu ai grafica la îndemână? Poți plasa comanda și o poți încărca mai târziu din{" "}
                      <Link href="/account" className="font-semibold text-indigo-600 hover:underline">
                        contul tău
                      </Link>.
                    </div>
                    {uploading && <p className="text-sm font-medium text-indigo-600">Se încarcă...</p>}
                    {artworkUrl && <p className="text-sm font-medium text-green-600">Fișier încărcat cu succes.</p>}
                    {uploadError && <p className="text-sm font-medium text-red-600">{uploadError}</p>}
                  </div>
                )}
                
                <RadioCard
                  checked={designOption === "text_only"}
                  onSelect={() => setDesignOption("text_only")}
                  title="Vreau doar text"
                  subtitle="Scrie textul și noi îl aranjăm gratuit."
                />
                {designOption === "text_only" && (
                     <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                        <textarea value={textDesign} onChange={(e) => setTextDesign(e.target.value)} rows={3} placeholder="ex: REDUCERI -50%" className="input w-full" />
                    </div>
                )}

                <RadioCard
                  checked={designOption === "pro"}
                  onSelect={() => setDesignOption("pro")}
                  title="Am nevoie de grafică profesională"
                  subtitle={`Un designer te va ajuta (+${PRO_DESIGN_FEE} RON).`}
                />
              </div>
            </ConfigStep>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <main className={renderOnlyConfigurator ? "" : "bg-gray-50 min-h-screen"}>
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">
        Produs adăugat în coș
      </div>
      {errorToast && (
        <div className={`toast-error ${errorToast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="assertive">{errorToast}</div>
      )}

      {gridContent}

      <MobilePriceBar total={totalShown} disabled={!canAdd} onAddToCart={handleAddToCart} onShowSummary={() => document.getElementById("order-summary")?.scrollIntoView({ behavior: "smooth" })} />
    </main>
  );
}

/* Inline ModeSwitch - reintegrat */
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
    <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={goSingle}
        className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
          !isDouble ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
        }`}
        aria-pressed={!isDouble}
      >
        O față
      </button>
      <button
        type="button"
        onClick={goDouble}
        className={`ml-1 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
          isDouble ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"
        }`}
        aria-pressed={isDouble}
      >
        Față-verso
      </button>
    </div>
  );
}

/* UI Helpers modernizați */

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const inc = (d: number) => onChange(Math.max(1, value + d));
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="flex">
        <button onClick={() => inc(-1)} className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200 transition-colors" aria-label="Decrement">
          <Minus size={16} className="text-gray-600" />
        </button>
        <input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-lg font-semibold text-center w-full rounded-none border-x-0 [appearance:textfield]" />
        <button onClick={() => inc(1)} className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200 transition-colors" aria-label="Increment">
          <Plus size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}

function RadioCard({ checked, onSelect, title, subtitle }: { checked: boolean; onSelect: () => void; title: string; subtitle?: string }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
        checked ? "border-indigo-600 bg-indigo-50 shadow-sm" : "border-gray-300 bg-white hover:border-gray-400"
      }`}
    >
      <div className="font-bold text-gray-800">{title}</div>
      {subtitle && <div className="text-sm text-gray-600 mt-1">{subtitle}</div>}
    </button>
  );
}

type DesignOption = "upload" | "pro" | "text_only";

type Props = {
  productSlug?: string;
  initialWidth?: number;
  initialHeight?: number;
  productImage?: string;
  renderOnlyConfigurator?: boolean;
};
