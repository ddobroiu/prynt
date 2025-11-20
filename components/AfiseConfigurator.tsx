"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import { QA } from "@/types";
import { 
    calculatePosterPrice, 
    AFISE_CONSTANTS, 
    formatMoneyDisplay, 
    type PriceInputAfise 
} from "@/lib/pricing";

const GALLERY = ["/products/afise/1.webp", "/products/afise/2.webp", "/products/afise/3.webp", "/products/afise/4.webp"] as const;

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
    const faqs: QA[] = [
        { question: "Ce tipuri de hârtie pot alege?", answer: "Oferim o varietate de hârtii, de la cele subțiri (150g) pentru volume mari, la cartoane de 300g pentru un aspect premium. De asemenea, avem materiale speciale precum Blueback pentru lipire pe panouri sau hârtie foto." },
        { question: "Care este diferența dintre Blueback și Whiteback?", answer: "Hârtia Blueback are spatele albastru și este opacă, fiind ideală pentru lipirea peste alte afișe. Whiteback are spatele alb și este folosită pentru postere de interior." },
        { question: "Ce înseamnă preț în funcție de tiraj?", answer: "Prețul pe bucată scade pe măsură ce comandați o cantitate mai mare. Puteți vedea exact prețul unitar calculat în sumarul comenzii." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && <div className="prose max-w-none text-sm"><h3>Afișe și Postere Personalizate</h3><p>Promovează-ți evenimentele sau ofertele cu afișe de înaltă calitate, imprimate pe o gamă variată de materiale. Alege dimensiunea și hârtia potrivită pentru mesajul tău.</p></div>}
                {activeTab === 'recenzii' && <Reviews productSlug={productSlug} />}
                {activeTab === 'faq' && <FaqAccordion qa={faqs} />}
            </div>
        </div>
    );
};

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => ( <button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{children}</button> );

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const inc = (d: number) => onChange(Math.max(1, value + d));
  return <div><label className="field-label">{label}</label><div className="flex"><button onClick={() => inc(-1)} className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200"><Minus size={16} /></button><input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-center w-full rounded-none border-x-0" /><button onClick={() => inc(1)} className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200"><Plus size={16} /></button></div></div>;
}

function OptionButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) {
  return <button type="button" onClick={onClick} className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${active ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-white hover:border-gray-400"}`}><div className="font-bold text-gray-800">{title}</div>{subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}</button>;
}

export default function AfiseConfigurator({ productSlug, initialWidth, initialHeight }: { productSlug?: string; initialWidth?: number; initialHeight?: number }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<string>("A2");
  const [material, setMaterial] = useState<string>("whiteback_150_material");
  const [quantity, setQuantity] = useState<number>(50);
  // Setează dimensiuni inițiale dacă sunt furnizate
  useEffect(() => {
    if (initialWidth) {
      // Poți folosi initialWidth pentru logica custom (ex: setare dimensiune)
      // Exemplu: setSize('custom') sau altă logică specifică
    }
    if (initialHeight) {
      // Similar pentru initialHeight
    }
  }, [initialWidth, initialHeight]);
  const [designOption, setDesignOption] = useState<"upload" | "pro">("upload");
  
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  // Helper: Check validity of material for current size
  function isMaterialVisibleForSize(mKey: string, sKey: string) {
     // Materialele de hârtie standard sunt disponibile pe toate formatele
     if (mKey.startsWith("paper_")) return true;
     
     // Pentru materiale speciale (blueback, satin etc), verificăm în tabela de prețuri
     const matTable = AFISE_CONSTANTS.PRICE_TABLE[mKey];
     return !!(matTable && matTable[sKey]);
  }

  // Reset material if not available for new size
  useEffect(() => {
    if (!isMaterialVisibleForSize(material, size)) {
        setMaterial("paper_150_lucioasa");
    }
  }, [size, material]);

  // Pricing Calculation
  const priceData = useMemo(() => calculatePosterPrice({ size, material, quantity, designOption }), [size, material, quantity, designOption]);
  const displayedTotal = priceData.finalPrice;

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
      setUploadError(e?.message ?? "Eroare la upload");
    } finally {
      setUploading(false);
    }
  };

  function handleAddToCart() {
    if (displayedTotal <= 0) {
      setErrorToast("Combinație invalidă.");
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }
    
    const selectedMaterialLabel = AFISE_CONSTANTS.MATERIALS.find(m => m.key === material)?.label || material;
    const selectedSizeLabel = AFISE_CONSTANTS.SIZES.find(s => s.key === size)?.label || size;

    addItem({
      id: `${productSlug ?? 'afise'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      productId: productSlug ?? "afise",
      slug: productSlug ?? "afise",
      title: `Afiș ${selectedSizeLabel} - ${selectedMaterialLabel}`,
      price: Math.round((displayedTotal / quantity) * 100) / 100,
      quantity,
      metadata: {
        "Dimensiune": selectedSizeLabel,
        "Material": selectedMaterialLabel,
        "Tiraj": `${quantity} buc`,
        "Grafică": designOption === 'pro' ? "Vreau grafică" : "Grafică proprie",
        ...(designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(priceData.proFee) }),
        artworkUrl,
      },
    });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1600);
  }

  const summaryStep1 = `${AFISE_CONSTANTS.SIZES.find(s => s.key === size)?.label}, ${quantity} buc.`;
  const summaryStep2 = AFISE_CONSTANTS.MATERIALS.find(m => m.key === material)?.label || "Selectat";
  const summaryStep3 = designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % GALLERY.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setActiveImage(GALLERY[activeIndex]);
  }, [activeIndex]);
  
  return (
    <main className="bg-gray-50 min-h-screen">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">Produs adăugat în coș</div>
      {errorToast && <div className={`toast-error opacity-100 translate-y-0`} aria-live="assertive">{errorToast}</div>}
      
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Afiș" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug || 'afise'} /></div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Afișe</h1></div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Personalizează opțiunile în 3 pași simpli.</p>
                <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5">
                  <Info size={16} /><span className="ml-2">Detalii</span>
                </button>
              </div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiune & Tiraj" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="field-label">Dimensiune</label>
                        <select value={size} onChange={(e) => setSize(e.target.value)} className="input w-full mt-2">
                            {AFISE_CONSTANTS.SIZES.map(s => <option key={s.key} value={s.key}>{s.label} — {s.dims}</option>)}
                        </select>
                    </div>
                    <NumberInput label="Tiraj (buc)" value={quantity} onChange={setQuantity} />
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={2} title="Material" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="grid grid-cols-2 gap-2">
                    {AFISE_CONSTANTS.MATERIALS.filter(m => isMaterialVisibleForSize(m.key, size)).map(m => (
                        <OptionButton key={m.key} active={material === m.key} onClick={() => setMaterial(m.key)} title={m.label} subtitle={m.description} />
                    ))}
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <OptionButton active={designOption === "upload"} onClick={() => setDesignOption("upload")} title="Am Grafică" subtitle="Încarc fișierul" />
                    <OptionButton active={designOption === "pro"} onClick={() => setDesignOption("pro")} title="Vreau Grafică" subtitle={`Cost: ${formatMoneyDisplay(priceData.proFee)}`} />
                 </div>
                 {designOption === 'upload' && (
                    <div className="mt-4">
                      <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <span className="flex items-center space-x-2">
                          <UploadCloud className="w-6 h-6 text-gray-600" /><span className="font-medium text-gray-600">Apasă pentru a încărca</span>
                        </span>
                        <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                      </label>
                      {uploading && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                      {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Grafică încărcată!</p>}
                    </div>
                  )}
                  {designOption === 'pro' && (
                    <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
                      <p className="font-semibold">Serviciu de Grafică Profesională</p>
                      <p>Cost: <strong>{formatMoneyDisplay(priceData.proFee)}</strong>. Veți fi contactat pentru detalii.</p>
                    </div>
                  )}
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
          <div className="lg:hidden col-span-1"><ProductTabs productSlug={productSlug || 'afise'} /></div>
        </div>
      </div>
      
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)} aria-label="Închide"><X size={20} className="text-gray-600" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Afișe</h3>
            <div className="prose prose-sm max-w-none">
                <h4>Materiale Disponibile</h4>
                <p>Alegeți dintr-o gamă variată de hârtii și cartoane, de la cele standard de 150g, la materiale premium precum hârtia foto de 220g sau cartonul de 300g. Pentru aplicații outdoor sau pe panouri, recomandăm hârtia Blueback.</p>
                <h4>Specificații Tehnice</h4>
                <p>Afișele sunt imprimate color (policromie) la o calitate superioară. Pentru o acuratețe maximă a culorilor, vă rugăm să trimiteți grafica în format CMYK. Rezoluția recomandată este de 300 dpi.</p>
                 <h4>Serviciu de Grafică</h4>
                <p>Dacă nu aveți un design pregătit, echipa noastră vă stă la dispoziție pentru a crea o machetă profesională. Costul pentru acest serviciu este fix.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}