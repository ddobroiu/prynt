"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AssistantWidget() {
  // Mesaj de bun venit
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Salut! Sunt consultantul tău virtual Prynt. \n\nAm acces la lista actualizată de prețuri pentru toate produsele (Bannere, Autocolante, Canvas, etc.). \n\nSpune-mi ce proiect ai (ex: dimensiuni, materiale) și îți pot calcula costul estimativ pe loc." 
    }
  ]);
  
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Funcția de trimitere mesaj
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput(""); // Curăță inputul
    
    // Adăugăm mesajul utilizatorului în listă
    const newHistory = [...messages, { role: "user", content: userMsg } as Message];
    setMessages(newHistory);
    setLoading(true);

    try {
      // Apelăm API-ul nostru care are acces la "lib/pricing.ts" și inteligență
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });

      if (!res.ok) {
        throw new Error("Eroare server");
      }
      
      const data = await res.json();
      
      // Extragem răspunsul (adaptat pentru structura OpenAI standard sau custom)
      const reply = data.choices?.[0]?.message?.content || 
                    data.reply || 
                    "Îmi pare rău, nu am putut genera un răspuns. Te rog să ne contactezi telefonic.";
      
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "A apărut o eroare de conexiune. Te rog verifică internetul sau încearcă mai târziu." }]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll la ultimul mesaj
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[600px]">
      {/* --- Header Chat --- */}
      <div className="bg-indigo-600 p-4 sm:p-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-full text-white backdrop-blur-sm">
            <Bot size={28} />
          </div>
          <div>
            <h3 className="text-white font-bold text-xl">Asistent Vânzări & Oferte</h3>
            <p className="text-indigo-100 text-sm">Calcul instant de preț pe baza specificațiilor tale.</p>
          </div>
        </div>
      </div>

      {/* --- Zona de Mesaje --- */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-50 dark:bg-black/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${m.role === "assistant" ? "bg-indigo-100 text-indigo-600" : "bg-zinc-200 text-zinc-600"}`}>
              {m.role === "assistant" ? <Bot size={20} /> : <User size={20} />}
            </div>
            
            {/* Bulă Mesaj */}
            <div className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-sm sm:text-base leading-relaxed shadow-sm whitespace-pre-wrap ${
              m.role === "assistant" 
                ? "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-tl-none" 
                : "bg-indigo-600 text-white rounded-tr-none"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        
        {/* Indicator încărcare */}
        {loading && (
          <div className="flex gap-4 animate-pulse">
             <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><Bot size={20} /></div>
             <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-3 text-zinc-500">
                <Loader2 className="animate-spin" size={18} />
                <span className="text-xs font-medium">Verific prețurile...</span>
             </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* --- Input Area --- */}
      <div className="p-4 sm:p-6 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
          <input 
            className="flex-1 bg-gray-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
            placeholder="Întreabă de preț... (ex: Vreau 100 de flyere A5 sau un banner 3x1m)" 
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <span className="hidden sm:inline font-medium">Trimite</span>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}