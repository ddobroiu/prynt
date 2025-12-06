"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Ruler, Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, MessageCircle } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import SmartNewsletterPopup from "./SmartNewsletterPopup";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
import { QA } from "@/types";
import { 
  calculateFonduriEUPrice, 
  FONDURI_EU_CONSTANTS, 
  formatMoneyDisplay, 
  type PriceInputFonduriEU 
} from "@/lib/pricing";

const GALLERY = [
  "/products/afise/afise-1.webp", 
  "/products/banner/banner-1.webp",
  "/products/autocolante/autocolante-1.webp",
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
        { question: "Sunt materialele conforme cu manualul de identitate?", answer: "Da, respectăm cu strictețe manualul de identitate vizuală pentru fiecare program (PNRR, Regio, etc.), folosind fonturile, culorile și elementele grafice obligatorii." },
        { question: "Ce include comunicatul de presă?", answer: "Serviciul include redactarea textului conform cerințelor și publicarea acestuia într-un ziar online sau fizic, cu dovadă de publicare (link sau scan)." },
        { question: "Panourile sunt rezistente la exterior?", answer: "Da, panourile temporare și plăcile permanente sunt realizate din materiale rezistente la intemperii (PVC Forex, Bond sau Banner) și printate cu cerneală UV." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && <div className="prose max-w-none text-sm"><h3>Kit Vizibilitate Fonduri Europene</h3><p>Soluție completă pentru beneficiarii de fonduri nerambursabile. Oferim toate elementele obligatorii de vizibilitate, personalizate pentru proiectul tău, conform manualului de identitate vizuală aplicabil (PNRR, POC, POR, etc.).</p></div>}
                {activeTab === 'recenzii' && <Reviews productSlug={productSlug} />}
                {activeTab === 'faq' && <FaqAccordion qa={faq} />}
            </div>
        </div>
    );
};

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => ( <button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{children}</button> );

const SelectGroup = ({ label, options, value, onChange }: { label: string, options: { id: string, label: string, price: number }[], value: string, onChange: (val: string) => void }) => (
    <div className="mb-4">
        <label className="field-label mb-1">{label}</label>
        <select className="input w-full" value={value || "none"} onChange={(e) => onChange(e.target.value)}>
            {options.map(opt => (
                <option key={opt.id} value={opt.id}>
                    {opt.label} {opt.price > 0 ? `(+${formatMoneyDisplay(opt.price)})` : ""}
                </option>
            ))}
        </select>
    </div>
);

/* --- MAIN COMPONENT --- */
type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number };
export default function FonduriEUConfigurator({ productSlug }: Props) {
  const { addItem } = useCart();
  
  // State for selections
  const [selections, setSelections] = useState<Record<string, string>>({
      comunicat: "none",
      bannerSite: "none",
      afisInformativ: "none",
      autoMici: "none",
      autoMari: "none",
      panouTemporar: "none",
      placaPermanenta: "none"
  });

  const [orderNotes, setOrderNotes] = useState("");
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeImage, setActiveImage] = useState<typeof GALLERY[number]>(GALLERY[0]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const toast = useToast();

  // Calculate Price
  const priceData = useMemo(() => calculateFonduriEUPrice({ selections }), [selections]);
  const displayedTotal = priceData.finalPrice;

  const handleSelectionChange = (key: string, value: string) => {
      setSelections(prev => ({ ...prev, [key]: value }));
  };

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
    if (displayedTotal <= 0) {
      toast.warning("Selectați cel puțin o opțiune.");
      return;
    }

    // Build descriptive title
    const selectedItems = Object.entries(selections)
        .filter(([_, val]) => val !== "none")
        .map(([key, val]) => {
            const group = FONDURI_EU_CONSTANTS.GROUPS[key as keyof typeof FONDURI_EU_CONSTANTS.GROUPS];
            const opt = group?.options.find(o => o.id === val);
            return `${group?.title}: ${opt?.label}`;
        });

    addItem({
      id: `${productSlug ?? 'fonduri-eu'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      productId: "fonduri-eu",
      slug: "fonduri-eu",
      title: "Kit Vizibilitate Fonduri Europene",
      price: displayedTotal,
      quantity: 1,
      currency: "RON",
      metadata: {
        "Configurație": selectedItems.join(" | "),
        "Detalii Proiect": orderNotes,
        artworkUrl,
      },
    });
    toast.success("Produs adăugat în coș");
  }

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 3000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex]);

  // Summaries for steps
  const getSummaryStep1 = () => {
      const s = [];
      if(selections.comunicat !== 'none') s.push('Comunicat');
      if(selections.bannerSite !== 'none') s.push('Banner Site');
      return s.length ? s.join(", ") : "Selectează";
  };
  const getSummaryStep2 = () => {
      const s = [];
      if(selections.afisInformativ !== 'none') s.push('Afiș');
      if(selections.autoMici !== 'none' || selections.autoMari !== 'none') s.push('Autocolante');
      return s.length ? s.join(", ") : "Selectează";
  };
  const getSummaryStep3 = () => {
       const s = [];
       if(selections.panouTemporar !== 'none') s.push('Panou');
       if(selections.placaPermanenta !== 'none') s.push('Placă');
       return s.length ? s.join(", ") : "Selectează";
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Fonduri EU" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
            <div className="hidden lg:block"><ProductTabs productSlug="fonduri-eu" /></div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Fonduri EU</h1></div>
              <div className="flex justify-between items-center"><p className="text-gray-600">Configurează pachetul complet.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              
              {/* STEP 1: Publicitate Obligatorie */}
              <AccordionStep stepNumber={1} title="Publicitate & Online" summary={getSummaryStep1()} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <SelectGroup label="Comunicat de presă" options={FONDURI_EU_CONSTANTS.GROUPS.comunicat.options} value={selections.comunicat} onChange={(v) => handleSelectionChange("comunicat", v)} />
                <SelectGroup label="Banner Web (Site)" options={FONDURI_EU_CONSTANTS.GROUPS.bannerSite.options} value={selections.bannerSite} onChange={(v) => handleSelectionChange("bannerSite", v)} />
              </AccordionStep>

              {/* STEP 2: Materiale Informare */}
              <AccordionStep stepNumber={2} title="Afișe & Autocolante" summary={getSummaryStep2()} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <SelectGroup label="Afiș Informativ (Interior)" options={FONDURI_EU_CONSTANTS.GROUPS.afisInformativ.options} value={selections.afisInformativ} onChange={(v) => handleSelectionChange("afisInformativ", v)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectGroup label="Autocolante Mici" options={FONDURI_EU_CONSTANTS.GROUPS.autoMici.options} value={selections.autoMici} onChange={(v) => handleSelectionChange("autoMici", v)} />
                    <SelectGroup label="Autocolante Mari" options={FONDURI_EU_CONSTANTS.GROUPS.autoMari.options} value={selections.autoMari} onChange={(v) => handleSelectionChange("autoMari", v)} />
                </div>
              </AccordionStep>

              {/* STEP 3: Panouri & Plăci */}
              <AccordionStep stepNumber={3} title="Panouri & Plăci" summary={getSummaryStep3()} isOpen={activeStep === 3} onClick={() => setActiveStep(3)}>
                <SelectGroup label="Panou Temporar (Șantier)" options={FONDURI_EU_CONSTANTS.GROUPS.panouTemporar.options} value={selections.panouTemporar} onChange={(v) => handleSelectionChange("panouTemporar", v)} />
                <SelectGroup label="Placă Permanentă (După proiect)" options={FONDURI_EU_CONSTANTS.GROUPS.placaPermanenta.options} value={selections.placaPermanenta} onChange={(v) => handleSelectionChange("placaPermanenta", v)} />
              </AccordionStep>

              {/* STEP 4: Documente */}
              <AccordionStep stepNumber={4} title="Detalii Proiect" summary={orderNotes ? "Completat" : "Opțional"} isOpen={activeStep === 4} onClick={() => setActiveStep(4)} isLast={true}>
                 <div className="space-y-4">
                    <div>
                        <label className="field-label">Date Proiect (Titlu, Cod SMIS, Beneficiar)</label>
                        <textarea className="input" rows={4} value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} placeholder="Introduceți aici datele proiectului pentru personalizarea materialelor..."></textarea>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Dacă aveți deja machetele grafice:</p>
                      <label className="flex flex-col items-center justify-center w-full h-24 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600" /><span className="font-medium text-gray-600">Încarcă Arhivă / PDF</span></span>
                        <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                      </label>
                      {uploading && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                      {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Fișier încărcat!</p>}
                    </div>
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

            {/* BUTOANE SECUNDARE - WHATSAPP ȘI CERERE OFERTĂ */}
            <div className="mt-4 lg:mt-6 bg-gray-50 rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-3 text-center">Ai nevoie de ajutor sau o ofertă personalizată?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a 
                  href="https://wa.me/40750473111?text=Ma%20intereseaza%20configuratorul%20fonduri-eu" 
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
            
            {/* SECȚIUNE FEATURES - 4 ICONIȚE */}}
            <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Conforme Legislație UE</h3>
                    <p className="text-sm text-gray-600">100% conform ghidurilor oficiale de publicitate</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Toate Opțiunile PNRR/REGIO</h3>
                    <p className="text-sm text-gray-600">Logo-uri și textele actualizate pentru orice program</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Materiale Rezistente</h3>
                    <p className="text-sm text-gray-600">Alucobond, PVC, banner - alegerea ta</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-1">Livrare Rapidă</h3>
                    <p className="text-sm text-gray-600">Producție urgentă pentru termenele tale</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:hidden col-span-1"><ProductTabs productSlug="fonduri-eu" /></div>
        </div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)}><X size={20} className="text-gray-600" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Cum funcționează?</h3>
            <div className="prose prose-sm max-w-none">
              <p>Acest configurator vă permite să selectați exact elementele de vizibilitate necesare proiectului dvs.</p>
              <ul>
                  <li>Selectați produsele dorite (comunicat, panouri, etc.).</li>
                  <li>Introduceți datele proiectului în pasul 4 sau încărcați machetele.</li>
                  <li>Adăugați în coș și finalizați comanda.</li>
                  <li>Vă vom contacta pentru confirmarea graficii înainte de producție.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}