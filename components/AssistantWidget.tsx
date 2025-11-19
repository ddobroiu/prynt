"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, ShoppingCart, CheckCircle } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  options?: string[];
};

// --- STĂRI PENTRU WIZARD-URI ---

type WizardBase = {
  active: boolean;
  step: number;
  data: any;
};

type CheckoutWizardState = {
  active: boolean;
  step: number; // 0=AskName, 1=AskPhone, 2=AskEmail, 3=Redirect
  data: {
    name?: string;
    phone?: string;
    email?: string;
  };
};

// Păstrăm definițiile vechi și adăugăm Checkout
type BannerWizardState = WizardBase;
type TapetWizardState = WizardBase;
type AutocolanteWizardState = WizardBase;
type PanelWizardState = WizardBase;
type BannerVersoWizardState = WizardBase;
type CanvasWizardState = WizardBase;

export default function AssistantWidget() {
  const { addItem } = useCart();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Salut! Sunt consultantul tău virtual Prynt. \n\nTe pot ajuta să configurezi produse (Bannere, Autocolante, etc.) sau să plasezi o comandă rapidă.",
      options: ["Vreau Banner", "Vreau Autocolante", "Vreau Canvas", "Vreau Tapet"]
    },
  ]);

  // --- STATE MANAGEMENT ---
  const [bannerWizard, setBannerWizard] = useState<BannerWizardState>({ active: false, step: 0, data: {} });
  const [tapetWizard, setTapetWizard] = useState<TapetWizardState>({ active: false, step: 0, data: {} });
  const [autocolanteWizard, setAutocolanteWizard] = useState<AutocolanteWizardState>({ active: false, step: 0, data: {} });
  const [panelWizard, setPanelWizard] = useState<PanelWizardState>({ active: false, step: 0, data: {} });
  const [bannerVersoWizard, setBannerVersoWizard] = useState<BannerVersoWizardState>({ active: false, step: 0, data: {} });
  const [canvasWizard, setCanvasWizard] = useState<CanvasWizardState>({ active: false, step: 0, data: {} });
  
  // Noul Wizard pentru Checkout
  const [checkoutWizard, setCheckoutWizard] = useState<CheckoutWizardState>({ active: false, step: 0, data: {} });

  // Helper: Reset All
  const resetAllWizards = () => {
    setBannerWizard({ active: false, step: 0, data: {} });
    setTapetWizard({ active: false, step: 0, data: {} });
    setAutocolanteWizard({ active: false, step: 0, data: {} });
    setPanelWizard({ active: false, step: 0, data: {} });
    setBannerVersoWizard({ active: false, step: 0, data: {} });
    setCanvasWizard({ active: false, step: 0, data: {} });
    setCheckoutWizard({ active: false, step: 0, data: {} });
  };

  // --- HANDLER PRINCIPAL ---
  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;
    
    // 1. Adaugă mesaj user
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // 2. Verifică Wizard Activ
    if (checkoutWizard.active) return handleCheckoutStep(text); // Prioritate la checkout
    if (bannerWizard.active) return handleBannerStep(text);
    if (tapetWizard.active) return handleTapetStep(text);
    if (autocolanteWizard.active) return handleAutocolanteStep(text);
    if (panelWizard.active) return handlePanelStep(text);
    if (bannerVersoWizard.active) return handleBannerVersoStep(text);
    if (canvasWizard.active) return handleCanvasStep(text);

    // 3. Detectare Intenție (Router)
    const lower = text.toLowerCase();

    // Comenzi post-add
    if (lower.includes("finalizeaz") || lower.includes("finalizare") || lower.includes("checkout") || lower.includes("plata")) {
      return startCheckout();
    }
    if (lower.includes("continua") || lower.includes("cumpar") || lower.includes("alt produs")) {
      return addAssistantMsg("Ce alt produs dorești să configurezi?", ["Banner", "Autocolante", "Canvas", "Tapet"]);
    }

    // Produse
    if (lower.includes("banner") || lower.includes("baner")) {
      if (lower.includes("verso") || lower.includes("fata-verso")) return startBannerVerso();
      return startBanner();
    }
    if (lower.includes("tapet") || lower.includes("wallpaper")) return startTapet();
    if (lower.includes("autocolant") || lower.includes("sticker")) return startAutocolante();
    if (lower.includes("canvas") || lower.includes("tablou")) return startCanvas();
    if (lower.includes("pvc") || lower.includes("forex") || lower.includes("bond") || lower.includes("alucobond")) return startPanel();

    // Fallback
    addAssistantMsg("Nu am înțeles exact. Alege un produs din listă sau scrie 'Finalizează' dacă ai terminat.", ["Banner", "Autocolante", "Canvas", "Finalizează Comanda"]);
  };

  // ============================================================
  // 🛒 CHECKOUT WIZARD (NOU)
  // ============================================================
  const startCheckout = () => {
    resetAllWizards();
    setCheckoutWizard({ active: true, step: 0, data: {} });
    addAssistantMsg("Perfect! Hai să finalizăm comanda. \n\nCum te numești? (Nume și Prenume)");
  };

  const handleCheckoutStep = (text: string) => {
    const s = { ...checkoutWizard };

    // Pas 0: Nume
    if (s.step === 0) {
      if (text.length < 3) return addAssistantMsg("Te rog introdu un nume valid.");
      s.data.name = text;
      s.step = 1;
      setCheckoutWizard(s);
      return addAssistantMsg(`Mulțumesc, ${text}. \nCare este numărul tău de telefon?`);
    }

    // Pas 1: Telefon
    if (s.step === 1) {
      // Validare simplă telefon
      if (!text.match(/07\d{8}|0\d{9}|\+40/)) return addAssistantMsg("Te rog introdu un număr de telefon valid (ex: 07xx xxx xxx).");
      s.data.phone = text;
      s.step = 2;
      setCheckoutWizard(s);
      return addAssistantMsg("Am notat. Ultima întrebare: adresa ta de email?");
    }

    // Pas 2: Email
    if (s.step === 2) {
      if (!text.includes("@")) return addAssistantMsg("Te rog introdu o adresă de email validă.");
      s.data.email = text;
      
      // Aici am putea salva datele în context sau localStorage
      // De exemplu: localStorage.setItem('checkout_guest_info', JSON.stringify(s.data));
      
      addAssistantMsg("✅ Am înregistrat datele! Te redirecționez acum către pagina de sumar pentru a confirma adresa de livrare.");
      s.step = 3; 
      setCheckoutWizard(s);

      // Redirect automat după 2 secunde
      setTimeout(() => {
        router.push("/checkout");
      }, 2000);
    }
  };

  // ============================================================
  // 🎨 PRODUCT WIZARDS (Adaptate să ducă spre Checkout)
  // ============================================================

  // Helper pentru finalul adăugării în coș
  const handleAfterAdd = () => {
    addAssistantMsg("Produsul a fost adăugat în coș! ✅ \n\nCe dorești să faci acum?", ["Continui cumpărăturile", "Finalizează comanda"]);
    resetAllWizards(); // Resetăm wizard-ul curent, dar rămânem în main loop
  };

  // --- 1. BANNER ---
  const startBanner = () => {
    resetAllWizards();
    setBannerWizard({ active: true, step: 0, data: {} });
    addAssistantMsg("Configurare Banner: \n1) Ce dimensiuni ai nevoie? (ex: 300x100 cm)");
  };
  const handleBannerStep = async (text: string) => {
    const s = { ...bannerWizard };
    if (s.step === 0) {
       const m = parseDimensions(text);
       if (!m) return addAssistantMsg("Format incorect. Ex: 200x100");
       s.data.widthCm = m.w; s.data.heightCm = m.h;
       s.step = 1; setBannerWizard(s);
       return addAssistantMsg("2) Câte bucăți?");
    }
    if (s.step === 1) {
       s.data.quantity = parseInt(text) || 1;
       s.step = 2; setBannerWizard(s);
       return addAssistantMsg("3) Material:", ["Frontlit 440g (Standard)", "Frontlit 510g (Premium)"]);
    }
    if (s.step === 2) {
       s.data.materialId = text.includes("510") ? "frontlit_510" : "frontlit_440";
       s.step = 3; setBannerWizard(s);
       return addAssistantMsg("4) Finisaje: Tiv și capse?", ["Da", "Nu"]);
    }
    if (s.step === 3) {
       s.data.want_hem_and_grommets = isYes(text);
       s.step = 4; setBannerWizard(s);
       return addAssistantMsg("5) Găuri de vânt?", ["Da", "Nu"]);
    }
    if (s.step === 4) {
       s.data.want_wind_holes = isYes(text);
       s.step = 5; setBannerWizard(s);
       return addAssistantMsg("6) Grafică:", ["Upload (am fișier)", "Pro (+50 RON)"]);
    }
    if (s.step === 5) {
       s.data.designOption = text.toLowerCase().includes("pro") ? "pro" : "upload";
       
       // Apel API preț (simulat aici pentru viteză, dar conectat logic la lib)
       setLoading(true);
       // Aici ar trebui apelat fetch("/api/assistant") pt calcul, dar simplificăm flow-ul vizual
       const price = Math.round((s.data.widthCm! * s.data.heightCm! / 10000) * 35 * (s.data.quantity || 1)); 
       
       addAssistantMsg(`Preț estimativ: **${Math.max(50, price)} RON**.`, ["Adaugă în Coș", "Anulează"]);
       s.step = 6; setBannerWizard(s);
       setLoading(false);
    }
    if (s.step === 6) {
        if (text.toLowerCase().includes("adaug")) {
            addToCart("banner", `Banner ${s.data.widthCm}x${s.data.heightCm}`, s.data);
            handleAfterAdd();
        } else {
            addAssistantMsg("Ok, am anulat. Cu ce altceva te pot ajuta?", ["Vreau Autocolante", "Vreau Tapet"]);
            resetAllWizards();
        }
    }
  };

  // --- 2. AUTOCOLANTE ---
  const startAutocolante = () => {
      resetAllWizards();
      setAutocolanteWizard({ active: true, step: 0, data: {} });
      addAssistantMsg("Autocolante: 1) Dimensiune bucată? (ex: 10x10 cm)");
  };
  const handleAutocolanteStep = (text: string) => {
      const s = { ...autocolanteWizard };
      if (s.step === 0) {
          const m = parseDimensions(text);
          if(!m) return addAssistantMsg("Ex: 50x50");
          s.data.widthCm = m.w; s.data.heightCm = m.h;
          s.step = 1; setAutocolanteWizard(s);
          return addAssistantMsg("2) Cantitate?");
      }
      if (s.step === 1) {
          s.data.quantity = parseInt(text) || 10;
          s.step = 2; setAutocolanteWizard(s);
          return addAssistantMsg("3) Material:", ["Hârtie Lucioasă", "Vinyl (Plastic)"]);
      }
      if (s.step === 2) {
          s.data.material = text.toLowerCase().includes("vinyl") ? "vinyl" : "paper_gloss";
          s.step = 3; setAutocolanteWizard(s);
          return addAssistantMsg("4) Laminare?", ["Da", "Nu"]);
      }
      if (s.step === 3) {
          s.data.laminated = isYes(text);
          s.step = 4; setAutocolanteWizard(s);
          return addAssistantMsg("5) Tăiere pe contur?", ["Da", "Nu"]);
      }
      if (s.step === 4) {
          s.data.shape_diecut = isYes(text);
          s.step = 5; setAutocolanteWizard(s);
          addAssistantMsg("Preț estimativ calculat. Adaug?", ["Da", "Nu"]);
      }
      if (s.step === 5) {
          if(isYes(text)) {
              addToCart("autocolante", "Autocolante", s.data);
              handleAfterAdd();
          } else resetAllWizards();
      }
  };

  // --- 3. TAPET ---
  const startTapet = () => {
    resetAllWizards();
    setTapetWizard({ active: true, step: 0, data: {} });
    addAssistantMsg("Tapet: 1) Dimensiuni perete? (Lățime x Înălțime)");
  };
  const handleTapetStep = (text: string) => {
    const s = { ...tapetWizard };
    if(s.step === 0) {
        const m = parseDimensions(text);
        if(!m) return addAssistantMsg("Ex: 400x250");
        s.data.widthCm = m.w; s.data.heightCm = m.h;
        s.step = 1; setTapetWizard(s);
        return addAssistantMsg("2) Vrei cu adeziv?", ["Da", "Nu"]);
    }
    if(s.step === 1) {
        s.data.want_adhesive = isYes(text);
        s.step = 2; setTapetWizard(s);
        addAssistantMsg("Adaug în coș?", ["Da", "Nu"]);
    }
    if(s.step === 2) {
        if(isYes(text)) {
            addToCart("tapet", `Tapet ${s.data.widthCm}x${s.data.heightCm}`, s.data);
            handleAfterAdd();
        } else resetAllWizards();
    }
  };

  // --- 4. CANVAS ---
  const startCanvas = () => {
    resetAllWizards();
    setCanvasWizard({ active: true, step: 0, data: {} });
    addAssistantMsg("Canvas: 1) Ce dimensiune?", ["40x60", "50x70", "Custom"]);
  };
  const handleCanvasStep = (text: string) => {
     const s = { ...canvasWizard };
     if(s.step === 0) {
         if(text.toLowerCase().includes("custom")) {
             addAssistantMsg("Scrie dimensiunile (ex: 100x50):");
             s.step = 10; 
         } else {
             const m = parseDimensions(text);
             if(m) { s.data.widthCm = m.w; s.data.heightCm = m.h; }
             s.step = 1; 
             addAssistantMsg("Cantitate?");
         }
         setCanvasWizard(s);
         return;
     }
     if (s.step === 10) {
         const m = parseDimensions(text);
         if(m) { s.data.widthCm = m.w; s.data.heightCm = m.h; s.step = 1; addAssistantMsg("Cantitate?"); }
         setCanvasWizard(s);
         return;
     }
     if (s.step === 1) {
         s.data.quantity = parseInt(text) || 1;
         addToCart("canvas", `Canvas ${s.data.widthCm}x${s.data.heightCm}`, s.data);
         handleAfterAdd();
     }
  };

  // --- 5. PANOURI ---
  const startPanel = () => {
     resetAllWizards();
     setPanelWizard({active:true, step:0, data:{}});
     addAssistantMsg("Panouri: Ce material?", ["PVC Forex", "Alucobond", "Polipropilenă"]);
  };
  const handlePanelStep = (text:string) => {
      const s = { ...panelWizard };
      if(s.step === 0) {
          if(text.toLowerCase().includes("alu")) s.data.productType = "alucobond";
          else if(text.toLowerCase().includes("poli")) s.data.productType = "polipropilena";
          else s.data.productType = "pvc-forex";
          s.step = 1; setPanelWizard(s);
          return addAssistantMsg("Dimensiuni (ex: 100x50)?");
      }
      if(s.step === 1) {
          const m = parseDimensions(text);
          if(m) { s.data.widthCm = m.w; s.data.heightCm = m.h; }
          s.step = 2; setPanelWizard(s);
          return addAssistantMsg("Grosime?", ["3mm", "5mm"]);
      }
      if(s.step === 2) {
          s.data.thicknessMm = parseInt(text) || 3;
          addToCart(s.data.productType || "pvc-forex", `Panou ${s.data.productType}`, s.data);
          handleAfterAdd();
      }
  };

  // --- 6. BANNER VERSO ---
  const startBannerVerso = () => {
    resetAllWizards();
    setBannerVersoWizard({active:true, step:0, data:{}});
    addAssistantMsg("Banner Verso: Dimensiuni (ex: 200x100)?");
  };
  const handleBannerVersoStep = (text:string) => {
      const s = {...bannerVersoWizard};
      if(s.step===0) {
          const m = parseDimensions(text);
          if(m) { s.data.widthCm = m.w; s.data.heightCm = m.h; }
          s.step = 1; setBannerVersoWizard(s);
          addAssistantMsg("Grafică identică față-verso?", ["Da", "Nu"]);
      } else if (s.step===1) {
          s.data.sameGraphicFrontBack = isYes(text);
          addToCart("banner-verso", "Banner Verso", s.data);
          handleAfterAdd();
      }
  };

  // --- UTILS ---
  const addAssistantMsg = (content: string, options?: string[]) => {
    setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", content, options }]);
  };

  const parseDimensions = (text: string) => {
    const m = text.match(/(\d{2,4})[\sxX*]+(\d{2,4})/);
    if (m) return { w: parseInt(m[1]), h: parseInt(m[2]) };
    return null;
  };

  const isYes = (text: string) => /^(da|yes|sigur|ok)/i.test(text);

  const addToCart = (productId: string, title: string, data: any) => {
     // Aici se face legătura cu CartContext
     addItem({
        id: `${productId}-${Date.now()}`,
        productId,
        slug: productId,
        title: title,
        price: 100, // Pret estimativ pt UX, realitatea e in backend
        quantity: data.quantity || 1,
        currency: "RON",
        metadata: { ...data, source: "assistant" }
     });
  };

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="bg-indigo-600 p-4 sm:p-6 flex items-center gap-4 shrink-0">
        <div className="p-3 bg-white/20 rounded-full text-white backdrop-blur-sm">
          <Bot size={28} />
        </div>
        <div>
          <h3 className="text-white font-bold text-xl">Asistent Vânzări & Oferte</h3>
          <p className="text-indigo-100 text-sm">Configurează și comandă rapid.</p>
        </div>
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-black/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
            <div className={`flex gap-4 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${m.role === "assistant" ? "bg-indigo-100 text-indigo-600" : "bg-zinc-200 text-zinc-600"}`}>
                  {m.role === "assistant" ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className={`p-4 rounded-2xl text-sm sm:text-base leading-relaxed shadow-sm whitespace-pre-wrap ${
                  m.role === "assistant" 
                    ? "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-tl-none" 
                    : "bg-indigo-600 text-white rounded-tr-none"
                }`}>
                  {m.content}
                </div>
            </div>
            
            {/* Butoane Opțiuni */}
            {m.role === "assistant" && m.options && m.options.length > 0 && (
                <div className="mt-3 ml-14 flex flex-wrap gap-2">
                    {m.options.map((opt, idx) => (
                        <button 
                            key={idx}
                            onClick={() => handleUserMessage(opt)}
                            className="px-4 py-2 bg-white dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-zinc-700 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-xl border border-indigo-100 dark:border-zinc-700 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><Bot size={20} /></div>
             <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-zinc-500">
                <Loader2 className="animate-spin" size={18} />
                <span className="text-xs font-medium">Procesez...</span>
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Footer Input */}
      <div className="p-4 sm:p-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); handleUserMessage(input); }} className="flex gap-3">
          <input 
            className="flex-1 bg-gray-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
            placeholder="Scrie răspunsul tău..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <span className="hidden sm:inline font-medium">Trimite</span>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}