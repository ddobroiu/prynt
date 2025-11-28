"use client";

import React from 'react';
import { 
  MessageCircle, FileText, ShoppingCart, Zap, Sparkles, ArrowLeft 
} from 'lucide-react';
import AssistantWidget from '@/components/AssistantWidget';

export default function AssistantSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-white overflow-hidden border-t border-slate-50">
        
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          
          {/* MODIFICARE LAYOUT:
             - flex-col: Pe mobil, elementele sunt unul sub altul (în ordinea din cod).
             - lg:flex-row: Pe desktop, sunt unul lângă altul (Stânga -> Dreapta).
             - items-start: Aliniere sus pentru sticky.
          */}
          <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
            
            {/* 1. ZONA WIDGET 
               - PRIMUL în cod => SUS pe Mobil.
               - STÂNGA pe Desktop (datorită flex-row).
            */}
            <div className="flex-1 w-full max-w-xl mx-auto lg:mx-0 relative">
               {/* Glow effect behind */}
               <div className="absolute -inset-4 bg-gradient-to-r from-indigo-200 to-blue-100 rounded-[40px] blur-3xl opacity-40 -z-10"></div>
               
               <div className="relative rounded-[32px] overflow-hidden bg-white/80 backdrop-blur-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-white/50 ring-1 ring-slate-900/5">
                  {/* Header Minimalist */}
                  <div className="h-14 bg-white/50 border-b border-slate-100 flex items-center justify-between px-6">
                     <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                     </div>
                     <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        AI Online
                     </div>
                  </div>
                  
                  <div className="h-[650px] w-full bg-white/50">
                    <AssistantWidget embedded={true} /> 
                  </div>
               </div>
            </div>

            {/* 2. ZONA TEXT 
               - AL DOILEA în cod => JOS pe Mobil.
               - DREAPTA pe Desktop.
            */}
            <div className="flex-1 space-y-12 lg:sticky lg:top-32 text-center lg:text-left">
              
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 text-xs font-bold tracking-wide uppercase shadow-sm">
                   <Sparkles className="w-3 h-3" />
                   <span>AI Assistant 2.0</span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                  Colegul tău digital, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">disponibil non-stop.</span>
                </h2>

                <p className="text-lg text-slate-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
                  Fără timp de așteptare la telefon. Discută direct cu sistemul nostru de producție pentru oferte, comenzi și status, chiar aici sau pe WhatsApp.
                </p>
              </div>

              {/* Listă Beneficii */}
              <div className="space-y-8 text-left">
                <div className="flex items-start gap-4 group">
                   <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <MessageCircle className="text-emerald-500 w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="text-slate-900 font-bold text-lg">Comenzi Rapide pe WhatsApp</h3>
                      <p className="text-slate-500 text-sm mt-1 leading-relaxed">Scrie-ne natural, trimite fișierele și noi preluăm comanda instant.</p>
                   </div>
                </div>

                <div className="flex items-start gap-4 group">
                   <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <FileText className="text-blue-500 w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="text-slate-900 font-bold text-lg">Oferte PDF Instantanee</h3>
                      <p className="text-slate-500 text-sm mt-1 leading-relaxed">Ai nevoie de preț? Asistentul generează oferta oficială pe loc.</p>
                   </div>
                </div>

                <div className="flex items-start gap-4 group">
                   <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <Zap className="text-amber-500 w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="text-slate-900 font-bold text-lg">Suport Tehnic & Status</h3>
                      <p className="text-slate-500 text-sm mt-1 leading-relaxed">Află unde e coletul sau ce specificații ai nevoie pentru grafică.</p>
                   </div>
                </div>
              </div>

              {/* BUTOANE */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                  {/* Buton WhatsApp - VERDE */}
                  <a 
                    href="https://wa.me/40750259955" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#128C7E] hover:bg-[#0F6B5A] text-white font-bold transition-all shadow-xl shadow-green-200 hover:shadow-2xl hover:-translate-y-1"
                  >
                    <MessageCircle size={22} />
                    WhatsApp Chat
                  </a>
                  
                  {/* Buton Secundar - Săgeată spre Stânga (indicând spre widget) */}
                  <div className="flex items-center justify-center gap-2 px-6 py-4 text-slate-500 text-sm font-medium bg-slate-50 rounded-full border border-slate-200">
                    <ArrowLeft className="text-indigo-500 animate-pulse" size={18} />
                    <span>Chat Live</span>
                  </div>
              </div>

            </div>

          </div>
        </div>
      </section>
  );
}