"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Ruler, Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, Frame, TrendingUp, Percent, MessageCircle } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import SmartNewsletterPopup from "./SmartNewsletterPopup";
import RelatedProducts from "./RelatedProducts";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
import { QA } from "@/types";
import { 
  calculateCanvasPrice, 
  getCanvasUpsell,
  CANVAS_CONSTANTS, 
  formatMoneyDisplay, 
  type PriceInputCanvas 
} from "@/lib/pricing";

const GALLERY = [
  "/products/canvas/canvas-1.webp",
  "/products/canvas/canvas-2.webp",
  "/products/canvas/canvas-3.webp", 
] as const;

const canvasFaqs: QA[] = [
  { question: "Ce este canvasul Fine Art?", answer: "Este o pânză texturată de calitate superioară, similară celei folosite de pictori profesioniști. Imprimarea se face cu cerneală eco-solvent rezistentă la UV." },
  { question: "Șasiul este inclus în preț?", answer: "Da, toate tablourile canvas vin montate pe șasiu din lemn de rășinoase, cu grosime de 2cm sau 4cm la alegere, gata de atârnat." },
  { question: "Cum se montează pe perete?", answer: "Fiecare tablou vine cu sistem de atârnare pe spate. Pur și simplu agățați-l de un cui sau șurub în perete." },
  { question: "Rezistă la umiditate?", answer: "Canvasul este tratat cu spray protector care oferă rezistență bună, dar recomandăm evitarea expunerii directe la apă sau umiditate extremă." },
  { question: "Pot comanda dimensiuni custom?", answer: "Da, acceptăm dimensiuni personalizate. Contactați-ne pentru o ofertă specială." },
];

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

const productFaqs: QA[] = [
  { question: "Ce material folosiți pentru tablouri?", answer: "Folosim Canvas Fine Art - pânză realizată prin combinația de bumbac și poliester, 330 g/mp, pentru imprimări de cea mai bună calitate. Materialul nu se cutează iar la tăiere țesătura nu se destramă." },
  { question: "Tabloul vine gata de agățat?", answer: "Da, pânza este întinsă pe un șasiu din lemn uscat, cu margine oglindită (imaginea continuă pe laterale). Tabloul include sistem de prindere și este gata de pus pe perete imediat ce îl scoateți din cutie." },
  { question: "Pentru ce tipuri de imagini este recomandat?", answer: "Canvas Fine Art este ideal pentru reproduceri de opere de artă, tablouri, portrete, peisaje, decor teatru și film, colaje și decorări speciale de interior." },
];

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
export default function CanvasConfigurator({ productSlug, initialWidth: initW, initialHeight: initH, productImage }: Props) {
  const { addItem } = useCart();
  const GALLERY = useMemo(() => productImage ? [productImage, "/products/canvas/canvas-1.webp", "/products/canvas/canvas-2.webp", "/products/canvas/canvas-3.webp"] : ["/products/canvas/canvas-1.webp", "/products/canvas/canvas-2.webp", "/products/canvas/canvas-3.webp", "/products/canvas/canvas-4.webp"], [productImage]);
  const [input, setInput] = useState<PriceInputCanvas>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    edge_type: "mirror", // implicit și fix: oglindită
    designOption: "upload",
    frameType: "framed", // implicit: cu ramă
    framedSize: "30x40", // dimensiune implicită pentru opțiunea cu ramă
    framedShape: "rectangle", // formă implicită: dreptunghi
  });

  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");
  
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [activeProductTab, setActiveProductTab] = useState<'descriere' | 'recenzii' | 'faq'>('descriere');
  const [userEmail, setUserEmail] = useState<string>('');
  const toast = useToast();

  // Pricing
  const priceData = useMemo(() => calculateCanvasPrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  // Upsell Logic (doar pentru Fără Ramă)
  const upsellOpportunity = useMemo(() => {
    const result = getCanvasUpsell(input);
    console.log('🔍 CANVAS UPSELL DEBUG:', { input, result, frameType: input.frameType });
    return result;
  }, [input]);

  // Auto-capture abandoned carts
  const cartData = useMemo(() => ({
    configuratorId: 'canvas',
    email: userEmail,
    configuration: input,
    price: displayedTotal,
    quantity: input.quantity
  }), [userEmail, input, displayedTotal]);

  useUserActivityTracking(cartData);

  const updateInput = <K extends keyof PriceInputCanvas>(k: K, v: PriceInputCanvas[K]) => setInput((p) => ({ ...p, [k]: v }));
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
    // Validare pentru opțiunea cu ramă
    if (input.frameType === "framed") {
      if (!input.framedSize) {
        toast?.warning("Selectați o dimensiune.");
        return;
      }
    } else {
      // Validare pentru opțiunea fără ramă (dimensiuni personalizate)
      if (!input.width_cm || !input.height_cm) {
        toast?.warning("Introduceți dimensiunile.");
        return;
      }
    }

    if (displayedTotal <= 0) {
      toast?.warning("Prețul trebuie calculat.");
      return;
    }

    const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
    const uniqueId = `${productSlug ?? 'canvas'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    
    let title = "";
    if (input.frameType === "framed") {
      const [w, h] = (input.framedSize || "").split("x");
      const shapeLabel = input.framedShape === "square" ? "Pătrat" : "Dreptunghi";
      title = `Tablou Canvas cu Ramă ${shapeLabel} ${w}×${h} cm`;
    } else {
      title = `Tablou Canvas ${input.width_cm}×${input.height_cm} cm`;
    }

    const edgeLabels = { white: "Albă", mirror: "Oglindită", wrap: "Continuată (Wrap)" };

    addItem({
      id: uniqueId,
      productId: productSlug ?? "canvas",
      slug: productSlug ?? "canvas",
      title,
      width: input.frameType === "framed" ? parseInt((input.framedSize || "").split("x")[0]) : input.width_cm,
      height: input.frameType === "framed" ? parseInt((input.framedSize || "").split("x")[1]) : input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        "Tip": input.frameType === "framed" ? "Cu Ramă" : "Fără Ramă",
        ...(input.frameType === "framed" && { "Formă": input.framedShape === "square" ? "Pătrat" : "Dreptunghi" }),
        "Grafică": input.designOption === 'pro' ? 'Vreau grafică' : 'Grafică proprie',
        ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(CANVAS_CONSTANTS.PRO_DESIGN_FEE) }),
        artworkUrl,
      },
    });
    toast?.success("Produs adăugat în coș");
  }

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 3000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex]);

  const summaryStep1 = input.frameType === "framed" ? "Cu Ramă" : "Fără Ramă";
  const summaryStep2 = input.frameType === "framed" 
    ? `${input.framedShape === "square" ? "Pătrat" : "Dreptunghi"} ${input.framedSize?.replace("x", "×")} cm, ${input.quantity} buc.`
    : (input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}×${input.height_cm} cm, ${input.quantity} buc.` : "Alege dimensiuni");
  const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Canvas" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3">
                <h1 className="text-3xl font-extrabold text-gray-900">Configurator Canvas</h1>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-500 text-white font-bold text-sm animate-pulse">
                  🔥 -20% REDUCERE
                </span>
              </div>
              <div className="flex justify-between items-center"><p className="text-gray-600">Personalizează tabloul în 3 pași simpli.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              {/* Pas 1: Tip Canvas (Cu Ramă / Fără Ramă) */}
              <AccordionStep stepNumber={1} title="Tip Canvas" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="mb-4">
                  <label className="field-label mb-3">Selectează tipul de canvas</label>
                  <div className="grid grid-cols-2 gap-3">
                    <OptionButton 
                      active={input.frameType === "framed"} 
                      onClick={() => updateInput("frameType", "framed")} 
                      title="Cu Ramă" 
                      subtitle="Dimensiuni prestabilite" 
                    />
                    <OptionButton 
                      active={input.frameType === "none"} 
                      onClick={() => updateInput("frameType", "none")} 
                      title="Fără Ramă" 
                      subtitle="Dimensiuni personalizate" 
                    />
                  </div>
                </div>
              </AccordionStep>

              {/* Pas 2: Formă & Dimensiuni */}
              <AccordionStep stepNumber={2} title="Formă & Dimensiuni" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                {/* Pentru Cu Ramă */}
                {input.frameType === "framed" && (
                  <>
                    {/* Selector Formă */}
                    <div className="mb-4">
                      <label className="field-label mb-3">Formă</label>
                      <div className="grid grid-cols-2 gap-3">
                        <OptionButton 
                          active={input.framedShape === "rectangle"} 
                          onClick={() => {
                            updateInput("framedShape", "rectangle");
                            updateInput("framedSize", "30x40");
                          }} 
                          title="Dreptunghi" 
                        />
                        <OptionButton 
                          active={input.framedShape === "square"} 
                          onClick={() => {
                            updateInput("framedShape", "square");
                            updateInput("framedSize", "30x30");
                          }} 
                          title="Pătrat" 
                        />
                      </div>
                    </div>

                    {/* Dimensiuni în funcție de formă */}
                    <div className="mb-4">
                      <label className="field-label mb-3">Dimensiune</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.keys(
                          input.framedShape === "square" 
                            ? CANVAS_CONSTANTS.FRAMED_PRICES_SQUARE 
                            : CANVAS_CONSTANTS.FRAMED_PRICES_RECTANGLE
                        ).map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => updateInput("framedSize", size)}
                            className={`px-3 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                              input.framedSize === size 
                                ? "border-indigo-600 bg-indigo-50 text-indigo-600" 
                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                            }`}
                          >
                            {size.replace("x", "×")} cm
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cantitate */}
                    <div>
                      <NumberInput label="Cantitate" value={input.quantity} onChange={setQty} />
                    </div>
                  </>
                )}

                {/* Pentru Fără Ramă - Dimensiuni Personalizate */}
                {input.frameType === "none" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="field-label">Lățime (cm)</label><input type="text" inputMode="numeric" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="40" className="input" /></div>
                      <div><label className="field-label">Înălțime (cm)</label><input type="text" inputMode="numeric" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="60" className="input" /></div>
                    </div>
                    <div>
                      <NumberInput label="Cantitate" value={input.quantity} onChange={setQty} />
                      
                      {/* UPSELL ALERT (doar pentru Fără Ramă) */}
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
                )}
              </AccordionStep>

              {/* Pas 3: Grafică */}
              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                <div>
                  <div className="mb-4 border-b border-gray-200">
                    <div className="flex -mb-px">
                      <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Fotografie</TabButton>
                      <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Colaj / Editare</TabButton>
                    </div>
                  </div>

                  {input.designOption === 'upload' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Încarcă fotografia ta (JPG, PNG, TIFF).</p>
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
                      <p className="font-semibold">Serviciu Editare / Colaj</p>
                      <p>Cost: <strong>{formatMoneyDisplay(CANVAS_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Designerii noștri pot crea un colaj, retușa fotografia sau adăuga text.</p>
                    </div>
                  )}
                </div>
              </AccordionStep>
            </div>
            <div className="sticky bottom-0 lg:static bg-white/80 lg:bg-white backdrop-blur-sm lg:backdrop-blur-none border-t-2 lg:border lg:rounded-2xl lg:shadow-lg border-gray-200 py-4 lg:p-6 lg:mt-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3 text-center">
                <p className="text-red-600 font-bold text-sm">🎉 Reducere specială 20% aplicată la toate tablourile canvas!</p>
              </div>
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
                  href="https://wa.me/40750473111?text=Ma%20intereseaza%20configuratorul%20canvas" 
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
          </div>
        </div>

        {/* SECȚIUNE DESCRIERE & FEATURES - FULL WIDTH JOS */}
        <div className="mt-8 lg:mt-12 bg-white rounded-2xl shadow-lg border border-gray-200">
          <nav className="border-b border-gray-200 flex">
            <button onClick={() => setActiveProductTab('descriere')} className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeProductTab === 'descriere' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Descriere</button>
            <button onClick={() => setActiveProductTab('recenzii')} className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeProductTab === 'recenzii' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Recenzii</button>
            <button onClick={() => setActiveProductTab('faq')} className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${activeProductTab === 'faq' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>FAQ</button>
          </nav>

          <div className="p-6 lg:p-8">

              {activeProductTab === 'descriere' && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tablouri Canvas Fine Art</h2>
                  <p className="text-gray-600 mb-6">
                    Transformă fotografiile preferate în opere de artă autentice. Tablourile noastre sunt imprimate la rezoluție înaltă pe pânză Canvas Fine Art și întinse manual pe șasiu de lemn.
                  </p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Materiale & Calitate</h3>
                      <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span><strong>Canvas Fine Art</strong> - pânză bumbac + poliester 330 g/mp</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span><strong>Șasiu lemn</strong> - cadru din lemn de rășinoase, rezistent</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span><strong>Margine oglindită</strong> - imaginea continuă pe laterale</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span><strong>Spray protector UV</strong> - finisaj museum grade</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">De ce să alegi Canvas?</h3>
                      <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span>Reproduceri opere de artă la calitate muzeală</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span>Tablouri și portrete pentru decorare premium</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span>Gata de agățat - sistem de prindere inclus</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 mt-1">✓</span>
                          <span>Livrare în siguranță - ambalaj protectiv special</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900 mb-1">Pânză Fine Art</h3>
                        <p className="text-sm text-gray-600">Textilă de calitate premium, imprimare rezistentă</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900 mb-1">Șasiu Lemn Masiv</h3>
                        <p className="text-sm text-gray-600">Cadru din lemn de rășinoase, gata de atârnat</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900 mb-1">Finisaj Museum</h3>
                        <p className="text-sm text-gray-600">Spray protector UV, culorile rezistă ani de zile</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900 mb-1">Ambalaj Protecție</h3>
                        <p className="text-sm text-gray-600">Livrare în siguranță, cutie carton specială</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeProductTab === 'recenzii' && <Reviews productSlug={productSlug || 'canvas'} />}
              
              {activeProductTab === 'faq' && <FaqAccordion qa={productFaqs} />}
            </div>
          </div>
        </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)}><X size={20} className="text-gray-600" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Canvas Fine Art</h3>
            <div className="prose prose-sm max-w-none">
              <h4>Material Canvas Fine Art</h4>
              <p>Pânză realizată prin combinația de bumbac și poliester pentru imprimări de cea mai bună calitate. Materialul nu se cutează iar la tăiere țesătura nu se destramă.</p>
              <ul>
                <li><strong>Grosime:</strong> 330 g/mp</li>
                <li><strong>Dimensiuni rolă:</strong> lățime 1.03, 1.26, 1.55, 3.10 m; lungime 50 m</li>
              </ul>
              <h4>Finisaj</h4>
              <p>Margine oglindită standard - imaginea continuă pe lateralele șasiului pentru un aspect profesional.</p>
              <h4>Șasiu</h4>
              <p>Lemn de brad uscat, profil 2×4 cm, rezistent la deformare. Pânza este întinsă manual pentru o tensiune perfectă.</p>
            </div>
          </div>
        </div>
      )}

      {/* Smart Newsletter Popup */}
      <SmartNewsletterPopup 
        onSubscribe={(email) => setUserEmail(email)}
        delay={30}
      />

      {/* Related Products Section */}
      <RelatedProducts category="canvas" />
    </main>
  );
}