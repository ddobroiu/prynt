"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import { QA } from "@/types";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import SmartNewsletterPopup from "./SmartNewsletterPopup";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
import { 
  calculatePliantePrice, 
  PLIANTE_CONSTANTS, 
  formatMoneyDisplay, 
  type PriceInputPliante,
  type PlianteFoldType,
  type PlianteWeightKey
} from "@/lib/pricing";

const GALLERY = [
  "/products/pliante/1.webp",
  "/products/pliante/2.webp",
  "/products/pliante/3.webp",
  "/products/pliante/4.webp"
] as const;

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
        { question: "Ce înseamnă 'big'?", answer: "'Big' este termenul tehnic pentru linia de îndoire. Un pliant cu 1 big este îndoit o singură dată (de obicei la mijloc)." },
        { question: "Cum aleg tipul de împăturire?", answer: "Alegeți în funcție de cantitatea de informație. Fereastră sau Fluture oferă o deschidere mai spectaculoasă, în timp ce Simplu sau Paralel sunt standard pentru meniuri sau liste de prețuri." },
        { question: "Ce hârtie recomandați?", answer: "115g este economică, ideală pentru volume mari. 170g este standardul de calitate. 250g oferă o rigiditate superioară, similară unui carton subțire." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && <div className="prose max-w-none text-sm"><h3>Pliante Personalizate</h3><p>Pliantele (broșurile îndoite) permit structurarea informației pe mai multe pagini/secțiuni. Sunt esențiale pentru meniuri, prezentări de servicii sau ghiduri turistice.</p></div>}
                {activeTab === 'recenzii' && <Reviews productSlug={productSlug} />}
                {activeTab === 'faq' && <FaqAccordion qa={faqs} />}
            </div>
        </div>
    );
};

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => ( <button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{children}</button> );

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const inc = (d: number) => onChange(Math.max(1, value + d));
  return <div><label className="field-label">{label}</label><div className="flex"><button onClick={() => inc(-10)} className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200" aria-label={`Scade ${label.toLowerCase()}`}><Minus size={16} /></button><input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-center w-full rounded-none border-x-0" min="1" /><button onClick={() => inc(10)} className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200" aria-label={`Creşte ${label.toLowerCase()}`}><Plus size={16} /></button></div></div>;
}

function OptionButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) {
  return <button type="button" onClick={onClick} className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${active ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-white hover:border-gray-400"}`}><div className="font-bold text-gray-800">{title}</div>{subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}</button>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
  return <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>;
}

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string };

/* --- MAIN COMPONENT --- */
export default function PlianteConfigurator({ productSlug, productImage }: Props) {
  const { addItem } = useCart();
  const GALLERY = useMemo(() => productImage ? [productImage, "/products/pliante/pliante-1.webp", "/products/pliante/pliante-2.webp", "/products/pliante/pliante-3.webp"] : ["/products/pliante/pliante-1.webp", "/products/pliante/pliante-2.webp", "/products/pliante/pliante-3.webp", "/products/pliante/pliante-4.webp"], [productImage]);
  const [weight, setWeight] = useState<PlianteWeightKey>("115");
  const [quantity, setQuantity] = useState<number>(50);
  const [fold, setFold] = useState<PlianteFoldType>("simplu");
  const [designOption, setDesignOption] = useState<"upload" | "pro">("upload");
  
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [activeStep, setActiveStep] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const toast = useToast();
  
  const [activeIndex, setActiveIndex] = useState<number>(0);
  type GalleryImage = typeof GALLERY[number];
  const [activeImage, setActiveImage] = useState<GalleryImage>(GALLERY[0]);

  // Pricing
  const priceData = useMemo(() => calculatePliantePrice({ weight, quantity, fold, designOption }), [weight, quantity, fold, designOption]);
  const displayedTotal = priceData.finalPrice;

  const handleArtworkFileInput = async (file: File | null) => {
    setArtworkUrl(null); setUploadError(null);
    if (!file) return;
    try {
      setUploading(true);
      const form = new FormData(); form.append("file", file);
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
      toast.warning("Prețul trebuie calculat."); return;
    }

    addItem({
      id: `${productSlug ?? 'pliante'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      productId: productSlug ?? "pliante",
      slug: productSlug ?? "pliante",
      title: `Pliante ${PLIANTE_CONSTANTS.FOLDS[fold].label}`,
      price: Math.round((displayedTotal / quantity) * 100) / 100,
      quantity,
      currency: "RON",
      metadata: {
        "Tip Împăturire": PLIANTE_CONSTANTS.FOLDS[fold].label,
        "Hârtie": `${weight} g/mp`,
        "Grafică": designOption === 'pro' ? "Vreau grafică" : "Grafică proprie",
        ...(designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(priceData.proFee) }),
        artworkUrl
      },
    });
  }

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 3000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex]);

  const summaryStep1 = `${weight}g, ${quantity} buc.`;
  const summaryStep2 = PLIANTE_CONSTANTS.FOLDS[fold].label;
  const summaryStep3 = designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Pliant" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug || 'pliante'} /></div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3">
                <h1 className="text-3xl font-extrabold text-gray-900">Configurator Pliante</h1>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-500 text-white font-bold text-sm animate-pulse">
                  🔥 -30% REDUCERE
                </span>
              </div>
              <div className="flex justify-between items-center"><p className="text-gray-600">Personalizează în 3 pași simpli.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Hârtie & Tiraj" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="field-label">Grosime Hârtie</label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            <OptionButton active={weight === "115"} onClick={() => setWeight("115")} title="115g" />
                            <OptionButton active={weight === "135"} onClick={() => setWeight("135")} title="135g" />
                            <OptionButton active={weight === "150"} onClick={() => setWeight("150")} title="150g" />
                            <OptionButton active={weight === "170"} onClick={() => setWeight("170")} title="170g" />
                            <OptionButton active={weight === "200"} onClick={() => setWeight("200")} title="200g" />
                            <OptionButton active={weight === "250"} onClick={() => setWeight("250")} title="250g" />
                        </div>
                    </div>
                    <NumberInput label="Cantitate (buc)" value={quantity} onChange={setQuantity} />
                </div>
              </AccordionStep>
              
              <AccordionStep stepNumber={2} title="Tip Împăturire" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(PLIANTE_CONSTANTS.FOLDS) as PlianteFoldType[]).map((k) => (
                        <OptionButton key={k} active={fold === k} onClick={() => setFold(k)} title={PLIANTE_CONSTANTS.FOLDS[k].label} subtitle={`${PLIANTE_CONSTANTS.FOLDS[k].open} -> ${PLIANTE_CONSTANTS.FOLDS[k].closed}`} />
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
                            <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600" /><span className="font-medium text-gray-600">Apasă pentru a încărca</span></span>
                            <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                        </label>
                        {uploading && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                        {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                        {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Grafică încărcată!</p>}
                    </div>
                )}

                {designOption === 'pro' && (
                    <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800 mt-4">
                        <p className="font-semibold">Serviciu de Grafică Profesională</p>
                        <p>Cost: <strong>{formatMoneyDisplay(priceData.proFee)}</strong>. Un designer va realiza macheta pentru toate fețele pliantului.</p>
                    </div>
                )}
              </AccordionStep>
            </div>
            <div className="sticky bottom-0 lg:static bg-white/80 lg:bg-white backdrop-blur-sm lg:backdrop-blur-none border-t-2 lg:border lg:rounded-2xl lg:shadow-lg border-gray-200 py-4 lg:p-6 lg:mt-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3 text-center">
                <p className="text-red-600 font-bold text-sm">🎉 Reducere specială 30% aplicată la toate pliantele!</p>
              </div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-3xl font-extrabold text-gray-900">{formatMoneyDisplay(displayedTotal)}</p>
                <button onClick={handleAddToCart} className="btn-primary w-1/2 py-3 text-base font-bold"><ShoppingCart size={20} /><span className="ml-2">Adaugă în Coș</span></button>
              </div>
              <DeliveryEstimation />
            </div>
          </div>
          <div className="lg:hidden col-span-1"><ProductTabs productSlug={productSlug || 'pliante'} /></div>
        </div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)}><X size={20} className="text-gray-600" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Pliante</h3>
            <div className="prose prose-sm max-w-none">
              <h4>Opțiuni de Împăturire</h4>
              <ul>
                  <li><strong>Simplu (1 big):</strong> Îndoit o dată, 4 fețe (pagini).</li>
                  <li><strong>Fereastră (2 biguri):</strong> Două părți laterale se închid spre centru.</li>
                  <li><strong>Paralel (3 biguri):</strong> Împăturire tip armonică sau C-fold.</li>
                  <li><strong>Fluture (4 biguri):</strong> Împăturire complexă cu deschidere simetrică.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}