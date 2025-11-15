"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart, Info, ChevronDown } from "lucide-react";
import DeliveryInfo from "@/components/DeliveryInfo";
import DeliveryEstimation from "./DeliveryEstimation";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import { QA } from "@/types";

/* --- UTILS & TYPES --- */
const roundMoney = (num: number) => Math.round(num * 100) / 100;
const formatMoneyDisplay = (amount: number) => new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(amount);
type PriceInput = { width_cm: number; height_cm: number; quantity: number; material: "frontlit_440" | "frontlit_510"; want_wind_holes: boolean; want_hem_and_grommets: boolean; };
type LocalPriceOutput = { finalPrice: number; total_sqm: number; pricePerSqmAfterSurcharges: number; };
type DesignOption = "upload" | "pro" | "text_only";
type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string; renderOnlyConfigurator?: boolean; };
const PRO_DESIGN_FEE = 50;

/* --- PRICING LOGIC --- */
const localCalculatePrice = (input: PriceInput): LocalPriceOutput => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) return { finalPrice: 0, total_sqm: 0, pricePerSqmAfterSurcharges: 0 };
  const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
  const total_sqm = sqm_per_unit * input.quantity;
  let pricePerSqmBand = 35;
  if (total_sqm < 1) pricePerSqmBand = 100; else if (total_sqm <= 5) pricePerSqmBand = 75; else if (total_sqm <= 20) pricePerSqmBand = 60; else if (total_sqm <= 50) pricePerSqmBand = 45;
  let multiplier = 1;
  if (input.material === "frontlit_510") multiplier *= 1.10;
  if (input.want_hem_and_grommets) multiplier *= 1.10;
  if (input.want_wind_holes) multiplier *= 1.10;
  const pricePerSqmAfterSurcharges = roundMoney(pricePerSqmBand * multiplier);
  const final = roundMoney(total_sqm * pricePerSqmAfterSurcharges);
  return { finalPrice: final, total_sqm: roundMoney(total_sqm), pricePerSqmAfterSurcharges };
};

/* --- SUB-COMPONENTS (WIZARD & TABS) --- */
const AccordionStep = ({ stepNumber, title, summary, isOpen, onClick, children, isLast = false }: { stepNumber: number; title: string; summary: string; isOpen: boolean; onClick: () => void; children: React.ReactNode; isLast?: boolean; }) => (
    <div className="relative pl-12">
        <div className="absolute top-5 left-0 flex flex-col items-center h-full">
            <span className={`flex items-center justify-center w-8 h-8 rounded-full text-md font-bold transition-colors ${isOpen ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{stepNumber}</span>
            {!isLast && <div className="w-px flex-grow bg-gray-200 mt-2"></div>}
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

const ProductTabs = ({ productSlug }: { productSlug: string }) => {
    const [activeTab, setActiveTab] = useState("descriere");
    const bannerFaqs: QA[] = [
        { question: "Ce materiale sunt disponibile?", answer: "Oferim Frontlit 440g (Standard) și Frontlit 510g (Premium)." },
        { question: "Ce finisaje sunt incluse?", answer: "Toate bannerele vin cu tiv de rezistență și capse metalice pentru prindere." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && <div className="prose max-w-none text-sm"><h3>Bannere Publicitare Durabile</h3><p>Fie că dorești să anunți o promoție sau să îți faci brandul cunoscut, bannerele noastre personalizate sunt soluția ideală, imprimate la o calitate excepțională.</p><h4>Structură Preț</h4><ul><li>Sub 1 m²: <strong>100 RON/m²</strong></li><li>1-5 m²: <strong>75 RON/m²</strong></li><li>5-20 m²: <strong>60 RON/m²</strong></li><li>20-50 m²: <strong>45 RON/m²</strong></li><li>Peste 50 m²: <strong>35 RON/m²</strong></li></ul></div>}
                {activeTab === 'recenzii' && <Reviews productSlug={productSlug} />}
                {activeTab === 'faq' && <FaqAccordion qa={bannerFaqs} />}
            </div>
        </div>
    );
};

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => ( <button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{children}</button> );
function BannerModeSwitchInline() {
  const router = useRouter();
  const isDouble = usePathname()?.startsWith("/banner-verso");
  return (
    <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
      <button type="button" onClick={() => !isDouble && router.push("/banner")} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${!isDouble ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>O față</button>
      <button type="button" onClick={() => isDouble && router.push("/banner-verso")} className={`ml-1 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${isDouble ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>Față-verso</button>
    </div>
  );
}
function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const inc = (d: number) => onChange(Math.max(1, value + d));
  return <div><label className="field-label">{label}</label><div className="flex"><button onClick={() => inc(-1)} className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200"><Minus size={16} /></button><input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-center w-full rounded-none border-x-0" /><button onClick={() => inc(1)} className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200"><Plus size={16} /></button></div></div>;
}
function OptionButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) {
  return <button type="button" onClick={onClick} className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${active ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-white hover:border-gray-400"}`}><div className="font-bold text-gray-800">{title}</div>{subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}</button>;
}
function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
  return <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>;
}

/* --- MAIN COMPONENT --- */
export default function BannerConfigurator({ productSlug, initialWidth: initW, initialHeight: initH, productImage, renderOnlyConfigurator = false }: Props) {
  const { addItem } = useCart();
  const [input, setInput] = useState<PriceInput>({ width_cm: initW ?? 0, height_cm: initH ?? 0, quantity: 1, material: "frontlit_440", want_wind_holes: false, want_hem_and_grommets: true });
  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");
  const galleryImages = useMemo(() => productImage ? [productImage, "/products/banner/1.webp", "/products/banner/2.webp", "/products/banner/3.webp"] : ["/products/banner/1.webp", "/products/banner/2.webp", "/products/banner/3.webp", "/products/banner/4.webp"], [productImage]);
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
  const [activeStep, setActiveStep] = useState(1);

  const priceDetailsLocal = useMemo(() => localCalculatePrice(input), [input]);
  const displayedTotal = useMemo(() => { const base = priceDetailsLocal.finalPrice || 0; return designOption === "pro" ? roundMoney(base + PRO_DESIGN_FEE) : base; }, [priceDetailsLocal, designOption]);

  const updateInput = <K extends keyof PriceInput>(k: K, v: PriceInput[K]) => setInput((p) => ({ ...p, [k]: v }));
  const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));
  const onChangeLength = (v: string) => { const d = v.replace(/\D/g, ""); setLengthText(d); updateInput("width_cm", d === "" ? 0 : parseInt(d, 10)); };
  const onChangeHeight = (v: string) => { const d = v.replace(/\D/g, ""); setHeightText(d); updateInput("height_cm", d === "" ? 0 : parseInt(d, 10)); };
  
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
    const totalForOrder = displayedTotal;
    if (!totalForOrder || totalForOrder <= 0) {
      setErrorToast("Prețul trebuie calculat înainte de a adăuga în coș.");
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }
    const unitPrice = roundMoney(totalForOrder / input.quantity);
    const uniqueId = [
      "banner",
      input.material,
      input.width_cm,
      input.height_cm,
      input.want_wind_holes ? "g" : "f",
      designOption,
    ].join("-");
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
  
  const totalShown = displayedTotal;
  const canAdd = totalShown > 0 && input.width_cm > 0 && input.height_cm > 0;
  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
  const summaryStep2 = `${input.material === 'frontlit_510' ? "Premium" : "Standard"}, ${input.want_wind_holes ? "cu găuri" : "fără găuri"}`;
  const summaryStep3 = designOption === 'upload' ? 'Grafică proprie' : designOption === 'text_only' ? 'Doar text' : 'Design Pro';

  return (
    <main className={renderOnlyConfigurator ? "" : "bg-gray-50 min-h-screen"}>
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Banner" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {galleryImages.map((src, i) => <button key={src} onClick={() => { setActiveImage(src); setActiveIndex(i); }} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug || 'banner'} /></div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Banner</h1><BannerModeSwitchInline /></div>
              <p className="text-gray-600">Personalizează opțiunile în 3 pași simpli.</p>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="field-label">Lungime (cm)</label><input type="text" inputMode="numeric" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="200" className="input" /></div>
                  <div><label className="field-label">Înălțime (cm)</label><input type="text" inputMode="numeric" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="100" className="input" /></div>
                  <div className="md:col-span-2"><NumberInput label="Cantitate" value={input.quantity} onChange={setQty} /></div>
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={2} title="Material & Finisaje" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <label className="field-label mb-2">Material</label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <OptionButton active={input.material === "frontlit_440"} onClick={() => updateInput("material", "frontlit_440")} title="Frontlit 440g" subtitle="Standard" />
                    <OptionButton active={input.material === "frontlit_510"} onClick={() => updateInput("material", "frontlit_510")} title="Frontlit 510g" subtitle="Premium" />
                </div>
                <label className="flex items-center gap-3 py-2 cursor-pointer"><input type="checkbox" className="checkbox" checked={input.want_wind_holes} onChange={(e) => updateInput("want_wind_holes", e.target.checked)} /><span className="text-sm font-medium text-gray-700">Adaugă găuri pentru vânt</span></label>
              </AccordionStep>
              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                 {/* ... content for graphics step ... */}
              </AccordionStep>
            </div>
            <div className="sticky bottom-0 lg:static bg-white/80 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none border-t-2 lg:border-t-0 border-gray-200 py-4 lg:py-0 lg:mt-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-3xl font-extrabold text-gray-900">{formatMoneyDisplay(totalShown)}</p>
                <button onClick={handleAddToCart} disabled={!canAdd} className="btn-primary w-1/2 py-3 text-base font-bold"><ShoppingCart size={20} /><span className="ml-2">Adaugă în Coș</span></button>
              </div>
              <DeliveryEstimation />
            </div>
          </div>
          <div className="lg:hidden col-span-1"><ProductTabs productSlug={productSlug || 'banner'} /></div>
        </div>
      </div>
    </main>
  );
}
