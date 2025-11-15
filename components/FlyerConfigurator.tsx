"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, CheckCircle } from "lucide-react";
import DeliveryInfo from "@/components/DeliveryInfo";
import DeliveryEstimation from "./DeliveryEstimation";
import { QA } from "@/types";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";

type PriceBracket = { max: number; oneSided: number; twoSided: number };
type SizeDef = { key: string; label: string; dims: string; brackets: PriceBracket[] };
type DesignOption = "upload" | "pro";

const GALLERY = ["/products/flyere/1.webp", "/products/flyere/2.webp", "/products/flyere/3.webp", "/products/flyere/4.webp"] as const;
const SIZES: SizeDef[] = [
    { key: "A6", label: "A6", dims: "105 × 148 mm", brackets: [{ max: 100, oneSided: 0.5, twoSided: 0.96 }, { max: 500, oneSided: 0.46, twoSided: 0.88 }, { max: 1000, oneSided: 0.3, twoSided: 0.6 }, { max: 2000, oneSided: 0.28, twoSided: 0.46 }, { max: 3000, oneSided: 0.26, twoSided: 0.4 }, { max: 4000, oneSided: 0.24, twoSided: 0.36 }, { max: 5000, oneSided: 0.22, twoSided: 0.28 }, { max: Infinity, oneSided: 0.22, twoSided: 0.28 }] },
    { key: "A5", label: "A5", dims: "148 × 210 mm", brackets: [{ max: 100, oneSided: 1.0, twoSided: 1.92 }, { max: 500, oneSided: 0.92, twoSided: 1.76 }, { max: 1000, oneSided: 0.6, twoSided: 1.2 }, { max: 2000, oneSided: 0.52, twoSided: 0.64 }, { max: 3000, oneSided: 0.38, twoSided: 0.44 }, { max: 4000, oneSided: 0.32, twoSided: 0.38 }, { max: 5000, oneSided: 0.28, twoSided: 0.32 }, { max: Infinity, oneSided: 0.28, twoSided: 0.32 }] },
    { key: "21x10", label: "21 × 10 cm", dims: "210 × 100 mm", brackets: [{ max: 100, oneSided: 0.76, twoSided: 1.4 }, { max: 500, oneSided: 0.68, twoSided: 1.2 }, { max: 1000, oneSided: 0.54, twoSided: 1.0 }, { max: 2000, oneSided: 0.4, twoSided: 0.64 }, { max: 3000, oneSided: 0.36, twoSided: 0.52 }, { max: 4000, oneSided: 0.28, twoSided: 0.38 }, { max: 5000, oneSided: 0.22, twoSided: 0.28 }, { max: Infinity, oneSided: 0.22, twoSided: 0.28 }] },
];
const PAPER_WEIGHTS = [{ key: "135", label: "135 g/mp", multiplier: 1.0 }, { key: "250", label: "250 g/mp", multiplier: 1.2 }];
const PRO_FEE_PER_FACE = 50;

const findBracket = (sizeKey: string, qty: number) => SIZES.find((x) => x.key === sizeKey)?.brackets.find((b) => qty <= b.max) ?? null;
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
        { question: "Ce dimensiuni de flyere oferiți?", answer: "Oferim dimensiuni standard precum A6, A5, A4 și 1/3 A4. Pentru alte dimensiuni, vă rugăm să ne contactați pentru o ofertă personalizată." },
        { question: "Ce înseamnă laminare și de ce aș alege-o?", answer: "Laminarea este aplicarea unui strat subțire de plastic mat sau lucios peste flyer. Aceasta oferă un aspect premium, protejează împotriva uzurii și crește rigiditatea materialului." },
        { question: "Pot imprima cantități mici?", answer: "Da, tirajul minim este de 100 de bucăți. Prețul pe bucată scade semnificativ la cantități mai mari, conform grilei de prețuri." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && <div className="prose max-w-none text-sm"><h3>Fluturași Publicitari (Flyere)</h3><p>Creați fluturași publicitari de impact pentru a vă promova eficient afacerea. Oferim o gamă variată de dimensiuni și tipuri de hârtie, cu opțiuni de imprimare față sau față-verso și laminare pentru un finisaj de excepție.</p></div>}
                {activeTab === 'recenzii' && <Reviews productSlug={productSlug} />}
                {activeTab === 'faq' && <FaqAccordion qa={faqs} />}
            </div>
        </div>
    );
};
const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => ( <button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{children}</button> );
function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const inc = (d: number) => onChange(Math.max(1, value + d));
  return <div><label className="field-label">{label}</label><div className="flex"><button onClick={() => inc(-100)} className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200"><Minus size={16} /></button><input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-center w-full rounded-none border-x-0" /><button onClick={() => inc(100)} className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200"><Plus size={16} /></button></div></div>;
}
function OptionButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) {
  return <button type="button" onClick={onClick} className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${active ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-white hover:border-gray-400"}`}><div className="font-bold text-gray-800">{title}</div>{subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}</button>;
}

export default function FlyerConfigurator({ productSlug }: { productSlug?: string }) {
  const { addItem } = useCart();
  const [sizeKey, setSizeKey] = useState<string>("A5");
  const [quantity, setQuantity] = useState<number>(100);
  const [twoSided, setTwoSided] = useState<boolean>(false);
  const [paperWeightKey, setPaperWeightKey] = useState<string>("135");
  const [designOption, setDesignOption] = useState<DesignOption>("upload");
  
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  const bracket = useMemo(() => findBracket(sizeKey, quantity), [sizeKey, quantity]);
  const baseUnit = useMemo(() => (bracket ? (twoSided ? bracket.twoSided : bracket.oneSided) : 0), [bracket, twoSided]);
  const paperMultiplier = useMemo(() => PAPER_WEIGHTS.find((p) => p.key === paperWeightKey)?.multiplier ?? 1, [paperWeightKey]);
  const pricePerUnit = useMemo(() => roundMoney(baseUnit * paperMultiplier), [baseUnit, paperMultiplier]);
  const subtotal = useMemo(() => roundMoney(pricePerUnit * quantity), [pricePerUnit, quantity]);
  const proFee = useMemo(() => (designOption === "pro" ? (twoSided ? PRO_FEE_PER_FACE * 2 : PRO_FEE_PER_FACE) : 0), [designOption, twoSided]);
  const displayedTotal = roundMoney(subtotal + proFee);

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
    if (!bracket) {
      setErrorToast("Cantitate sau dimensiune invalidă.");
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }
    addItem({
      id: `flyer-${sizeKey}-${quantity}-${twoSided}-${paperWeightKey}-${designOption}`,
      productId: productSlug,
      slug: productSlug,
      title: `Flyere ${sizeKey}`,
      price: roundMoney(displayedTotal / quantity),
      quantity,
      metadata: { size: sizeKey, twoSided, paperWeight: paperWeightKey, designOption, proFee, artworkUrl },
    });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1600);
  }

  const summaryStep1 = `${sizeKey}, ${quantity} buc.`;
  const summaryStep2 = `${paperWeightKey}g, ${twoSided ? "Față-Verso" : "O față"}`;
  const summaryStep3 = designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

  return (
    <main className="bg-gray-50 min-h-screen">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">Produs adăugat în coș</div>
      {errorToast && <div className={`toast-error opacity-100 translate-y-0`} aria-live="assertive">{errorToast}</div>}
      
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Flyer" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug || 'flyere'} /></div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Flyere</h1></div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Personalizează opțiunile în 3 pași simpli.</p>
                <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5">
                  <Info size={16} />
                  <span className="ml-2">Detalii</span>
                </button>
              </div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiune & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="field-label">Dimensiune</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                           {SIZES.map(s => <OptionButton key={s.key} active={sizeKey === s.key} onClick={() => setSizeKey(s.key)} title={s.label} subtitle={s.dims} />)}
                        </div>
                    </div>
                    <NumberInput label="Cantitate (buc)" value={quantity} onChange={setQuantity} />
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={2} title="Specificații Hârtie" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="field-label">Print</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                           <OptionButton active={!twoSided} onClick={() => setTwoSided(false)} title="O față" />
                           <OptionButton active={twoSided} onClick={() => setTwoSided(true)} title="Față-Verso" />
                        </div>
                    </div>
                     <div>
                        <label className="field-label">Grosime Hârtie</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                           <OptionButton active={paperWeightKey === "135"} onClick={() => setPaperWeightKey("135")} title="135g" />
                           <OptionButton active={paperWeightKey === "250"} onClick={() => setPaperWeightKey("250")} title="250g" />
                        </div>
                    </div>
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <OptionButton active={designOption === "upload"} onClick={() => setDesignOption("upload")} title="Am Grafică" subtitle="Încarc fișierul" />
                    <OptionButton active={designOption === "pro"} onClick={() => setDesignOption("pro")} title="Vreau Grafică" subtitle={`Cost: ${formatMoneyDisplay(proFee)}`} />
                 </div>
                 {designOption === 'upload' && (
                    <div className="mt-4">
                      <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <span className="flex items-center space-x-2">
                          <UploadCloud className="w-6 h-6 text-gray-600" />
                          <span className="font-medium text-gray-600">Apasă pentru a încărca</span>
                        </span>
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
          <div className="lg:hidden col-span-1"><ProductTabs productSlug={productSlug || 'flyere'} /></div>
        </div>
      </div>
      
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={20} className="text-gray-600" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Flyere</h3>
            <div className="prose prose-sm max-w-none">
                <h4>Hârtie și Imprimare</h4>
                <p>Flyerele sunt imprimate color pe hârtie de înaltă calitate. Puteți alege între 135g (standard, flexibil) și 250g (premium, mai rigid).</p>
                 <h4>Grafică Profesională</h4>
                <p>Dacă alegeți serviciul de grafică, prețul este de 50 RON pentru o față și 100 RON pentru față-verso. Designerii noștri vor crea o machetă conform indicațiilor dumneavoastră.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}