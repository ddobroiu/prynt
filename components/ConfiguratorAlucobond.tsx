"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Ruler, Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, Palette } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import { QA } from "@/types";
import { 
  calculateAlucobondPrice, 
  ALUCOBOND_CONSTANTS, 
  formatMoneyDisplay, 
  type PriceInputAlucobond 
} from "@/lib/pricing";

const GALLERY = [
  "/products/materiale/alucobond/alucobond-1.webp",
  "/products/materiale/alucobond/alucobond-2.webp",
  "/products/materiale/alucobond/alucobond-3.webp",
  "/products/materiale/alucobond/alucobond-4.webp"
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
        { question: "Ce este Alucobond-ul?", answer: "Alucobond (sau Bond) este un panou compozit format din două foi de aluminiu și un miez din polietilenă. Este extrem de rigid, perfect plan și rezistent la intemperii." },
        { question: "Se poate folosi la exterior?", answer: "Da, este materialul ideal pentru fațade, reclame luminoase, totemuri și panouri publicitare outdoor, având o durată de viață foarte mare." },
        { question: "Cum se poate prinde?", answer: "Se poate prinde mecanic (șuruburi, nituri), prin lipire cu adezivi speciali sau poate fi casetat (îndoit) pentru a crea cutii sau litere volumetrice." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6 lg:p-8">
                {activeTab === 'descriere' && (
                    <>
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Panouri Alucobond (Bond)</h2>
                        <p className="text-gray-700 mb-8 leading-relaxed">Soluția premium pentru signalistică rigidă. Panourile compozite din aluminiu oferă o planeitate perfectă, rigiditate și un aspect modern. Ideale pentru placări de fațade, panouri publicitare de mari dimensiuni și decorări interioare.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">Material Premium</h3>
                                <p className="text-sm text-gray-600">Alucobond rigid 3mm, suprafață plană impecabilă</p>
                            </div>
                            
                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">Rezistență Superioară</h3>
                                <p className="text-sm text-gray-600">Ideal exterior, rezistă ani de zile fără deformare</p>
                            </div>
                            
                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">Print Direct UV</h3>
                                <p className="text-sm text-gray-600">Culori vibrante, rezistente la decolorare</p>
                            </div>
                            
                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">Dimensiuni Mari</h3>
                                <p className="text-sm text-gray-600">Perfect pentru fațade, inscripționari, reclame</p>
                            </div>
                        </div>
                    </>
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
  return <div><label className="field-label">{label}</label><div className="flex"><button onClick={() => inc(-1)} className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200"><Minus size={16} /></button><input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-center w-full rounded-none border-x-0" /><button onClick={() => inc(1)} className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200"><Plus size={16} /></button></div></div>;
}

function OptionButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) {
  return <button type="button" onClick={onClick} className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${active ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-white hover:border-gray-400"}`}><div className="font-bold text-gray-800">{title}</div>{subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}</button>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
  return <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>;
}

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string; productType?: string };

/* --- MAIN COMPONENT --- */
export default function ConfiguratorAlucobond({ productSlug, initialWidth: initW, initialHeight: initH, productImage }: Props) {
  const { addItem } = useCart();
  const [input, setInput] = useState<PriceInputAlucobond>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    thickness_mm: 3,
    color: "Alb",
    designOption: "upload",
  });

  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");
  
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [textDesign, setTextDesign] = useState<string>("");
  
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const toast = useToast();

  // Pricing
  const priceData = useMemo(() => calculateAlucobondPrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  const updateInput = <K extends keyof PriceInputAlucobond>(k: K, v: PriceInputAlucobond[K]) => setInput((p) => ({ ...p, [k]: v }));
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
      // Try parse JSON; if response is HTML/text, surface it
      let data: any;
      try {
        data = await res.json();
      } catch (e) {
        const text = await res.text();
        throw new Error(text || res.statusText || 'Upload eșuat');
      }
      if (!res.ok) throw new Error(data?.error || 'Upload eșuat');
      setArtworkUrl(data.url);
    } catch (e: any) {
      setUploadError(e?.message ?? "Eroare la upload");
    } finally {
      setUploading(false);
    }
  };

  function handleAddToCart() {
    if (!input.width_cm || !input.height_cm) {
      toast.warning("Introduceți dimensiunile."); return;
    }
    if (input.width_cm > ALUCOBOND_CONSTANTS.LIMITS.MAX_WIDTH || input.height_cm > ALUCOBOND_CONSTANTS.LIMITS.MAX_HEIGHT) {
        toast.warning(`Dimensiune maximă: ${ALUCOBOND_CONSTANTS.LIMITS.MAX_WIDTH}x${ALUCOBOND_CONSTANTS.LIMITS.MAX_HEIGHT} cm`); 
        return;
    }
    if (displayedTotal <= 0) {
      toast.warning("Prețul trebuie calculat."); return;
    }

    const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
    const uniqueId = `${productSlug ?? 'alucobond'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const title = `Panou Alucobond ${input.thickness_mm}mm - ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "alucobond",
      slug: productSlug ?? "alucobond",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        "Grosime": `${input.thickness_mm} mm`,
        "Culoare": input.color,
        "Grafică": input.designOption === 'pro' ? 'Vreau grafică' : input.designOption === 'text_only' ? 'Doar text' : 'Grafică proprie',
        ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(ALUCOBOND_CONSTANTS.PRO_DESIGN_FEE) }),
        ...(input.designOption === 'text_only' && { "Text": textDesign }),
        artworkUrl,
        productImage,
      },
    });
  }

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 3000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex]);

  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
  const summaryStep2 = `${input.thickness_mm}mm, ${input.color}`;
  const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : input.designOption === 'text_only' ? 'Doar text' : 'Design Pro';

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Alucobond" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Alucobond</h1></div>
              <div className="flex justify-between items-center"><p className="text-gray-600">Personalizează panoul în 3 pași simpli.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="field-label">Lățime (cm)</label><input type="text" inputMode="numeric" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="100" className="input" /></div>
                  <div><label className="field-label">Înălțime (cm)</label><input type="text" inputMode="numeric" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="50" className="input" /></div>
                  <div className="md:col-span-2"><NumberInput label="Cantitate" value={input.quantity} onChange={setQty} /></div>
                  <p className="text-xs text-gray-400 md:col-span-2">Dimensiune maximă: {ALUCOBOND_CONSTANTS.LIMITS.MAX_WIDTH}x{ALUCOBOND_CONSTANTS.LIMITS.MAX_HEIGHT} cm</p>
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={2} title="Specificații Material" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="field-label">Grosime</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {ALUCOBOND_CONSTANTS.AVAILABLE_THICKNESS.map(t => (
                                <OptionButton key={t} active={input.thickness_mm === t} onClick={() => updateInput("thickness_mm", t)} title={`${t} mm`} subtitle="Standard" />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="field-label">Culoare Panou</label>
                        <select className="input w-full mt-2" value={input.color} onChange={(e) => updateInput("color", e.target.value)}>
                            {ALUCOBOND_CONSTANTS.COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
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

                  {input.designOption === 'upload' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Încarcă fișierul tău (PDF, JPG, AI, CDR).</p>
                      <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600" /><span className="font-medium text-gray-600">Apasă pentru a încărca</span></span>
                        <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                      </label>
                      {uploading && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                      {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Fișier încărcat!</p>}
                    </div>
                  )}

                  {input.designOption === 'text_only' && (
                    <div className="space-y-3">
                      <label className="field-label">Introdu textul dorit</label>
                      <textarea className="input" rows={3} value={textDesign} onChange={e => setTextDesign(e.target.value)} placeholder="Ex: NUME FIRMĂ, PROGRAM, CUI..."></textarea>
                    </div>
                  )}

                  {input.designOption === 'pro' && (
                    <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
                      <p className="font-semibold">Serviciu de Grafică Profesională</p>
                      <p>Cost: <strong>{formatMoneyDisplay(ALUCOBOND_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Un designer te va contacta pentru detalii.</p>
                    </div>
                  )}
                </div>
              </AccordionStep>
            </div>
            <div className="sticky bottom-0 lg:static bg-white/80 lg:bg-white backdrop-blur-sm lg:backdrop-blur-none border-t-2 lg:border lg:rounded-2xl lg:shadow-lg border-gray-200 py-4 lg:p-6 lg:mt-8">
              <div className="flex flex-col gap-3">
                <button onClick={handleAddToCart} className="btn-primary w-full py-4 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200">
                  <ShoppingCart size={24} />
                  <span className="ml-2">Adaugă în Coș</span>
                </button>
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2">
                  <p className="text-3xl font-extrabold text-gray-900">{formatMoneyDisplay(displayedTotal)}</p>
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
                  href="https://wa.me/40750473111?text=Ma%20intereseaza%20configuratorul%20alucobond" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
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
            
          </div>
        </div>

        <div className="mt-8 lg:mt-12"><ProductTabs productSlug={productSlug || 'alucobond'} /></div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)}><X size={20} className="text-gray-600" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Alucobond</h3>
            <div className="prose prose-sm max-w-none">
              <h4>Structură</h4>
              <p>Panou tip sandwich cu două fețe din aluminiu (0.3mm) și miez din polietilenă. Grosime totală 3mm sau 4mm.</p>
              <h4>Avantaje</h4>
              <ul>
                  <li>Rigiditate excepțională la greutate redusă.</li>
                  <li>Suprafață perfect plană, ideală pentru print.</li>
                  <li>Rezistență la UV, ploaie și variații de temperatură.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}