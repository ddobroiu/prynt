"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Ruler, Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, TrendingUp, Percent, MessageCircle } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import SmartNewsletterPopup from "./SmartNewsletterPopup";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
import { QA } from "@/types";
import {
  calculateFlyerPrice,
  getFlyerUpsell,
  FLYER_CONSTANTS,
  formatMoneyDisplay,
  type PriceInputFlyer,
} from "@/lib/pricing";

const GALLERY = [
  "/products/flayere/flayere-1.webp",
  "/products/flayere/flayere-2.webp",
  "/products/flayere/flayere-3.webp",
] as const;

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

const productFaqs: QA[] = [
  { question: "Ce dimensiuni sunt disponibile?", answer: "Standard: A6, A5 și variante personalizate (21×10)." },
  { question: "Pot alege față/dos?", answer: "Da — selectați două fețe pentru imprimare față-verso." },
  { question: "Care este timpul de livrare?", answer: "Depinde de tiraj; estimarea apare înainte de a adăuga în coș." },
];

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (<button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{children}</button>);

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const inc = (d: number) => onChange(Math.max(1, value + d));
  return <div><label className="field-label">{label}</label><div className="flex"><button onClick={() => inc(-10)} className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200" aria-label={`Scade ${label.toLowerCase()}`}><Minus size={16} /></button><input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-center w-full rounded-none border-x-0" min="1" /><button onClick={() => inc(10)} className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200" aria-label={`Creşte ${label.toLowerCase()}`}><Plus size={16} /></button></div></div>;
}

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string };

export default function FlyerConfigurator({ productSlug, productImage }: Props) {
  const { addItem } = useCart();
  const GALLERY = useMemo(() => productImage ? [productImage, "/products/flayere/flayere-1.webp", "/products/flayere/flayere-2.webp", "/products/flayere/flayere-3.webp"] : ["/products/flayere/flayere-1.webp", "/products/flayere/flayere-2.webp", "/products/flayere/flayere-3.webp", "/products/flayere/flayere-4.webp"], [productImage]);
  const [sizeKey, setSizeKey] = useState(FLYER_CONSTANTS.SIZES[0].key);
  const [quantity, setQuantity] = useState<number>(100);
  const [twoSided, setTwoSided] = useState<boolean>(false);
  const [paperWeightKey, setPaperWeightKey] = useState(FLYER_CONSTANTS.PAPER_WEIGHTS[0].key);
  const [designOption, setDesignOption] = useState<"upload" | "pro">("upload");

  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  type GalleryImage = typeof GALLERY[number];
  const [activeImage, setActiveImage] = useState<GalleryImage>(GALLERY[0]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeProductTab, setActiveProductTab] = useState<'descriere' | 'recenzii' | 'faq'>('descriere');
  const toast = useToast();
  const [userEmail, setUserEmail] = useState<string>('');
  
  // Starea pentru gestionarea pașilor (fixul principal)
  const [activeStep, setActiveStep] = useState(1);

  const priceData = useMemo(() => calculateFlyerPrice({ sizeKey, quantity, twoSided, paperWeightKey, designOption } as PriceInputFlyer), [sizeKey, quantity, twoSided, paperWeightKey, designOption]);
  const displayedTotal = priceData.finalPrice;

  // Upsell Logic
  const upsellOpportunity = useMemo(() => {
    return getFlyerUpsell({ sizeKey, quantity, twoSided, paperWeightKey, designOption } as PriceInputFlyer);
  }, [sizeKey, quantity, twoSided, paperWeightKey, designOption]);

  // Auto-capture abandoned carts
  const cartData = useMemo(() => ({
    configuratorId: 'flayere',
    email: userEmail,
    configuration: { sizeKey, quantity, twoSided, paperWeightKey, designOption, artworkUrl },
    price: displayedTotal,
    quantity: quantity
  }), [userEmail, sizeKey, quantity, twoSided, paperWeightKey, designOption, artworkUrl, displayedTotal]);

  useUserActivityTracking(cartData);

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
    if (displayedTotal <= 0) { toast.warning("Prețul nu este calculat"); return; }
    addItem({
      id: `${productSlug ?? 'flyer'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      productId: productSlug ?? 'flyere',
      slug: productSlug ?? 'flayere',
      title: `Flyer ${sizeKey} ${twoSided ? 'față-verso' : 'față'}`,
      price: displayedTotal,
      quantity,
      currency: 'RON',
      metadata: {
        'Dimensiune': sizeKey,
        'Hârtie': paperWeightKey,
        'Față-verso': twoSided ? 'Da' : 'Nu',
        'Grafică': designOption === 'pro' ? 'Vreau grafică' : 'Grafică proprie',
        artworkUrl,
      }
    });
  }

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 3000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex]);

  // Update image based on size selection
  useEffect(() => {
    const sizeToImageMap: Record<string, number> = {
      "A6": 1,     // flayere-2.webp
      "A5": 2,     // flayere-3.webp
      "21x10": 3   // flayere-4.webp
    };
    const imageIndex = sizeToImageMap[sizeKey] ?? 1;
    setActiveIndex(imageIndex);
  }, [sizeKey]);

  const summary1 = `${sizeKey}, ${paperWeightKey}g`;
  const summary2 = `${twoSided ? 'Față-verso' : 'Față'}`;

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Flyer" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3">
                <h1 className="text-3xl font-extrabold text-gray-900">Configurator Flyere</h1>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold bg-red-100 text-red-700 border-2 border-red-500 animate-pulse">
                  🔥 -25% REDUCERE
                </span>
              </div>
              <div className="mb-4 p-3 bg-linear-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-800">🎉 Reducere specială 25% aplicată la toate flyerele!</p>
              </div>
              <div className="flex justify-between items-center"><p className="text-gray-600">Alege dimensiune, hârtie și tirajul.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiune & Hârtie" summary={summary1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Dimensiune</label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {FLYER_CONSTANTS.SIZES.map(s => <button key={s.key} onClick={() => setSizeKey(s.key)} className={`p-3 rounded-lg border-2 text-sm ${sizeKey === s.key ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}>{s.label}</button>)}
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Hârtie</label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {FLYER_CONSTANTS.PAPER_WEIGHTS.map(p => <button key={p.key} onClick={() => setPaperWeightKey(p.key)} className={`p-3 rounded-lg border-2 text-sm ${paperWeightKey === p.key ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}>{p.label}</button>)}
                    </div>
                  </div>
                </div>
              </AccordionStep>

              <AccordionStep stepNumber={2} title="Tiraj & Față/Dos" summary={summary2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NumberInput label="Cantitate (buc)" value={quantity} onChange={setQuantity} />
                  <div>
                    <label className="field-label">Imprimare</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button onClick={() => setTwoSided(false)} className={`p-3 rounded-lg border-2 text-sm ${!twoSided ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}>Față</button>
                      <button onClick={() => setTwoSided(true)} className={`p-3 rounded-lg border-2 text-sm ${twoSided ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}>Față-verso</button>
                    </div>
                  </div>
                </div>
                
                {upsellOpportunity && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => setQuantity(upsellOpportunity.requiredQty)}>
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-amber-900 mb-1">💡 Recomandare Smart:</p>
                        <p className="text-sm text-amber-800">
                          Dacă alegi <strong>{upsellOpportunity.requiredQty} buc</strong>, prețul scade la <strong>{formatMoneyDisplay(upsellOpportunity.newUnitPrice)}/buc</strong>.
                        </p>
                        <p className="text-xs text-amber-700 mt-1">
                          Economisești {upsellOpportunity.discountPercent}% la prețul per unitate!
                        </p>
                      </div>
                      <div className="shrink-0">
                        <span className="text-xs font-bold text-amber-600">-{upsellOpportunity.discountPercent}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </AccordionStep>

              <AccordionStep stepNumber={3} title="Grafică" summary={designOption === 'upload' ? 'Grafică proprie' : 'Vreau grafică'} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <button onClick={() => setDesignOption('upload')} className={`p-3 rounded-lg border-2 text-sm ${designOption === 'upload' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}>Am grafică</button>
                  <button onClick={() => setDesignOption('pro')} className={`p-3 rounded-lg border-2 text-sm ${designOption === 'pro' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}>Vreau grafică ({formatMoneyDisplay(priceData.proFee || 0)})</button>
                </div>

                {designOption === 'upload' && (
                  <div className="mt-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                      <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600" /><span className="font-medium text-gray-600">Apasă pentru a încărca</span></span>
                      <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                    </label>
                    {uploading && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                    {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                    {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Fișier încărcat!</p>}
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

            {/* BUTOANE SECUNDARE - WHATSAPP ȘI CERERE OFERTĂ */}
            <div className="mt-4 lg:mt-6 bg-gray-50 rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-3 text-center">Ai nevoie de ajutor sau o ofertă personalizată?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a 
                  href="https://wa.me/40750473111?text=Ma%20intereseaza%20configuratorul%20flyer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <MessageCircle size={18} />
                  <span className="text-sm">WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => window.location.href = '/contact'}
                  className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Info size={18} />
                  <span className="text-sm">Cerere Ofertă</span>
                </button>
              </div>
            </div>
            
            {/* SECȚIUNE DESCRIERE & FEATURES */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button onClick={() => setActiveProductTab('descriere')} className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeProductTab === 'descriere' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Descriere</button>
                <button onClick={() => setActiveProductTab('recenzii')} className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeProductTab === 'recenzii' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Recenzii</button>
                <button onClick={() => setActiveProductTab('faq')} className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeProductTab === 'faq' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>FAQ</button>
              </div>

              {activeProductTab === 'descriere' && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Flyere Personalizate</h2>
                  <p className="text-gray-600 mb-6">
                    Flyere rapide și eficiente pentru campanii, promoții și evenimente. Alegeți dimensiunea, hârtia și imprimarea față-verso.
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Materiale & Calitate</h3>
                      <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span><strong>Print Offset</strong> - tehnologie profesională, culori vibrante</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span><strong>Format A5</strong> - dimensiunea ideală pentru impact maxim</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span><strong>Hârtie premium</strong> - finisaj lucios sau mat disponibil</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span><strong>Față-verso</strong> - opțiune imprimare ambele fețe</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">De ce să alegi Flyere?</h3>
                      <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span>Perfect pentru campanii publicitare și evenimente</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span>Reduceri automate la cantități mari (min 100 buc)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span>Producție rapidă - livrare în 2-3 zile lucrătoare</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span>Distribuție ușoară - format convenabil și atractiv</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900 mb-1">Print Offset Profesional</h3>
                        <p className="text-sm text-gray-600">Calitate superioară, culorile perfect reproducte</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900 mb-1">Format A5 Standard</h3>
                        <p className="text-sm text-gray-600">Dimensiunea perfectă pentru distribuție și impact</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900 mb-1">Preț pe Bucăță Mic</h3>
                        <p className="text-sm text-gray-600">Reduceri automate la cantități mari (min 100 buc)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900 mb-1">Producție Rapidă</h3>
                        <p className="text-sm text-gray-600">Livrare în 2-3 zile lucrătoare național</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeProductTab === 'recenzii' && <Reviews productSlug={productSlug || 'flayere'} />}
              
              {activeProductTab === 'faq' && <FaqAccordion qa={productFaqs} />}
            </div>
          </div>
        </div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)}><X size={20} className="text-gray-600" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cum funcționează?</h3>
            <div className="prose prose-sm max-w-none">
              <p>Alege dimensiunea, cantitatea și dacă vrei imprimare față-verso. Încarcă grafică sau soliciti design profesional.</p>
            </div>
          </div>
        </div>
      )}

      {/* Smart Newsletter Popup */}
      <SmartNewsletterPopup 
        onSubscribe={(email) => setUserEmail(email)}
        delay={30}
      />
    </main>
  );
}