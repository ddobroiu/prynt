"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Ruler, Layers, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, TrendingUp, Percent } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import { usePathname, useRouter } from "next/navigation";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import SmartNewsletterPopup from "./SmartNewsletterPopup";
import RelatedProducts from "./RelatedProducts";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture";
import { QA } from "@/types";
import { 
  calculateAutocolantePrice, 
  getAutocolanteUpsell,
  AUTOCOLANTE_CONSTANTS, 
  formatMoneyDisplay, 
  type PriceInputAutocolante,
  type AutocolantesMaterialKey
} from "@/lib/pricing";

const GALLERY_BASE = [
  "/products/autocolante/autocolante-1.webp", 
  "/products/autocolante/autocolante-2.webp", 
  "/products/autocolante/autocolante-3.webp", 
  "/products/autocolante/autocolante-4.webp"
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
        { question: "Care este diferența dintre hârtie și vinyl?", answer: "Hârtia este economică și potrivită pentru interior sau etichete de produs de scurtă durată. Vinyl-ul (PVC) este plastic, rezistent la apă și rupere, ideal pentru exterior sau produse care intră în contact cu umezeala." },
        { question: "Ce înseamnă 'Die-cut'?", answer: "Die-cut (tăiere pe contur) înseamnă că autocolantul este tăiat exact pe forma graficii tale (ex: rotund, stea, formă liberă), nu doar dreptunghiular." },
        { question: "Laminarea este necesară?", answer: "Laminarea adaugă un strat de protecție transparent. Recomandăm laminarea pentru autocolantele expuse la soare, frecare sau umezeală intensă, pentru a prelungi durata de viață." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && <div className="prose max-w-none text-sm"><h3>Autocolante și Etichete</h3><p>Personalizează orice suprafață cu autocolantele noastre de înaltă calitate. Disponibile pe hârtie sau vinyl, cu opțiuni de laminare și tăiere pe contur.</p><h4>Aplicații</h4><ul><li>Etichete de produs (borcane, sticle, cutii)</li><li>Promoții și marketing</li><li>Decorare laptopuri, telefoane</li><li>Stickere auto (varianta Vinyl + Laminare)</li></ul></div>}
                {activeTab === 'recenzii' && <Reviews productSlug={productSlug} />}
                {activeTab === 'faq' && <FaqAccordion qa={faq} />}
            </div>
        </div>
    );
};

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => ( <button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{children}</button> );

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const inc = (d: number) => onChange(Math.max(1, value + d)); // Min 1
  return <div><label className="field-label">{label}</label><div className="flex"><button onClick={() => inc(-10)} className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200" aria-label={`Scade ${label.toLowerCase()}`}><Minus size={16} /></button><input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-center w-full rounded-none border-x-0" min="1" /><button onClick={() => inc(10)} className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200" aria-label={`Creşte ${label.toLowerCase()}`}><Plus size={16} /></button></div></div>;
}

function OptionButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) {
  return <button type="button" onClick={onClick} className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${active ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-white hover:border-gray-400"}`}><div className="font-bold text-gray-800">{title}</div>{subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}</button>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
  return <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>;
}

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string };

/* --- MAIN COMPONENT --- */
export default function AutocolanteConfigurator({ productSlug, initialWidth: initW, initialHeight: initH, productImage }: Props) {
  const { addItem } = useCart();
  const GALLERY = useMemo(() => productImage ? [productImage, ...GALLERY_BASE] : GALLERY_BASE, [productImage]);
  
  const [input, setInput] = useState<PriceInputAutocolante>({
    width_cm: initW ?? 0,
    height_cm: initH ?? 0,
    quantity: 10,
    material: "oracal_641",
    print_type: "print_cut",
    laminated: false,
    designOption: "upload",
  });

  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");
  
  const [activeImage, setActiveImage] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  
  useEffect(() => {
    if (GALLERY.length > 0 && !activeImage) {
      setActiveImage(GALLERY[0]);
    }
  }, [GALLERY, activeImage]);
  
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [textDesign, setTextDesign] = useState<string>("");
  
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [userEmail, setUserEmail] = useState<string>('');
  const toast = useToast();

  // Pricing
  const priceData = useMemo(() => calculateAutocolantePrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  // Upsell Logic
  const upsellOpportunity = useMemo(() => {
    const result = getAutocolanteUpsell(input);
    console.log('🔍 AUTOCOLANTE UPSELL DEBUG:', { input, result });
    return result;
  }, [input]);

  // Auto-capture abandoned carts
  const cartData = useMemo(() => ({
    configuratorId: 'autocolante',
    email: userEmail,
    configuration: { ...input, artworkUrl, textDesign },
    price: displayedTotal,
    quantity: input.quantity
  }), [userEmail, input, artworkUrl, textDesign, displayedTotal]);

  useUserActivityTracking(cartData);

  const updateInput = <K extends keyof PriceInputAutocolante>(k: K, v: PriceInputAutocolante[K]) => setInput((p) => ({ ...p, [k]: v }));
  const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v))); // Min 1
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
      toast.warning("Te rugăm să introduci dimensiunile.");
      return;
    }
    if (displayedTotal <= 0) {
      toast.warning("Prețul trebuie calculat.");
      return;
    }

    const materialDef = AUTOCOLANTE_CONSTANTS.MATERIALS.find(m => m.key === input.material);
    const materialLabel = materialDef?.label || input.material;
    const unitPrice = Math.round((displayedTotal / input.quantity) * 100) / 100;
    const uniqueId = `${productSlug ?? 'autocolante'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const title = `Autocolant ${materialLabel} - ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "autocolante",
      slug: productSlug ?? "autocolante",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        "Material": materialLabel,
        "Tip producție": input.print_type === "print_only" ? "Doar Print (-20%)" : "Print + Cut",
        "Laminare": input.laminated ? "Da (+10%)" : "Nu",
        "Dimensiuni": `${input.width_cm} x ${input.height_cm} cm`,
        "Suprafață totală": `${priceData.total_sqm.toFixed(2)} mp`,
        "Preț/mp": `${priceData.pricePerSqm} lei`,
        "Grafică": input.designOption === 'pro' ? 'Vreau grafică' : input.designOption === 'text_only' ? 'Doar text' : 'Grafică proprie',
        ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(AUTOCOLANTE_CONSTANTS.PRO_DESIGN_FEE) }),
        ...(input.designOption === 'text_only' && { "Text": textDesign }),
        artworkUrl,
      },
    });
  }

  useEffect(() => {
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % GALLERY.length), 3000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => setActiveImage(GALLERY[activeIndex]), [activeIndex]);

  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
  const materialDef = AUTOCOLANTE_CONSTANTS.MATERIALS.find(m => m.key === input.material);
  const printTypeLabel = input.print_type === "print_only" ? "Doar Print (-20%)" : "Print + Cut";
  const laminatedLabel = input.laminated ? ", Laminat (+10%)" : "";
  const summaryStep2 = `${materialDef?.label.split(' — ')[0] || input.material}, ${printTypeLabel}${laminatedLabel}`;
  const summaryStep3 = input.designOption === 'upload' ? 'Grafică proprie' : input.designOption === 'text_only' ? 'Doar text' : 'Design Pro';

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Autocolante" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {GALLERY.map((src, i) => <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug || 'autocolante'} /></div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Autocolante</h1></div>
              <div className="flex justify-between items-center"><p className="text-gray-600">Personalizează opțiunile în 3 pași simpli.</p><button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5"><Info size={16} /><span className="ml-2">Detalii</span></button></div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="field-label">Lungime (cm)</label><input type="text" inputMode="numeric" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="10" className="input" /></div>
                  <div><label className="field-label">Înălțime (cm)</label><input type="text" inputMode="numeric" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="10" className="input" /></div>
                  <div className="md:col-span-2">
                    <NumberInput label="Cantitate" value={input.quantity} onChange={setQty} />
                    
                    {/* UPSELL ALERT */}
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
              </AccordionStep>
              <AccordionStep stepNumber={2} title="Material & Tip Print" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <label className="field-label mb-2">Tip folie Oracal</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  {AUTOCOLANTE_CONSTANTS.MATERIALS.map((mat) => {
                    const [name, desc] = mat.label.split(' — ');
                    return (
                      <OptionButton 
                        key={mat.key}
                        active={input.material === mat.key} 
                        onClick={() => updateInput("material", mat.key as AutocolantesMaterialKey)} 
                        title={name} 
                        subtitle={desc}
                      />
                    );
                  })}
                </div>
                <label className="field-label mb-2">Tip producție</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  <OptionButton 
                    active={input.print_type === "print_cut"} 
                    onClick={() => updateInput("print_type", "print_cut")} 
                    title="Print + Cut" 
                    subtitle="Tăiere pe contur (standard)"
                  />
                  <OptionButton 
                    active={input.print_type === "print_only"} 
                    onClick={() => updateInput("print_type", "print_only")} 
                    title="Doar Print (-20%)" 
                    subtitle="Fără tăiere, reducere 20%"
                  />
                </div>
                <label className="field-label mb-2">Finisaj</label>
                <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" className="checkbox" checked={input.laminated} onChange={(e) => updateInput("laminated", e.target.checked)} />
                  <div>
                    <span className="text-sm font-bold text-gray-800">Laminare (+10%)</span>
                    <p className="text-xs text-gray-500">Protecție extra UV și zgârieturi</p>
                  </div>
                </label>
              </AccordionStep>
              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                <div>
                  <div className="mb-4 border-b border-gray-200">
                    <div className="flex -mb-px">
                      <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Grafică</TabButton>
                      <TabButton active={input.designOption === 'text_only'} onClick={() => updateInput("designOption", 'text_only')}>Doar Text</TabButton>
                      <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Grafică</TabButton>
                    </div>
                  </div>

                  {input.designOption === 'upload' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Încarcă fișierul tău (PDF, JPG, PNG, AI, CDR).</p>
                      <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <span className="flex items-center space-x-2"><UploadCloud className="w-6 h-6 text-gray-600" /><span className="font-medium text-gray-600">Apasă pentru a încărca</span></span>
                        <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                      </label>
                      {uploading && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                      {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Grafică încărcată cu succes!</p>}
                    </div>
                  )}

                  {input.designOption === 'text_only' && (
                    <div className="space-y-3">
                      <label className="field-label">Introdu textul dorit</label>
                      <textarea className="input" rows={3} value={textDesign} onChange={e => setTextDesign(e.target.value)} placeholder="Ex: ETICHETA PRODUS, PROMOȚIE, etc."></textarea>
                    </div>
                  )}

                  {input.designOption === 'pro' && (
                    <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
                      <p className="font-semibold">Serviciu de Grafică Profesională</p>
                      <p>Cost: <strong>{formatMoneyDisplay(AUTOCOLANTE_CONSTANTS.PRO_DESIGN_FEE)}</strong>. Un designer te va contacta pentru detalii.</p>
                    </div>
                  )}
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
          <div className="lg:hidden col-span-1"><ProductTabs productSlug={productSlug || 'autocolante'} /></div>
        </div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)}><X size={20} className="text-gray-600" /></button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Autocolante</h3>
            <div className="prose prose-sm max-w-none">
              <h4>Materiale</h4>
              <ul>
                <li><strong>Hârtie (Mată/Lucioasă):</strong> Ideală pentru etichete de interior, ambalaje de produs, cutii. Economică.</li>
                <li><strong>Vinyl (PVC):</strong> Material plastic rezistent la rupere, apă și UV. Ideal pentru exterior sau produse expuse la umezeală.</li>
              </ul>
              <h4>Finisaje</h4>
              <ul>
                <li><strong>Laminare:</strong> Strat protector transparent aplicat peste print. Mărește rezistența la zgârieturi și decolorare.</li>
                <li><strong>Die-cut:</strong> Tăiere pe contur neregulat (nu doar dreptunghiular).</li>
              </ul>
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
      <RelatedProducts category="autocolante" />
    </main>
  );
}