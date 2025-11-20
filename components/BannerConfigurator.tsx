"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, Image as ImageIcon, Box, Eye, Ruler } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import { useRouter } from "next/navigation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import DynamicBannerPreview from "./DynamicBannerPreview"; 
import { 
  calculateBannerPrice, 
  BANNER_CONSTANTS, 
  formatMoneyDisplay, 
  roundMoney,
  type PriceInputBanner 
} from "@/lib/pricing";
import { QA } from "@/types";

/* --- NEW COMPONENT: ARTWORK RATIO PREVIEW --- */
// Aceasta este componenta nouă cerută. 
// Ea afișează strict imaginea într-un container cu aspect ratio corect (L/H).
const ArtworkRatioPreview = ({ width, height, imageUrl }: { width: number; height: number; imageUrl: string | null }) => {
    // Calculăm raportul de aspect. Dacă nu sunt dimensiuni, folosim pătrat (1/1)
    const ratio = (width > 0 && height > 0) ? width / height : 1;
    
    return (
        <div className="w-full h-full flex items-center justify-center bg-zinc-100 p-6 overflow-hidden relative">
            {/* Containerul care ține forma corectă */}
            <div 
                style={{ aspectRatio: ratio }} 
                className="relative shadow-2xl border-4 border-white bg-white max-w-full max-h-full flex items-center justify-center"
            >
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt="Simulare Grafică" 
                        className="w-full h-full object-cover" 
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                         <UploadCloud className="w-10 h-10 text-gray-300 mb-2" />
                         <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Încarcă imagine</span>
                    </div>
                )}
            </div>
            
            {/* Label informativ */}
            <div className="absolute bottom-2 left-0 w-full text-center text-[10px] text-gray-400 uppercase tracking-widest">
                Raport dimensiune: {width || 0}x{height || 0} cm
            </div>
        </div>
    );
};

/* --- SUB-COMPONENTS --- */
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
        { question: "Ce materiale sunt disponibile?", answer: "Oferim Frontlit 440g (Standard) și Frontlit 510g (Premium), ambele fiind materiale PVC durabile, special concepute pentru uz exterior." },
        { question: "Ce finisaje sunt incluse?", answer: "Toate bannerele vin cu tiv de rezistență pe tot perimetrul și capse metalice de prindere, aplicate de obicei la o distanță de 50 cm una de cealaltă." },
        { question: "Cum trimit grafica pentru imprimare?", answer: "Puteți încărca fișierul grafic direct în configurator, în pasul 3. Acceptăm formate precum PDF, AI, CDR, TIFF sau JPG la o rezoluție bună." },
        { question: "Cât durează producția și livrarea?", answer: "Producția durează în mod normal 1-2 zile lucrătoare. Livrarea prin curier rapid mai adaugă încă 1-2 zile, în funcție de localitatea de destinație." },
        { question: "Bannerele sunt rezistente la exterior?", answer: "Da, absolut. Materialele folosite sunt special tratate pentru a rezista la apă, vânt și radiații UV, asigurând o durată de viață îndelungată." },
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
  return (
    <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
      <button type="button" onClick={() => router.push("/banner")} className="px-4 py-1.5 rounded-md text-sm font-semibold transition-all bg-indigo-600 text-white shadow-md">O față</button>
      <button type="button" onClick={() => router.push("/banner-verso")} className="ml-1 px-4 py-1.5 rounded-md text-sm font-semibold transition-all text-gray-600 hover:bg-gray-100">Față-verso</button>
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

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string; renderOnlyConfigurator?: boolean; imageUrl?: string | null };

// Definesc tipurile de view posibile
type ViewMode = 'gallery' | 'shape' | 'simulation';

/* --- MAIN COMPONENT --- */
export default function BannerConfigurator({ productSlug, initialWidth: initW, initialHeight: initH, productImage, renderOnlyConfigurator = false }: Props) {
  const { addItem } = useCart();
  const [input, setInput] = useState<PriceInputBanner>({ width_cm: initW ?? 0, height_cm: initH ?? 0, quantity: 1, material: "frontlit_440", want_wind_holes: false, want_hem_and_grommets: true, designOption: "upload" });
  
  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");
  
  const galleryImages = useMemo(() => productImage ? [productImage, "/products/banner/1.webp", "/products/banner/2.webp", "/products/banner/3.webp"] : ["/products/banner/1.webp", "/products/banner/2.webp", "/products/banner/3.webp", "/products/banner/4.webp"], [productImage]);
  
  // 3 Moduri: Galerie, Schiță (doar forma tehnică), Simulare (Componenta nouă cu poza)
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(galleryImages[0]);
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [textDesign, setTextDesign] = useState<string>("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  const priceData = useMemo(() => calculateBannerPrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  const updateInput = <K extends keyof PriceInputBanner>(k: K, v: PriceInputBanner[K]) => setInput((p) => ({ ...p, [k]: v }));
  const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));
  
  // Auto-switch la 'shape' când se modifică dimensiunile
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
  
  const handleArtworkFileInput = async (file: File | null) => {
    setArtworkUrl(null);
    setUploadError(null);
    if (!file) return;
    try {
      // 1. Previzualizare Locală Imediată
      const previewUrl = URL.createObjectURL(file);
      setArtworkUrl(previewUrl); 
      
      // Comutăm automat pe modul Simulare (Componenta Nouă) când se încarcă o poză
      setViewMode('simulation');

      // 2. Upload în Background (către Cloudinary prin API)
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
    if (displayedTotal <= 0) {
      setErrorToast("Prețul trebuie calculat înainte de a adăuga în coș.");
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }
    const unitPrice = roundMoney(displayedTotal / input.quantity);
    const uniqueId = `${productSlug ?? 'banner'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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
        "Material": input.material === 'frontlit_510' ? "Frontlit 510g (Premium)" : "Frontlit 440g (Standard)",
        "Finisaje": `Tiv și capse, ${input.want_wind_holes ? "cu găuri de vânt" : "fără găuri de vânt"}`,
        "Grafică": input.designOption === 'pro' ? 'Vreau grafică' : input.designOption === 'text_only' ? 'Doar text' : 'Grafică proprie',
        ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(BANNER_CONSTANTS.PRO_DESIGN_FEE) }),
        ...(input.designOption === 'text_only' && { "Text": textDesign }),
        artworkUrl, 
      },
    });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1600);
  }

  useEffect(() => {
    if (viewMode !== 'gallery') return;
    const id = setInterval(() => {
      setActiveIndex((i) => {
        const next = (i + 1) % galleryImages.length;
        setActiveImage(galleryImages[next]);
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, [galleryImages, viewMode]);
  
  const canAdd = displayedTotal > 0 && input.width_cm > 0 && input.height_cm > 0;
  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
  const summaryStep2 = `${input.material === 'frontlit_510' ? "Premium" : "Standard"}, ${input.want_wind_holes ? "cu găuri" : "fără găuri"}`;
  const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : input.designOption === 'text_only' ? 'Doar text' : 'Design Pro';

  return (
    <main className={renderOnlyConfigurator ? "" : "bg-gray-50 min-h-screen"}>
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">
        Produs adăugat în coș
      </div>
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* STÂNGA - ZONA VIZUALĂ */}
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              
              {/* Header Switch: Galerie / Schiță / Simulare */}
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
                  <button 
                      onClick={() => setViewMode('simulation')}
                      className={`flex-1 py-3 min-w-[80px] text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === 'simulation' ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                      <Eye size={16} /> 
                      <span className="hidden sm:inline">Grafica Mea</span>
                  </button>
              </div>

              <div className="aspect-square relative bg-white">
                  {viewMode === 'gallery' && (
                      <img src={activeImage} alt="Banner" className="h-full w-full object-cover animate-in fade-in duration-300" />
                  )}
                  
                  {viewMode === 'shape' && (
                      <div className="h-full w-full p-4 animate-in fade-in slide-in-from-bottom-4 duration-300 bg-zinc-50">
                          {/* AICI E SCHIȚA TEHNICĂ (NU NE ATINGEM DE EA, E SEPARATĂ) */}
                          <DynamicBannerPreview 
                              width={input.width_cm} 
                              height={input.height_cm} 
                              hasGrommets={input.want_hem_and_grommets}
                              hasWindHoles={input.want_wind_holes}
                              imageUrl={null} 
                          />
                          <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-400">
                             Vizualizare tehnică (poziționare capse)
                          </div>
                      </div>
                  )}

                  {viewMode === 'simulation' && (
                      <div className="h-full w-full animate-in fade-in slide-in-from-bottom-4 duration-300 bg-zinc-50 relative">
                          {/* AICI ESTE COMPONENTA NOUĂ - ARTWORK PREVIEW */}
                          <ArtworkRatioPreview 
                              width={input.width_cm} 
                              height={input.height_cm} 
                              imageUrl={artworkUrl}
                          />
                          
                          {!artworkUrl && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px]">
                                <p className="text-sm text-gray-500 font-medium">Încarcă o grafică pentru previzualizare</p>
                                <button onClick={() => setActiveStep(3)} className="mt-2 text-xs text-indigo-600 hover:underline">Mergi la pasul upload</button>
                            </div>
                          )}
                      </div>
                  )}
              </div>
              
              {viewMode === 'gallery' && (
                  <div className="p-2 grid grid-cols-4 gap-2">
                    {galleryImages.map((src, i) => <button key={src} onClick={() => { setActiveImage(src); setActiveIndex(i); }} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
                  </div>
              )}
            </div>
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug || 'banner'} /></div>
          </div>

          {/* DREAPTA - CONFIGURATOR */}
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Banner</h1><BannerModeSwitchInline /></div>
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
                <label className="field-label mb-2">Material</label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <OptionButton active={input.material === "frontlit_440"} onClick={() => updateInput("material", "frontlit_440")} title="Frontlit 440g" subtitle="Standard" />
                    <OptionButton active={input.material === "frontlit_510"} onClick={() => updateInput("material", "frontlit_510")} title="Frontlit 510g" subtitle="Premium" />
                </div>
                <label className="flex items-center gap-3 py-2 cursor-pointer"><input type="checkbox" className="checkbox" checked={input.want_wind_holes} onChange={(e) => updateInput("want_wind_holes", e.target.checked)} /><span className="text-sm font-medium text-gray-700">Adaugă găuri pentru vânt</span></label>
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

                  {/* AICI ESTE INPUT-UL */}
                  {input.designOption === 'upload' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Încarcă fișierul tău (PDF, JPG, TIFF, etc.).</p>
                      <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <span className="flex items-center space-x-2">
                          <UploadCloud className="w-6 h-6 text-gray-600" />
                          <span className="font-medium text-gray-600">Apasă pentru a încărca</span>
                        </span>
                        <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                      </label>
                      {uploading && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                      {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Grafică încărcată cu succes!</p>}
                    </div>
                  )}

                  {input.designOption === 'text_only' && (
                    <div className="space-y-3">
                      <label className="field-label">Introdu textul dorit</label>
                      <textarea className="input" rows={3} value={textDesign} onChange={e => setTextDesign(e.target.value)} placeholder="ex: PROMOTIE, REDUCERI, etc."></textarea>
                    </div>
                  )}

                  {input.designOption === 'pro' && (
                    <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
                      <p className="font-semibold">Serviciu de Grafică Profesională</p>
                      <p>O echipă de designeri va crea o propunere grafică pentru tine. Vei primi pe email o simulare pentru confirmare. Cost: <strong>{formatMoneyDisplay(BANNER_CONSTANTS.PRO_DESIGN_FEE)}</strong>.</p>
                    </div>
                  )}
                </div>
              </AccordionStep>
            </div>
            <div className="sticky bottom-0 lg:static bg-white/80 lg:bg-white backdrop-blur-sm lg:backdrop-blur-none border-t-2 lg:border lg:rounded-2xl lg:shadow-lg border-gray-200 py-4 lg:p-6 lg:mt-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-3xl font-extrabold text-gray-900">{formatMoneyDisplay(displayedTotal)}</p>
                <button onClick={handleAddToCart} disabled={!canAdd} className="btn-primary w-1/2 py-3 text-base font-bold"><ShoppingCart size={20} /><span className="ml-2">Adaugă în Coș</span></button>
              </div>
              <DeliveryEstimation />
            </div>
          </div>
          <div className="lg:hidden col-span-1"><ProductTabs productSlug={productSlug || 'banner'} /></div>
        </div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={20} className="text-gray-600" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Produs: Banner</h3>
            <div className="prose prose-sm max-w-none">
              <h4>Materiale & Durabilitate</h4>
              <ul>
                <li><strong>Frontlit 440g (Standard):</strong> Material PVC flexibil și rezistent, ideal pentru o gamă largă de aplicații outdoor. Imprimare la calitate foto.</li>
                <li><strong>Frontlit 510g (Premium):</strong> O versiune mai groasă și mai durabilă, perfectă pentru utilizare pe termen lung sau în condiții meteo mai aspre.</li>
              </ul>
              <h4>Finisaje Incluse</h4>
              <ul>
                <li><strong>Tiv de Rezistență:</strong> Toate bannerele sunt tivite pe margine pentru a preveni ruperea și a crește durabilitatea.</li>
                <li><strong>Capse Metalice:</strong> Inele metalice aplicate la aproximativ 50 cm distanță, pentru o instalare ușoară și sigură.</li>
                <li><strong>Găuri pentru Vânt (Opțional):</strong> Perforații speciale care permit vântului să treacă, reducând presiunea asupra bannerului și prelungind durata de viață în zonele expuse.</li>
              </ul>
              <h4>Specificații Grafică</h4>
              <ul>
                <li>Formate acceptate: PDF, AI, CDR, TIFF, JPG.</li>
                <li>Rezoluție recomandată: Minimum 150 dpi la scara 1:1.</li>
                <li>Mod de culoare: CMYK.</li>
                <li>Vă rugăm să nu includeți semne de tăiere sau bleed.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}