"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, Frame } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import { QA } from "@/types";
import { 
  calculateCanvasPrice, 
  CANVAS_CONSTANTS, 
  formatMoneyDisplay, 
  type PriceInputCanvas 
} from "@/lib/pricing";

const GALLERY = [
  "/products/canvas/1.webp",
  "/products/canvas/2.webp", // Asigură-te că ai aceste imagini sau înlocuiește cu placeholder
  "/products/canvas/3.webp", 
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
        { question: "Ce material folosiți pentru tablouri?", answer: "Folosim pânză canvas din bumbac 100% sau amestec bumbac-poliester de înaltă calitate, texturată, care redă culorile fidel." },
        { question: "Tabloul vine gata de agățat?", answer: "Da, pânza este întinsă pe un șasiu din lemn uscat, iar tabloul include sistem de prindere. Este gata de pus pe perete imediat ce îl scoateți din cutie." },
        { question: "Ce înseamnă 'Margine Oglindită'?", answer: "Marginea oglindită înseamnă că imaginea de pe fața tabloului este reflectată pe lateralele șasiului. Astfel, nu se pierde nimic din subiectul principal al imaginii pe canturi." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && <div className="prose max-w-none text-sm"><h3>Tablouri Canvas Personalizate</h3><p>Transformă fotografiile preferate în opere de artă. Tablourile noastre sunt imprimate la rezoluție înaltă pe pânză canvas și întinse manual pe șasiu de lemn.</p><h4>Opțiuni Margine</h4><ul><li><strong>Albă:</strong> Lateralele rămân albe.</li><li><strong>Oglindită (Recomandat):</strong> Imaginea continuă pe laterale prin efect de oglindire.</li><li><strong>Wrap:</strong> Imaginea curge natural pe laterale (se pierde o parte din margine).</li></ul></div>}
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

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number };

/* --- MAIN COMPONENT --- */
export default function CanvasConfigurator({ productSlug, initialWidth: initW, initialHeight: initH }: Props) {
  const { addItem } = useCart();
  const [input, setInput] = useState<PriceInputCanvas>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 1,
    edge_type: "mirror",
    designOption: "upload",
  });

  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");
  
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  // Pricing
  const priceData = useMemo(() => calculateCanvasPrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

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
    if (!input.width_cm || !input.height_cm) {
      setErrorToast("Introduceți dimensiunile."); setTimeout(() => setErrorToast(null), 1600); return;
    }
    if (displayedTotal <= 0) {
      setErrorToast("Prețul trebuie calculat."); setTimeout(() => setErrorToast(null), 1600); return;
    }

    const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
    const uniqueId = ["canvas", input.width_cm, input.height_cm, input.edge_type, input.designOption].join("-");
    const title = `Tablou Canvas ${input.width_cm}x${input.height_cm} cm`;

    const edgeLabels = { white: "Albă", mirror: "Oglindită", wrap: "Continuată (Wrap)" };

    addItem({
      id: uniqueId,
      productId: productSlug ?? "canvas",
      slug: productSlug ?? "canvas",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        "Margine": edgeLabels[input.edge_type],
        "Grafică": input.designOption === 'pro' ? 'Vreau grafică' : 'Grafică proprie',
        ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(CANVAS_CONSTANTS.PRO_DESIGN_FEE) }),
        artworkUrl,
      },
    });
    setToastVisible(true); setTimeout(() => setToastVisible(false), 1600);
  }

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 3000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex]);

  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
  const edgeLabels = { white: "Albă", mirror: "Oglindită", wrap: "Wrap" };
  const summaryStep2 = `Margine: ${edgeLabels[input.edge_type]}`;
  const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

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
              <div className="flex justify-between items-center"><p className="text-gray-600">Personalizează tabloul în 3 pași simpli.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="field-label">Lățime (cm)</label><input type="text" inputMode="numeric" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="40" className="input" /></div>
                  <div><label className="field-label">Înălțime (cm)</label><input type="text" inputMode="numeric" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="60" className="input" /></div>
                  <div className="md:col-span-2"><NumberInput label="Cantitate" value={input.quantity} onChange={setQty} /></div>
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={2} title="Finisaje Margine" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                    <OptionButton active={input.edge_type === "mirror"} onClick={() => updateInput("edge_type", "mirror")} title="Oglindită" subtitle="Recomandat" />
                    <OptionButton active={input.edge_type === "wrap"} onClick={() => updateInput("edge_type", "wrap")} title="Wrap" subtitle="Imagine continuă" />
                    <OptionButton active={input.edge_type === "white"} onClick={() => updateInput("edge_type", "white")} title="Albă" subtitle="Margini simple" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    {input.edge_type === "mirror" && "Imaginea principală rămâne pe față, iar marginile sunt o reflexie a acesteia. Nu se pierde nimic din cadru."}
                    {input.edge_type === "wrap" && "Imaginea este mărită și acoperă marginile. Atenție: elementele de la periferie vor ajunge pe cantul tabloului."}
                    {input.edge_type === "white" && "Imaginea este doar pe față, marginile șasiului rămân albe."}
                </p>
              </AccordionStep>
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
              <div className="flex justify-between items-center mb-2">
                <p className="text-3xl font-extrabold text-gray-900">{formatMoneyDisplay(displayedTotal)}</p>
                <button onClick={handleAddToCart} disabled={!input.width_cm || !input.height_cm} className="btn-primary w-1/2 py-3 text-base font-bold"><ShoppingCart size={20} /><span className="ml-2">Adaugă în Coș</span></button>
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
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)}><X size={20} className="text-gray-600" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Canvas</h3>
            <div className="prose prose-sm max-w-none">
              <h4>Material</h4>
              <p>Pânză canvas bumbac/poliester, 350g/mp, textură fină, tratată pentru imprimare digitală de înaltă rezoluție.</p>
              <h4>Șasiu</h4>
              <p>Lemn de brad uscat, profil 2x4 cm, rezistent la deformare. Pânza este întinsă manual pentru o tensiune perfectă.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}