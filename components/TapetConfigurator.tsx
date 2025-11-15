"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud } from "lucide-react";
import DeliveryInfo from "@/components/DeliveryInfo";
import DeliveryEstimation from "./DeliveryEstimation";
import { QA } from "@/types";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";

const GALLERY = ["/products/wallpaper/1.webp", "/products/wallpaper/2.webp", "/products/wallpaper/3.webp", "/products/wallpaper/4.webp"] as const;
type PriceInput = { width_cm: number; height_cm: number; quantity: number; want_adhesive: boolean; };
const pricePerSqmForTotalArea = (totalSqm: number) => {
    if (totalSqm <= 0) return 0; if (totalSqm < 1) return 180; if (totalSqm < 5) return 170;
    if (totalSqm < 20) return 160; return 150;
};
const PRO_DESIGN_FEE = 200;
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
        { question: "Ce material folosiți pentru tapet?", answer: "Folosim tapet Dreamscape Vinilic, un material premium din țesătură de poliester cu un coating vinilic, cu o grosime de 400 g/mp. Este ideal pentru un decor interior de înaltă calitate." },
        { question: "Care este diferența dintre varianta cu și fără adeziv?", answer: "Varianta standard necesită aplicarea unui adeziv pentru tapet pe perete. Varianta cu adeziv are un strat auto-adeziv pe spate, similar cu un autocolant, facilitând montajul." },
        { question: "Pot comanda o grafică personalizată?", answer: "Da, puteți încărca propria grafică sau puteți opta pentru serviciul nostru de design profesional, contra unui cost suplimentar de 200 RON." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && <div className="prose max-w-none text-sm"><h3>Tapet Personalizat Dreamscape Vinilic</h3><p>Creați un ambient unic cu tapetul nostru personalizat. Ideal pentru spații rezidențiale, birouri sau comerciale, tapetul Dreamscape Vinilic transformă orice perete într-o operă de artă. Imprimat la calitate fotografică, este rezistent și ușor de întreținut.</p></div>}
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

export default function TapetConfigurator({ productSlug }: { productSlug?: string }) {
  const { addItem } = useCart();
  const [input, setInput] = useState<PriceInput>({ width_cm: 0, height_cm: 0, quantity: 1, want_adhesive: false });
  const [designOption, setDesignOption] = useState<"upload" | "pro">("upload");
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImage, setActiveImage] = useState(GALLERY[0]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  const updateInput = <K extends keyof PriceInput>(k: K, v: PriceInput[K]) => setInput((p) => ({ ...p, [k]: v }));
  const onChangeWidth = (v: string) => updateInput("width_cm", Number(v.replace(/\D/g, '')));
  const onChangeHeight = (v: string) => updateInput("height_cm", Number(v.replace(/\D/g, '')));

  const priceDetails = useMemo(() => {
    const { width_cm, height_cm, quantity, want_adhesive } = input;
    if (width_cm <= 0 || height_cm <= 0) return { finalPrice: 0, total_sqm: 0 };
    const sqm_per_unit = (width_cm / 100) * (height_cm / 100);
    const total_sqm = sqm_per_unit * quantity;
    const pricePerSqm = pricePerSqmForTotalArea(total_sqm);
    const multiplier = want_adhesive ? 1.1 : 1.0;
    const finalPrice = roundMoney(total_sqm * pricePerSqm * multiplier);
    return { finalPrice, total_sqm: roundMoney(total_sqm) };
  }, [input]);
  
  const displayedTotal = useMemo(() => {
    const base = priceDetails.finalPrice || 0;
    return designOption === "pro" ? roundMoney(base + PRO_DESIGN_FEE) : base;
  }, [priceDetails, designOption]);

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
    addItem({
      id: `tapet-${input.width_cm}x${input.height_cm}-${input.want_adhesive}-${designOption}`,
      productId: productSlug, slug: productSlug,
      title: `Tapet personalizat ${input.width_cm}x${input.height_cm}cm`,
      price: roundMoney(displayedTotal / input.quantity), quantity: input.quantity,
      metadata: {
        "Dimensiuni": `${input.width_cm} x ${input.height_cm} cm`,
        "Suprafață totală": `${priceDetails.total_sqm} m²`,
        "Finisaj": input.want_adhesive ? "Cu adeziv" : "Fără adeziv",
        "Grafică": designOption === 'pro' ? "Vreau grafică" : "Grafică proprie",
        ...(designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(PRO_DESIGN_FEE) }),
        artworkUrl,
      },
    });
    setToastVisible(true); setTimeout(() => setToastVisible(false), 1600);
  }

  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm} x ${input.height_cm} cm, ${input.quantity} buc.` : "Alege dimensiuni";
  const summaryStep2 = input.want_adhesive ? "Cu adeziv" : "Fără adeziv";
  const summaryStep3 = designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';
  
  return (
    <main className="bg-gray-50 min-h-screen">
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">Produs adăugat în coș</div>
      {errorToast && <div className={`toast-error opacity-100 translate-y-0`} aria-live="assertive">{errorToast}</div>}
      
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Tapet" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug || 'tapet'} /></div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Tapet</h1></div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Personalizează opțiunile în 3 pași simpli.</p>
                <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button>
              </div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="field-label">Lățime Perete (cm)</label><input type="text" inputMode="numeric" value={input.width_cm || ''} onChange={e => onChangeWidth(e.target.value)} placeholder="ex: 400" className="input" /></div>
                    <div><label className="field-label">Înălțime Perete (cm)</label><input type="text" inputMode="numeric" value={input.height_cm || ''} onChange={e => onChangeHeight(e.target.value)} placeholder="ex: 270" className="input" /></div>
                    <div className="md:col-span-2"><NumberInput label="Cantitate" value={input.quantity} onChange={v => updateInput('quantity', v)} /></div>
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={2} title="Tip Material" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <div className="grid grid-cols-2 gap-2">
                    <OptionButton active={!input.want_adhesive} onClick={() => updateInput('want_adhesive', false)} title="Standard" subtitle="Fără adeziv" />
                    <OptionButton active={input.want_adhesive} onClick={() => updateInput('want_adhesive', true)} title="Auto-adeziv" subtitle="Montaj ușor (+10%)" />
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <OptionButton active={designOption === "upload"} onClick={() => setDesignOption("upload")} title="Am Grafică" subtitle="Încarc fișierul" />
                    <OptionButton active={designOption === "pro"} onClick={() => setDesignOption("pro")} title="Vreau Grafică" subtitle={`Cost: ${formatMoneyDisplay(PRO_DESIGN_FEE)}`} />
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
          <div className="lg:hidden col-span-1"><ProductTabs productSlug={productSlug || 'tapet'} /></div>
        </div>
      </div>
      
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)} aria-label="Închide"><X size={20} className="text-gray-600" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Tapet Personalizat</h3>
            <div className="prose prose-sm max-w-none">
                <h4>Material Premium</h4>
                <p>Tapetul este realizat din Dreamscape Vinilic, un material textil pe bază de poliester cu un strat de vinil, având o grosime de 400 g/mp. Este durabil, lavabil și oferă un aspect deosebit.</p>
                <h4>Montaj</h4>
                <p>Puteți alege varianta standard, care se montează cu adeziv de tapet, sau varianta auto-adezivă pentru un montaj mai simplu și rapid, fără a necesita adeziv suplimentar.</p>
                 <h4>Grafică și Imprimare</h4>
                <p>Imprimarea se face la calitate fotografică. Pentru cele mai bune rezultate, vă recomandăm să încărcați o imagine la o rezoluție cât mai mare. Dacă aveți un model repetitiv (pattern), asigurați-vă că fișierul este pregătit corespunzător.</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}