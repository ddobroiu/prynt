"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Ruler, Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, Upload, TrendingUp, Percent, MessageCircle } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import SmartNewsletterPopup from "./SmartNewsletterPopup";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
import { QA } from "@/types";
import { 
  calculateTapetPrice, 
  getTapetUpsell,
  TAPET_CONSTANTS, 
  formatMoneyDisplay, 
  type PriceInputTapet 
} from "@/lib/pricing";

const GALLERY = ["/products/tapet/tapet-1.webp", "/products/tapet/tapet-2.webp", "/products/tapet/tapet-3.webp", "/products/tapet/tapet-4.webp"] as const;

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
        { question: "Ce material folosiți pentru tapet?", answer: "Folosim tapet Dreamscape Vinilic, un material premium din țesătură de poliester cu un coating vinilic, cu o grosime de 400 g/mp. Este ideal pentru un decor interior de înaltă calitate." },
        { question: "Care este diferența dintre varianta cu și fără adeziv?", answer: "Varianta standard necesită aplicarea unui adeziv pentru tapet pe perete. Varianta cu adeziv are un strat auto-adeziv pe spate, similar cu un autocolant, facilitând montajul." },
        { question: "Pot comanda o grafică personalizată?", answer: "Da, puteți încărca propria grafică sau puteți opta pentru serviciul nostru de design profesional, contra unui cost suplimentar de 200 RON." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && <div className="prose max-w-none text-sm"><h3>Tapet Personalizat Dreamscape Vinilic</h3><p>Creați un ambient unic cu tapetul nostru personalizat. Ideal pentru spații rezidențiale, birouri sau comerciale, tapetul Dreamscape Vinilic transformă orice perete într-o operă de artă. Imprimat la calitate fotografică, este rezistent și ușor de întreținut.</p></div>}
                {activeTab === 'recenzii' && <Reviews productSlug={productSlug} />}
                {activeTab === 'faq' && <FaqAccordion qa={faqs} />}
            </div>
        </div>
    );
};

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => ( <button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{children}</button> );

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const inc = (d: number) => onChange(Math.max(1, value + d));
  return <div><label className="field-label">{label}</label><div className="flex"><button onClick={() => inc(-1)} className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200" aria-label={`Scade ${label.toLowerCase()}`}><Minus size={16} /></button><input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-center w-full rounded-none border-x-0" /><button onClick={() => inc(1)} className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200" aria-label={`Creşte ${label.toLowerCase()}`}><Plus size={16} /></button></div></div>;
}

function OptionButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) {
  return <button type="button" onClick={onClick} className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${active ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-white hover:border-gray-400"}`}><div className="font-bold text-gray-800">{title}</div>{subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}</button>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
  return <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>;
}

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string };

/* --- MAIN COMPONENT --- */
export default function TapetConfigurator({ productSlug, productImage }: Props) {
  const { addItem } = useCart();
  const GALLERY = useMemo(() => productImage ? [productImage, "/products/tapet/tapet-1.webp", "/products/tapet/tapet-2.webp", "/products/tapet/tapet-3.webp"] : ["/products/tapet/tapet-1.webp", "/products/tapet/tapet-2.webp", "/products/tapet/tapet-3.webp", "/products/tapet/tapet-4.webp"], [productImage]);
  const [input, setInput] = useState<PriceInputTapet>({
    width_cm: 0,
    height_cm: 0,
    quantity: 1,
    want_adhesive: false,
    designOption: "upload",
  });

  const [lengthText, setLengthText] = useState("");
  const [heightText, setHeightText] = useState("");
  
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
  const priceData = useMemo(() => calculateTapetPrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  // Upsell Logic
  const upsellOpportunity = useMemo(() => getTapetUpsell(input), [input]);

  const updateInput = <K extends keyof PriceInputTapet>(k: K, v: PriceInputTapet[K]) => setInput((p) => ({ ...p, [k]: v }));
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
        toast.warning("Introduceți dimensiunile peretelui."); return;
    }
    if (displayedTotal <= 0) {
        toast.warning("Prețul trebuie calculat."); return;
    }

    const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
    const uniqueId = `${productSlug ?? 'tapet'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "tapet",
      slug: productSlug ?? "tapet",
      title: `Tapet personalizat ${input.width_cm}x${input.height_cm} cm`,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        "Dimensiune": `${input.width_cm}x${input.height_cm} cm`,
        "Suprafață": `${priceData.total_sqm} mp`,
        "Finisaj": input.want_adhesive ? "Auto-adeziv" : "Standard (fără adeziv)",
        "Grafică": input.designOption === 'pro' ? 'Vreau grafică' : 'Grafică proprie',
        ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(TAPET_CONSTANTS.PRO_DESIGN_FEE) }),
        artworkUrl,
      },
    });
  }

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 3000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex]);

  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm` : "Alege";
  const summaryStep2 = input.want_adhesive ? "Auto-adeziv" : "Standard";
  const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Tapet" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`} aria-label={`Selectează imaginea ${i + 1} pentru tapet`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug || 'tapet'} /></div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Tapet</h1></div>
              <div className="flex justify-between items-center"><p className="text-gray-600">Personalizează peretele în 3 pași simpli.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiuni Perete" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="field-label">Lățime (cm)</label><input type="text" inputMode="numeric" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="ex: 300" className="input" /></div>
                  <div><label className="field-label">Înălțime (cm)</label><input type="text" inputMode="numeric" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="ex: 250" className="input" /></div>
                  <div className="md:col-span-2">
                    <NumberInput label="Nr. Pereți (identici)" value={input.quantity} onChange={setQty} />
                    
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
              
              <AccordionStep stepNumber={2} title="Tip Material" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="grid grid-cols-2 gap-2">
                    <OptionButton active={!input.want_adhesive} onClick={() => updateInput("want_adhesive", false)} title="Standard" subtitle="Aplicare cu adeziv" />
                    <OptionButton active={input.want_adhesive} onClick={() => updateInput("want_adhesive", true)} title="Auto-adeziv" subtitle="Fără adeziv separat" />
                </div>
              </AccordionStep>

              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                <div>
                  <div className="mb-4 border-b border-gray-200">
                    <div className="flex -mb-px">
                      <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Fotografie</TabButton>
                      <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Grafică</TabButton>
                    </div>
                  </div>

                  {input.designOption === 'upload' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Încarcă fotografia ta (JPG, TIFF, rezoluție mare).</p>
                      <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600" /><span className="font-medium text-gray-600">Apasă pentru a încărca</span></span>
                        <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                      </label>
                      {uploading && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                      {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Fotografie încărcată!</p>}
                    </div>
                  )}

                  {input.designOption === 'pro' && (
                    <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
                      <p className="font-semibold">Serviciu de Design</p>
                      <p>Cost: <strong>{formatMoneyDisplay(TAPET_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Designerii noștri vor căuta imaginea perfectă sau vor crea un model personalizat.</p>
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

            {/* BUTOANE SECUNDARE - WHATSAPP ȘI CERERE OFERTĂ */}
            <div className="mt-4 lg:mt-6 bg-gray-50 rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-3 text-center">Ai nevoie de ajutor sau o ofertă personalizată?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a 
                  href="https://wa.me/40750473111?text=Ma%20intereseaza%20configuratorul%20tapet" 
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
            
            {/* SECȚIUNE FEATURES - 4 ICONIȚE */}}
            <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Print HD Personalizat</h3>
                    <p className="text-sm text-gray-600">Orice imagine, rezoluție fotografică, design unic</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Material Textil Premium</h3>
                    <p className="text-sm text-gray-600">Tapet textil non-woven, rezistent și ecologic</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Dimensiuni Personalizate</h3>
                    <p className="text-sm text-gray-600">Măsurăm exact peretele tău, fără limite</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Montaj Ușor</h3>
                    <p className="text-sm text-gray-600">Include adeziv special, montare rapidă DIY</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:hidden col-span-1"><ProductTabs productSlug={productSlug || 'tapet'} /></div>
        </div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)} aria-label="Închide detaliile produsului"><X size={20} className="text-gray-600" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Tapet</h3>
            <div className="prose prose-sm max-w-none">
              <h4>Material Premium</h4>
              <p>Tapet Dreamscape Vinilic, textură fină, 400 g/mp. Lavabil și rezistent.</p>
              <h4>Aplicație</h4>
              <p>Se livrează în fâșii numerotate, cu suprapunere de 2cm pentru îmbinare perfectă (double-cut).</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}