"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Ruler, Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import { QA } from "@/types";
import { 
  calculateCartonPrice, 
  CARTON_CONSTANTS, 
  formatMoneyDisplay, 
  type PriceInputCarton 
} from "@/lib/pricing";

const GALLERY = [
  "/products/materiale/carton/carton-1.webp",
  "/products/materiale/carton/carton-2.webp",
  "/products/materiale/carton/carton-3.webp",
  "/products/materiale/carton/carton-4.webp"
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
        { question: "Care este diferența dintre ondulat și reciclat?", answer: "Cartonul ondulat (CO) este clasic, format din straturi (ex: CO3, CO5), ideal pentru ambalaje. Cartonul reciclat (Honeycomb/Board) are structură de fagure, este foarte rigid și ușor, ideal pentru display-uri și mobilier eco." },
        { question: "Ce grosimi sunt disponibile?", answer: "Ondulat: de la 1mm (Micro) la 5mm (CO5). Reciclat: 10mm și 16mm." },
        { question: "Ce este cantul?", answer: "Pentru cartonul reciclat rigid, marginile pot fi protejate și estetizate cu o bandă adezivă specială (cant), albă sau colorată." },
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
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Soluții Carton Personalizate</h2>
                        <p className="text-gray-700 mb-8 leading-relaxed">Producem ambalaje, standuri și elemente de signalistică din carton ondulat sau carton structural (fagure) reciclabil. Imprimare directă UV de înaltă calitate.</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">Carton Prespahn Rigid</h3>
                                <p className="text-sm text-gray-600">Grosime 1.5mm-3mm, rezistență structură</p>
                            </div>
                            
                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">Preț Mic</h3>
                                <p className="text-sm text-gray-600">Soluție economică pentru interior, temporar</p>
                            </div>
                            
                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">Ușor de Montat</h3>
                                <p className="text-sm text-gray-600">Lipsă ușor, ideal standuri, evenimente, PLV</p>
                            </div>
                            
                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">Print Full-Color</h3>
                                <p className="text-sm text-gray-600">Calitate excelentă, finisaj mat sau lucios</p>
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

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productType?: string };

/* --- MAIN COMPONENT --- */
export default function ConfiguratorCarton({ productSlug, initialWidth: initW, initialHeight: initH }: Props) {
  const { addItem } = useCart();
  const [input, setInput] = useState<PriceInputCarton>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    material: "ondulat",
    ondula: "E",
    reciclatBoard: "board16",
    edgePerimeter_m: 0,
    edgeType: "board16",
    designOption: "upload",
    printDouble: false
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

  // Pricing Calculation - FULL CLIENT SIDE
  const priceData = useMemo(() => calculateCartonPrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  const updateInput = <K extends keyof PriceInputCarton>(k: K, v: PriceInputCarton[K]) => setInput((p) => ({ ...p, [k]: v }));
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
      toast.warning("Introduceți dimensiunile."); return;
    }
    if (input.width_cm > CARTON_CONSTANTS.LIMITS.MAX_WIDTH || input.height_cm > CARTON_CONSTANTS.LIMITS.MAX_HEIGHT) {
        toast.warning(`Dimensiune maximă: ${CARTON_CONSTANTS.LIMITS.MAX_WIDTH}x${CARTON_CONSTANTS.LIMITS.MAX_HEIGHT} cm`); 
        return;
    }
    if (displayedTotal <= 0) {
      toast.warning("Prețul trebuie calculat."); return;
    }

    const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
    const matLabel = input.material === "ondulat" ? `Ondulat ${input.ondula}` : `Reciclat ${input.reciclatBoard}`;
    const uniqueId = `${productSlug ?? 'carton'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "carton",
      slug: productSlug ?? "carton",
      title: `Carton ${matLabel} - ${input.width_cm}x${input.height_cm} cm`,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        "Material": matLabel,
        "Print": input.printDouble ? "Față-Verso" : "O față",
        "Cant (Perimetru)": input.material === 'reciclat' && input.edgePerimeter_m ? `${input.edgePerimeter_m} ml` : "-",
        "Grafică": input.designOption === 'pro' ? 'Vreau grafică' : input.designOption === 'text_only' ? 'Doar text' : 'Grafică proprie',
        ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(CARTON_CONSTANTS.PRO_DESIGN_FEE) }),
        ...(input.designOption === 'text_only' && { "Text": textDesign }),
        artworkUrl,
      },
    });
  }

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 3000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex]);

  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
  const summaryStep2 = input.material === "ondulat" ? `Ondulat ${input.ondula}` : `Reciclat ${input.reciclatBoard}`;
  const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : input.designOption === 'text_only' ? 'Doar text' : 'Design Pro';

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Carton" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Carton</h1></div>
              <div className="flex justify-between items-center"><p className="text-gray-600">Personalizează în 3 pași simpli.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="field-label">Lățime (cm)</label><input type="text" inputMode="numeric" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="100" className="input" /></div>
                  <div><label className="field-label">Înălțime (cm)</label><input type="text" inputMode="numeric" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="50" className="input" /></div>
                  <div className="md:col-span-2"><NumberInput label="Cantitate" value={input.quantity} onChange={setQty} /></div>
                  <p className="text-xs text-gray-400 md:col-span-2">Maxim: {CARTON_CONSTANTS.LIMITS.MAX_WIDTH}x{CARTON_CONSTANTS.LIMITS.MAX_HEIGHT} cm</p>
                </div>
              </AccordionStep>
              
              <AccordionStep stepNumber={2} title="Material & Detalii" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="field-label">Tip Carton</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <OptionButton active={input.material === "ondulat"} onClick={() => updateInput("material", "ondulat")} title="Ondulat" subtitle="Clasic" />
                            <OptionButton active={input.material === "reciclat"} onClick={() => updateInput("material", "reciclat")} title="Reciclat" subtitle="Rigid (Fagure)" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="field-label">Grosime / Tip</label>
                        {input.material === "ondulat" ? (
                            <select className="input w-full mt-2" value={input.ondula} onChange={(e) => updateInput("ondula", e.target.value)}>
                                <option value="E">Micro Ondula E (1mm)</option>
                                <option value="3B">Ondula B (3mm)</option>
                                <option value="5BC">Ondula BC (5mm)</option>
                            </select>
                        ) : (
                             <select className="input w-full mt-2" value={input.reciclatBoard} onChange={(e) => updateInput("reciclatBoard", e.target.value)}>
                                <option value="board10">Board 10mm</option>
                                <option value="board16">Board 16mm</option>
                            </select>
                        )}
                    </div>
                </div>

                {input.material === "ondulat" && (
                     <label className="flex items-center gap-3 py-2 cursor-pointer"><input type="checkbox" className="checkbox" checked={input.printDouble} onChange={(e) => updateInput("printDouble", e.target.checked)} /><span className="text-sm font-medium text-gray-700">Print Față-Verso</span></label>
                )}

                {input.material === "reciclat" && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-bold mb-2">Cant (Protecție margini)</p>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="text-xs text-gray-500">Lungime totală (ml)</label>
                                <input type="number" className="input" value={input.edgePerimeter_m || ""} onChange={(e) => updateInput("edgePerimeter_m", parseFloat(e.target.value))} placeholder="ex: 2.5" />
                             </div>
                             <div>
                                <label className="text-xs text-gray-500">Tip cant</label>
                                <select className="input w-full" value={input.edgeType || ""} onChange={(e) => updateInput("edgeType", e.target.value)}>
                                    <option value="board10">Cant 10mm</option>
                                    <option value="board16">Cant 16mm</option>
                                </select>
                             </div>
                         </div>
                    </div>
                )}
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
                      <p className="text-sm text-gray-600">Încarcă fișierul tău (PDF, JPG, AI).</p>
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
                      <textarea className="input" rows={3} value={textDesign} onChange={e => setTextDesign(e.target.value)} placeholder="Descriere..."></textarea>
                    </div>
                  )}

                  {input.designOption === 'pro' && (
                    <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
                      <p className="font-semibold">Serviciu de Grafică Profesională</p>
                      <p>Cost: <strong>{formatMoneyDisplay(CARTON_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Un designer te va contacta.</p>
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
        </div>

        <div className="mt-8 lg:mt-12"><ProductTabs productSlug={productSlug || 'carton'} /></div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)}><X size={20} className="text-gray-600" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Carton</h3>
            <div className="prose prose-sm max-w-none">
              <h4>Materiale</h4>
              <p><strong>Ondulat:</strong> Standard, pentru cutii și ambalaje. Diverse grosimi.</p>
              <p><strong>Reciclat (Honeycomb):</strong> Structură internă tip fagure, foarte rezistent la comprimare, ideal pentru mobilier și standuri.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}