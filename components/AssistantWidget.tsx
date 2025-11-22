"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, X, MessageSquare, ChevronDown } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  suggestions?: string[];
};

interface AssistantWidgetProps {
  embedded?: boolean; // Prop nou pentru modul integrat
}

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
  
  // Dacă e embedded, pornește deschis. Dacă e floating, pornește închis.
  const [isOpen, setIsOpen] = useState(embedded);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen, isLoading]);

  const parseResponse = (rawText: string): { cleanText: string; suggestions: string[] } => {
    const regex = /\|\|OPTIONS:\s*(\[[\s\S]*?\])\s*\|\|/i;
    const match = rawText.match(regex);
    if (match && match[1]) {
      try {
        let jsonStr = match[1].replace(/'/g, '"'); 
        const suggestions = JSON.parse(jsonStr);
        const cleanText = rawText.replace(match[0], "").trim();
        return { cleanText, suggestions };
      } catch (e) {
        console.error("Eroare parsare:", e);
      }
    }
    return { cleanText: rawText, suggestions: [] };
  };

  const sendMessage = async (textOverride?: string) => {
    const userText = textOverride || input.trim();
    if (!userText || isLoading) return;

    setInput("");
    const newMessages = [...messages, { role: "user", content: userText } as Message];
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
      const { cleanText, suggestions } = parseResponse(data.message || "");
      setMessages((prev) => [...prev, { role: "assistant", content: cleanText, suggestions }]);

    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "A apărut o eroare. Încearcă din nou." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Logica de afișare Buton Plutitor (doar dacă NU e embedded și e închis)
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

  // Clase CSS dinamice în funcție de mod (Embedded vs Floating)
  const containerClasses = embedded 
    ? "w-full h-[600px] bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden relative"
    : "fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[380px] h-[550px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200";

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="p-4 bg-indigo-600 flex items-center justify-between text-white shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Bot size={18} /></div>
          <div><h3 className="font-bold text-sm">Asistent Prynt.ro</h3></div>
        </div>
        
        {/* Butonul de închidere apare doar în modul Floating */}
        {!embedded && (
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg">
            <ChevronDown size={20} />
          </button>
        )}
      </div>

      {/* Messages Area */}
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

            {/* Butoane de răspuns rapid */}
            {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && idx === messages.length - 1 && !isLoading && (
               <div className="flex flex-wrap gap-2 pl-10 animate-in fade-in slide-in-from-top-2 duration-300">
                  {msg.suggestions.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(option)}
                      className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 hover:border-indigo-300 transition-all text-left shadow-sm"
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
             <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center"><Bot size={14} className="text-zinc-400" /></div>
             <div className="bg-zinc-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2"><Loader2 size={14} className="animate-spin text-indigo-600" /><span className="text-xs text-zinc-500">Scriu...</span></div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t bg-white shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Scrie aici..." className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-100 border-transparent focus:bg-white focus:border-indigo-500 border outline-none text-sm" />
          <button type="submit" disabled={isLoading || !input.trim()} className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"><Send size={18} /></button>
        </form>
      </div>
    </div>
  );
}