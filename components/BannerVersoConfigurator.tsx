"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud } from "lucide-react";
import DeliveryInfo from "@/components/DeliveryInfo";
import DeliveryEstimation from "./DeliveryEstimation";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import { QA } from "@/types";

const roundMoney = (num: number) => Math.round(num * 100) / 100;
const formatMoneyDisplay = (amount: number) => new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(amount);

type PriceInput = {
    width_cm: number;
    height_cm: number;
    quantity: number;
    want_wind_holes: boolean;
};
type LocalPriceOutput = { finalPrice: number; total_sqm: number; pricePerSqmAfterSurcharges: number; };
type DesignOption = "upload" | "pro" | "text_only";
type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string; renderOnlyConfigurator?: boolean; };

const localCalculatePrice = (input: PriceInput): LocalPriceOutput => {
    if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) return { finalPrice: 0, total_sqm: 0, pricePerSqmAfterSurcharges: 0 };
    const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
    const total_sqm = sqm_per_unit * input.quantity;
    let pricePerSqmBand = 55;
    if (total_sqm < 1) pricePerSqmBand = 165;
    else if (total_sqm <= 5) pricePerSqmBand = 120;
    else if (total_sqm <= 20) pricePerSqmBand = 99;
    else if (total_sqm <= 50) pricePerSqmBand = 75;
    let multiplier = 1;
    if (input.want_wind_holes) multiplier *= 1.10;
    const pricePerSqmAfterSurcharges = roundMoney(pricePerSqmBand * multiplier);
    const final = roundMoney(total_sqm * pricePerSqmAfterSurcharges);
    return { finalPrice: final, total_sqm: roundMoney(total_sqm), pricePerSqmAfterSurcharges };
};

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

const ProductTabs = ({ productSlug }: { productSlug: string }) => {
    const [activeTab, setActiveTab] = useState("descriere");
    const bannerFaqs: QA[] = [
        { question: "Ce material este folosit pentru bannerele față-verso?", answer: "Folosim un material special numit blockout, cu o inserție neagră la mijloc. Aceasta previne transperența și asigură că grafica de pe o parte nu este vizibilă pe cealaltă." },
        { question: "Pot imprima grafică diferită pe fiecare parte?", answer: "Da, desigur. Puteți alege opțiunea de grafică diferită în configurator și încărca fișiere separate pentru față și spate." },
        { question: "Finisajele sunt incluse?", answer: "Da, toate bannerele față-verso vin cu tiv de rezistență și capse metalice pentru prindere, la fel ca cele imprimate pe o singură față." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && <div className="prose max-w-none text-sm"><h3>Bannere Față-Verso de Impact</h3><p>Dublați vizibilitatea mesajului dumneavoastră cu bannerele imprimate față-verso. Realizate dintr-un material blockout de 610g, acestea asigură o opacitate perfectă.</p><h4>Structură Preț</h4><ul><li>Sub 1 m²: <strong>165 RON/m²</strong></li><li>1-5 m²: <strong>120 RON/m²</strong></li><li>5-20 m²: <strong>99 RON/m²</strong></li><li>20-50 m²: <strong>75 RON/m²</strong></li><li>Peste 50 m²: <strong>55 RON/m²</strong></li></ul></div>}
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
      <button type-="button" onClick={() => router.push("/banner")} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${!isDouble ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>O față</button>
      <button type="button" onClick={() => router.push("/banner-verso")} className={`ml-1 px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${isDouble ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100"}`}>Față-verso</button>
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

export default function BannerVersoConfigurator({ productSlug, initialWidth: initW, initialHeight: initH, productImage, renderOnlyConfigurator = false }: Props) {
  const { addItem } = useCart();
  const [input, setInput] = useState<PriceInput>({ width_cm: initW ?? 0, height_cm: initH ?? 0, quantity: 1, want_wind_holes: false });
  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");
  const galleryImages = useMemo(() => productImage ? [productImage, "/products/banner/verso/1.webp", "/products/banner/verso/2.webp", "/products/banner/verso/3.webp"] : ["/products/banner/verso/1.webp", "/products/banner/verso/2.webp", "/products/banner/verso/3.webp", "/products/banner/verso/4.webp"], [productImage]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(galleryImages[0]);
  const [designOption, setDesignOption] = useState<DesignOption>("upload");
  const [sameGraphic, setSameGraphic] = useState(true);

  const [artworkUrlFront, setArtworkUrlFront] = useState<string | null>(null);
  const [artworkUrlBack, setArtworkUrlBack] = useState<string | null>(null);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [uploadErrorFront, setUploadErrorFront] = useState<string | null>(null);
  const [uploadErrorBack, setUploadErrorBack] = useState<string | null>(null);
  const [textDesignFront, setTextDesignFront] = useState<string>("");
  const [textDesignBack, setTextDesignBack] = useState<string>("");

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  const priceDetailsLocal = useMemo(() => localCalculatePrice(input), [input]);
  
  const PRO_DESIGN_FEE = sameGraphic ? 50 : 100;
  const DIFFERENT_GRAPHICS_FEE = 100;

  const displayedTotal = useMemo(() => {
    const base = priceDetailsLocal.finalPrice || 0;
    if (designOption === "pro") return roundMoney(base + PRO_DESIGN_FEE);
    if (!sameGraphic) return roundMoney(base + DIFFERENT_GRAPHICS_FEE);
    return base;
  }, [priceDetailsLocal, designOption, sameGraphic, PRO_DESIGN_FEE]);

  const updateInput = <K extends keyof PriceInput>(k: K, v: PriceInput[K]) => setInput((p) => ({ ...p, [k]: v }));
  const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));
  const onChangeLength = (v: string) => { const d = v.replace(/\D/g, ""); setLengthText(d); updateInput("width_cm", d === "" ? 0 : parseInt(d, 10)); };
  const onChangeHeight = (v: string) => { const d = v.replace(/\D/g, ""); setHeightText(d); updateInput("height_cm", d === "" ? 0 : parseInt(d, 10)); };
  
  const handleArtworkFileInput = async (file: File | null, side: 'front' | 'back') => {
    const setArtworkUrl = side === 'front' ? setArtworkUrlFront : setArtworkUrlBack;
    const setUploading = side === 'front' ? setUploadingFront : setUploadingBack;
    const setUploadError = side === 'front' ? setUploadErrorFront : setUploadErrorBack;

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
    const unitPrice = roundMoney(displayedTotal / input.quantity);
    const uniqueId = ["banner-verso", input.width_cm, input.height_cm, designOption, sameGraphic ? 'same' : 'diff'].join("-");
    const title = `Banner Față-Verso - ${input.width_cm}x${input.height_cm} cm`;

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
        artworkUrlFront,
        artworkUrlBack: sameGraphic ? artworkUrlFront : artworkUrlBack,
        designOption,
        textDesignFront,
        textDesignBack: sameGraphic ? textDesignFront : textDesignBack,
        proDesignFee: designOption === "pro" ? PRO_DESIGN_FEE : 0,
        differentGraphicsFee: !sameGraphic ? DIFFERENT_GRAPHICS_FEE : 0,
        totalSqm: priceDetailsLocal.total_sqm,
      },
    });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1600);
  }

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % galleryImages.length);
    }, 3000);
    return () => clearInterval(id);
  }, [galleryImages.length]);
  
  useEffect(() => {
    setActiveImage(galleryImages[activeIndex]);
  }, [activeIndex, galleryImages]);

  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
  const summaryStep2 = `Blockout 610g, ${input.want_wind_holes ? "cu găuri" : "fără găuri"}`;
  const summaryStep3 = designOption === 'upload' ? (sameGraphic ? 'Grafică identică' : 'Grafică diferită') : designOption === 'text_only' ? 'Doar text' : 'Design Pro';

  return (
    <main className={renderOnlyConfigurator ? "" : "bg-gray-50 min-h-screen"}>
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">Produs adăugat în coș</div>
      {errorToast && <div className={`toast-error opacity-100 translate-y-0`} aria-live="assertive">{errorToast}</div>}
      
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Banner" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {galleryImages.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug || 'banner-verso'} /></div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Banner Față-Verso</h1><BannerModeSwitchInline /></div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Personalizează opțiunile în 3 pași simpli.</p>
                <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5">
                  <Info size={16} />
                  <span className="ml-2">Detalii</span>
                </button>
              </div>
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
                <OptionButton active={true} onClick={() => {}} title="Blockout 610g" subtitle="Material special pentru print față-verso" />
                <label className="flex items-center gap-3 py-2 cursor-pointer mt-4"><input type="checkbox" className="checkbox" checked={input.want_wind_holes} onChange={(e) => updateInput("want_wind_holes", e.target.checked)} /><span className="text-sm font-medium text-gray-700">Adaugă găuri pentru vânt</span></label>
              </AccordionStep>
              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                <div>
                  <div className="mb-4 border-b border-gray-200">
                    <div className="flex -mb-px">
                      <TabButton active={designOption === 'upload'} onClick={() => setDesignOption('upload')}>Am Grafică</TabButton>
                      <TabButton active={designOption === 'text_only'} onClick={() => setDesignOption('text_only')}>Doar Text</TabButton>
                      <TabButton active={designOption === 'pro'} onClick={() => setDesignOption('pro')}>Vreau Grafică</TabButton>
                    </div>
                  </div>
                  
                  <label className="flex items-center gap-3 py-2 cursor-pointer mb-4">
                      <input type="checkbox" className="checkbox" checked={sameGraphic} onChange={(e) => setSameGraphic(e.target.checked)} />
                      <span className="text-sm font-medium text-gray-700">Grafică identică față-verso</span>
                  </label>

                  {designOption === 'upload' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="field-label">Grafică Față</label>
                            <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                <span className="flex items-center space-x-2">
                                <UploadCloud className="w-6 h-6 text-gray-600" />
                                <span className="font-medium text-gray-600">Apasă pentru a încărca</span>
                                </span>
                                <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null, 'front')} />
                            </label>
                            {uploadingFront && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                            {uploadErrorFront && <p className="text-sm text-red-600">{uploadErrorFront}</p>}
                            {artworkUrlFront && !uploadErrorFront && <p className="text-sm text-green-600 font-semibold">Grafică încărcată!</p>}
                        </div>
                        {!sameGraphic && (
                            <div>
                                <label className="field-label">Grafică Spate</label>
                                <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                    <span className="flex items-center space-x-2">
                                    <UploadCloud className="w-6 h-6 text-gray-600" />
                                    <span className="font-medium text-gray-600">Apasă pentru a încărca</span>
                                    </span>
                                    <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null, 'back')} />
                                </label>
                                {uploadingBack && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                                {uploadErrorBack && <p className="text-sm text-red-600">{uploadErrorBack}</p>}
                                {artworkUrlBack && !uploadErrorBack && <p className="text-sm text-green-600 font-semibold">Grafică încărcată!</p>}
                            </div>
                        )}
                    </div>
                  )}

                  {designOption === 'text_only' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="field-label">Text Față</label>
                            <textarea className="input" rows={3} value={textDesignFront} onChange={e => setTextDesignFront(e.target.value)}></textarea>
                        </div>
                         {!sameGraphic && (
                            <div>
                               <label className="field-label">Text Spate</label>
                               <textarea className="input" rows={3} value={textDesignBack} onChange={e => setTextDesignBack(e.target.value)}></textarea>
                            </div>
                        )}
                    </div>
                  )}

                  {designOption === 'pro' && (
                    <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
                      <p className="font-semibold">Serviciu de Grafică Profesională</p>
                      <p>Cost: <strong>{formatMoneyDisplay(PRO_DESIGN_FEE)}</strong>. O echipă de designeri va crea o propunere grafică.</p>
                      {!sameGraphic && <p className="mt-1">Costul acoperă design pentru ambele fețe.</p>}
                    </div>
                  )}
                </div>
              </AccordionStep>
            </div>
            <div className="sticky bottom-0 lg:static bg-white/80 lg:bg-white backdrop-blur-sm lg:backdrop-blur-none border-t-2 lg:border lg:rounded-2xl lg:shadow-lg border-gray-200 py-4 lg:p-6 lg:mt-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-3xl font-extrabold text-gray-900">{formatMoneyDisplay(displayedTotal)}</p>
                <button onClick={handleAddToCart} className="btn-primary w-1/2 py-3 text-base font-bold"><ShoppingCart size={20} /><span className="ml-2">Adaugă în Coș</span></button>
              </div>
              <DeliveryEstimation />
            </div>
          </div>
          <div className="lg:hidden col-span-1"><ProductTabs productSlug={productSlug || 'banner-verso'} /></div>
        </div>
      </div>
      
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={20} className="text-gray-600" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Banner Față-Verso</h3>
            <div className="prose prose-sm max-w-none">
                <h4>Material Blockout 610g</h4>
                <p>Utilizăm un material PVC special, complet opac, cu o inserție neagră care blochează lumina. Acest lucru garantează că grafica de pe o parte nu va fi vizibilă pe cealaltă, indiferent de condițiile de iluminare.</p>
                <h4>Finisaje Standard</h4>
                <ul>
                    <li><strong>Tiv de Rezistență:</strong> Marginile sunt îndoite și sudate pentru o durabilitate sporită.</li>
                    <li><strong>Capse Metalice:</strong> Inele de prindere din metal, aplicate la o distanță de 50 cm.</li>
                </ul>
                 <h4>Grafică Față-Verso</h4>
                <ul>
                    <li><strong>Grafică Identică:</strong> Puteți folosi același design pentru ambele părți.</li>
                    <li><strong>Grafică Diferită:</strong> Puteți încărca fișiere separate pentru față și spate. Se aplică o taxă suplimentară pentru procesarea a două grafice distincte.</li>
                </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}