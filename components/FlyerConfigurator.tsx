"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import { QA } from "@/types";
import {
  calculateFlyerPrice,
  FLYER_CONSTANTS,
  formatMoneyDisplay,
  type PriceInputFlyer,
} from "@/lib/pricing";

const GALLERY = [
  "/products/flayere/1.webp",
  "/products/flayere/2.webp",
  "/products/flayere/3.webp",
] as const;

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
    { question: "Ce dimensiuni sunt disponibile?", answer: "Standard: A6, A5 și variante personalizate (21×10)." },
    { question: "Pot alege față/dos?", answer: "Da — selectați două fețe pentru imprimare față-verso." },
    { question: "Care este timpul de livrare?", answer: "Depinde de tiraj; estimarea apare înainte de a adăuga în coș." },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
      <nav className="border-b border-gray-200 flex">
        <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
        <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
        <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
      </nav>
      <div className="p-6">
        {activeTab === 'descriere' && <div className="prose max-w-none text-sm"><h3>Flyere Personalizate</h3><p>Flyere rapide și eficiente pentru campanii, promoții și evenimente. Alegeți dimensiunea, hârtia și imprimarea față-verso.</p></div>}
        {activeTab === 'recenzii' && <Reviews productSlug={productSlug} />}
        {activeTab === 'faq' && <FaqAccordion qa={faq} />}
      </div>
    </div>
  );
};

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (<button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{children}</button>);

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const inc = (d: number) => onChange(Math.max(1, value + d));
  return <div><label className="field-label">{label}</label><div className="flex"><button onClick={() => inc(-1)} className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200"><Minus size={16} /></button><input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-center w-full rounded-none border-x-0" /><button onClick={() => inc(1)} className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200"><Plus size={16} /></button></div></div>;
}

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number };

export default function FlyerConfigurator({ productSlug }: Props) {
  const { addItem } = useCart();
  const [sizeKey, setSizeKey] = useState(FLYER_CONSTANTS.SIZES[0].key);
  const [quantity, setQuantity] = useState<number>(100);
  const [twoSided, setTwoSided] = useState<boolean>(false);
  const [paperWeightKey, setPaperWeightKey] = useState(FLYER_CONSTANTS.PAPER_WEIGHTS[0].key);
  const [designOption, setDesignOption] = useState<"upload" | "pro">("upload");

  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  type GalleryImage = typeof GALLERY[number];
  const [activeImage, setActiveImage] = useState<GalleryImage>(GALLERY[0]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const priceData = useMemo(() => calculateFlyerPrice({ sizeKey, quantity, twoSided, paperWeightKey, designOption } as PriceInputFlyer), [sizeKey, quantity, twoSided, paperWeightKey, designOption]);
  const displayedTotal = priceData.finalPrice;

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
    if (displayedTotal <= 0) { setErrorToast("Prețul nu este calculat"); setTimeout(() => setErrorToast(null), 1600); return; }
    addItem({
      id: `${productSlug ?? 'flyer'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      productId: productSlug ?? 'flyere',
      slug: productSlug ?? 'flayere',
      title: `Flyer ${sizeKey} ${twoSided ? 'față-verso' : 'față'}`,
      price: displayedTotal,
      quantity,
      currency: 'RON',
      metadata: {
        'Dimensiune': sizeKey,
        'Hârtie': paperWeightKey,
        'Față-verso': twoSided ? 'Da' : 'Nu',
        'Grafică': designOption === 'pro' ? 'Vreau grafică' : 'Grafică proprie',
        artworkUrl,
      }
    });
    setToastVisible(true); setTimeout(() => setToastVisible(false), 1600);
  }

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 3000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex]);

  const summary1 = `${sizeKey}, ${paperWeightKey}g`;
  const summary2 = `${twoSided ? 'Față-verso' : 'Față'}`;

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
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug ?? 'flayere'} /></div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Flyere</h1></div>
              <div className="flex justify-between items-center"><p className="text-gray-600">Alege dimensiune, hârtie și tirajul.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiune & Hârtie" summary={summary1} isOpen={true} onClick={() => {}}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="field-label">Dimensiune</label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {FLYER_CONSTANTS.SIZES.map(s => <button key={s.key} onClick={() => setSizeKey(s.key)} className={`p-3 rounded-lg border-2 text-sm ${sizeKey === s.key ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}>{s.label}</button>)}
                    </div>
                  </div>
                  <div>
                    <label className="field-label">Hârtie</label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {FLYER_CONSTANTS.PAPER_WEIGHTS.map(p => <button key={p.key} onClick={() => setPaperWeightKey(p.key)} className={`p-3 rounded-lg border-2 text-sm ${paperWeightKey === p.key ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}>{p.label}</button>)}
                    </div>
                  </div>
                </div>
              </AccordionStep>

              <AccordionStep stepNumber={2} title="Tiraj & Față/Dos" summary={summary2} isOpen={false} onClick={() => {}}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NumberInput label="Cantitate (buc)" value={quantity} onChange={setQuantity} />
                  <div>
                    <label className="field-label">Imprimare</label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button onClick={() => setTwoSided(false)} className={`p-3 rounded-lg border-2 text-sm ${!twoSided ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}>Față</button>
                      <button onClick={() => setTwoSided(true)} className={`p-3 rounded-lg border-2 text-sm ${twoSided ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}>Față-verso</button>
                    </div>
                  </div>
                </div>
              </AccordionStep>

              <AccordionStep stepNumber={3} title="Grafică" summary={designOption === 'upload' ? 'Grafică proprie' : 'Vreau grafică'} isOpen={false} onClick={() => {}} isLast={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <button onClick={() => setDesignOption('upload')} className={`p-3 rounded-lg border-2 text-sm ${designOption === 'upload' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}>Am grafică</button>
                  <button onClick={() => setDesignOption('pro')} className={`p-3 rounded-lg border-2 text-sm ${designOption === 'pro' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}>Vreau grafică ({formatMoneyDisplay(priceData.proFee || 0)})</button>
                </div>

                {designOption === 'upload' && (
                  <div className="mt-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                      <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600" /><span className="font-medium text-gray-600">Apasă pentru a încărca</span></span>
                      <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                    </label>
                    {uploading && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                    {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                    {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Fișier încărcat!</p>}
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
          <div className="lg:hidden col-span-1"><ProductTabs productSlug={productSlug ?? 'flayere'} /></div>
        </div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)}><X size={20} className="text-gray-600" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cum funcționează?</h3>
            <div className="prose prose-sm max-w-none">
              <p>Alege dimensiunea, cantitatea și dacă vrei imprimare față-verso. Încarcă grafică sau soliciti design profesional.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}