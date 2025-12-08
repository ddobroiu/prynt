"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Ruler, Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, Upload, TrendingUp, Percent } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import SmartNewsletterPopup from "./SmartNewsletterPopup";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
import { QA } from "@/types";
import { 
  calculateWindowGraphicsPrice, 
  getWindowGraphicsUpsell,
  WINDOW_GRAPHICS_CONSTANTS, 
  formatMoneyDisplay, 
  type PriceInputWindowGraphics 
} from "@/lib/pricing";

const GALLERY = [
  "/products/window-graphics/window-graphics-1.webp", 
  "/products/window-graphics/window-graphics-2.webp", 
  "/products/window-graphics/window-graphics-3.webp", 
  "/products/window-graphics/window-graphics-4.webp"
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
    const faq: QA[] = [
        { question: "Ce este folia perforată pentru ferestre?", answer: "Este o folie PVC specială cu perforații (raport 50% printabil / 50% transparent) care permite vizibilitatea dinspre interior spre exterior, dar oferă suprafață de print pe exterior." },
        { question: "Cum se aplică?", answer: "Aplicarea se face doar uscat, pe suprafețe curate de sticlă. Nu necesită apă sau soluții speciale." },
        { question: "Cât rezistă?", answer: "Durabilitate până la 3 ani, rezistentă la UV și intemperii. Adezivul removabil permite îndepărtarea fără urme." },
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
                    <div className="prose max-w-none text-sm">
                        <h3>Window Graphics - Folie Perforată Ferestre</h3>
                        <p>Folie PVC specială cu perforații, ideală pentru publicitate pe ferestre și vitrine. Vizibilitate unidirecțională perfectă!</p>
                        <h4>Specificații Tehnice</h4>
                        <ul>
                            <li><strong>Grosime:</strong> 140 microni</li>
                            <li><strong>Adeziv:</strong> Poliacrilic removabil, transparent</li>
                            <li><strong>Suprafață:</strong> Albă lucioasă (exterior) / Neagră (interior)</li>
                            <li><strong>Raport perforații:</strong> 50% printabil / 50% transparent</li>
                            <li><strong>Durabilitate:</strong> Până la 3 ani</li>
                            <li><strong>Aplicare:</strong> Doar uscat</li>
                        </ul>
                        <h4>Aplicații</h4>
                        <ul>
                            <li>Vitrine magazine și showroom-uri</li>
                            <li>Ferestre birouri și sedii</li>
                            <li>Autovehicule comerciale (geamuri laterale/spate)</li>
                            <li>Publicitate outdoor cu vizibilitate interioară</li>
                        </ul>
                    </div>
                )}
                {activeTab === 'recenzii' && <Reviews productSlug={productSlug} />}
                {activeTab === 'faq' && <FaqAccordion qa={faq} />}
            </div>
        </div>
    );
};

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => ( <button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{children}</button> );

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const inc = (d: number) => onChange(Math.max(1, value + d));
  return <div><label className="field-label">{label}</label><div className="flex"><button onClick={() => inc(-10)} className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200" aria-label={`Scade ${label.toLowerCase()}`}><Minus size={16} /></button><input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-center w-full rounded-none border-x-0" min="1" /><button onClick={() => inc(10)} className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200" aria-label={`Creşte ${label.toLowerCase()}`}><Plus size={16} /></button></div></div>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
  return <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>;
}

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string };

/* --- MAIN COMPONENT --- */
export default function WindowGraphicsConfigurator({ productSlug, initialWidth: initW, initialHeight: initH, productImage }: Props) {
  const { addItem } = useCart();
  const GALLERY_IMAGES = useMemo(() => productImage ? [productImage, ...GALLERY] : GALLERY, [productImage]);
  
  const [input, setInput] = useState<PriceInputWindowGraphics>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    designOption: "upload",
  });

  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");
  
  const [activeImage, setActiveImage] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  
  useEffect(() => {
    if (GALLERY_IMAGES.length > 0 && !activeImage) {
      setActiveImage(GALLERY_IMAGES[0]);
    }
  }, [GALLERY_IMAGES, activeImage]);
  
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [userEmail, setUserEmail] = useState<string>('');
  const toast = useToast();

  // Pricing
  const priceData = useMemo(() => calculateWindowGraphicsPrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  // Upsell Logic
  const upsellOpportunity = useMemo(() => getWindowGraphicsUpsell(input), [input]);

  // Auto-capture abandoned carts
  const cartData = useMemo(() => ({
    configuratorId: 'window-graphics',
    email: userEmail,
    configuration: { ...input, artworkUrl },
    price: displayedTotal,
    quantity: input.quantity
  }), [userEmail, input, artworkUrl, displayedTotal]);

  useUserActivityTracking(cartData);

  const updateInput = <K extends keyof PriceInputWindowGraphics>(k: K, v: PriceInputWindowGraphics[K]) => setInput((p) => ({ ...p, [k]: v }));
  const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));
  const onChangeLength = (v: string) => { const d = v.replace(/\D/g, ""); setLengthText(d); updateInput("width_cm", d === "" ? 0 : parseInt(d, 10)); };
  const onChangeHeight = (v: string) => { const d = v.replace(/\D/g, ""); setHeightText(d); updateInput("height_cm", d === "" ? 0 : parseInt(d, 10)); };

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
    if (!input.width_cm || !input.height_cm) {
      toast.warning("Te rugăm să introduci dimensiunile.");
      return;
    }
    if (displayedTotal <= 0) {
      toast.warning("Prețul trebuie calculat.");
      return;
    }

    const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
    const uniqueId = `${productSlug ?? 'window-graphics'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const title = `Window Graphics - ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "window-graphics",
      slug: productSlug ?? "window-graphics",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        "Material": "Folie PVC perforată 140μ",
        "Dimensiuni": `${input.width_cm} x ${input.height_cm} cm`,
        "Suprafață totală": `${priceData.total_sqm.toFixed(2)} mp`,
        "Preț/mp": `${priceData.pricePerSqm} lei`,
        "Grafică": input.designOption === 'pro' ? 'Design Pro' : 'Grafică proprie',
        ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(WINDOW_GRAPHICS_CONSTANTS.PRO_DESIGN_FEE) }),
        artworkUrl,
        productImage,
      },
    });
    toast.success("Produs adăugat în coș!");
  }

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY_IMAGES.length), 3000);
    return () => clearInterval(id);
  }, [GALLERY_IMAGES.length]);
  useEffect(() => setActiveImage(GALLERY_IMAGES[activeIndex]), [activeIndex, GALLERY_IMAGES]);

  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
  const summaryStep2 = input.designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Window Graphics" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY_IMAGES.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Window Graphics</h1></div>
              <div className="flex justify-between items-center"><p className="text-gray-600">Folie perforată pentru ferestre - vizibilitate perfectă!</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="field-label">Lungime (cm)</label><input type="text" inputMode="numeric" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="100" className="input" /></div>
                  <div><label className="field-label">Înălțime (cm)</label><input type="text" inputMode="numeric" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="100" className="input" /></div>
                  <div className="md:col-span-2">
                    <NumberInput label="Cantitate" value={input.quantity} onChange={setQty} />
                    
                    {/* UPSELL ALERT */}
                    {upsellOpportunity && (
                        <div 
                            className="mt-3 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors flex gap-2 sm:gap-3 items-start touch-manipulation"
                            onClick={() => updateInput("quantity", upsellOpportunity.requiredQty)}
                        >
                            <TrendingUp className="text-amber-600 w-5 h-5 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm text-amber-900 font-bold">
                                    Reducere de Volum Disponibilă!
                                </p>
                                <p className="text-xs text-amber-800 mt-1">
                                    Dacă alegi <strong>{upsellOpportunity.requiredQty} buc</strong>, prețul scade la <strong>{formatMoneyDisplay(upsellOpportunity.newUnitPrice)}/buc</strong>.
                                    <span className="block mt-0.5 font-semibold text-amber-700">
                                        Economisești {upsellOpportunity.discountPercent}% la prețul per unitate!
                                    </span>
                                </p>
                            </div>
                            <div className="ml-auto flex flex-col justify-center items-center bg-white rounded-lg px-2 py-1 shadow-sm border border-amber-100">
                                <Percent className="w-4 h-4 text-amber-600 mb-0.5" />
                                <span className="text-xs font-bold text-amber-600">-{upsellOpportunity.discountPercent}%</span>
                            </div>
                        </div>
                    )}
                  </div>
                </div>
              </AccordionStep>
              
              <AccordionStep stepNumber={2} title="Grafică" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)} isLast={true}>
                <div>
                  <div className="mb-4 border-b border-gray-200">
                    <div className="flex -mb-px">
                      <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Grafică</TabButton>
                      <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Grafică</TabButton>
                    </div>
                  </div>

                  {input.designOption === 'upload' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Încarcă fișierul tău (PDF, JPG, PNG, AI, CDR).</p>
                      <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <div className="flex flex-col items-center space-y-2"><UploadCloud className="w-8 h-8 text-gray-400" /><span className="font-medium text-gray-600">Selectează fișier</span><span className="text-xs text-gray-500">sau trage și plasează aici</span></div>
                        <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.ai,.cdr,.svg" onChange={(e) => handleArtworkFileInput(e.target.files?.[0] || null)} />
                      </label>
                      {uploading && <p className="text-sm text-blue-600">Se încarcă...</p>}
                      {artworkUrl && <p className="text-sm text-green-600">✓ Fișier încărcat cu succes</p>}
                      {uploadError && <p className="text-sm text-red-600">Eroare: {uploadError}</p>}
                    </div>
                  )}

                  {input.designOption === 'pro' && (
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800"><strong>Design profesional:</strong> Echipa noastră va crea design-ul conform specificațiilor tale.</p>
                        <p className="text-sm text-blue-600 mt-2">Cost grafică: <strong>{formatMoneyDisplay(WINDOW_GRAPHICS_CONSTANTS.PRO_DESIGN_FEE)}</strong></p>
                      </div>
                    </div>
                  )}
                </div>
              </AccordionStep>
            </div>

            <div className="sticky bottom-0 lg:static bg-white/95 lg:bg-white backdrop-blur-md lg:backdrop-blur-none border-t-2 lg:border lg:rounded-2xl lg:shadow-lg border-gray-200 p-3 sm:p-4 lg:p-6 lg:mt-8 safe-area-inset-bottom">
              <div className="flex flex-col gap-3">
                <button onClick={handleAddToCart} className="btn-primary w-full py-4 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200">
                  <ShoppingCart size={24} />
                  <span className="ml-2">Adaugă în Coș</span>
                </button>
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2">
                  <p className="text-3xl font-extrabold text-gray-900">{formatMoneyDisplay(displayedTotal)}</p>
                  {priceData.total_sqm > 0 && (
                    <p className="text-xs sm:text-sm text-gray-500">
                      Suprafață: {priceData.total_sqm.toFixed(2)} mp × {priceData.pricePerSqm} lei/mp
                    </p>
                  )}
                  <div className="lg:ml-auto">
                    <DeliveryEstimation />
                  </div>
                </div>
              </div>
            </div>
            
            {/* BUTOANE SECUNDARE - WHATSAPP ȘI CERERE OFERTĂ */}
            <div className="mt-4 lg:mt-6 bg-linear-to-br from-slate-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center font-medium">Ai nevoie de ajutor sau o ofertă personalizată?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a 
                  href="https://wa.me/40750473111?text=Ma%20intereseaza%20configuratorul%20window-graphics" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <MessageCircle size={18} />
                  <span className="text-sm">WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => window.location.href = '/contact'}
                  className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Info size={18} />
                  <span className="text-sm">Cerere Ofertă</span>
                </button>
              </div>
            </div>
            
            {/* SECȚIUNE FEATURES - 4 ICONIȚE */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Folie One-Way Vision</h3>
                    <p className="text-sm text-gray-600">Vezi din interior, vizibilitate totală din exterior</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Rezistent Intemperii</h3>
                    <p className="text-sm text-gray-600">Material premium pentru exterior, 3-5 ani garanție</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Montaj Profesional</h3>
                    <p className="text-sm text-gray-600">Opțional - echipa noastră montează perfect</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Impact Vizual Maxim</h3>
                    <p className="text-sm text-gray-600">Perfect pentru magazine, birouri, vitrine</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECȚIUNE TABS - FULL WIDTH JOS */}
        <div className="mt-8 lg:mt-12"><ProductTabs productSlug={productSlug || 'window-graphics'} /></div>
      </div>
      <SmartNewsletterPopup />
      {detailsOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 bg-gray-50" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={20} className="text-gray-600" />
            </button>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pr-8">Detalii Window Graphics</h3>
            <div className="prose prose-sm max-w-none text-gray-600">
              <h3>Specificații Window Graphics</h3>
              <ul>
                <li><strong>Material:</strong> Folie PVC perforată 140 microni</li>
                <li><strong>Adeziv:</strong> Poliacrilic removabil, transparent</li>
                <li><strong>Culori:</strong> Alb lucios (exterior) / Negru (interior)</li>
                <li><strong>Raport perforații:</strong> 50% printabil / 50% transparent</li>
                <li><strong>Aplicare:</strong> Doar uscat, fără apă</li>
                <li><strong>Durabilitate:</strong> Până la 3 ani outdoor</li>
                <li><strong>Dimensiuni rolă:</strong> 137cm lățime × 50m lungime</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
