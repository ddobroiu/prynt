"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Ruler, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, MessageCircle } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import SmartNewsletterPopup from "./SmartNewsletterPopup";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
import { QA } from "@/types";
import { 
  calculateRollupPrice, 
  ROLLUP_CONSTANTS, 
  formatMoneyDisplay, 
  type PriceInputRollup 
} from "@/lib/pricing";

const GALLERY = [
  "/products/rollup/rollup-1.webp", 
  "/products/rollup/rollup-2.webp", 
  "/products/rollup/rollup-3.webp", 
  "/products/rollup/rollup-4.webp"
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
        { question: "Ce este un rollup banner?", answer: "Roll-up (sau banner retractabil) este un sistem de afișaj portabil perfect pentru evenimente, expoziții, prezentări. Se rulează și se derulează ușor într-o casetă din aluminiu." },
        { question: "Ce include prețul?", answer: "Prețul include caseta din aluminiu de calitate premium, printuri pe material Blueback 440g și geantă de transport." },
        { question: "Cât de rezistent este?", answer: "Sistemul rollup este foarte durabil - caseta din aluminiu rezistă la transport și utilizare repetată, iar printul Blueback este opac și rezistent." },
        { question: "Cum se montează?", answer: "Extrem de simplu: scoți din geantă, tragi printul în sus și îl fixezi pe bara superioară. Montaj sub 1 minut, fără unelte!" },
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
                        <h3>Rollup Banner - Afișaj Portabil Premium</h3>
                        <p>Sistem complet de afișaj retractabil pentru evenimente, expoziții, showroom-uri și prezentări profesionale.</p>
                        <h4>Ce include:</h4>
                        <ul>
                            <li><strong>Casetă aluminiu</strong> premium cu mecanism retractabil</li>
                            <li><strong>Print Blueback 440g</strong> opac, culori vibrante</li>
                            <li><strong>Geantă transport</strong> rezistentă</li>
                            <li><strong>Bară superioară</strong> pentru fixare</li>
                        </ul>
                        <h4>Dimensiuni disponibile:</h4>
                        <ul>
                            <li><strong>85 cm</strong> lățime - compact, ideal spații mici</li>
                            <li><strong>100 cm</strong> lățime - standard, cel mai popular</li>
                            <li><strong>120 cm</strong> lățime - vizibilitate excelentă</li>
                            <li><strong>150 cm</strong> lățime - impact maxim</li>
                        </ul>
                        <p className="text-xs text-gray-500"><em>Înălțime standard: 200 cm pentru toate modelele</em></p>
                        <h4>Avantaje:</h4>
                        <ul>
                            <li>✅ Portabil și ușor de transportat</li>
                            <li>✅ Montaj rapid (sub 1 minut)</li>
                            <li>✅ Fără unelte necesare</li>
                            <li>✅ Refolosibil - schimbi doar printul</li>
                            <li>✅ Print opac, dublu strat Blueback</li>
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
  return <div><label className="field-label">{label}</label><div className="flex"><button onClick={() => inc(-1)} className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200" aria-label={`Scade ${label.toLowerCase()}`}><Minus size={16} /></button><input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-center w-full rounded-none border-x-0" min="1" /><button onClick={() => inc(1)} className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200" aria-label={`Creşte ${label.toLowerCase()}`}><Plus size={16} /></button></div></div>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
  return <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>;
}

type Props = { productSlug?: string; initialWidth?: number; productImage?: string };

/* --- MAIN COMPONENT --- */
export default function RollupConfigurator({ productSlug, initialWidth: initW, productImage }: Props) {
  const { addItem } = useCart();
  const GALLERY_IMAGES = useMemo(() => productImage ? [productImage, ...GALLERY] : GALLERY, [productImage]);
  
  const [input, setInput] = useState<PriceInputRollup>({
    width_cm: initW ?? 85,
    quantity: 1,
    designOption: "upload",
  });

  const [activeImage, setActiveImage] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  
  // Schimbă poza automat când se schimbă dimensiunea
  useEffect(() => {
    const widthToIndex: Record<number, number> = {
      85: 0,  // rollup-1.webp
      100: 1, // rollup-2.webp
      120: 2, // rollup-3.webp
      150: 3  // rollup-4.webp
    };
    const newIndex = widthToIndex[input.width_cm] ?? 0;
    setActiveIndex(newIndex);
    setActiveImage(GALLERY_IMAGES[newIndex] || GALLERY_IMAGES[0]);
  }, [input.width_cm, GALLERY_IMAGES]);
  
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
  const priceData = useMemo(() => calculateRollupPrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  // Auto-capture abandoned carts
  const cartData = useMemo(() => ({
    configuratorId: 'rollup',
    email: userEmail,
    configuration: { ...input, artworkUrl },
    price: displayedTotal,
    quantity: input.quantity
  }), [userEmail, input, artworkUrl, displayedTotal]);

  useUserActivityTracking(cartData);

  const updateInput = <K extends keyof PriceInputRollup>(k: K, v: PriceInputRollup[K]) => setInput((p) => ({ ...p, [k]: v }));
  const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));

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
      toast.warning("Prețul trebuie calculat.");
      return;
    }

    const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
    const uniqueId = `${productSlug ?? 'rollup'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const title = `Rollup Banner ${input.width_cm}cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "rollup",
      slug: productSlug ?? "rollup",
      title,
      width: input.width_cm,
      height: 200,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        "Lățime": `${input.width_cm} cm`,
        "Înălțime": "200 cm (standard)",
        "Include": "Casetă aluminiu + Print Blueback 440g + Geantă",
        "Preț unitar": formatMoneyDisplay(priceData.unitPrice),
        "Grafică": input.designOption === 'pro' ? 'Design Pro' : 'Grafică proprie',
        ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(ROLLUP_CONSTANTS.PRO_DESIGN_FEE) }),
        artworkUrl,
      },
    });
    toast.success("Produs adăugat în coș!");
  }

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY_IMAGES.length), 3000);
    return () => clearInterval(id);
  }, [GALLERY_IMAGES.length]);
  useEffect(() => setActiveImage(GALLERY_IMAGES[activeIndex]), [activeIndex, GALLERY_IMAGES]);

  const widthLabel = ROLLUP_CONSTANTS.SIZES.find(s => s.width_cm === input.width_cm)?.label || `${input.width_cm}cm`;
  const summaryStep1 = `${widthLabel}, ${input.quantity} buc.`;
  const summaryStep2 = input.designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Rollup Banner" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY_IMAGES.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug || 'rollup'} /></div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Rollup Banner</h1></div>
              <div className="flex justify-between items-center"><p className="text-gray-600">Banner retractabil premium - portabil și profesional!</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiune & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="space-y-4">
                  <div>
                    <label className="field-label">Lățime Banner</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {ROLLUP_CONSTANTS.SIZES.map(size => (
                        <button
                          key={size.width_cm}
                          onClick={() => updateInput("width_cm", size.width_cm)}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            input.width_cm === size.width_cm
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="font-bold text-lg">{size.width_cm}cm</div>
                          <div className="text-xs text-gray-500">{size.label}</div>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Înălțime standard: 200 cm (toate modelele)</p>
                  </div>
                  <div><NumberInput label="Cantitate" value={input.quantity} onChange={setQty} /></div>
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
                      <p className="text-sm text-gray-600">Încarcă fișierul tău (PDF, JPG, PNG, AI, CDR). Dimensiuni recomandate: {input.width_cm}cm × 200cm la 150 DPI.</p>
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
                        <p className="text-sm text-blue-600 mt-2">Cost grafică: <strong>{formatMoneyDisplay(ROLLUP_CONSTANTS.PRO_DESIGN_FEE)}</strong></p>
                      </div>
                    </div>
                  )}
                </div>
              </AccordionStep>
            </div>

            <div className="sticky bottom-0 lg:static bg-white/95 lg:bg-white backdrop-blur-md lg:backdrop-blur-none border-t-2 lg:border lg:rounded-2xl lg:shadow-lg border-gray-200 p-3 sm:p-4 lg:p-6 lg:mt-8 safe-area-inset-bottom">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-2 mb-2">
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 order-2 sm:order-1">{formatMoneyDisplay(displayedTotal)}</p>
                <button onClick={handleAddToCart} className="btn-primary w-full sm:w-1/2 py-3 text-base font-bold order-1 sm:order-2"><ShoppingCart size={20} /><span className="ml-2">Adaugă în Coș</span></button>
              </div>
              {priceData.unitPrice > 0 && (
                <p className="text-xs sm:text-sm text-gray-500 mb-0">
                  {formatMoneyDisplay(priceData.unitPrice)}/buc × {input.quantity} = Include casetă + print + geantă
                </p>
              )}
              <DeliveryEstimation />
            </div>

            {/* BUTOANE SECUNDARE - WHATSAPP ȘI CERERE OFERTĂ */}
            <div className="mt-4 lg:mt-6 bg-gray-50 rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-3 text-center">Ai nevoie de ajutor sau o ofertă personalizată?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a 
                  href="https://wa.me/40750473111?text=Ma%20intereseaza%20configuratorul%20rollup" 
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

            {/* SECȚIUNE FEATURES - 4 ICONIȚE */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Casetă Premium Inclusă</h3>
                    <p className="text-sm text-gray-600">Sistem retractabil profesional, stabil și elegant</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Montaj în 30 Secunde</h3>
                    <p className="text-sm text-gray-600">Extrem de ușor de instalat, transportabil</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Geantă Transport</h3>
                    <p className="text-sm text-gray-600">Inclusă în preț - transport ușor la evenimente</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Print Anti-Curl</h3>
                    <p className="text-sm text-gray-600">Banner special tratat, rămâne perfect plat</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:hidden mt-12"><ProductTabs productSlug={productSlug || 'rollup'} /></div>
      </div>
      <SmartNewsletterPopup />
      {detailsOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 bg-gray-50" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={20} className="text-gray-600" />
            </button>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 pr-8">Detalii Rollup Banner</h3>
            <div className="prose prose-sm max-w-none text-gray-600">
              <h3>Ce include sistemul Rollup?</h3>
              <ul>
                <li><strong>Casetă premium</strong> din aluminiu cu mecanism retractabil</li>
                <li><strong>Print Blueback 440g</strong> material opac, dublu strat</li>
                <li><strong>Geantă de transport</strong> rezistentă cu mâner</li>
                <li><strong>Bară superioară</strong> pentru fixare print</li>
              </ul>
              <h3>Dimensiuni disponibile</h3>
              <ul>
                <li><strong>85cm × 200cm</strong> - Compact</li>
                <li><strong>100cm × 200cm</strong> - Standard (cel mai popular)</li>
                <li><strong>120cm × 200cm</strong> - Vizibilitate mare</li>
                <li><strong>150cm × 200cm</strong> - Impact maxim</li>
              </ul>
              <h3>Montaj simplu</h3>
              <ol>
                <li>Scoate caseta din geantă</li>
                <li>Trage printul în sus din casetă</li>
                <li>Fixează printul pe bara superioară</li>
                <li>Gata! Montaj sub 1 minut</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
