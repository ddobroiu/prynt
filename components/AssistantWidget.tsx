"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, X, MessageSquare, ChevronDown, MapPin } from "lucide-react";
// Importăm componentele existente
import JudetSelector from "./JudetSelector";
import LocalitateSelector from "./LocalitateSelector";

type Message = {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
};

interface AssistantWidgetProps {
  embedded?: boolean;
}

// Moduri de input: text simplu, selector județ sau selector localitate
type InputMode = "text" | "judet" | "localitate";

export default function AssistantWidget({ embedded = false }: AssistantWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Salut! 👋 Sunt asistentul Prynt.ro. Cu ce te pot ajuta astăzi?",
      suggestions: ["Vreau o ofertă de preț", "Informații livrare", "Produse"]
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(embedded);
  
  // Stări pentru gestionarea selecțiilor de livrare
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [selectedJudet, setSelectedJudet] = useState<string>(""); 
  const [tempLocalitate, setTempLocalitate] = useState(""); 

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll la ultimul mesaj - optimizat pentru a preveni reflow forțat
  useEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      });
    }
  }, [messages, isOpen, isLoading, inputMode]);

  // Funcție pentru a detecta cerințele speciale din răspunsul AI-ului
  const parseResponse = (rawText: string) => {
    let cleanText = rawText;
    let mode: InputMode = "text";
    let suggestions: string[] = [];

    // Detectăm tag-urile speciale pentru Județ și Localitate
    if (rawText.includes("||REQUEST: JUDET||")) {
        mode = "judet";
        cleanText = cleanText.replace("||REQUEST: JUDET||", "");
    } else if (rawText.includes("||REQUEST: LOCALITATE||")) {
        mode = "localitate";
        cleanText = cleanText.replace("||REQUEST: LOCALITATE||", "");
    }

    // Parsăm opțiunile (butoanele) dacă există: ||OPTIONS: [...]||
    const regex = /\|\|OPTIONS:\s*(\[[\s\S]*?\])\s*\|\|/i;
    const match = cleanText.match(regex);
    if (match && match[1]) {
      try {
        let jsonStr = match[1].replace(/'/g, '"'); 
        suggestions = JSON.parse(jsonStr);
        cleanText = cleanText.replace(match[0], "");
      } catch (e) {
        console.error("Eroare parsare optiuni:", e);
      }
    }

    // Parsăm și liste numerotate simple din text (fallback pentru detecție automată)
    if (suggestions.length === 0) {
        const lines = cleanText.split('\n');
        lines.forEach(line => {
            const listMatch = line.trim().match(/^(\d+\.|-|\*)\s+(.*)/);
            if (listMatch && listMatch[2] && listMatch[2].length < 50) {
                suggestions.push(listMatch[2].trim());
            }
        });
    }

    return { cleanText: cleanText.trim(), suggestions, mode };
  };

  const sendMessage = async (textOverride?: string, displayLabel?: string) => {
    const userText = textOverride || input.trim();
    if (!userText || isLoading) return;

    setInput("");
    // Nu resetăm selectedJudet aici, pentru a-l păstra pentru selectorul de localitate
    if (inputMode !== "localitate") {
        setTempLocalitate(""); 
    }
    
    setInputMode("text"); // Revenim temporar la text cât așteptăm

    const newMessages = [...messages, { role: "user", content: displayLabel || userText } as Message];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Pregătim istoricul pentru API
      const apiMessages = newMessages.map(({ role, content }) => ({ role, content }));
      
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error("Eroare server");
      const data = await res.json();
      
      // Procesăm răspunsul pentru a vedea dacă cere Județ/Localitate sau oferă Opțiuni
      const { cleanText, suggestions, mode } = parseResponse(data.content || data.message || "");
      
      setMessages((prev) => [...prev, { role: "assistant", content: cleanText, suggestions }]);
      setInputMode(mode);

    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Îmi pare rău, a apărut o eroare. Te rog să încerci din nou." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler pentru selecția Județului
  const handleJudetSelect = (val: string) => {
      if (!val) return;
      setSelectedJudet(val);
      // Trimitem automat răspunsul la chat și trecem la pasul următor
      sendMessage(val, val); 
  };

  // Handler pentru selecția Localității
  const handleLocalitateSelect = (val: string) => {
      if (!val) return;
      setTempLocalitate(val);
      sendMessage(val, val);
  };

  // --- RENDER UI ---

  if (!embedded && !isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-xl transition-all hover:scale-105 animate-[fadeIn_0.3s_ease-out]"
      >
        <MessageSquare size={24} />
        <span className="font-semibold hidden sm:inline">Asistent</span>
      </button>
    );
  }

  const containerClasses = embedded 
    ? "w-full h-[600px] bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden relative"
    : "fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-[fadeIn_0.3s_ease-out]";

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="p-4 bg-blue-600 flex items-center justify-between text-white shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Bot size={18} /></div>
          <div><h2 className="font-bold text-sm">Asistent Prynt.ro</h2></div>
        </div>
        {!embedded && (
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg">
            <ChevronDown size={20} />
          </button>
        )}
      </div>

      {/* Zona de Chat */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className="space-y-2">
            <div className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === "user" ? "bg-blue-100 text-blue-600" : "bg-white text-gray-600 border"}`}>
                {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm shadow-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white text-gray-800 border rounded-tl-sm"}`}>
                {msg.content}
              </div>
            </div>
            
            {/* Butoane (Chips) pentru Opțiuni */}
            {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && idx === messages.length - 1 && !isLoading && inputMode === 'text' && (
               <div className="flex flex-wrap gap-2 pl-10 animate-[fadeIn_0.3s_ease-out]">
                  {msg.suggestions.map((option, i) => (
                    <button 
                        key={i} 
                        onClick={() => sendMessage(option)} 
                        className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all text-left shadow-sm active:scale-95"
                    >
                      {option}
                    </button>
                  ))}
               </div>
            )}
          </div>
        ))}
        
        {isLoading && (
           <div className="flex gap-2 ml-1">
                <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center"><Bot size={14} className="text-gray-400" /></div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-blue-600" />
                    <span className="text-xs text-gray-500">Scriu...</span>
                </div>
           </div>
        )}
      </div>

      {/* Zona de Input (Dinamică) */}
      <div className="p-3 border-t bg-white shrink-0 min-h-[72px] flex items-center">
        
        {/* MOD 1: Text Input Standard */}
        {inputMode === "text" && (
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2 w-full">
            <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Scrie aici..." 
                className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 border outline-none text-sm transition-all" 
            />
            <button 
                type="submit" 
                disabled={isLoading || !input.trim()} 
                className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                aria-label="Trimite mesaj"
            >
                <Send size={18} />
            </button>
            </form>
        )}

        {/* MOD 2: Selector Județ */}
        {inputMode === "judet" && (
            <div className="w-full animate-[fadeIn_0.3s_ease-out]">
                <p className="text-xs text-gray-500 mb-1 ml-1 font-medium flex items-center gap-1"><MapPin size={12}/> Selectează Județul:</p>
                <div className="border rounded-xl overflow-hidden bg-gray-50 p-1">
                    <JudetSelector 
                        value={selectedJudet} 
                        onChange={handleJudetSelect} 
                    />
                </div>
            </div>
        )}

        {/* MOD 3: Selector Localitate */}
        {inputMode === "localitate" && (
            <div className="w-full animate-[fadeIn_0.3s_ease-out]">
                <p className="text-xs text-gray-500 mb-1 ml-1 font-medium flex items-center gap-1"><MapPin size={12}/> Selectează Localitatea:</p>
                {selectedJudet ? (
                    <div className="border rounded-xl overflow-hidden bg-gray-50 p-1">
                        <LocalitateSelector 
                            judet={selectedJudet} 
                            value={tempLocalitate}
                            onChange={handleLocalitateSelect}
                        />
                    </div>
                ) : (
                    <div className="text-red-500 text-xs p-2 bg-red-50 rounded-lg border border-red-100">
                        ⚠️ Eroare: Județul nu a fost selectat corect. Vă rog scrieți "Reset" pentru a începe din nou.
                    </div>
                )}
            </div>
        )}

      </div>
    </div>
  );
}