"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud } from "lucide-react";
import DeliveryInfo from "@/components/DeliveryInfo";
import DeliveryEstimation from "./DeliveryEstimation";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import { QA } from "@/types";

/* --- UTILS & TYPES --- */
const roundMoney = (num: number) => Math.round(num * 100) / 100;
const formatMoneyDisplay = (amount: number) => new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(amount);

type MaterialType = "PE" | "PVDF";
type PriceInput = {
  width_cm: number;
  height_cm: number;
  quantity: number;
  material: MaterialType;
  color: string;
};
type LocalPriceOutput = {
  finalPrice: number;
  total_sqm: number;
  pricePerSqm: number;
};

type DesignOption = "upload" | "pro";
type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string; renderOnlyConfigurator?: boolean; };
const PRO_DESIGN_FEE = 100;


const MATERIAL_INFO: Record<MaterialType, { thickness_mm: number; label: string }> = {
    PE: { thickness_mm: 3, label: "Visual Bond PE - Interior" },
    PVDF: { thickness_mm: 4, label: "Visual Bond PVDF - Exterior" },
  };
  
  const PRICE_MAP: Record<MaterialType, Record<string, number>> = {
    PE: { Alb: 250, Argintiu: 250, Negru: 250 },
    PVDF: { Alb: 350 },
  };
/* --- PRICING LOGIC --- */
const localCalculatePrice = (input: PriceInput): LocalPriceOutput => {
  if (input.width_cm <= 0 || input.height_cm <= 0 || input.quantity <= 0) return { finalPrice: 0, total_sqm: 0, pricePerSqm: 0 };
  const sqm_per_unit = (input.width_cm / 100) * (input.height_cm / 100);
  const total_sqm = sqm_per_unit * input.quantity;
  const pricePerSqm = PRICE_MAP[input.material]?.[input.color] ?? 0;
  const finalPrice = roundMoney(total_sqm * pricePerSqm);

  return { finalPrice: finalPrice, total_sqm: roundMoney(total_sqm), pricePerSqm };
};

/* --- SUB-COMPONENTS (WIZARD & TABS) --- */
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
    const alucobondFaqs: QA[] = [
        { question: "Ce materiale sunt disponibile?", answer: "Oferim Visual Bond PE (Interior) și Visual Bond PVDF (Exterior), ambele fiind materiale durabile." },
        { question: "Ce finisaje sunt incluse?", answer: "Toate placile de alucobond vin cu tiv de rezistență pe tot perimetrul și capse metalice de prindere, aplicate de obicei la o distanță de 50 cm una de cealaltă." },
        { question: "Cum trimit grafica pentru imprimare?", answer: "Puteți încărca fișierul grafic direct în configurator, în pasul 3. Acceptăm formate precum PDF, AI, CDR, TIFF sau JPG la o rezoluție bună." },
        { question: "Cât durează producția și livrarea?", answer: "Producția durează în mod normal 1-2 zile lucrătoare. Livrarea prin curier rapid mai adaugă încă 1-2 zile, în funcție de localitatea de destinație." },
        { question: "Placile de alucobond sunt rezistente la exterior?", answer: "Da, absolut. Materialele folosite sunt special tratate pentru a rezista la apă, vânt și radiații UV, asigurând o durată de viață îndelungată." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && <div className="prose max-w-none text-sm"><h3>Plăci Alucobond Durabile</h3><p>Fie că dorești să anunți o promoție sau să îți faci brandul cunoscut, bannerele noastre personalizate sunt soluția ideală, imprimate la o calitate excepțională.</p><h4>Structură Preț</h4><ul><li>Sub 1 m²: <strong>100 RON/m²</strong></li><li>1-5 m²: <strong>75 RON/m²</strong></li><li>5-20 m²: <strong>60 RON/m²</strong></li><li>20-50 m²: <strong>45 RON/m²</strong></li><li>Peste 50 m²: <strong>35 RON/m²</strong></li></ul></div>}
                {activeTab === 'recenzii' && <Reviews productSlug={productSlug} />}
                {activeTab === 'faq' && <FaqAccordion qa={alucobondFaqs} />}
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

/* --- MAIN COMPONENT --- */
export default function ConfiguratorAlucobond({ productSlug, initialWidth: initW, initialHeight: initH, productImage, renderOnlyConfigurator = false }: Props) {
  const { addItem } = useCart();
  const [input, setInput] = useState<PriceInput>({ width_cm: initW ?? 0, height_cm: initH ?? 0, quantity: 1, material: "PE", color: "Alb" });
  const [lengthText, setLengthText] = useState(initW ? String(initW) : "");
  const [heightText, setHeightText] = useState(initH ? String(initH) : "");
  const galleryImages = useMemo(() => productImage ? [productImage, "/products/alucobond/1.webp", "/products/alucobond/2.webp", "/products/alucobond/3.webp"] : ["/products/alucobond/1.webp", "/products/alucobond/2.webp", "/products/alucobond/3.webp", "/products/alucobond/4.webp"], [productImage]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(galleryImages[0]);
  const [designOption, setDesignOption] = useState<DesignOption>("upload");
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [artworkLink, setArtworkLink] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [textDesign, setTextDesign] = useState<string>("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [serverPrice, setServerPrice] = useState<number | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);

  const availableColors = useMemo(() => {
    return input.material === "PE" ? ["Alb", "Argintiu", "Negru"] : ["Alb"];
  }, [input.material]);

  useEffect(() => {
    if (!availableColors.includes(input.color)) {
      setInput((s) => ({ ...s, color: availableColors[0] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.material]);

  const priceDetailsLocal = useMemo(() => localCalculatePrice(input), [input]);
  const displayedTotal = useMemo(() => { const base = (serverPrice ?? priceDetailsLocal.finalPrice) || 0; return designOption === "pro" ? roundMoney(base + PRO_DESIGN_FEE) : base; }, [priceDetailsLocal, designOption, serverPrice]);

  const updateInput = <K extends keyof PriceInput>(k: K, v: PriceInput[K]) => setInput((p) => ({ ...p, [k]: v }));
  const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));
  const onChangeLength = (v: string) => { const d = v.replace(/\D/g, ""); setLengthText(d); updateInput("width_cm", d === "" ? 0 : parseInt(d, 10)); };
  const onChangeHeight = (v: string) => { const d = v.replace(/\D/g, ""); setHeightText(d); updateInput("height_cm", d === "" ? 0 : parseInt(d, 10)); };
  
  useEffect(() => {
    const calculateServerPrice = async () => {
      if (input.width_cm > 0 && input.height_cm > 0 && input.quantity > 0) {
        setCalcLoading(true);
        try {
          const res = await fetch("/api/calc-price-alucobond", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
          });
          if (!res.ok) throw new Error("API Error");
          const data = await res.json();
          setServerPrice(data.price);
        } catch (error) {
          console.error("Failed to calculate server price", error);
          setServerPrice(null);
        } finally {
          setCalcLoading(false);
        }
      }
    };
    const debounce = setTimeout(calculateServerPrice, 500);
    return () => clearTimeout(debounce);
  }, [input]);

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
      setArtworkLink("");
    } catch (e: any) {
      try {
        const preview = file ? URL.createObjectURL(file) : null;
        setArtworkUrl(preview);
      } catch {}
      setUploadError(e?.message ?? "Eroare la upload");
    } finally {
      setUploading(false);
    }
  };

  function handleAddToCart() {
    if (!input.width_cm || !input.height_cm) {
      setErrorToast("Te rugăm să completezi lungimea și înălțimea.");
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }
    const totalForOrder = displayedTotal;
    if (!totalForOrder || totalForOrder <= 0) {
      setErrorToast("Prețul trebuie calculat înainte de a adăuga în coș.");
      setTimeout(() => setErrorToast(null), 1600);
      return;
    }
    const unitPrice = roundMoney(totalForOrder / input.quantity);
    const uniqueId = [
      "alucobond",
      input.material,
      input.width_cm,
      input.height_cm,
      designOption,
    ].join("-");
    const title = `Alucobond personalizat - ${input.width_cm}x${input.height_cm} cm`;

    addItem({
      id: uniqueId,
      productId: productSlug ?? "alucobond-generic",
      slug: productSlug ?? "generic-alucobond",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata: {
        "Material": input.material,
        "Culoare": input.color,
        "Grafică": designOption === 'pro' ? 'Vreau grafică' : 'Grafică proprie',
        ...(designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(PRO_DESIGN_FEE) }),
        artworkUrl,
      },
    });
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 1600);
  }

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => {
        const next = (i + 1) % galleryImages.length;
        setActiveImage(galleryImages[next]);
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, [galleryImages]);
  
  const totalShown = displayedTotal;
  const canAdd = totalShown > 0 && input.width_cm > 0 && input.height_cm > 0;
  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
  const summaryStep2 = `${input.material}, ${input.color}`;
  const summaryStep3 = designOption === 'upload' ? 'Grafică proprie' : 'Design Pro';

  return (
    <main className={renderOnlyConfigurator ? "" : "bg-gray-50 min-h-screen"}>
      <div id="added-toast" className={`toast-success ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`} aria-live="polite">
        Produs adăugat în coș
      </div>
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square"><img src={activeImage} alt="Alucobond" className="h-full w-full object-cover" /></div>
              <div className="p-2 grid grid-cols-4 gap-2">
                {galleryImages.map((src, i) => <button key={src} onClick={() => { setActiveImage(src); setActiveIndex(i); }} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>)}
              </div>
            </div>
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug || 'alucobond'} /></div>
          </div>
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Alucobond</h1></div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Personalizează opțiunile în 3 pași simpli.</p>
                <button type="button" onClick={() => setDetailsOpen(true)} className="btn-outline inline-flex items-center text-sm px-3 py-1.5">
                  <Info size={16} />
                  <span className="ml-2">Detalii</span>
                </button>
              </div>
            </header>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-4">
              <AccordionStep stepNumber={1} title="Dimensiuni & Cantitate" summary={summaryStep1} isOpen={activeStep === 1} onClick={() => setActiveStep(1)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="field-label">Lungime (cm)</label><input type="text" inputMode="numeric" value={lengthText} onChange={(e) => onChangeLength(e.target.value)} placeholder="200" className="input" /></div>
                  <div><label className="field-label">Înălțime (cm)</label><input type="text" inputMode="numeric" value={heightText} onChange={(e) => onChangeHeight(e.target.value)} placeholder="100" className="input" /></div>
                  <div className="md:col-span-2"><NumberInput label="Cantitate" value={input.quantity} onChange={setQty} /></div>
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={2} title="Material & Finisaje" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <label className="field-label mb-2">Material</label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <OptionButton active={input.material === "PE"} onClick={() => updateInput("material", "PE")} title="Visual Bond PE" subtitle="Interior" />
                    <OptionButton active={input.material === "PVDF"} onClick={() => updateInput("material", "PVDF")} title="Visual Bond PVDF" subtitle="Exterior" />
                </div>
                <label className="field-label mb-2">Culoare</label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {availableColors.map((color) => (
                        <OptionButton
                            key={color}
                            active={input.color === color}
                            onClick={() => updateInput("color", color)}
                            title={color}
                            subtitle=""
                        />
                    ))}
                </div>
              </AccordionStep>
              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                <div>
                  <div className="mb-4 border-b border-gray-200">
                    <div className="flex -mb-px">
                      <TabButton active={designOption === 'upload'} onClick={() => setDesignOption('upload')}>Am Grafică</TabButton>
                      <TabButton active={designOption === 'pro'} onClick={() => setDesignOption('pro')}>Vreau Grafică</TabButton>
                    </div>
                  </div>

                  {designOption === 'upload' && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Încarcă fișierul tău (PDF, JPG, TIFF, etc.).</p>
                      <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <span className="flex items-center space-x-2">
                          <UploadCloud className="w-6 h-6 text-gray-600" />
                          <span className="font-medium text-gray-600">Apasă pentru a încărca</span>
                        </span>
                        <input type="file" name="file_upload" className="hidden" onChange={e => handleArtworkFileInput(e.target.files?.[0] ?? null)} />
                      </label>
                      {uploading && <p className="text-sm text-indigo-600">Se încarcă...</p>}
                      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                      {artworkUrl && !uploadError && <p className="text-sm text-green-600 font-semibold">Grafică încărcată cu succes!</p>}
                    </div>
                  )}



                  {designOption === 'pro' && (
                    <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
                      <p className="font-semibold">Serviciu de Grafică Profesională</p>
                      <p>O echipă de designeri va crea o propunere grafică pentru tine. Vei primi pe email o simulare pentru confirmare. Cost: <strong>{formatMoneyDisplay(PRO_DESIGN_FEE)}</strong>.</p>
                    </div>
                  )}
                </div>
              </AccordionStep>
            </div>
            <div className="sticky bottom-0 lg:static bg-white/80 lg:bg-white backdrop-blur-sm lg:backdrop-blur-none border-t-2 lg:border lg:rounded-2xl lg:shadow-lg border-gray-200 py-4 lg:p-6 lg:mt-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-3xl font-extrabold text-gray-900">{formatMoneyDisplay(totalShown)}</p>
                <button onClick={handleAddToCart} disabled={!canAdd} className="btn-primary w-1/2 py-3 text-base font-bold"><ShoppingCart size={20} /><span className="ml-2">Adaugă în Coș</span></button>
              </div>
              <DeliveryEstimation />
            </div>
          </div>
          <div className="lg:hidden col-span-1"><ProductTabs productSlug={productSlug || 'alucobond'} /></div>
        </div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={20} className="text-gray-600" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Produs: Alucobond</h3>
            <div className="prose prose-sm max-w-none">
              <h4>Materiale & Durabilitate</h4>
              <ul>
                <li><strong>Visual Bond PE (Interior):</strong> Material PVC flexibil și rezistent, ideal pentru o gamă largă de aplicații outdoor. Imprimare la calitate foto.</li>
                <li><strong>Visual Bond PVDF (Exterior):</strong> O versiune mai groasă și mai durabilă, perfectă pentru utilizare pe termen lung sau în condiții meteo mai aspre.</li>
              </ul>
              <h4>Finisaje Incluse</h4>
              <ul>
                <li><strong>Tiv de Rezistență:</strong> Toate placile de alucobond sunt tivite pe margine pentru a preveni ruperea și a crește durabilitatea.</li>
                <li><strong>Capse Metalice:</strong> Inele metalice aplicate la aproximativ 50 cm distanță, pentru o instalare ușoară și sigură.</li>
              </ul>
              <h4>Specificații Grafică</h4>
              <ul>
                <li>Formate acceptate: PDF, AI, CDR, TIFF, JPG.</li>
                <li>Rezoluție recomandată: Minimum 150 dpi la scara 1:1.</li>
                <li>Mod de culoare: CMYK.</li>
                <li>Vă rugăm să nu includeți semne de tăiere sau bleed.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}