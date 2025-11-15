"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud } from "lucide-react";
import DeliveryInfo from "@/components/DeliveryInfo";
import DeliveryEstimation from "./DeliveryEstimation";
import { QA } from "@/types";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";

type SizeKey = "A3" | "A2" | "A1" | "A0" | "S5" | "S7";
type MaterialKey = "blueback_115" | "whiteback_150_material" | "satin_170" | "foto_220" | "paper_150_lucioasa" | "paper_150_mata" | "paper_300_lucioasa" | "paper_300_mata";
type DesignOption = "upload" | "pro";

const GALLERY = ["/products/afise/1.webp", "/products/afise/2.webp", "/products/afise/3.webp", "/products/afise/4.webp"] as const;
const SIZES: { key: SizeKey; label: string; dims: string }[] = [
    { key: "A3", label: "A3", dims: "297×420 mm" }, { key: "A2", label: "A2", dims: "420×594 mm" }, { key: "A1", label: "A1", dims: "594×841 mm" },
    { key: "A0", label: "A0", dims: "841×1189 mm" }, { key: "S5", label: "S5", dims: "500×700 mm" }, { key: "S7", label: "S7", dims: "700×1000 mm" },
];
const MATERIALS: { key: MaterialKey; label: string; description: string; }[] = [
    { key: "paper_150_lucioasa", label: "Hârtie 150g lucioasă", description: "Standard, uz general" }, { key: "paper_150_mata", label: "Hârtie 150g mată", description: "Standard, aspect elegant" },
    { key: "paper_300_lucioasa", label: "Carton 300g lucios", description: "Rigiditate sporită" }, { key: "paper_300_mata", label: "Carton 300g mat", description: "Premium, fără reflexii" },
    { key: "blueback_115", label: "Blueback 115g", description: "Spate albastru, outdoor" }, { key: "whiteback_150_material", label: "Whiteback 150g", description: "Spate alb, uz interior" },
    { key: "satin_170", label: "Satin 170g", description: "Aspect satinat, foto" }, { key: "foto_220", label: "Hârtie Foto 220g", description: "Calitate fotografică" },
];
const PRICE_TABLE: Record<MaterialKey, Partial<Record<SizeKey, { min: number; price: number }[]>>> = {
    paper_150_lucioasa: { A3: [{ min: 1000, price: 1.2 }, { min: 500, price: 1.6 }, { min: 400, price: 1.88 }, { min: 300, price: 1.98 }, { min: 200, price: 2.2 }, { min: 100, price: 2.3 }, { min: 51, price: 2.5 }, { min: 1, price: 3.0 }], A2: [{ min: 1000, price: 3.12 }, { min: 500, price: 3.74 }, { min: 400, price: 4.37 }, { min: 300, price: 4.99 }, { min: 200, price: 6.24 }, { min: 100, price: 7.48 }, { min: 51, price: 8.73 }, { min: 1, price: 9.98 }], A1: [{ min: 1000, price: 12.48 }, { min: 500, price: 14.98 }, { min: 400, price: 17.48 }, { min: 300, price: 19.98 }, { min: 200, price: 24.98 }, { min: 100, price: 29.98 }, { min: 51, price: 34.96 }, { min: 1, price: 39.96 }], A0: [{ min: 1000, price: 25.0 }, { min: 500, price: 30.0 }, { min: 400, price: 35.0 }, { min: 300, price: 40.0 }, { min: 200, price: 50.0 }, { min: 100, price: 60.0 }, { min: 51, price: 70.0 }, { min: 1, price: 80.0 }], S5: [{ min: 1000, price: 8.76 }, { min: 500, price: 10.5 }, { min: 400, price: 12.26 }, { min: 300, price: 14.0 }, { min: 200, price: 17.5 }, { min: 100, price: 21.0 }, { min: 51, price: 24.5 }, { min: 1, price: 28.0 }], S7: [{ min: 1000, price: 17.5 }, { min: 500, price: 21.0 }, { min: 400, price: 24.5 }, { min: 300, price: 28.0 }, { min: 200, price: 35.0 }, { min: 100, price: 42.0 }, { min: 51, price: 49.0 }, { min: 1, price: 56.0 }] },
    paper_150_mata: {}, paper_300_lucioasa: {}, paper_300_mata: {},
    blueback_115: { A0: [{ min: 1000, price: 20.0 }, { min: 500, price: 23.0 }, { min: 400, price: 25.0 }, { min: 300, price: 30.0 }, { min: 200, price: 40.0 }, { min: 100, price: 50.0 }, { min: 51, price: 60.0 }, { min: 1, price: 70.0 }], A1: [{ min: 1000, price: 5.0 }, { min: 500, price: 5.74 }, { min: 400, price: 6.24 }, { min: 300, price: 7.49 }, { min: 200, price: 9.99 }, { min: 100, price: 12.49 }, { min: 51, price: 14.99 }, { min: 1, price: 17.48 }], A2: [{ min: 1000, price: 4.98 }, { min: 500, price: 5.74 }, { min: 400, price: 6.24 }, { min: 300, price: 7.48 }, { min: 200, price: 9.98 }, { min: 100, price: 12.48 }, { min: 51, price: 14.96 }, { min: 1, price: 17.46 }], S5: [{ min: 1000, price: 7.0 }, { min: 500, price: 8.06 }, { min: 400, price: 8.76 }, { min: 300, price: 10.5 }, { min: 200, price: 14.0 }, { min: 100, price: 17.5 }, { min: 51, price: 21.0 }, { min: 1, price: 24.5 }], S7: [{ min: 1000, price: 14.0 }, { min: 500, price: 16.1 }, { min: 400, price: 17.5 }, { min: 300, price: 21.0 }, { min: 200, price: 28.0 }, { min: 100, price: 35.0 }, { min: 51, price: 42.0 }, { min: 1, price: 49.0 }] },
    whiteback_150_material: { A0: [{ min: 1000, price: 25.0 }, { min: 500, price: 30.0 }, { min: 400, price: 35.0 }, { min: 300, price: 40.0 }, { min: 200, price: 50.0 }, { min: 100, price: 60.0 }, { min: 51, price: 70.0 }, { min: 1, price: 80.0 }], A1: [{ min: 1000, price: 12.48 }, { min: 500, price: 14.98 }, { min: 400, price: 17.48 }, { min: 300, price: 19.98 }, { min: 200, price: 24.98 }, { min: 100, price: 29.98 }, { min: 51, price: 34.96 }, { min: 1, price: 39.96 }], A2: [{ min: 1000, price: 4.98 }, { min: 500, price: 5.74 }, { min: 400, price: 6.24 }, { min: 300, price: 7.48 }, { min: 200, price: 9.98 }, { min: 100, price: 12.48 }, { min: 51, price: 14.96 }, { min: 1, price: 17.46 }], S5: [{ min: 1000, price: 8.76 }, { min: 500, price: 10.5 }, { min: 400, price: 12.26 }, { min: 300, price: 14.0 }, { min: 200, price: 17.5 }, { min: 100, price: 21.0 }, { min: 51, price: 24.5 }, { min: 1, price: 28.0 }], S7: [{ min: 1000, price: 17.5 }, { min: 500, price: 21.0 }, { min: 400, price: 24.5 }, { min: 300, price: 28.0 }, { min: 200, price: 35.0 }, { min: 100, price: 42.0 }, { min: 51, price: 49.0 }, { min: 1, price: 56.0 }] },
    satin_170: { A0: [{ min: 1000, price: 33.0 }, { min: 500, price: 35.0 }, { min: 400, price: 40.0 }, { min: 300, price: 50.0 }, { min: 200, price: 60.0 }, { min: 100, price: 70.0 }, { min: 51, price: 80.0 }, { min: 1, price: 90.0 }], A1: [{ min: 1000, price: 16.48 }, { min: 500, price: 17.48 }, { min: 400, price: 19.98 }, { min: 300, price: 24.98 }, { min: 200, price: 29.98 }, { min: 100, price: 34.96 }, { min: 51, price: 39.96 }, { min: 1, price: 44.96 }], A2: [{ min: 1000, price: 8.24 }, { min: 500, price: 8.74 }, { min: 400, price: 9.98 }, { min: 300, price: 12.48 }, { min: 200, price: 14.96 }, { min: 100, price: 17.46 }, { min: 51, price: 19.96 }, { min: 1, price: 22.46 }], S5: [{ min: 1000, price: 11.56 }, { min: 500, price: 12.26 }, { min: 400, price: 14.0 }, { min: 300, price: 17.5 }, { min: 200, price: 21.0 }, { min: 100, price: 24.5 }, { min: 51, price: 28.0 }, { min: 1, price: 31.5 }], S7: [{ min: 1000, price: 23.1 }, { min: 500, price: 24.5 }, { min: 400, price: 28.0 }, { min: 300, price: 35.0 }, { min: 200, price: 42.0 }, { min: 100, price: 49.0 }, { min: 51, price: 56.0 }, { min: 1, price: 63.0 }] },
    foto_220: { A0: [{ min: 1000, price: 40.0 }, { min: 500, price: 50.0 }, { min: 400, price: 60.0 }, { min: 300, price: 70.0 }, { min: 200, price: 80.0 }, { min: 100, price: 90.0 }, { min: 51, price: 100.0 }, { min: 1, price: 120.0 }], A1: [{ min: 1000, price: 19.98 }, { min: 500, price: 24.98 }, { min: 400, price: 29.98 }, { min: 300, price: 34.96 }, { min: 200, price: 39.96 }, { min: 100, price: 44.96 }, { min: 51, price: 49.96 }, { min: 1, price: 59.94 }], A2: [{ min: 1000, price: 9.98 }, { min: 500, price: 12.48 }, { min: 400, price: 14.96 }, { min: 300, price: 17.46 }, { min: 200, price: 19.96 }, { min: 100, price: 22.46 }, { min: 51, price: 24.94 }, { min: 1, price: 29.94 }], S5: [{ min: 1000, price: 14.0 }, { min: 500, price: 17.5 }, { min: 400, price: 21.0 }, { min: 300, price: 24.5 }, { min: 200, price: 28.0 }, { min: 100, price: 31.5 }, { min: 51, price: 35.0 }, { min: 1, price: 42.0 }], S7: [{ min: 1000, price: 28.0 }, { min: 500, price: 35.0 }, { min: 400, price: 42.0 }, { min: 300, price: 49.0 }, { min: 200, price: 56.0 }, { min: 100, price: 63.0 }, { min: 51, price: 70.0 }, { min: 1, price: 84.0 }] },
};
PRICE_TABLE.paper_150_mata = PRICE_TABLE.paper_150_lucioasa;
const findTiersFor = (material: MaterialKey, size: SizeKey) => {
    const mat = PRICE_TABLE[material];
    if (mat && mat[size]) return mat[size]!;
    if (material.startsWith("paper_300")) {
        const baseKey: MaterialKey = material.includes("lucioasa") ? "paper_150_lucioasa" : "paper_150_mata";
        return PRICE_TABLE[baseKey][size];
    }
    return undefined;
};
const getUnitFromTiers = (tiers: { min: number; price: number }[], qty: number) => {
    const sorted = tiers.slice().sort((a, b) => b.min - a.min);
    for (const t of sorted) if (qty >= t.min) return t.price;
    return sorted[sorted.length - 1].price;
};
const PRO_DESIGN_FEE = 100;
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
        { question: "Ce tipuri de hârtie pot alege?", answer: "Oferim o varietate de hârtii, de la cele subțiri (150g) pentru volume mari, la cartoane de 300g pentru un aspect premium. De asemenea, avem materiale speciale precum Blueback pentru lipire pe panouri sau hârtie foto." },
        { question: "Care este diferența dintre Blueback și Whiteback?", answer: "Hârtia Blueback are spatele albastru și este opacă, fiind ideală pentru lipirea peste alte afișe. Whiteback are spatele alb și este folosită pentru postere de interior." },
        { question: "Ce înseamnă preț în funcție de tiraj?", answer: "Prețul pe bucată scade pe măsură ce comandați o cantitate mai mare. Puteți vedea exact prețul unitar calculat în sumarul comenzii." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && <div className="prose max-w-none text-sm"><h3>Afișe și Postere Personalizate</h3><p>Promovează-ți evenimentele sau ofertele cu afișe de înaltă calitate, imprimate pe o gamă variată de materiale. Alege dimensiunea și hârtia potrivită pentru mesajul tău.</p></div>}
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

export default function AfiseConfigurator({ productSlug }: { productSlug?: string }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<SizeKey>("A2");
  const [material, setMaterial] = useState<MaterialKey>("whiteback_150_material");
  const [quantity, setQuantity] = useState<number>(50);
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

  function isMaterialVisibleForSize(mKey: MaterialKey, sKey: SizeKey) {
    if (mKey.startsWith("paper_")) return !!PRICE_TABLE.paper_150_lucioasa[sKey];
    const mat = PRICE_TABLE[mKey];
    return !!(mat && mat[sKey]);
  }

  useEffect(() => {
    const dedicatedMaterials: MaterialKey[] = ["blueback_115", "whiteback_150_material", "satin_170", "foto_220"];
    if (dedicatedMaterials.includes(material)) {
        if (!isMaterialVisibleForSize(material, size)) {
            setMaterial("paper_150_lucioasa");
        }
    }
  }, [size, material]);

  const baseUnit = useMemo(() => {
    const tiers = findTiersFor(material, size);
    if (!tiers) return 0;
    return getUnitFromTiers(tiers, Math.max(1, Math.floor(quantity)));
  }, [material, size, quantity]);

  const unitPrice = useMemo(() => {
    if (material.startsWith("paper_300")) {
      const baseTiers = findTiersFor(material, size);
      if (!baseTiers) return roundMoney(baseUnit * 2);
      const base = getUnitFromTiers(baseTiers, Math.max(1, Math.floor(quantity)));
      return roundMoney(base * 2);
    }
    return roundMoney(baseUnit);
  }, [material, baseUnit, size, quantity]);

  const proFee = designOption === "pro" ? PRO_DESIGN_FEE : 0;
  const displayedTotal = useMemo(() => roundMoney(unitPrice * quantity + proFee), [unitPrice, quantity, proFee]);

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
    addItem({
      id: `afis-${size}-${material}-${quantity}`,
      productId: productSlug, slug: productSlug,
      title: `Afiș ${size} - ${MATERIALS.find(m => m.key === material)?.label}`,
      price: roundMoney(displayedTotal / quantity),
      quantity,
      metadata: {
        "Dimensiune": SIZES.find(s => s.key === size)?.label || size,
        "Material": MATERIALS.find(m => m.key === material)?.label || material,
        "Tiraj": `${quantity} buc`,
        "Grafică": designOption === 'pro' ? "Vreau grafică" : "Grafică proprie",
        ...(designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(proFee) }),
        artworkUrl,
      },
    });
    setToastVisible(true); setTimeout(() => setToastVisible(false), 1600);
  }

  const summaryStep1 = `${SIZES.find(s => s.key === size)?.label}, ${quantity} buc.`;
  const summaryStep2 = MATERIALS.find(m => m.key === material)?.label || "Neselectat";
  const summaryStep3 = designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';
  
  return (
    <main className="bg-gray-50 min-h-screen">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">Produs adăugat în coș</div>
      {errorToast && <div className={`toast-error opacity-100 translate-y-0`} aria-live="assertive">{errorToast}</div>}
      
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Afiș" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug || 'afise'} /></div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Afișe</h1></div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Personalizează opțiunile în 3 pași simpli.</p>
                <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5">
                  <Info size={16} /><span className="ml-2">Detalii</span>
                </button>
              </div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiune & Tiraj" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="field-label">Dimensiune</label>
                        <select value={size} onChange={(e) => setSize(e.target.value as SizeKey)} className="input w-full mt-2">
                            {SIZES.map(s => <option key={s.key} value={s.key}>{s.label} — {s.dims}</option>)}
                        </select>
                    </div>
                    <NumberInput label="Tiraj (buc)" value={quantity} onChange={setQuantity} />
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={2} title="Material" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="grid grid-cols-2 gap-2">
                    {MATERIALS.filter(m => isMaterialVisibleForSize(m.key, size)).map(m => (
                        <OptionButton key={m.key} active={material === m.key} onClick={() => setMaterial(m.key)} title={m.label} subtitle={m.description} />
                    ))}
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
                          <UploadCloud className="w-6 h-6 text-gray-600" /><span className="font-medium text-gray-600">Apasă pentru a încărca</span>
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
          <div className="lg:hidden col-span-1"><ProductTabs productSlug={productSlug || 'afise'} /></div>
        </div>
      </div>
      
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)} aria-label="Închide"><X size={20} className="text-gray-600" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Afișe</h3>
            <div className="prose prose-sm max-w-none">
                <h4>Materiale Disponibile</h4>
                <p>Alegeți dintr-o gamă variată de hârtii și cartoane, de la cele standard de 150g, la materiale premium precum hârtia foto de 220g sau cartonul de 300g. Pentru aplicații outdoor sau pe panouri, recomandăm hârtia Blueback.</p>
                <h4>Specificații Tehnice</h4>
                <p>Afișele sunt imprimate color (policromie) la o calitate superioară. Pentru o acuratețe maximă a culorilor, vă rugăm să trimiteți grafica în format CMYK. Rezoluția recomandată este de 300 dpi.</p>
                 <h4>Serviciu de Grafică</h4>
                <p>Dacă nu aveți un design pregătit, echipa noastră vă stă la dispoziție pentru a crea o machetă profesională. Costul pentru acest serviciu este fix, de 100 RON.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}