"use client";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Info, ChevronDown, X, UploadCloud, Image as ImageIcon, Box, ShoppingCart, Plus, Minus, RefreshCw, AlertTriangle, Link as LinkIcon } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import DynamicBannerPreview from "./DynamicBannerPreview";
import ArtworkRatioPreview from "./ArtworkRatioPreview"; 
import { QA } from "@/types";
import { 
  calculateBannerVersoPrice, 
  BANNER_VERSO_CONSTANTS, 
  formatMoneyDisplay, 
  type PriceInputBannerVerso 
} from "@/lib/pricing";

/* --- UI COMPONENTS --- */
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
        { question: "Ce material este folosit?", answer: "Folosim Blockout 610g, un material special cu inserție neagră la mijloc care previne transparența, ideal pentru print față-verso." },
        { question: "Pot imprima grafică diferită pe fiecare parte?", answer: "Da, puteți alege opțiunea 'Grafică diferită' și încărca fișiere separate. Se aplică o taxă suplimentară." },
        { question: "Finisajele sunt incluse?", answer: "Da, tivul de rezistență și capsele metalice sunt incluse standard în preț." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && (
                    <div className="prose max-w-none text-sm text-gray-600">
                        <h3 className="text-gray-900 text-lg font-bold mb-2">Banner Publicitar Față-Verso (Blockout)</h3>
                        <p className="mb-4">
                            <strong>Maximizați vizibilitatea brandului dumneavoastră din orice unghi.</strong> Bannerele față-verso sunt soluția ideală pentru afișare stradală, pasaje sau spații comerciale unde traficul vine din ambele sensuri.
                        </p>
                        <h4 className="text-gray-900 font-semibold mt-4 mb-2">Tehnologie Blockout & Calitate Premium</h4>
                        <p className="mb-4">
                            Folosim materialul <strong>Blockout 610g</strong>, care conține un strat opac intermediar ce blochează 100% trecerea luminii. Astfel, grafica de pe o față nu va fi niciodată vizibilă pe cealaltă.
                        </p>
                    </div>
                )}
                {activeTab === 'recenzii' && <Reviews productSlug={productSlug} />}
                {activeTab === 'faq' && <FaqAccordion qa={bannerFaqs} />}
            </div>
        </div>
    );
};

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => ( <button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{children}</button> );

function BannerModeSwitchInline() {
  const router = useRouter();
  return (
    <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
      <button type="button" onClick={() => router.push("/banner")} className="px-4 py-1.5 rounded-md text-sm font-semibold transition-all text-gray-600 hover:bg-gray-100">O față</button>
      <button type="button" onClick={() => router.push("/banner-verso")} className="ml-1 px-4 py-1.5 rounded-md text-sm font-semibold transition-all bg-indigo-600 text-white shadow-md">Față-verso</button>
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

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string; renderOnlyConfigurator?: boolean; };

type ViewMode = 'gallery' | 'shape';

export default function BannerVersoConfigurator({ productSlug, initialWidth: initW, initialHeight: initH, productImage, renderOnlyConfigurator = false }: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // --- 1. INITIAL STATE WITH URL PARAMS SUPPORT ---
  const [input, setInput] = useState<PriceInputBannerVerso>(() => {
    const pW = searchParams.get("w");
    const pH = searchParams.get("h");
    const pQ = searchParams.get("q");
    const pWind = searchParams.get("wind");
    const pSame = searchParams.get("same");

    return {
      width_cm: pW ? parseInt(pW) : (initW ?? 0),
      height_cm: pH ? parseInt(pH) : (initH ?? 0),
      quantity: pQ ? parseInt(pQ) : 1,
      want_wind_holes: pWind === "1",
      same_graphic: pSame !== "0", // Default true, doar "0" e false
      designOption: "upload" 
    };
  });
  
  const [lengthText, setLengthText] = useState(input.width_cm ? String(input.width_cm) : "");
  const [heightText, setHeightText] = useState(input.height_cm ? String(input.height_cm) : "");
  
  const galleryImages = useMemo(() => productImage ? [productImage, "/products/banner/verso/1.webp", "/products/banner/verso/2.webp"] : ["/products/banner/verso/1.webp", "/products/banner/verso/2.webp", "/products/banner/verso/3.webp"], [productImage]);
  
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(galleryImages[0]);

  const [artworkUrlFront, setArtworkUrlFront] = useState<string | null>(null);
  const [artworkUrlBack, setArtworkUrlBack] = useState<string | null>(null);
  
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [uploadErrorFront, setUploadErrorFront] = useState<string | null>(null);
  const [uploadErrorBack, setUploadErrorBack] = useState<string | null>(null);
  
  // --- NEW: Rezoluție Warning State ---
  const [lowResWarningFront, setLowResWarningFront] = useState(false);
  const [lowResWarningBack, setLowResWarningBack] = useState(false);

  const [textDesignFront, setTextDesignFront] = useState<string>("");
  const [textDesignBack, setTextDesignBack] = useState<string>("");

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  const priceData = useMemo(() => calculateBannerVersoPrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  const updateInput = <K extends keyof PriceInputBannerVerso>(k: K, v: PriceInputBannerVerso[K]) => setInput((p) => ({ ...p, [k]: v }));
  const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));

  const onChangeLength = (v: string) => { 
      const d = v.replace(/\D/g, ""); 
      setLengthText(d); 
      updateInput("width_cm", d === "" ? 0 : parseInt(d, 10));
      if(d && parseInt(d) > 0) setViewMode('shape');
  };
  const onChangeHeight = (v: string) => { 
      const d = v.replace(/\D/g, ""); 
      setHeightText(d); 
      updateInput("height_cm", d === "" ? 0 : parseInt(d, 10));
      if(d && parseInt(d) > 0) setViewMode('shape');
  };

  // --- 2. URL SYNCHRONIZATION ---
  // Folosim un useEffect debounced pentru a nu spama istoricul browserului
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (input.width_cm > 0) params.set("w", input.width_cm.toString());
      if (input.height_cm > 0) params.set("h", input.height_cm.toString());
      if (input.quantity > 1) params.set("q", input.quantity.toString());
      if (input.want_wind_holes) params.set("wind", "1");
      if (!input.same_graphic) params.set("same", "0");
      
      // Actualizăm URL-ul fără refresh (scroll: false)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [input, pathname, router]);

  // --- 3. RESOLUTION CHECK FUNCTION ---
  const checkResolution = useCallback((file: File, side: 'front' | 'back') => {
    // Setăm warning pe false inițial
    if (side === 'front') setLowResWarningFront(false);
    else setLowResWarningBack(false);

    // Dacă nu avem dimensiuni setate, nu putem verifica
    if (input.width_cm <= 0 || input.height_cm <= 0) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
        const { naturalWidth, naturalHeight } = img;
        
        // Calculăm DPI aproximativ
        // 1 inch = 2.54 cm
        // DPI = pixeli / (cm / 2.54)
        const widthInches = input.width_cm / 2.54;
        const heightInches = input.height_cm / 2.54;

        // Verificăm pe cea mai mică latură (pentru siguranță) sau medie
        const dpiW = naturalWidth / widthInches;
        const dpiH = naturalHeight / heightInches;
        const avgDpi = (dpiW + dpiH) / 2;

        // Prag minim acceptabil (75 DPI e ok pentru outdoor mari, dar ideal e 150)
        // Pentru bannere mari, 72 e standard. Punem warning sub 70.
        if (avgDpi < 70) {
            if (side === 'front') setLowResWarningFront(true);
            else setLowResWarningBack(true);
        }
        URL.revokeObjectURL(objectUrl);
    };
  }, [input.width_cm, input.height_cm]);
  
  const handleArtworkFileInput = async (file: File | null, side: 'front' | 'back') => {
    const setUrl = side === 'front' ? setArtworkUrlFront : setArtworkUrlBack;
    const setUploading = side === 'front' ? setUploadingFront : setUploadingBack;
    const setError = side === 'front' ? setUploadErrorFront : setUploadErrorBack;
    
    setUrl(null); setError(null);
    if (!file) return;
    
    try {
      // 1. Verificare Rezoluție
      checkResolution(file, side);

      // 2. Preview Local
      const previewUrl = URL.createObjectURL(file);
      setUrl(previewUrl);
      
      setViewMode('gallery');
      setPreviewSide(side);

      // 3. Upload
      setUploading(true);
      const form = new FormData(); form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload eșuat");
      const data = await res.json();
      setUrl(data.url);
    } catch (e: any) {
      setError(e?.message ?? "Eroare la upload");
    } finally {
      setUploading(false);
    }
  };

  function handleAddToCart() {
    if (!input.width_cm || !input.height_cm) {
      setErrorToast("Introduceți dimensiunile."); setTimeout(() => setErrorToast(null), 1600); return;
    }
    if (displayedTotal <= 0) {
      setErrorToast("Calcul preț eșuat."); setTimeout(() => setErrorToast(null), 1600); return;
    }

    const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
    const uniqueId = `${productSlug ?? 'banner-verso'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const title = `Banner Față-Verso ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "banner-verso",
      slug: productSlug ?? "banner-verso",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        "Material": "Blockout 610g",
        "Finisaje": `Tiv și capse, ${input.want_wind_holes ? "cu găuri de vânt" : "fără găuri de vânt"}`,
        "Laturi": input.same_graphic ? "Grafică identică" : "Grafică diferită",
        "Grafică": input.designOption === 'pro' ? 'Vreau grafică' : input.designOption === 'text_only' ? 'Doar text' : 'Grafică proprie',
        ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(priceData.proFee) }),
        ...(!input.same_graphic && input.designOption !== 'pro' && { "Taxă grafică diferită": formatMoneyDisplay(priceData.diffFee) }),
        ...(input.designOption === 'text_only' && { "Text Față": textDesignFront }),
        ...(!input.same_graphic && input.designOption === 'text_only' && { "Text Spate": textDesignBack }),
        artworkUrlFront,
        ...(!input.same_graphic && { artworkUrlBack }),
      },
    });
    setToastVisible(true); setTimeout(() => setToastVisible(false), 1600);
  }

  useEffect(() => {
    if(viewMode !== 'gallery' || artworkUrlFront || artworkUrlBack) return;
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % galleryImages.length), 3000);
    return () => clearInterval(id);
  }, [galleryImages.length, viewMode, artworkUrlFront, artworkUrlBack]);

  useEffect(() => setActiveImage(galleryImages[activeIndex]), [activeIndex, galleryImages]);

  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
  const summaryStep2 = `Blockout, ${input.want_wind_holes ? "cu găuri" : "fără găuri"}`;
  const summaryStep3 = input.designOption === 'upload' ? (input.same_graphic ? 'Grafică identică' : 'Grafică diferită') : input.designOption === 'text_only' ? 'Doar text' : 'Design Pro';
  const showSimulation = artworkUrlFront || artworkUrlBack;

  return (
    <main className={renderOnlyConfigurator ? "" : "bg-gray-50 min-h-screen"}>
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">Produs adăugat în coș</div>
      {errorToast && <div className={`toast-error opacity-100 translate-y-0`} aria-live="assertive">{errorToast}</div>}
      
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* STÂNGA - ZONA VIZUALĂ */}
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                
                <div className="flex border-b border-gray-100 overflow-x-auto">
                    <button 
                        onClick={() => setViewMode('gallery')}
                        className={`flex-1 py-3 min-w-[80px] text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === 'gallery' ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <ImageIcon size={16} /> 
                        <span className="hidden sm:inline">Galerie</span>
                    </button>
                    <button 
                        onClick={() => setViewMode('shape')}
                        className={`flex-1 py-3 min-w-[80px] text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === 'shape' ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Ruler size={16} /> 
                        <span className="hidden sm:inline">Schiță Tehnică</span>
                    </button>
                </div>

              <div className="aspect-square relative bg-white">
                 {viewMode === 'gallery' && (
                    <>
                        {showSimulation ? (
                           <div className="h-full w-full relative animate-in fade-in duration-300 group">
                                <ArtworkRatioPreview 
                                    width={input.width_cm} 
                                    height={input.height_cm} 
                                    imageUrl={
                                        input.same_graphic 
                                            ? artworkUrlFront 
                                            : (previewSide === 'front' ? artworkUrlFront : artworkUrlBack)
                                    }
                                    hasGrommets={true} 
                                    hasWindHoles={input.want_wind_holes}
                                />

                                {!input.same_graphic && (
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full shadow-lg p-1 z-20 transition-opacity opacity-90 hover:opacity-100">
                                        <button onClick={(e) => { e.stopPropagation(); setPreviewSide('front'); }} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${previewSide === 'front' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>Față</button>
                                        <button onClick={(e) => { e.stopPropagation(); setPreviewSide('back'); }} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${previewSide === 'back' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>Spate</button>
                                    </div>
                                )}
                           </div>
                        ) : (
                           <img src={activeImage} alt="Banner Verso" className="h-full w-full object-cover animate-in fade-in duration-300" />
                        )}
                    </>
                 )}

                 {viewMode === 'shape' && (
                    <div className="h-full w-full p-4 animate-in fade-in slide-in-from-bottom-4 duration-300 bg-zinc-50">
                        <DynamicBannerPreview 
                            width={input.width_cm} 
                            height={input.height_cm} 
                            hasGrommets={true} 
                            hasWindHoles={input.want_wind_holes}
                            imageUrl={null} 
                        />
                        <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-400">
                             Vizualizare tehnică (cote și finisaje)
                        </div>
                    </div>
                 )}
              </div>

              {viewMode === 'gallery' && (
                <div className="p-2 grid grid-cols-4 gap-2">
                    {galleryImages.map((src, i) => (
                        <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>
                    ))}
                </div>
              )}

            </div>
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug || 'banner-verso'} /></div>
          </div>

          {/* DREAPTA - CONFIGURATOR */}
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Banner Față-Verso</h1><BannerModeSwitchInline /></div>
              <div className="flex justify-between items-center"><p className="text-gray-600">Personalizează opțiunile în 3 pași simpli.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
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
                      <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Grafică</TabButton>
                      <TabButton active={input.designOption === 'text_only'} onClick={() => updateInput("designOption", 'text_only')}>Doar Text</TabButton>
                      <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Grafică</TabButton>
                    </div>
                  </div>
                  
                  <label className="flex items-center gap-3 py-2 cursor-pointer mb-4">
                      <input type="checkbox" className="checkbox" checked={input.same_graphic} onChange={(e) => updateInput("same_graphic", e.target.checked)} />
                      <span className="text-sm font-medium text-gray-700">Grafică identică față-verso</span>
                  </label>

                  {input.designOption === 'upload' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="field-label">Grafică Față</label>
                            <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600" /><span className="font-medium text-gray-600">Apasă pentru a încărca</span></span>
                                <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null, 'front')} />
                            </label>
                            {uploadingFront && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                            {uploadErrorFront && <p className="text-sm text-red-600">{uploadErrorFront}</p>}
                            {/* WARNING REZOLUTIE FATA */}
                            {lowResWarningFront && (
                                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700 flex items-start gap-2">
                                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                    <span>Imaginea pare a avea o rezoluție mică pentru aceste dimensiuni. Printul ar putea ieși pixelat.</span>
                                </div>
                            )}
                            {artworkUrlFront && !uploadErrorFront && !lowResWarningFront && <p className="text-sm text-green-600 font-semibold">Grafică încărcată!</p>}
                        </div>
                        {!input.same_graphic && (
                            <div>
                                <label className="field-label">Grafică Spate</label>
                                <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                                    <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600" /><span className="font-medium text-gray-600">Apasă pentru a încărca</span></span>
                                    <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null, 'back')} />
                                </label>
                                {uploadingBack && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                                {uploadErrorBack && <p className="text-sm text-red-600">{uploadErrorBack}</p>}
                                {/* WARNING REZOLUTIE SPATE */}
                                {lowResWarningBack && (
                                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700 flex items-start gap-2">
                                        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                        <span>Imaginea pare a avea o rezoluție mică pentru aceste dimensiuni.</span>
                                    </div>
                                )}
                                {artworkUrlBack && !uploadErrorBack && !lowResWarningBack && <p className="text-sm text-green-600 font-semibold">Grafică încărcată!</p>}
                            </div>
                        )}
                    </div>
                  )}

                  {input.designOption === 'text_only' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="field-label">Text Față</label><textarea className="input" rows={3} value={textDesignFront} onChange={e => setTextDesignFront(e.target.value)}></textarea></div>
                         {!input.same_graphic && <div><label className="field-label">Text Spate</label><textarea className="input" rows={3} value={textDesignBack} onChange={e => setTextDesignBack(e.target.value)}></textarea></div>}
                    </div>
                  )}

                  {input.designOption === 'pro' && (
                    <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
                      <p className="font-semibold">Serviciu de Grafică Profesională</p>
                      <p>Cost: <strong>{formatMoneyDisplay(priceData.proFee)}</strong>. O echipă de designeri va crea o propunere grafică.</p>
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Produs: Banner Față-Verso</h3>
            <div className="prose prose-sm max-w-none">
              <h4>Materiale & Durabilitate</h4>
              <ul>
                <li><strong>Blockout 610g (Premium):</strong> Material PVC special conceput pentru imprimarea pe ambele părți. Conține un strat intermediar opac (negru) care blochează complet trecerea luminii, asigurând că grafica de pe o parte nu interferează cu cea de pe cealaltă parte. Este foarte rezistent la intemperii și radiații UV.</li>
              </ul>
              <h4>Finisaje Incluse</h4>
              <ul>
                <li><strong>Tiv de Rezistență:</strong> Întăritură perimetrală realizată prin termosudare pentru a preveni ruperea și a asigura o tensionare uniformă.</li>
                <li><strong>Capse Metalice:</strong> Inele metalice inoxidabile aplicate standard la fiecare 30-50 cm (sau la cerere) pentru o prindere sigură.</li>
                <li><strong>Găuri pentru Vânt (Opțional):</strong> Tăieturi speciale care permit trecerea vântului, reducând efectul de velă și prelungind durata de viață a bannerului în zonele expuse.</li>
              </ul>
              <h4>Specificații Grafică</h4>
              <ul>
                <li>Formate acceptate: PDF, AI, CDR, TIFF, JPG.</li>
                <li>Rezoluție recomandată: Minimum 150 dpi la scara 1:1.</li>
                <li>Mod de culoare: CMYK.</li>
                <li>Dacă alegeți "Grafică Diferită", vă rugăm să încărcați două fișiere distincte.</li>
                <li>Vă rugăm să nu includeți semne de tăiere sau bleed.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}