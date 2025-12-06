// components/BannerVersoConfigurator.tsx

"use client";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useCart } from "@/components/CartContext";
import { useToast } from "@/components/ToastProvider";
import { Plus, Minus, ShoppingCart, Info, ChevronDown, X, UploadCloud, Image as ImageIcon, Ruler, AlertTriangle, Link as LinkIcon, PlayCircle, TrendingUp, Percent, MessageCircle } from "lucide-react";
import DeliveryEstimation from "./DeliveryEstimation";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from 'next/link';
import FaqAccordion from "./FaqAccordion";
import Reviews from "./Reviews";
import DynamicBannerPreview from "./DynamicBannerPreview";
import ArtworkRatioPreview from "./ArtworkRatioPreview";
import SmartNewsletterPopup from "./SmartNewsletterPopup";
import { useUserActivityTracking } from "@/hooks/useAbandonedCartCapture"; 
import { 
  calculateBannerVersoPrice, 
  getBannerVersoUpsell, // <--- IMPORT NOU
  BANNER_VERSO_CONSTANTS, 
  formatMoneyDisplay, 
  roundMoney,
  type PriceInputBannerVerso 
} from "@/lib/pricing";
import { QA } from "@/types";

/* --- FAQs SPECIFIC PRODUSULUI --- */
const productFaqs: QA[] = [
  { question: "Ce material este folosit pentru bannerele față-verso?", answer: "Folosim material tip Blockout (650g/mp), special conceput pentru a bloca lumina, asigurând vizibilitate perfectă a graficii pe ambele fețe." },
  { question: "Care este diferența de preț față de cel cu o singură față?", answer: "Bannerele față-verso sunt calculate cu o bază de preț de aproximativ 1.5x față de cele standard, datorită materialului mai scump și procesului de imprimare mai complex." },
  { question: "Finisajele sunt incluse în preț?", answer: "Da, tivul de rezistență perimetral și capsele metalice sunt incluse standard. Puteți opta și pentru găuri de vânt." },
  { question: "Pot avea grafică diferită pe față și pe verso?", answer: "Da. Puteți alege să încărcați două grafici diferite sau să solicitați un design profesional separat pentru fiecare față, cu o taxă suplimentară (100 RON pentru grafică diferită)." },
  { question: "Cât durează producția și livrarea?", answer: "Producția durează în mod normal 1-3 zile lucrătoare. Livrarea prin curier rapid mai adaugă încă 1-2 zile, în funcție de localitatea de destinație." },
];

/* --- FAQs SPECIFIC PRODUSULUI --- */
const productFaqs: QA[] = [
  { question: "Ce material este folosit pentru bannerele față-verso?", answer: "Folosim material tip Blockout (650g/mp), special conceput pentru a bloca lumina, asigurând vizibilitate perfectă a graficii pe ambele fețe." },
  { question: "Care este diferența de preț față de cel cu o singură față?", answer: "Bannerele față-verso sunt calculate cu o bază de preț de aproximativ 1.5x față de cele standard, datorită materialului mai scump și procesului de imprimare mai complex." },
  { question: "Finisajele sunt incluse în preț?", answer: "Da, tivul de rezistență perimetral și capsele metalice sunt incluse standard. Puteți opta și pentru găuri de vânt." },
  { question: "Pot avea grafică diferită pe față și pe verso?", answer: "Da. Puteți alege să încărcați două grafici diferite sau să solicitați un design profesional separat pentru fiecare față, cu o taxă suplimentară (100 RON pentru grafică diferită)." },
  { question: "Cât durează producția și livrarea?", answer: "Producția durează în mod normal 1-3 zile lucrătoare. Livrarea prin curier rapid mai adaugă încă 1-2 zile, în funcție de localitatea de destinație." },
];

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
    const bannerFaqs: QA[] = [
        { question: "Ce material este folosit pentru bannerele față-verso?", answer: "Folosim material tip Blockout (650g/mp), special conceput pentru a bloca lumina, asigurând vizibilitate perfectă a graficii pe ambele fețe." },
        { question: "Care este diferența de preț față de cel cu o singură față?", answer: "Bannerele față-verso sunt calculate cu o bază de preț de aproximativ 1.5x față de cele standard, datorită materialului mai scump și procesului de imprimare mai complex." },
        { question: "Finisajele sunt incluse în preț?", answer: "Da, tivul de rezistență perimetral și capsele metalice sunt incluse standard. Puteți opta și pentru găuri de vânt." },
        { question: "Pot avea grafică diferită pe față și pe verso?", answer: "Da. Puteți alege să încărcați două grafici diferite sau să solicitați un design profesional separat pentru fiecare față, cu o taxă suplimentară (100 RON pentru grafică diferită)." },
        { question: "Cât durează producția și livrarea?", answer: "Producția durează în mod normal 1-3 zile lucrătoare. Livrarea prin curier rapid mai adaugă încă 1-2 zile, în funcție de localitatea de destinație." },
    ];
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeTab === "descriere"} onClick={() => setActiveTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeTab === "recenzii"} onClick={() => setActiveTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeTab === "faq"} onClick={() => setActiveTab("faq")}>FAQ</TabButtonSEO>
            </nav>
            <div className="p-6">
                {activeTab === 'descriere' && (
                    <div className="prose max-w-none text-sm text-gray-600">
                        <h3 className="text-gray-900 text-lg font-bold mb-2">Bannere Publicitare Față-Verso (Blockout)</h3>
                        <p className="mb-4">
                            <strong>Vizibilitate maximă în ambele direcții de mers.</strong> Bannerele Blockout sunt realizate dintr-un material special, opac, care împiedică trecerea luminii, asigurând vizibilitate perfectă a graficii pe ambele fețe. Soluția ideală pentru expunerea perpendiculară pe sensul de mers (ex: pe stâlpi sau balcoane).
                        </p>
                        
                        <h4 className="text-gray-900 font-semibold mt-4 mb-2">Materiale & Calitate</h4>
                        <ul className="list-disc pl-5 space-y-1 mb-4">
                            <li><strong>Blockout 650g:</strong> Material PVC foarte gros, cu inserție neagră la interior, care blochează lumina. Imprimare la rezoluție fotografică pe ambele fețe.</li>
                        </ul>

                        <h4 className="text-gray-900 font-semibold mt-4 mb-2">De ce să alegi bannerele noastre față-verso?</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Opacitate 100%:</strong> Grație stratului de blocare, nu veți avea probleme de 'ghosting' (vizibilitatea textului de pe partea opusă).</li>
                            <li><strong>Rezistență UV și Apă:</strong> Folosim cerneluri Eco-Solvent de ultimă generație care nu se decolorează.</li>
                            <li><strong>Finisaje Incluse:</strong> Tivul perimetral și capsele de prindere sunt incluse standard în preț.</li>
                        </ul>
                    </div>
                )}
                {activeTab === 'recenzii' && <Reviews productSlug={productSlug} />}
                {activeTab === 'faq' && <FaqAccordion qa={bannerFaqs} />}
            </div>
        </div>
    );
};

const TabButtonSEO = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => ( <button onClick={onClick} className={`flex-1 whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{children}</button> );

function BannerModeSwitchInline() {
  const pathname = usePathname();
  const isVerso = !!pathname && pathname.startsWith("/banner-verso");
  const isFace = !!pathname && pathname.startsWith("/banner") && !isVerso;

  return (
    <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
      <Link
        href="/banner"
        className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all inline-flex items-center justify-center ${isFace ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
      >
        O față
      </Link>
      <Link
        href="/banner-verso"
        className={`ml-1 px-4 py-1.5 rounded-md text-sm font-semibold transition-all inline-flex items-center justify-center ${isVerso ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
      >
        Față-verso
      </Link>
    </div>
  );
}

function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const inc = (d: number) => onChange(Math.max(1, value + d));
  return <div><label className="field-label">{label}</label><div className="flex"><button onClick={() => inc(-1)} className="p-3 bg-gray-100 rounded-l-lg hover:bg-gray-200" aria-label={`Scade ${label.toLowerCase()}`}><Minus size={16} /></button><input type="number" value={value} onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))} className="input text-center w-full rounded-none border-x-0" /><button onClick={() => inc(1)} className="p-3 bg-gray-100 rounded-r-lg hover:bg-gray-200" aria-label={`Creşte ${label.toLowerCase()}`}><Plus size={16} /></button></div></div>;
}

function OptionButton({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle?: string; }) {
  return <button type="button" onClick={onClick} className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${active ? "border-indigo-600 bg-indigo-50" : "border-gray-300 bg-white hover:border-gray-400"}`}><div className="font-bold text-gray-800">{title}</div>{subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}</button>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode; }) {
  return <button type="button" onClick={onClick} className={`px-4 py-2 text-sm font-semibold transition-colors rounded-t-lg ${active ? "border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50" : "text-gray-500 hover:text-gray-800"}`}>{children}</button>;
}

type Props = { productSlug?: string; initialWidth?: number; initialHeight?: number; productImage?: string; renderOnlyConfigurator?: boolean; imageUrl?: string | null };

// Definesc tipurile de view posibile
type ViewMode = 'gallery' | 'shape';

/* --- MAIN COMPONENT --- */
export default function BannerVersoConfigurator({ productSlug, initialWidth: initW, initialHeight: initH, productImage, renderOnlyConfigurator = false }: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // --- 1. INITIALIZARE STATE DIN URL SAU DEFAULT ---
  const [input, setInput] = useState<PriceInputBannerVerso>(() => {
    const pW = searchParams.get("w");
    const pH = searchParams.get("h");
    const pQ = searchParams.get("q");
    const pWind = searchParams.get("wind");
    const pSame = searchParams.get("same"); 

    return {
      width_cm: pW ? parseInt(pW) : (initW ?? 0),
      height_cm: pH ? parseInt(pH) : (initH ?? 0),
      quantity: pQ ? parseInt(pQ) : 1,
      want_wind_holes: pWind === '1',
      same_graphic: pSame !== '0', 
      designOption: "upload"
    };
  });
  
  const [lengthText, setLengthText] = useState(input.width_cm ? String(input.width_cm) : "");
  const [heightText, setHeightText] = useState(input.height_cm ? String(input.height_cm) : "");
  
  const galleryImages = useMemo(() => productImage ? [productImage, "/products/banner/verso/banner-verso-1.webp", "/products/banner/verso/banner-verso-2.webp", "/products/banner/verso/banner-verso-3.webp"] : ["/products/banner/verso/banner-verso-1.webp", "/products/banner/verso/banner-verso-2.webp", "/products/banner/verso/banner-verso-3.webp", "/products/banner/verso/banner-verso-4.webp"], [productImage]);
  
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [activeImage, setActiveImage] = useState<string>(galleryImages[0]);
  
  // --- VIDEO STATE ---
  const [videoOpen, setVideoOpen] = useState(false);

  const [artworkUrl, setArtworkUrl] = useState<string | null>(null); 
  const [artworkUrlVerso, setArtworkUrlVerso] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lowResWarning, setLowResWarning] = useState(false);

  const [textDesign, setTextDesign] = useState<string>(""); 
  const [textDesignVerso, setTextDesignVerso] = useState<string>(""); 
  
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [activeProductTab, setActiveProductTab] = useState("descriere");
  const [userEmail, setUserEmail] = useState<string>('');
  const toast = useToast();

  const priceData = useMemo(() => calculateBannerVersoPrice(input), [input]);
  const displayedTotal = priceData.finalPrice;

  // Auto-capture abandoned carts
  const cartData = useMemo(() => ({
    configuratorId: 'banner-verso',
    email: userEmail,
    configuration: { ...input, artworkUrl, textDesign, artworkUrlVerso, textDesignVerso },
    price: displayedTotal,
    quantity: input.quantity
  }), [userEmail, input, artworkUrl, textDesign, artworkUrlVerso, textDesignVerso, displayedTotal]);

  useUserActivityTracking(cartData);

  // --- UPSELL LOGIC (NOU) ---
  const upsellOpportunity = useMemo(() => {
    return getBannerVersoUpsell(input);
  }, [input]);

  const updateInput = <K extends keyof PriceInputBannerVerso>(k: K, v: PriceInputBannerVerso[K]) => setInput((p) => ({ ...p, [k]: v }));
  const setQty = (v: number) => updateInput("quantity", Math.max(1, Math.floor(v)));
  
  const onChangeLength = (v: string) => { 
      const d = v.replace(/\D/g, ""); 
      setLengthText(d); 
      updateInput("width_cm", d === "" ? 0 : parseInt(d, 10));
      if(d && parseInt(d) > 0) setViewMode('shape');
  };
  const onChangeHeight = (v: string) => { 
      const d = v.replace(/\D/g, ""); 
      setHeightText(d); 
      updateInput("height_cm", d === "" ? 0 : parseInt(d, 10));
      if(d && parseInt(d) > 0) setViewMode('shape');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (input.width_cm > 0) params.set("w", input.width_cm.toString());
      if (input.height_cm > 0) params.set("h", input.height_cm.toString());
      if (input.quantity > 1) params.set("q", input.quantity.toString());
      if (input.want_wind_holes) params.set("wind", "1");
      if (!input.same_graphic) params.set("same", "0"); 
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500); 

    return () => clearTimeout(timer);
  }, [input, pathname, router]);

  const checkResolution = useCallback((file: File) => {
    setLowResWarning(false);
    if (input.width_cm <= 0 || input.height_cm <= 0) return;

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;

    img.onload = () => {
        const { naturalWidth, naturalHeight } = img;
        const widthInches = input.width_cm / 2.54;
        const heightInches = input.height_cm / 2.54;
        const dpiW = naturalWidth / widthInches;
        const dpiH = naturalHeight / heightInches;
        const avgDpi = (dpiW + dpiH) / 2;

        if (avgDpi < 70) {
            setLowResWarning(true);
        }
        URL.revokeObjectURL(objectUrl);
    };
  }, [input.width_cm, input.height_cm]);
  
  const handleArtworkFileInput = async (file: File | null, side: 'front' | 'verso' = 'front') => {
    setUploadError(null);
    setLowResWarning(false); 

    if (side === 'front') setArtworkUrl(null); else setArtworkUrlVerso(null);

    if (!file) return;
    try {
      if (side === 'front' || input.same_graphic) {
          checkResolution(file);
      }

      const previewUrl = URL.createObjectURL(file);
      if (side === 'front' || input.same_graphic) {
          setArtworkUrl(previewUrl); 
          setViewMode('gallery'); 
      } else {
          setArtworkUrlVerso(previewUrl);
      }

      setUploading(true);
      const form = new FormData();
      form.append("file", file);
      form.append("side", side); 
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload eșuat pentru " + (side === 'front' ? 'față' : 'verso'));
      const data = await res.json();
      
      if (side === 'front' || input.same_graphic) {
          setArtworkUrl(data.url); 
      } else {
          setArtworkUrlVerso(data.url);
      }
    } catch (e: any) {
      setUploadError(e?.message ?? ("Eroare la upload pentru " + (side === 'front' ? 'față' : 'verso')));
    } finally {
      setUploading(false);
    }
  };

  function handleAddToCart() {
    if (!input.width_cm || !input.height_cm) {
      toast.warning("Te rugăm să completezi lungimea și înălțimea.");
      return;
    }
    if (displayedTotal <= 0) {
      toast.warning("Prețul trebuie calculat înainte de a adăuga în coș.");
      return;
    }
    
    const unitPrice = roundMoney(displayedTotal / input.quantity);
    const uniqueId = `${productSlug ?? 'banner-verso'}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const title = `Banner Față-Verso - ${input.width_cm}x${input.height_cm} cm`;

    const graphicMeta = input.designOption === 'pro' 
        ? 'Vreau grafică' 
        : input.designOption === 'text_only' 
        ? 'Doar text' 
        : 'Grafică proprie';
        
    const graphicsDetail = input.same_graphic ? "Identică" : "Diferită";

    const metadata: Record<string, any> = {
      "Material": "Blockout (Față-Verso)",
      "Finisaje": `Tiv și capse, ${input.want_wind_holes ? "cu găuri de vânt" : "fără găuri de vânt"}`,
      "Grafică": `${graphicMeta} (${graphicsDetail})`,
      
      ...(input.designOption === 'pro' && { "Cost grafică": formatMoneyDisplay(priceData.proFee) }),
      ...(input.designOption === 'text_only' ? { "Text Față": textDesign } : { "Grafică Față": artworkUrl }),
      ...(!input.same_graphic && input.designOption === 'text_only' && { "Text Verso": textDesignVerso }),
      ...(!input.same_graphic && input.designOption === 'upload' && { "Grafică Verso": artworkUrlVerso }),
      ...(!input.same_graphic && input.designOption !== 'pro' && { "Taxă Grafică Diferită": formatMoneyDisplay(BANNER_VERSO_CONSTANTS.FEES.DIFF_GRAPHICS) }),
    };

    addItem({
      id: uniqueId,
      productId: productSlug ?? "banner-verso-generic",
      slug: productSlug ?? "generic-banner-verso",
      title,
      width: input.width_cm,
      height: input.height_cm,
      price: unitPrice,
      quantity: input.quantity,
      currency: "RON",
      metadata,
    });
    toast.success("Produs adăugat în coș");
  }

  useEffect(() => {
    if (viewMode !== 'gallery' || artworkUrl) return;
    
    const id = setInterval(() => {
      setActiveIndex((i) => {
        const next = (i + 1) % galleryImages.length;
        return next;
      });
    }, 3000);
    return () => clearInterval(id);
  }, [galleryImages, viewMode, artworkUrl]);

  useEffect(() => {
    setActiveImage(galleryImages[activeIndex]);
  }, [activeIndex, galleryImages]);
  
  const canAdd = displayedTotal > 0 && input.width_cm > 0 && input.height_cm > 0;
  const summaryStep1 = input.width_cm > 0 && input.height_cm > 0 ? `${input.width_cm}x${input.height_cm}cm, ${input.quantity} buc.` : "Alege";
  const summaryStep2 = `Blockout, ${input.want_wind_holes ? "cu găuri" : "fără găuri"}`;
  const summaryStep3 = input.designOption === 'upload' ? `Grafică proprie (${input.same_graphic ? 'Identică' : 'Diferită'})` : input.designOption === 'text_only' ? `Doar text (${input.same_graphic ? 'Identic' : 'Diferit'})` : `Design Pro (${input.same_graphic ? 'Identic' : 'Diferit'})`;

  // --- HELPER COMPONENTS RENDER ---
  const renderUploadSection = (side: 'Față' | 'Verso', currentUrl: string | null, handleFile: (f: File | null) => Promise<void>, isLowRes: boolean, doCheck: boolean) => (
    <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
      <p className="text-sm font-semibold text-gray-700">{side}</p>
      <label className="flex flex-col items-center justify-center w-full h-24 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
        <span className="flex items-center space-x-2">
          <UploadCloud className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-600">Apasă pentru a încărca</span>
        </span>
        <input type="file" name={`file_upload_${side}`} className="hidden" onChange={e => handleFile(e.target.files?.[0] ?? null)} />
      </label>
      {uploading && <p className="text-sm text-indigo-600">Se încarcă...</p>}
      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
      {doCheck && isLowRes && (
          <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700 flex items-start gap-2">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <span>Imaginea pare a avea o rezoluție mică. Printul poate ieși pixelat.</span>
          </div>
      )}
      {currentUrl && !uploadError && (!doCheck || !isLowRes) && <p className="text-sm text-green-600 font-semibold">Grafică {side} încărcată cu succes!</p>}
    </div>
  );

  const renderTextOnlySection = (side: 'Față' | 'Verso', currentText: string, handleTextChange: (e: any) => void) => (
    <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
      <label className="field-label">{side} - Introdu textul dorit</label>
      <textarea 
        className="input" 
        rows={3} 
        value={currentText} 
        onChange={handleTextChange} 
        placeholder="ex: PROMOTIE, REDUCERI, etc."
      />
    </div>
  );

  return (
    <main className={renderOnlyConfigurator ? "" : "bg-gray-50 min-h-screen"}>
      <div className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* STÂNGA - ZONA VIZUALĂ */}
          <div className="lg:sticky top-24 h-max space-y-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              
              <div className="flex border-b border-gray-100 overflow-x-auto">
                    <button 
                      onClick={() => setViewMode('gallery')}
                      className={`flex-1 py-3 min-w-20 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === 'gallery' ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      <ImageIcon size={16} /> 
                      <span className="hidden sm:inline">Galerie</span>
                  </button>
                    <button 
                      onClick={() => setViewMode('shape')}
                      className={`flex-1 py-3 min-w-20 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${viewMode === 'shape' ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      <Ruler size={16} /> 
                      <span className="hidden sm:inline">Schiță Tehnică</span>
                  </button>
              </div>

              <div className="aspect-square relative bg-white">
                  {viewMode === 'gallery' && (
                    <>
                        {artworkUrl ? (
                            <div className="h-full w-full animate-in fade-in duration-300">
                                <ArtworkRatioPreview 
                                    width={input.width_cm} 
                                    height={input.height_cm} 
                                    imageUrl={artworkUrl}
                                    hasGrommets={true}
                                    hasWindHoles={input.want_wind_holes}
                                />
                            </div>
                        ) : (
                            <img src={activeImage} alt="Banner Față-Verso" className="h-full w-full object-cover animate-in fade-in duration-300" />
                        )}
                        <div className="absolute bottom-4 right-4 z-30">
                          <button
                            type="button"
                            onClick={() => setVideoOpen(true)}
                            aria-label="Vezi Video Prezentare"
                            className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold shadow-lg hover:bg-red-700 transform hover:-translate-y-0.5 transition-all"
                          >
                            <PlayCircle className="w-5 h-5 text-white" />
                            <span>Vezi Video Prezentare</span>
                          </button>
                        </div>
                    </>
                  )}
                  
                  {viewMode === 'shape' && (
                      <div className="h-full w-full p-4 animate-in fade-in slide-in-from-bottom-4 duration-300 bg-zinc-50">
                          <DynamicBannerPreview 
                              width={input.width_cm} 
                              height={input.height_cm} 
                              hasGrommets={true}
                              hasWindHoles={input.want_wind_holes}
                              imageUrl={null} 
                          />
                          <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-400">
                             Vizualizare tehnică (cote și finisaje)
                          </div>
                      </div>
                  )}
              </div>
              
              {viewMode === 'gallery' && (
                <div className="p-2">
                  <div className="grid grid-cols-4 gap-2">
                    {galleryImages.map((src, i) => (
                      <button key={src} onClick={() => setActiveIndex(i)} className={`relative rounded-lg aspect-square ${activeIndex === i ? "ring-2 ring-offset-2 ring-indigo-500" : "hover:opacity-80"}`}><img src={src} alt="Thumb" className="w-full h-full object-cover" /></button>
                    ))}
                  </div>
                </div>
                )}
            </div>
            <div className="hidden lg:block"><ProductTabs productSlug={productSlug || 'banner-verso'} /></div>
          </div>

          {/* DREAPTA - CONFIGURATOR */}
          <div>
            <header className="mb-6">
              <div className="flex justify-between items-center gap-4 mb-3"><h1 className="text-3xl font-extrabold text-gray-900">Configurator Banner Față-Verso</h1><BannerModeSwitchInline /></div>
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
                  <div className="md:col-span-2">
                    <NumberInput label="Cantitate" value={input.quantity} onChange={setQty} />

                    {/* --- UPSELL ALERT (NOU) --- */}
                    {upsellOpportunity && (
                        <div 
                            className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors flex gap-3 items-start"
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
              {/* Pasul 2 adaptat pentru Verso (material fix) */}
              <AccordionStep stepNumber={2} title="Material & Finisaje" summary={summaryStep2} isOpen={activeStep === 2} onClick={() => setActiveStep(2)}>
                <p className="field-label mb-2 font-bold">Material: Blockout 650g</p>
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        Bannerele Față-Verso sunt realizate exclusiv din material Blockout 650g, special conceput pentru opacitate 100%. Finisajele (tiv și capse) sunt incluse.
                    </p>
                </div>
                <label className="flex items-center gap-3 py-2 cursor-pointer"><input type="checkbox" className="checkbox" checked={input.want_wind_holes} onChange={(e) => updateInput("want_wind_holes", e.target.checked)} /><span className="text-sm font-medium text-gray-700">Adaugă găuri pentru vânt</span></label>
              </AccordionStep>
              <AccordionStep stepNumber={3} title="Grafică" summary={summaryStep3} isOpen={activeStep === 3} onClick={() => setActiveStep(3)} isLast={true}>
                <div>
                  <div className="mb-4">
                      {/* NOU: Selector Grafică Identică / Diferită (Buton Switch) */}
                      <div className="mb-4 p-4 rounded-lg border border-gray-300 bg-white shadow-sm">
                          <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-800">
                                  Tip Grafică:
                              </span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                      type="checkbox" 
                                      className="sr-only peer" 
                                      checked={!input.same_graphic} // TRUE = Grafica Diferă
                                      onChange={(e) => updateInput("same_graphic", !e.target.checked)} // Când este bifat, sameGraphic devine FALSE
                                  />
                                  {/* Switch UI */}
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                  
                                  {/* Text Indicator */}
                                  <span className="ml-3 text-sm font-medium text-gray-700">
                                      {input.same_graphic ? "Identică (Aceeași pe ambele fețe)" : "Diferită (Fețe diferite)"}
                                  </span>
                              </label>
                          </div>
                      </div>
                  </div>
                  
                  <div className="mb-4 border-b border-gray-200">
                    <div className="flex -mb-px">
                      <TabButton active={input.designOption === 'upload'} onClick={() => updateInput("designOption", 'upload')}>Am Grafică</TabButton>
                      <TabButton active={input.designOption === 'text_only'} onClick={() => updateInput("designOption", 'text_only')}>Doar Text</TabButton>
                      <TabButton active={input.designOption === 'pro'} onClick={() => updateInput("designOption", 'pro')}>Vreau Grafică</TabButton>
                    </div>
                  </div>

                  {input.designOption === 'upload' && (
                    <div className={`space-y-3 ${!input.same_graphic ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}>
                      <p className={`text-sm text-gray-600 ${!input.same_graphic ? 'md:col-span-2' : ''}`}>Încarcă fișierul/fișierele tale (PDF, JPG, TIFF, etc.).</p>
                      
                      {renderUploadSection('Față', artworkUrl, (f) => handleArtworkFileInput(f, 'front'), lowResWarning, true)}
                      
                      {!input.same_graphic && renderUploadSection('Verso', artworkUrlVerso, (f) => handleArtworkFileInput(f, 'verso'), false, false)}
                      
                    </div>
                  )}

                  {input.designOption === 'text_only' && (
                    <div className={`space-y-3 ${!input.same_graphic ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''}`}>
                      {renderTextOnlySection('Față', textDesign, e => setTextDesign(e.target.value))}
                      
                      {!input.same_graphic && renderTextOnlySection('Verso', textDesignVerso, e => setTextDesignVerso(e.target.value))}
                      
                    </div>
                  )}

                  {input.designOption === 'pro' && (
                    <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-800">
                      <p className="font-semibold">Serviciu de Grafică Profesională</p>
                      <p>O echipă de designeri va crea o propunere grafică pentru tine. Vei primi pe email o simulare pentru confirmare. Cost: 
                          <strong> 
                            {input.same_graphic 
                              ? formatMoneyDisplay(BANNER_VERSO_CONSTANTS.FEES.PRO_SAME) 
                              : formatMoneyDisplay(BANNER_VERSO_CONSTANTS.FEES.PRO_DIFF)}
                          </strong>.
                      </p>
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

            {/* BUTOANE SECUNDARE - WHATSAPP ȘI CERERE OFERTĂ */}
            <div className="mt-4 lg:mt-6 bg-gray-50 rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-3 text-center">Ai nevoie de ajutor sau o ofertă personalizată?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a 
                  href="https://wa.me/40750473111?text=Ma%20intereseaza%20configuratorul%20banner-verso" 
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
            
            {/* SECȚIUNE FEATURES - 4 ICONIȚE */}
            <div className="mt-8 lg:mt-12 bg-white rounded-2xl shadow-lg border border-gray-200">
              <nav className="border-b border-gray-200 flex">
                <TabButtonSEO active={activeProductTab === "descriere"} onClick={() => setActiveProductTab("descriere")}>Descriere</TabButtonSEO>
                <TabButtonSEO active={activeProductTab === "recenzii"} onClick={() => setActiveProductTab("recenzii")}>Recenzii</TabButtonSEO>
                <TabButtonSEO active={activeProductTab === "faq"} onClick={() => setActiveProductTab("faq")}>FAQ</TabButtonSEO>
              </nav>

              <div className="p-6 lg:p-8">
                {activeProductTab === 'descriere' && (
                  <>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Bannere Publicitare Față-Verso (Blockout)</h2>
                    <p className="text-gray-700 mb-6 leading-relaxed text-base lg:text-lg">
                      Vizibilitate maximă în ambele direcții de mers. Bannerele Blockout sunt realizate dintr-un material special, opac, care împiedică trecerea luminii, asigurând vizibilitate perfectă a graficii pe ambele fețe. Soluția ideală pentru expunerea perpendiculară pe sensul de mers (ex: pe stâlpi sau balcoane).
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Materiale & Calitate</h3>
                        <ul className="space-y-3 text-gray-700">
                          <li className="flex items-start">
                            <span className="text-indigo-600 font-bold mr-2 mt-1">•</span>
                            <span><strong>Blockout 650g:</strong> Material PVC foarte gros, cu inserție neagră la interior, care blochează lumina. Imprimare la rezoluție fotografică pe ambele fețe.</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">De ce să alegi bannerele noastre față-verso?</h3>
                        <ul className="space-y-3 text-gray-700">
                          <li className="flex items-start">
                            <span className="text-emerald-600 font-bold mr-2 mt-1">✓</span>
                            <span><strong>Opacitate 100%:</strong> Grăție stratului de blocare, nu veți avea probleme de 'ghosting' (vizibilitatea textului de pe partea opusă).</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-emerald-600 font-bold mr-2 mt-1">✓</span>
                            <span><strong>Rezistență UV și Apă:</strong> Folosim cerneluri Eco-Solvent de ultimă generație care nu se decolorează.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-emerald-600 font-bold mr-2 mt-1">✓</span>
                            <span><strong>Finisaje Incluse:</strong> Tivul perimetral și capsele de prindere sunt incluse standard în preț.</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900 mb-1">Print Dublu-Față UV</h3>
                          <p className="text-sm text-gray-600">Imprimare foto pe ambele fețe, vizibilitate maximă</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900 mb-1">Aceeași sau Grafică Diferită</h3>
                          <p className="text-sm text-gray-600">Flexibilitate maximă - alegi ce afișezi pe fiecare față</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900 mb-1">Rezistent Exterior</h3>
                          <p className="text-sm text-gray-600">Material Frontlit tratat UV, perfect pentru outdoor</p>
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
                          <p className="text-sm text-gray-600">Producție în 1-2 zile + curier rapid oriunde în România</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {activeProductTab === 'recenzii' && <Reviews productSlug={productSlug || 'banner-verso'} />}
                {activeProductTab === 'faq' && <FaqAccordion qa={productFaqs} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDetailsOpen(false)}>
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100" onClick={() => setDetailsOpen(false)} aria-label="Închide">
              <X size={20} className="text-gray-600" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Detalii Produs: Banner Față-Verso</h3>
            <div className="prose prose-sm max-w-none">
              <h4>Materiale & Durabilitate</h4>
              <ul>
                <li><strong>Blockout 650g:</strong> Material PVC flexibil și foarte rezistent, cu strat opac (negru) la interior, ideal pentru imprimarea față-verso fără ca imaginea de pe o parte să se vadă pe cealaltă.</li>
                <li><strong>Imprimare Eco-Solvent:</strong> Cerneluri rezistente la UV și apă, asigurând o durată de viață îndelungată la exterior.</li>
              </ul>
              <h4>Finisaje Incluse</h4>
              <ul>
                <li><strong>Tiv de Rezistență:</strong> Toate bannerele sunt tivite pe margine pentru a preveni ruperea și a crește durabilitatea.</li>
                <li><strong>Capse Metalice:</strong> Inele metalice aplicate la aproximativ 50 cm distanță, pentru o instalare ușoară și sigură.</li>
                <li><strong>Găuri pentru Vânt (Opțional):</strong> Perforații speciale care permit vântului să treacă, reducând presiunea asupra bannerului și prelungind durata de viață în zonele expuse.</li>
              </ul>
              <h4>Specificații Grafică</h4>
              <ul>
                <li>Formate acceptate: PDF, AI, CDR, TIFF, JPG.</li>
                <li>Rezoluție recomandată: Minimum 150 dpi la scara 1:1.</li>
                <li>Mod de culoare: CMYK.</li>
                <li>Puteți alege ca grafica să fie **Identică** sau **Diferită** pe cele două fețe.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO MODAL (LIGHTBOX) */}
      {videoOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={() => setVideoOpen(false)}>
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
                <button 
                    className="absolute top-4 right-4 text-white/70 hover:text-white z-20 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-all backdrop-blur-sm"
                    onClick={() => setVideoOpen(false)}
                >
                    <X size={24} />
                </button>
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/yTnqcz6RJ-4?autoplay=1&start=22&rel=0&modestbranding=1" 
                    title="Video Prezentare Banner" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full"
                ></iframe>
            </div>
        </div>
      )}

      {/* Smart Newsletter Popup */}
      <SmartNewsletterPopup 
        onSubscribe={(email) => setUserEmail(email)}
        delay={30}
      />
    </main>
  );
}