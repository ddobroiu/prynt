"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud } from "lucide-react";
import DeliveryInfo from "@/components/DeliveryInfo";
import DeliveryEstimation from "./DeliveryEstimation";
import { QA } from "@/types";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";

const GALLERY = ["/products/canvas/1.webp", "/products/canvas/2.webp", "/products/canvas/3.webp", "/products/canvas/4.webp"] as const;
const SIZE_PRICE_MAP: Record<string, number> = {
    "30x40": 89, "30x50": 99, "40x60": 119, "50x70": 169, "60x90": 199, "80x100": 249, "80x120": 299, "100x120": 369,
    "30x30": 79, "40x40": 99, "50x50": 129, "60x60": 149, "70x70": 189, "80x80": 219, "90x90": 299, "100x100": 389,
};
type SizeOption = { w: number; h: number; key: string; price: number; label: string };
const RECT_SIZES: SizeOption[] = [
    { w: 30, h: 40, key: "30x40", price: SIZE_PRICE_MAP["30x40"], label: "30×40 cm" }, { w: 30, h: 50, key: "30x50", price: SIZE_PRICE_MAP["30x50"], label: "30×50 cm" },
    { w: 40, h: 60, key: "40x60", price: SIZE_PRICE_MAP["40x60"], label: "40×60 cm" }, { w: 50, h: 70, key: "50x70", price: SIZE_PRICE_MAP["50x70"], label: "50×70 cm" },
    { w: 60, h: 90, key: "60x90", price: SIZE_PRICE_MAP["60x90"], label: "60×90 cm" }, { w: 80, h: 100, key: "80x100", price: SIZE_PRICE_MAP["80x100"], label: "80×100 cm" },
    { w: 80, h: 120, key: "80x120", price: SIZE_PRICE_MAP["80x120"], label: "80×120 cm" }, { w: 100, h: 120, key: "100x120", price: SIZE_PRICE_MAP["100x120"], label: "100×120 cm" },
];
const SQUARE_SIZES: SizeOption[] = [
    { w: 30, h: 30, key: "30x30", price: SIZE_PRICE_MAP["30x30"], label: "30×30 cm" }, { w: 40, h: 40, key: "40x40", price: SIZE_PRICE_MAP["40x40"], label: "40×40 cm" },
    { w: 50, h: 50, key: "50x50", price: SIZE_PRICE_MAP["50x50"], label: "50×50 cm" }, { w: 60, h: 60, key: "60x60", price: SIZE_PRICE_MAP["60x60"], label: "60×60 cm" },
    { w: 70, h: 70, key: "70x70", price: SIZE_PRICE_MAP["70x70"], label: "70×70 cm" }, { w: 80, h: 80, key: "80x80", price: SIZE_PRICE_MAP["80x80"], label: "80×80 cm" },
    { w: 90, h: 90, key: "90x90", price: SIZE_PRICE_MAP["90x90"], label: "90×90 cm" }, { w: 100, h: 100, key: "100x100", price: SIZE_PRICE_MAP["100x100"], label: "100×100 cm" },
];
const pricePerSqmForTotalArea = (totalSqm: number) => {
    if (totalSqm <= 0) return 0; if (totalSqm < 1) return 175; if (totalSqm <= 5) return 150;
    if (totalSqm <= 20) return 130; if (totalSqm <= 50) return 100; return 80;
};
const MAX_WIDTH_CM_NO_FRAME = 310; const MAX_LENGTH_CM_NO_FRAME = 5000;
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
        { question: "Ce material folosiți pentru canvas?", answer: "Folosim un canvas de tip 'Fine Art', un amestec de bumbac și poliester cu o greutate de 330 g/mp. Acesta oferă culori vibrante și o textură similară pânzei de pictură." },
        { question: "Ce înseamnă 'cu șasiu'?", answer: "'Cu șasiu' înseamnă că pânza este întinsă pe un cadru de lemn, gata de a fi agățată pe perete. Varianta 'fără șasiu' este doar pânza imprimată, pe care o puteți înrăma ulterior." },
        { question: "Pot comanda o dimensiune personalizată?", answer: "Da, pentru varianta 'fără șasiu' puteți introduce orice dimensiune doriți, cu o lățime maximă de 3.1 metri și o lungime de până la 50 de metri." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && <div className="prose max-w-none text-sm"><h3>Tablouri Canvas Personalizate</h3><p>Transformă fotografiile tale preferate în opere de artă cu ajutorul tablourilor canvas personalizate. Imprimate pe pânză de înaltă calitate și, opțional, întinse pe șasiu de lemn, acestea aduc o notă de eleganță oricărui spațiu.</p></div>}
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

export default function CanvasConfigurator({ productSlug }: { productSlug?: string }) {
  const { addItem } = useCart();
  const [framed, setFramed] = useState(true);
  const [shape, setShape] = useState<"rect" | "square">("rect");
  const [selectedSizeKey, setSelectedSizeKey] = useState<string | null>(RECT_SIZES[0]?.key);
  const [customWidthCm, setCustomWidthCm] = useState<string>("");
  const [customHeightCm, setCustomHeightCm] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(GALLERY[0]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (framed) {
      const currentList = shape === "rect" ? RECT_SIZES : SQUARE_SIZES;
      if (!currentList.find(s => s.key === selectedSizeKey)) {
        setSelectedSizeKey(currentList[0]?.key);
      }
    }
  }, [shape, framed, selectedSizeKey]);
  
  const unitPrice = useMemo(() => {
    if (framed) {
        return selectedSizeKey ? SIZE_PRICE_MAP[selectedSizeKey] : 0;
    }
    const widthM = Number(customWidthCm) / 100;
    const heightM = Number(customHeightCm) / 100;
    if (widthM <= 0 || heightM <= 0) return 0;
    const area = widthM * heightM;
    const pricePerSqm = pricePerSqmForTotalArea(area * quantity);
    return roundMoney(area * pricePerSqm);
  }, [framed, selectedSizeKey, customWidthCm, customHeightCm, quantity]);
  
  const displayedTotal = useMemo(() => roundMoney(unitPrice * quantity), [unitPrice, quantity]);

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
    let width_cm = 0, height_cm = 0;
    if (framed) {
        const size = [...RECT_SIZES, ...SQUARE_SIZES].find(s => s.key === selectedSizeKey);
        if (!size) { setErrorToast("Selectați o dimensiune."); return; }
        width_cm = size.w; height_cm = size.h;
    } else {
        width_cm = Number(customWidthCm); height_cm = Number(customHeightCm);
        if (width_cm <= 0 || height_cm <= 0) { setErrorToast("Introduceți dimensiuni valide."); return; }
    }
    addItem({
      id: `canvas-${framed ? 'sasiu' : 'fara'}-${width_cm}x${height_cm}`,
      productId: productSlug, slug: productSlug,
      title: `Tablou Canvas ${width_cm}x${height_cm}cm`,
      price: roundMoney(displayedTotal / quantity), quantity,
      metadata: {
        "Finisaj": framed ? "Cu șasiu de lemn" : "Fără șasiu (doar pânza)",
        "Dimensiune": `${width_cm} x ${height_cm} cm`,
        "Forma": shape === 'rect' ? 'Dreptunghiular' : 'Pătrat',
        artworkUrl,
      },
    });
    setToastVisible(true); setTimeout(() => setToastVisible(false), 1600);
  }

  const summaryStep1 = framed ? (selectedSizeKey ? `${[...RECT_SIZES, ...SQUARE_SIZES].find(s => s.key === selectedSizeKey)?.label}` : "Alege dimensiune") : `${customWidthCm || "_"} x ${customHeightCm || "_"} cm`;
  const summaryStep2 = "Imaginea ta";
  
  return (
    <main className="bg-gray-50 min-h-screen">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">Produs adăugat în coș</div>
      {errorToast && <div className={`toast-error opacity-100 translate-y-0`} aria-live="assertive">{errorToast}</div>}
      
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Canvas" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug || 'canvas'} /></div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Canvas</h1></div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Personalizează opțiunile în pași simpli.</p>
                <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button>
              </div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiune & Finisaj" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                      <OptionButton active={framed} onClick={() => setFramed(true)} title="Cu Șasiu" subtitle="Dimensiuni predefinite" />
                      <OptionButton active={!framed} onClick={() => setFramed(false)} title="Fără Șasiu" subtitle="Dimensiuni personalizate" />
                  </div>
                  {framed && <div className="grid grid-cols-2 gap-2 mb-4">
                      <OptionButton active={shape === 'rect'} onClick={() => setShape('rect')} title="Dreptunghi" />
                      <OptionButton active={shape === 'square'} onClick={() => setShape('square')} title="Pătrat" />
                  </div>}

                  {framed ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {(shape === 'rect' ? RECT_SIZES : SQUARE_SIZES).map(s => <OptionButton key={s.key} active={selectedSizeKey === s.key} onClick={() => setSelectedSizeKey(s.key)} title={s.label} subtitle={formatMoneyDisplay(s.price)} />)}
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><label className="field-label">Lățime (cm)</label><input type="text" inputMode="numeric" value={customWidthCm} onChange={e => setCustomWidthCm(e.target.value.replace(/\D/g, ''))} placeholder="ex: 50" className="input" /></div>
                          <div><label className="field-label">Înălțime (cm)</label><input type="text" inputMode="numeric" value={customHeightCm} onChange={e => setCustomHeightCm(e.target.value.replace(/\D/g, ''))} placeholder="ex: 70" className="input" /></div>
                      </div>
                  )}
                  <div className="mt-4"><NumberInput label="Cantitate" value={quantity} onChange={setQuantity} /></div>
              </AccordionStep>
              <AccordionStep stepNumber={2} title="Încarcă Fotografia" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)} isLast={true}>
                 <div>
                      <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600" /><span className="font-medium text-gray-600">Apasă pentru a încărca</span></span>
                        <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                      </label>
                      {uploading && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                      {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Imagine încărcată!</p>}
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
          <div className="lg:hidden col-span-1"><ProductTabs productSlug={productSlug || 'canvas'} /></div>
        </div>
      </div>
      
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)} aria-label="Închide"><X size={20} className="text-gray-600" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Tablouri Canvas</h3>
            <div className="prose prose-sm max-w-none">
                <h4>Material & Imprimare</h4>
                <p>Folosim pânză canvas de tip 'Fine Art' (330 g/mp), un material premium care redă culorile cu o acuratețe excepțională și oferă o textură elegantă. Imprimarea se face la rezoluție fotografică.</p>
                <h4>Șasiu de Lemn</h4>
                <p>Opțiunea 'Cu Șasiu' înseamnă că tabloul vine gata montat pe un cadru de lemn uscat și tratat, perfect pentru a fi agățat direct pe perete. Pânza acoperă marginile cadrului (efect 'mirror' sau 'wrap') pentru un aspect modern.</p>
                 <h4>Dimensiuni Personalizate</h4>
                <p>Dacă alegeți varianta 'Fără Șasiu', puteți comanda pânza imprimată la orice dimensiune doriți, prețul fiind calculat pe metru pătrat. Această opțiune este ideală dacă doriți să înrămați tabloul ulterior.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}