"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, X, MessageSquare, ChevronDown, MapPin } from "lucide-react";
// Asigură-te că importurile sunt corecte
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
  
  // --- FIX: Stocăm numele județului ca string, nu ID ---
  const [inputMode, setInputMode] = useState<InputMode>("text");
  const [selectedJudet, setSelectedJudet] = useState<string>(""); 
  const [tempLocalitate, setTempLocalitate] = useState(""); // Pentru controlul componentei

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen, isLoading, inputMode]);

  const parseResponse = (rawText: string) => {
    let cleanText = rawText;
    let mode: InputMode = "text";
    let suggestions: string[] = [];

    if (rawText.includes("||REQUEST: JUDET||")) {
        mode = "judet";
        cleanText = cleanText.replace("||REQUEST: JUDET||", "");
    } else if (rawText.includes("||REQUEST: LOCALITATE||")) {
        mode = "localitate";
        cleanText = cleanText.replace("||REQUEST: LOCALITATE||", "");
    }

    const regex = /\|\|OPTIONS:\s*(\[[\s\S]*?\])\s*\|\|/i;
    const match = cleanText.match(regex);
    if (match && match[1]) {
      try {
        let jsonStr = match[1].replace(/'/g, '"'); 
        suggestions = JSON.parse(jsonStr);
        cleanText = cleanText.replace(match[0], "");
      } catch (e) {}
    }

    return { cleanText: cleanText.trim(), suggestions, mode };
  };

  const sendMessage = async (textOverride?: string, displayLabel?: string) => {
    const userText = textOverride || input.trim();
    if (!userText || isLoading) return;

    setInput("");
    setTempLocalitate(""); // Resetăm selecția locală
    setInputMode("text");  // Revenim la text cât timp așteptăm răspunsul

    const newMessages = [...messages, { role: "user", content: displayLabel || userText } as Message];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const apiMessages = newMessages.map(({ role, content }) => ({ role, content }));
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error("Eroare server");
      const data = await res.json();
      
      const { cleanText, suggestions, mode } = parseResponse(data.message || "");
      
      setMessages((prev) => [...prev, { role: "assistant", content: cleanText, suggestions }]);
      setInputMode(mode);

    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "A apărut o eroare. Încearcă din nou." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- FIX: Handlers compatibili cu componentele tale ---
  
  // JudetSelector trimite direct string-ul (ex: "Alba")
  const handleJudetSelect = (val: string) => {
      if (!val) return;
      setSelectedJudet(val);
      sendMessage(val, val); // Trimitem numele județului la chat
  };

  // LocalitateSelector trimite direct string-ul (ex: "Alba Iulia")
  const handleLocalitateSelect = (val: string) => {
      if (!val) return;
      setTempLocalitate(val); // Doar pentru UI
      sendMessage(val, val);
  };

  if (!embedded && !isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-full shadow-xl transition-all hover:scale-105 animate-in fade-in slide-in-from-bottom-4"
      >
        <MessageSquare size={24} />
        <span className="font-semibold hidden sm:inline">Chat</span>
      </button>
    );
  }

  const containerClasses = embedded 
    ? "w-full h-[600px] bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden relative"
    : "fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[380px] h-[550px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200";

  return (
    <div className={containerClasses}>
      <div className="p-4 bg-indigo-600 flex items-center justify-between text-white shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Bot size={18} /></div>
          <div><h3 className="font-bold text-sm">Asistent Prynt.ro</h3></div>
        </div>
        {!embedded && (
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg">
            <ChevronDown size={20} />
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-black/40">
        {messages.map((msg, idx) => (
          <div key={idx} className="space-y-2">
            <div className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === "user" ? "bg-indigo-100 text-indigo-600" : "bg-white text-zinc-600 border"}`}>
                {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-sm shadow-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-indigo-600 text-white rounded-tr-sm" : "bg-white text-zinc-800 border rounded-tl-sm"}`}>
                {msg.content}
              </div>
            </div>
            
            {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && idx === messages.length - 1 && !isLoading && inputMode === 'text' && (
               <div className="flex flex-wrap gap-2 pl-10 animate-in fade-in slide-in-from-top-2 duration-300">
                  {msg.suggestions.map((option, i) => (
                    <button key={i} onClick={() => sendMessage(option)} className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-all text-left shadow-sm">
                      {option}
                    </button>
                  ))}
               </div>
            )}
          </div>
        ))}
        {isLoading && (
           <div className="flex gap-2 ml-1"><div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center"><Bot size={14} className="text-zinc-400" /></div><div className="bg-zinc-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2"><Loader2 size={14} className="animate-spin text-indigo-600" /><span className="text-xs text-zinc-500">Scriu...</span></div></div>
        )}
      </div>

      <div className="p-3 border-t bg-white shrink-0 min-h-[72px] flex items-center">
        
        {inputMode === "text" && (
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2 w-full">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Scrie aici..." className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-100 border-transparent focus:bg-white focus:border-indigo-500 border outline-none text-sm" />
            <button type="submit" disabled={isLoading || !input.trim()} className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"><Send size={18} /></button>
            </form>
        )}

        {inputMode === "judet" && (
            <div className="w-full animate-in slide-in-from-bottom-2 fade-in duration-300">
                <p className="text-xs text-zinc-500 mb-1 ml-1 font-medium flex items-center gap-1"><MapPin size={12}/> Selectează Județul:</p>
                <div className="border rounded-xl overflow-hidden bg-zinc-50">
                    <JudetSelector 
                        value={selectedJudet} // Acum trimitem string
                        onChange={handleJudetSelect} 
                    />
                </div>
            </div>
        )}

        {inputMode === "localitate" && (
            <div className="w-full animate-in slide-in-from-bottom-2 fade-in duration-300">
                <p className="text-xs text-zinc-500 mb-1 ml-1 font-medium flex items-center gap-1"><MapPin size={12}/> Selectează Localitatea:</p>
                {selectedJudet ? (
                    <div className="border rounded-xl overflow-hidden bg-zinc-50">
                        <LocalitateSelector 
                            judet={selectedJudet} // String, nu ID
                            value={tempLocalitate}
                            onChange={handleLocalitateSelect}
                        />
                    </div>
                ) : (
                    <p className="text-red-500 text-xs p-2">Eroare: Județul nu a fost selectat.</p>
                )}
            </div>
        )}

      </div>
    </div>
  );
}