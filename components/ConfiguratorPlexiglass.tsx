"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, Layers } from "lucide-react";
import DeliveryInfo from "@/components/DeliveryInfo";
import DeliveryEstimation from "./DeliveryEstimation";
import { QA } from "@/types";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";

const GALLERY = ["/products/plexiglass/1.webp", "/products/plexiglass/2.webp", "/products/plexiglass/3.webp", "/products/plexiglass/4.webp"] as const;
type MaterialType = "alb" | "transparent";
type DesignOption = "upload" | "pro";
type PriceInput = { width_cm: number; height_cm: number; quantity: number; material: MaterialType; thickness_mm: number; print_double: boolean; };

const PLEXI_ALB_PRICE: Record<number, number> = { 2: 200, 3: 250, 4: 300, 5: 350 };
const PLEXI_TRANSPARENT_SINGLE: Record<number, number> = { 2: 280, 3: 350, 4: 410, 5: 470, 6: 700, 8: 1100, 10: 1450 };
const PLEXI_TRANSPARENT_DOUBLE: Record<number, number> = { 2: 380, 3: 450, 4: 510, 5: 570, 6: 800, 8: 1200, 10: 1650 };
const AVAILABLE_THICKNESS_ALB = [2, 3, 4, 5];
const AVAILABLE_THICKNESS_TRANSPARENT = [2, 3, 4, 5, 6, 8, 10];
const MAX_WIDTH_CM = 400; const MAX_HEIGHT_CM = 200;

const roundMoney = (n: number) => Math.round(n * 100) / 100;
const formatMoneyDisplay = (amount: number) => new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(amount);

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
        { question: "Ce este plexiglasul?", answer: "Plexiglasul (PMMA) este un material plastic transparent și rigid, cunoscut și ca sticlă acrilică. Este mai ușor și mai rezistent la impact decât sticla, fiind ideal pentru o varietate de aplicații." },
        { question: "Ce înseamnă 'print cu alb selectiv'?", answer: "Pentru plexiglasul transparent, putem imprima un strat de cerneală albă sub grafica color. Acest lucru face ca imaginea să fie opacă și vibrantă, chiar și pe un material transparent." },
        { question: "Se poate decupa pe contur?", answer: "Da, oferim servicii de decupare computerizată (CNC) pe orice contur dorit. Pentru aceasta, este necesar să ne trimiteți un fișier vectorial (ex: .ai, .eps, .dxf)." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && <div className="prose max-w-none text-sm"><h3>Plăci Plexiglas Personalizate</h3><p>Oferim servicii de imprimare UV direct pe plăci de plexiglas (sticlă acrilică), alb sau transparent. Ideal pentru signalistică, panouri publicitare, decor interior sau piese de mobilier. Calitate excepțională a printului și rezistență îndelungată.</p></div>}
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

export default function ConfiguratorPlexiglass({ productSlug }: { productSlug?: string }) {
  const { addItem } = useCart();
  const [input, setInput] = useState<PriceInput>({ width_cm: 0, height_cm: 0, quantity: 1, material: 'alb', thickness_mm: 2, print_double: false });
  const [designOption, setDesignOption] = useState<DesignOption>("upload");
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(GALLERY[0]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  const updateInput = <K extends keyof PriceInput>(k: K, v: PriceInput[K]) => setInput(p => ({ ...p, [k]: v }));

  const availableThickness = useMemo(() => input.material === 'alb' ? AVAILABLE_THICKNESS_ALB : AVAILABLE_THICKNESS_TRANSPARENT, [input.material]);

  useEffect(() => {
    if (!availableThickness.includes(input.thickness_mm)) {
      updateInput('thickness_mm', availableThickness[0]);
    }
  }, [input.material, input.thickness_mm, availableThickness]);

  const priceDetails = useMemo(() => {
    const { width_cm, height_cm, quantity, material, thickness_mm, print_double } = input;
    if (width_cm <= 0 || height_cm <= 0) return { finalPrice: 0, total_sqm: 0 };
    const sqm_per_unit = (width_cm / 100) * (height_cm / 100);
    const total_sqm = sqm_per_unit * quantity;
    let pricePerSqm = 0;
    if (material === 'alb') {
        pricePerSqm = PLEXI_ALB_PRICE[thickness_mm] || 0;
    } else {
        pricePerSqm = print_double ? (PLEXI_TRANSPARENT_DOUBLE[thickness_mm] || 0) : (PLEXI_TRANSPARENT_SINGLE[thickness_mm] || 0);
    }
    const finalPrice = roundMoney(total_sqm * pricePerSqm);
    return { finalPrice, total_sqm: roundMoney(total_sqm) };
  }, [input]);
  
  const displayedTotal = priceDetails.finalPrice;

  const handleArtworkFileInput = async (file: File | null) => {
    setArtworkUrl(null); setUploadError(null); if (!file) return;
    try {
      setUploading(true);
      const form = new FormData(); form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload eșuat");
      const data = await res.json(); setArtworkUrl(data.url);
    } catch (e: any) {
      setUploadError(e?.message ?? "Eroare la upload");
    } finally {
      setUploading(false);
    }
  };

  function handleAddToCart() {
    if (input.width_cm <= 0 || input.height_cm <= 0) { setErrorToast("Introduceți dimensiuni valide."); return; }
    if (input.width_cm > MAX_WIDTH_CM || input.height_cm > MAX_HEIGHT_CM) { setErrorToast(`Dimensiunile maxime sunt ${MAX_WIDTH_CM}x${MAX_HEIGHT_CM}cm.`); return; }
    
    addItem({
      id: `plexiglas-${input.material}-${input.thickness_mm}-${input.width_cm}x${input.height_cm}`,
      productId: productSlug, slug: productSlug,
      title: `Placă Plexiglas ${input.material} ${input.thickness_mm}mm`,
      price: roundMoney(displayedTotal / input.quantity), quantity: input.quantity,
      metadata: {
        "Dimensiuni": `${input.width_cm} x ${input.height_cm} cm`,
        "Material": `Plexiglas ${input.material}`,
        "Grosime": `${input.thickness_mm} mm`,
        "Tip Print": input.print_double ? "Față-Verso (cu alb selectiv)" : "O față",
        "Grafică": designOption === 'pro' ? "Grafică profesională (contact ulterior)" : "Grafică proprie",
        artworkUrl,
      },
    });
    setToastVisible(true); setTimeout(() => setToastVisible(false), 1600);
  }

  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm} x ${input.height_cm} cm, ${input.quantity} buc.` : "Alege dimensiuni";
  const summaryStep2 = `Plexiglas ${input.material}, ${input.thickness_mm}mm, Print ${input.print_double ? 'față-verso' : 'o față'}`;
  const summaryStep3 = designOption === 'upload' ? 'Grafică proprie' : 'Grafică Pro (contact ulterior)';
  
  return (
    <main className="bg-gray-50 min-h-screen">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">Produs adăugat în coș</div>
      {errorToast && <div className={`toast-error opacity-100 translate-y-0`} aria-live="assertive">{errorToast}</div>}
      
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Plexiglas" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug || 'plexiglas'} /></div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Plexiglas</h1></div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Personalizează opțiunile în 3 pași simpli.</p>
                <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button>
              </div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="field-label">Lățime (cm)</label><input type="text" inputMode="numeric" value={input.width_cm || ''} onChange={e => updateInput('width_cm', Number(e.target.value.replace(/\D/g, '')))} placeholder="ex: 100" className="input" /></div>
                    <div><label className="field-label">Înălțime (cm)</label><input type="text" inputMode="numeric" value={input.height_cm || ''} onChange={e => updateInput('height_cm', Number(e.target.value.replace(/\D/g, '')))} placeholder="ex: 70" className="input" /></div>
                    <div className="md:col-span-2"><NumberInput label="Cantitate" value={input.quantity} onChange={v => updateInput('quantity', v)} /></div>
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={2} title="Material & Grosime" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="field-label">Tip Material</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                           <OptionButton active={input.material === 'alb'} onClick={() => updateInput('material', 'alb')} title="Alb" />
                           <OptionButton active={input.material === 'transparent'} onClick={() => updateInput('material', 'transparent')} title="Transparent" />
                        </div>
                    </div>
                    <div>
                        <label className="field-label">Grosime</label>
                        <select value={input.thickness_mm} onChange={e => updateInput('thickness_mm', Number(e.target.value))} className="input w-full mt-2">
                            {availableThickness.map(t => <option key={t} value={t}>{t} mm</option>)}
                        </select>
                    </div>
                    {input.material === 'transparent' && <div className="md:col-span-2"><label className="flex items-center gap-3 py-2 cursor-pointer"><input type="checkbox" className="checkbox" checked={input.print_double} onChange={e => updateInput('print_double', e.target.checked)} /><span className="text-sm font-medium text-gray-700">Print față-verso (cu alb selectiv)</span></label></div>}
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <OptionButton active={designOption === "upload"} onClick={() => setDesignOption("upload")} title="Am Grafică" subtitle="Încarc fișierul" />
                    <OptionButton active={designOption === "pro"} onClick={() => setDesignOption("pro")} title="Vreau Grafică" subtitle="Contact ulterior pentru preț" />
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
          <div className="lg:hidden col-span-1"><ProductTabs productSlug={productSlug || 'plexiglas'} /></div>
        </div>
      </div>
      
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)} aria-label="Închide"><X size={20} className="text-gray-600" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Plexiglas</h3>
            <div className="prose prose-sm max-w-none">
                <h4>Material și Imprimare</h4>
                <p>Imprimăm direct pe plăci de plexiglas alb sau transparent, folosind tehnologie UV pentru culori vibrante și rezistente. Puteți alege grosimea materialului în funcție de aplicația dorită.</p>
                <h4>Print pe Transparent</h4>
                <p>Pentru plexiglasul transparent, oferim opțiunea de print față-verso, care include un strat de alb selectiv între straturile de culoare. Acest proces asigură o vizibilitate excelentă a graficii din ambele părți.</p>
                 <h4>Grafică Profesională</h4>
                <p>Dacă nu aveți un design, puteți selecta opțiunea de grafică profesională. Veți fi contactat de un designer după plasarea comenzii pentru a stabili detaliile și costul serviciului.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}