"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, CheckCircle } from "lucide-react";
import DeliveryInfo from "@/components/DeliveryInfo";
import DeliveryEstimation from "./DeliveryEstimation";
import { QA } from "@/types";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";

type FoldType = "simplu" | "fereastra" | "paralel" | "fluture";
type WeightKey = "115" | "170" | "250";
type DesignOption = "upload" | "pro";

const GALLERY = ["/products/pliante/1.webp", "/products/pliante/2.webp", "/products/pliante/3.webp", "/products/pliante/4.webp"] as const;
const FOLDS: Record<FoldType, { label: string; open: string; closed: string; index: number }> = {
  simplu: { label: "1 big (Simplu)", open: "297×210mm", closed: "148.5×210mm", index: 0 },
  fereastra: { label: "2 biguri (Fereastră)", open: "297×210mm", closed: "148.5×210mm", index: 1 },
  paralel: { label: "3 biguri (Paralel)", open: "297×210mm", closed: "75×210mm", index: 2 },
  fluture: { label: "4 biguri (Fluture)", open: "297×210mm", closed: "74.25×210mm", index: 3 },
};

const PRICE_TABLE: Record<WeightKey, { min: number; price: number }[]> = {
  "115": [{ min: 10000, price: 0.5 }, { min: 5000, price: 0.6 }, { min: 2500, price: 0.8 }, { min: 1000, price: 1.4 }, { min: 500, price: 2.0 }, { min: 100, price: 3.2 }, { min: 1, price: 3.2 }],
  "170": [{ min: 10000, price: 0.8 }, { min: 5000, price: 0.9 }, { min: 2500, price: 1.1 }, { min: 1000, price: 1.7 }, { min: 500, price: 2.3 }, { min: 100, price: 3.5 }, { min: 1, price: 3.5 }],
  "250": [{ min: 10000, price: 1.0 }, { min: 5000, price: 1.1 }, { min: 2500, price: 1.3 }, { min: 1000, price: 1.9 }, { min: 500, price: 2.5 }, { min: 100, price: 3.7 }, { min: 1, price: 3.7 }],
};
const PRO_FEES: Record<FoldType, number> = { simplu: 100, fereastra: 135, paralel: 175, fluture: 200 };

const getUnitPrice = (weight: WeightKey, qty: number) => {
  const tiers = PRICE_TABLE[weight].slice().sort((a, b) => b.min - a.min);
  for (const t of tiers) if (qty >= t.min) return t.price;
  return tiers[tiers.length - 1].price;
};

const roundMoney = (num: number) => Math.round(num * 100) / 100;
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
        { question: "Ce tipuri de hârtie sunt disponibile?", answer: "Oferim hârtie lucioasă sau mată de 115g, 170g și 250g. Hârtia de 115g este subțire și economică, ideală pentru volume mari, în timp ce cea de 250g este un carton subțire, oferind o senzație premium." },
        { question: "Ce înseamnă 'big'?", answer: "'Big' este termenul tehnic pentru îndoitură. Un pliant cu 1 big este îndoit o dată (ex: în două), unul cu 2 biguri este îndoit de două ori (ex: în trei), și așa mai departe." },
        { question: "Care sunt specificațiile pentru grafica trimisă?", answer: "Pentru o calitate optimă, grafica trebuie să fie în format PDF, la 300 dpi, cu modul de culoare CMYK și un bleed de 3mm pe fiecare latură." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && <div className="prose max-w-none text-sm"><h3>Pliante Personalizate</h3><p>Realizăm pliante de înaltă calitate, perfecte pentru a-ți promova afacerea. Alege tipul de hârtie, modul de împăturire și finisajele dorite pentru a crea un material publicitar de impact.</p></div>}
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

export default function PlianteConfigurator({ productSlug }: { productSlug?: string }) {
  const { addItem } = useCart();
  const [weight, setWeight] = useState<WeightKey>("115");
  const [quantity, setQuantity] = useState<number>(100);
  const [fold, setFold] = useState<FoldType>("simplu");
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

  useEffect(() => {
    const idx = FOLDS[fold].index;
    setActiveIndex(idx);
    setActiveImage(GALLERY[idx]);
  }, [fold]);

  const unitBasePrice = useMemo(() => getUnitPrice(weight, Math.max(1, Math.floor(quantity))), [weight, quantity]);
  const subtotal = useMemo(() => roundMoney(unitBasePrice * Math.max(1, Math.floor(quantity))), [unitBasePrice, quantity]);
  const proFee = useMemo(() => (designOption === "pro" ? PRO_FEES[fold] : 0), [designOption, fold]);
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
    if (quantity <= 0) {
      setErrorToast("Setează un tiraj valid.");
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }
    addItem({
      id: `pliante-${productSlug ?? "generic"}-${weight}-${fold}-${quantity}`,
      productId: productSlug,
      slug: productSlug,
      title: `Pliante - ${FOLDS[fold].label} - ${weight}g`,
      price: roundMoney(displayedTotal / quantity),
      quantity,
      metadata: {
        "Grosime hârtie": `${weight} g/mp`,
        "Tip împăturire": FOLDS[fold].label,
        "Grafică": designOption === 'pro' ? "Vreau grafică" : "Grafică proprie",
        ...(designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(proFee) }),
        artworkUrl
      },
    });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1600);
  }

  const summaryStep1 = `${weight}g, ${quantity} buc.`;
  const summaryStep2 = FOLDS[fold].label;
  const summaryStep3 = designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';
  
  return (
    <main className="bg-gray-50 min-h-screen">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">Produs adăugat în coș</div>
      {errorToast && <div className={`toast-error opacity-100 translate-y-0`} aria-live="assertive">{errorToast}</div>}
      
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
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Pliante</h1></div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Personalizează opțiunile în 3 pași simpli.</p>
                <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5">
                  <Info size={16} />
                  <span className="ml-2">Detalii</span>
                </button>
              </div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Hârtie & Tiraj" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="field-label">Grosime Hârtie</label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                           <OptionButton active={weight === "115"} onClick={() => setWeight("115")} title="115g" />
                           <OptionButton active={weight === "170"} onClick={() => setWeight("170")} title="170g" />
                           <OptionButton active={weight === "250"} onClick={() => setWeight("250")} title="250g" />
                        </div>
                    </div>
                    <NumberInput label="Tiraj (buc)" value={quantity} onChange={setQuantity} />
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={2} title="Tip Împăturire" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(FOLDS) as FoldType[]).map((k) => (
                      <OptionButton key={k} active={fold === k} onClick={() => setFold(k)} title={FOLDS[k].label} subtitle={`${FOLDS[k].open} -> ${FOLDS[k].closed}`} />
                    ))}
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <OptionButton active={designOption === "upload"} onClick={() => setDesignOption("upload")} title="Am Grafică" subtitle="Încarc fișierul" />
                    <OptionButton active={designOption === "pro"} onClick={() => setDesignOption("pro")} title="Vreau Grafică" subtitle={`Cost suplimentar: ${formatMoneyDisplay(PRO_FEES[fold])}`} />
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
          <div className="lg:hidden col-span-1"><ProductTabs productSlug={productSlug || 'pliante'} /></div>
        </div>
      </div>
      
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={20} className="text-gray-600" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Pliante</h3>
            <div className="prose prose-sm max-w-none">
                <h4>Hârtie și Imprimare</h4>
                <p>Pliantele sunt imprimate color față-verso (policromie) pe hârtie de înaltă calitate. Puteți alege între diferite grosimi, de la 115g (standard) la 250g (premium).</p>
                <h4>Tipuri de Împăturire (Big)</h4>
                <ul>
                    <li><strong>Simplu (1 big):</strong> O singură îndoitură, ideal pentru meniuri sau prezentări scurte.</li>
                    <li><strong>Fereastră (2 biguri):</strong> Împăturire în trei secțiuni, deschidere ca o fereastră.</li>
                    <li><strong>Paralel (3 biguri):</strong> Împăturire tip armonică, perfect pentru broșuri detaliate.</li>
                    <li><strong>Fluture (4 biguri):</strong> O împăturire mai complexă, pentru un impact vizual maxim.</li>
                </ul>
                 <h4>Grafică Profesională</h4>
                <p>Dacă nu aveți grafica pregătită, echipa noastră de designeri vă poate ajuta. Costul variază în funcție de complexitatea împăturirii, deoarece fiecare secțiune trebuie concepută individual.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}