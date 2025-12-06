"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, ChevronRight, ChevronLeft, Sparkles, Truck, Zap, ShieldCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- DATELE (TOATE CONFIGURATOARELE - 18) ---
const HERO_ITEMS = [
  {
    id: 'banner',
    title: 'Bannere Outdoor',
    description: 'Rezistente UV, tiv & capse incluse. Vizibilitate maximă.',
    image: '/products/banner/banner-1.webp',
    link: '/banner',
    gradient: 'from-blue-600 to-cyan-500',
    badge: 'Top Vânzări'
  },
  {
    id: 'autocolante',
    title: 'Autocolante & Stickere',
    description: 'Print & Cut pe contur. Orice formă.',
    image: '/products/autocolante/autocolante-1.webp',
    link: '/autocolante',
    gradient: 'from-emerald-600 to-teal-500',
    badge: 'Popular'
  },
  {
    id: 'tapet',
    title: 'Tapet Personalizat',
    description: 'Textură premium, lavabil, dintr-o bucată.',
    image: '/products/tapet/tapet-1.webp',
    link: '/tapet',
    gradient: 'from-orange-600 to-amber-500',
    badge: 'Nou'
  },
  {
    id: 'afise',
    title: 'Afișe & Postere',
    description: 'Calitate HD pe hârtie foto sau blueback.',
    image: '/products/afise/afise-1.webp',
    link: '/afise',
    gradient: 'from-purple-600 to-pink-500'
  },
  {
    id: 'canvas',
    title: 'Tablouri Canvas',
    description: 'Transformă fotografiile în artă. Pânză bumbac.',
    image: '/products/canvas/canvas-1.webp',
    link: '/canvas',
    gradient: 'from-pink-600 to-rose-500'
  },
  {
    id: 'pliante',
    title: 'Pliante & Flyere',
    description: 'Promovare eficientă. Tiraje mici sau mari.',
    image: '/products/pliante/pliante-1.webp',
    link: '/pliante',
    gradient: 'from-indigo-600 to-violet-500'
  },
  {
    id: 'flayere',
    title: 'Flyere',
    description: 'Promovare rapidă și eficientă. Format compact.',
    image: '/products/flayere/flayere-1.webp',
    link: '/flayere',
    gradient: 'from-violet-600 to-purple-500'
  },
  {
    id: 'banner-verso',
    title: 'Banner Față-Verso',
    description: 'Vizibilitate din ambele sensuri. Blockout.',
    image: '/products/banner/verso/banner-verso-1.webp',
    link: '/banner-verso',
    gradient: 'from-blue-700 to-indigo-600'
  },
  {
    id: 'rollup',
    title: 'Rollup Banner',
    description: 'Sistem retractabil portabil. Perfect evenimente.',
    image: '/products/rollup/rollup-1.webp',
    link: '/rollup',
    gradient: 'from-cyan-600 to-blue-600'
  },
  {
    id: 'window-graphics',
    title: 'Window Graphics',
    description: 'Folie perforată pentru geamuri. Vizibilitate dublă.',
    image: '/products/window-graphics/window-graphics-1.webp',
    link: '/window-graphics',
    gradient: 'from-sky-600 to-cyan-500'
  },
  {
    id: 'pvc',
    title: 'Plăci PVC / Forex',
    description: 'Panouri rigide pentru semnalistică durabilă.',
    image: '/products/materiale/pvc-forex/pvc-forex-1.webp',
    link: '/materiale/pvc-forex',
    gradient: 'from-slate-600 to-gray-500'
  },
  {
    id: 'plexiglass',
    title: 'Plexiglass',
    description: 'Aspect sticlă, elegant și durabil.',
    image: '/products/materiale/plexiglass/plexiglass-1.webp',
    link: '/materiale/plexiglass',
    gradient: 'from-cyan-600 to-blue-500'
  },
  {
    id: 'alucobond',
    title: 'Alucobond',
    description: 'Sandwich aluminiu pentru exterior.',
    image: '/products/materiale/alucobond/alucobond-1.webp',
    link: '/materiale/alucobond',
    gradient: 'from-gray-700 to-slate-800'
  },
  {
    id: 'carton',
    title: 'Carton Ondulat',
    description: 'Ambalaje și prototipuri rezistente.',
    image: '/products/materiale/carton/carton-1.webp',
    link: '/materiale/carton',
    gradient: 'from-amber-700 to-orange-600'
  },
  {
    id: 'polipropilena',
    title: 'Polipropilenă',
    description: 'Material celular ușor și rezistent.',
    image: '/products/materiale/polipropilena/polipropilena-1.webp',
    link: '/materiale/polipropilena',
    gradient: 'from-lime-600 to-green-500'
  },
  {
    id: 'fonduri-pnrr',
    title: 'Panouri PNRR',
    description: 'Obligatorii pentru proiecte UE.',
    image: '/products/fonduri/pnrr/pnrr-1.webp',
    link: '/fonduri-pnrr',
    gradient: 'from-blue-800 to-yellow-500'
  },
  {
    id: 'fonduri-regio',
    title: 'Panouri Regio',
    description: 'Vizibilitate proiecte regionale UE.',
    image: '/products/fonduri/regio/regio-1.webp',
    link: '/fonduri-regio',
    gradient: 'from-blue-600 to-blue-400'
  },
  {
    id: 'fonduri-nationale',
    title: 'Panouri Fonduri Naționale',
    description: 'Conformitate proiecte fonduri naționale.',
    image: '/products/fonduri/nationale/nationale-1.webp',
    link: '/fonduri-nationale',
    gradient: 'from-red-600 to-yellow-500'
  }
];

export default function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % HERO_ITEMS.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + HERO_ITEMS.length) % HERO_ITEMS.length);

  // Auto-play doar pentru Desktop (Mobilul e scroll manual)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentSlide = HERO_ITEMS[activeSlide];

  return (
    <section className="relative w-full bg-white overflow-hidden pt-4 pb-12 lg:pt-16 lg:pb-24 border-b border-slate-200">
      <div className="container mx-auto px-4 relative z-10">

        {/* LAYOUT */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          
          {/* 1. TEXT (Comun) */}
          <div className="w-full lg:flex-1 text-center lg:text-left space-y-6 lg:space-y-8 z-20 order-1 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 shadow-sm text-indigo-700 text-sm font-bold">
              <Sparkles className="h-4 w-4 fill-indigo-200" />
              <span>Tipografie Digitală Next-Gen</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] lg:min-h-40">
              Printează <br className="hidden lg:block" />
              <span className={`text-transparent bg-clip-text bg-linear-to-r transition-all duration-700 ${currentSlide.gradient}`}>
                {currentSlide.title}
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto lg:mx-0 lg:min-h-20">
              {currentSlide.description} <br className="hidden sm:block"/> 
              <span className="text-slate-600 text-base">Configurezi online, vezi prețul instant și comanzi.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 text-lg rounded-2xl shadow-xl shadow-indigo-200 transition-transform hover:-translate-y-1">
                <Link href="/configuratoare">
                  Configurează Acum <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-slate-200 text-slate-600 hover:bg-slate-50 h-14 px-8 text-lg rounded-2xl bg-white">
                <Link href="/contact">Cere Ofertă</Link>
              </Button>
            </div>

            {/* Badges */}
            <div className="flex flex-nowrap items-center justify-start lg:justify-start gap-2 sm:gap-4 pt-4 opacity-90 overflow-x-auto no-scrollbar w-full pb-2">
               <div className="shrink-0 flex items-center gap-1.5 text-[11px] sm:text-sm font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 whitespace-nowrap">
                  <Truck size={16} className="text-indigo-600 shrink-0" />
                  <span>Livrare Gratuită {'>'} 500 RON</span>
               </div>
               <div className="shrink-0 flex items-center gap-1.5 text-[11px] sm:text-sm font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 whitespace-nowrap">
                  <Zap size={16} className="text-amber-500 shrink-0" />
                  <span>Producție Rapidă</span>
               </div>
               <div className="shrink-0 flex items-center gap-1.5 text-[11px] sm:text-sm font-semibold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 whitespace-nowrap">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span>Calitate Garantată</span>
               </div>
            </div>
          </div>

          {/* 2. ZONA VIZUALĂ (Hibrid: Mobil = Listă Pătrate, Desktop = Slide Mare) */}
          <div className="w-full lg:flex-1 relative order-2 lg:order-2">
             
             {/* --- VARIANTA MOBIL: LISTA DE PĂTRATE (CARDURI) --- 
                 MODIFICARE: min-w-[90vw] pentru a fi "ÎNTREG" (unul pe ecran).
                 snap-center pentru a se opri fix pe mijloc.
             */}
             <div className="block lg:hidden">
                <div 
                    className="flex gap-4 overflow-x-auto pb-8 pt-4 px-4 snap-x snap-mandatory no-scrollbar scroll-smooth"
                >
                    {HERO_ITEMS.map((item) => (
                    <Link 
                        key={item.id} 
                        href={item.link}
                        className="group relative min-w-[85vw] sm:min-w-[300px] aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 shadow-lg shrink-0 snap-center"
                    >
                        <Image 
                            src={item.image} 
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 90vw, 300px"
                            priority={true}
                        />
                        {/* Overlay mai puternic jos pentru text lizibil */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-90" />
                        
                        {item.badge && (
                            <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                {item.badge}
                            </div>
                        )}

                        <div className="absolute bottom-0 left-0 w-full p-6 text-left">
                            <p className="text-white font-bold text-2xl leading-tight mb-1">{item.title}</p>
                            <div className="flex items-center gap-2 text-indigo-300 text-sm font-bold uppercase tracking-wide">
                                Configurează <ChevronRight size={16} strokeWidth={3} />
                            </div>
                        </div>
                    </Link>
                    ))}
                    <div className="min-w-2.5 shrink-0" /> 
                </div>
             </div>

             {/* --- VARIANTA DESKTOP: SINGLE SLIDE (NESCHIMBATĂ) --- */}
             <div className="hidden lg:block h-[550px] relative">
                 
                 {/* SĂGEȚI POZIȚIONARE RELATIVĂ LA IMAGINEA DESKTOP */}
                 <button 
                     onClick={prevSlide} 
                     className="absolute -left-6 top-1/2 -translate-y-1/2 z-40 p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-2xl text-white transition-all"
                     aria-label="Previous Slide"
                 >
                     <ChevronLeft size={20} />
                 </button>
                 <button 
                     onClick={nextSlide} 
                     className="absolute -right-6 top-1/2 -translate-y-1/2 z-40 p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-2xl text-white transition-all"
                     aria-label="Next Slide"
                 >
                     <ChevronRight size={20} />
                 </button>
                 
                 <div key={currentSlide.id} className="relative w-full h-full animate-in fade-in duration-700">
                      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white group cursor-pointer bg-slate-100">
                         <Link href={currentSlide.link} className="block w-full h-full">
                             <Image 
                              src={currentSlide.image} 
                              alt={currentSlide.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-1000"
                              priority={true}
                              sizes="50vw"
                             />
                             <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
                             
                             <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-md px-8 py-5 rounded-2xl shadow-lg border border-white/50">
                                <p className="font-bold text-slate-900 text-2xl">{currentSlide.title}</p>
                                <p className="text-indigo-600 text-base font-bold flex items-center gap-2 uppercase tracking-wide mt-1">
                                  Vezi Detalii <ChevronRight size={16} strokeWidth={3} />
                                </p>
                             </div>
                         </Link>
                      </div>
                 </div>
                 
                 <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                    {HERO_ITEMS.map((slide, idx) => (
                        <button 
                          key={slide.id} 
                          onClick={() => setActiveSlide(idx)}
                          className={`transition-all duration-300 rounded-full ${idx === activeSlide ? 'w-8 h-2 bg-indigo-600' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'}`}
                          aria-label={`Mergi la slide-ul ${idx + 1}: ${slide.title}`}
                        />
                    ))}
                </div>
             </div>

          </div>

        </div>
      </div>
    </section>
  );
}