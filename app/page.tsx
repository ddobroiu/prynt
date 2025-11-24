"use client"; // Trebuie să fie client component pentru animații și slider

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, CheckCircle, Upload, Truck, PenTool, Star, ShieldCheck, Zap,
  FileImage, StickyNote, Scroll, LayoutTemplate, Layers, Box, Sparkles, ChevronRight, Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Componente existente
import InStockScroller from '@/components/InStockScroller';
import ProductCard from '@/components/ProductCard';
import Reviews from '@/components/Reviews';
import FaqAccordion from '@/components/FaqAccordion';
import AssistantWidget from '@/components/AssistantWidget'; // <--- ROBOTUL ESTE AICI
import { getProducts } from '@/lib/products';

// --- DATA & CONSTANTS ---

const SLIDES = [
  {
    id: 'banner',
    title: 'Bannere Publicitare',
    description: 'Rezistente outdoor, finisaje incluse (capse, tiv).',
    image: '/products/banner/1.webp',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    link: '/banner'
  },
  {
    id: 'autocolante',
    title: 'Autocolante & Stickere',
    description: 'Print & Cut pe contur, orice formă și dimensiune.',
    image: '/products/autocolante/1.webp',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    link: '/autocolante'
  },
  {
    id: 'tapet',
    title: 'Tapet Personalizat',
    description: 'Decor unic pentru pereți, textură premium.',
    image: '/products/tapet/1.webp',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    link: '/tapet'
  },
  {
    id: 'canvas',
    title: 'Tablouri Canvas',
    description: 'Transformă fotografiile în artă pe pânză.',
    image: '/products/canvas/1.webp',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    link: '/canvas'
  }
];

const QUICK_NAV_ITEMS = [
  { name: "Bannere", icon: FileImage, href: "/banner", color: "text-blue-600", bg: "bg-blue-50" },
  { name: "Autocolante", icon: StickyNote, href: "/autocolante", color: "text-emerald-600", bg: "bg-emerald-50" },
  { name: "Afișe", icon: LayoutTemplate, href: "/afise", color: "text-purple-600", bg: "bg-purple-50" },
  { name: "Tapet", icon: Scroll, href: "/tapet", color: "text-orange-600", bg: "bg-orange-50" },
  { name: "Canvas", icon: Image, href: "/canvas", color: "text-pink-600", bg: "bg-pink-50" },
  { name: "Pliante", icon: Layers, href: "/pliante", color: "text-indigo-600", bg: "bg-indigo-50" },
  { name: "Rigide", icon: Box, href: "/materiale/pvc-forex", color: "text-slate-600", bg: "bg-slate-50" },
];

const HOMEPAGE_FAQ = [
  { question: "Cât durează producția?", answer: "Producția durează 24-48h lucrătoare." },
  { question: "Livrarea este gratuită?", answer: "Da, pentru comenzile ce depășesc 500 RON." },
  { question: "Verificați grafica?", answer: "Da, verificăm gratuit fiecare fișier înainte de print." }
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [products, setProducts] = useState<any[]>([]);

  // Fetch products on client side since we switched to "use client"
  useEffect(() => {
    getProducts().then(data => setProducts(data.slice(0, 4)));
  }, []);

  // Carousel Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000); // Schimbă la fiecare 4 secunde
    return () => clearInterval(interval);
  }, []);

  const currentSlide = SLIDES[activeSlide];

  return (
    <main className="min-h-screen flex flex-col bg-white selection:bg-indigo-100">
      
      {/* --- 0. FREE SHIPPING BANNER --- */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white text-center py-2 text-xs font-bold tracking-wider uppercase">
        <span className="flex items-center justify-center gap-2 animate-pulse">
          <Gift size={14} /> Livrare Gratuită la comenzi peste 500 RON
        </span>
      </div>

      {/* --- 1. HERO SECTION (CAROUSEL DINAMIC) --- */}
      <section className="relative w-full bg-white overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left: Static Text + Dynamic Slide Info */}
            <div className="flex-1 text-center lg:text-left space-y-8 z-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm text-indigo-600 text-sm font-semibold">
                <Sparkles className="h-4 w-4 fill-indigo-600" />
                <span>Tipografie Digitală Next-Gen</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                Ideile tale, <br/>
                <span className={`text-transparent bg-clip-text bg-gradient-to-r transition-all duration-700 ${currentSlide.id === 'banner' ? 'from-blue-600 to-cyan-500' : currentSlide.id === 'autocolante' ? 'from-emerald-600 to-teal-500' : 'from-indigo-600 to-purple-600'}`}>
                  {currentSlide.title}
                </span>
              </h1>
              
              <p className="text-xl text-slate-500 max-w-2xl mx-auto lg:mx-0 h-16 lg:h-auto">
                {currentSlide.description} Platforma completă unde configurezi, vizualizezi prețul și comanzi instant.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 text-lg rounded-2xl shadow-xl shadow-indigo-200 transition-transform hover:-translate-y-1">
                  <Link href={currentSlide.link}>
                    Configurează {currentSlide.title.split(' ')[0]} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-slate-200 text-slate-600 hover:bg-slate-50 h-14 px-8 text-lg rounded-2xl bg-white">
                  <Link href="/contact">Cere Ofertă</Link>
                </Button>
              </div>
            </div>

            {/* Right: Animated Carousel Image */}
            <div className="flex-1 relative w-full max-w-xl lg:max-w-full h-[400px] lg:h-[500px]">
               <div className="relative w-full h-full">
                  {SLIDES.map((slide, index) => (
                    <div 
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                            index === activeSlide 
                            ? 'opacity-100 translate-x-0 scale-100 z-10' 
                            : 'opacity-0 translate-x-10 scale-95 z-0'
                        }`}
                    >
                        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white group cursor-pointer">
                           <Link href={slide.link}>
                               <Image 
                                src={slide.image} 
                                alt={slide.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                priority={index === 0}
                               />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                               {/* Floating Label */}
                               <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-xl shadow-lg">
                                  <p className="font-bold text-slate-900 text-lg">{slide.title}</p>
                                  <p className="text-indigo-600 text-sm font-medium flex items-center gap-1">Configurează acum <ChevronRight size={14}/></p>
                               </div>
                           </Link>
                        </div>
                    </div>
                  ))}
                  
                  {/* Slide Indicators */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                      {SLIDES.map((_, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => setActiveSlide(idx)}
                            className={`h-3 rounded-full transition-all duration-300 ${idx === activeSlide ? 'w-10 bg-indigo-600' : 'w-3 bg-slate-300 hover:bg-slate-400'}`}
                          />
                      ))}
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- 2. STICKY NAV --- */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 lg:gap-6 overflow-x-auto py-3 no-scrollbar snap-x">
                {QUICK_NAV_ITEMS.map((item) => (
                    <Link 
                        key={item.name} 
                        href={item.href}
                        className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-slate-100 transition-colors shrink-0 snap-start group"
                    >
                        <div className={`p-1.5 rounded-full ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                            <item.icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{item.name}</span>
                    </Link>
                ))}
                <div className="w-px h-6 bg-slate-200 mx-2 hidden lg:block"></div>
                <Link href="/shop" className="hidden lg:flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 whitespace-nowrap">
                    Toate Produsele <ChevronRight size={16} />
                </Link>
            </div>
        </div>
      </div>

      {/* --- 3. SCROLLER STOC --- */}
      <div className="bg-slate-50 border-b border-slate-200">
         <InStockScroller />
      </div>

      {/* --- 4. CATEGORII PRINCIPALE (BENTO GRID) --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Alege Configuratorul</h2>
            <p className="text-slate-500 text-lg">Fiecare produs este 100% personalizabil. Încarci grafica, alegi dimensiunile, vezi prețul.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
            
            {/* Banner - Main Feature */}
            <Link href="/banner" className="group relative col-span-1 md:col-span-2 row-span-2 rounded-3xl overflow-hidden bg-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100">
              <Image src="/products/banner/1.webp" alt="Bannere" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full w-fit mb-3">Cel mai vândut</span>
                <h3 className="text-3xl font-bold text-white mb-2">Bannere Outdoor</h3>
                <p className="text-slate-200 text-sm opacity-90 translate-y-2 group-hover:translate-y-0 transition-transform">Mesh, Frontlit, Blockout - finisaje incluse.</p>
              </div>
            </Link>

            {/* Autocolante */}
            <Link href="/autocolante" className="group relative col-span-1 md:col-span-2 row-span-1 rounded-3xl overflow-hidden bg-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100">
              <Image src="/products/autocolante/1.webp" alt="Autocolante" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8">
                <h3 className="text-2xl font-bold text-white mb-1">Autocolante</h3>
                <p className="text-slate-200 text-sm">Stickere decupate pe contur.</p>
              </div>
            </Link>

            {/* Tapet */}
            <Link href="/tapet" className="group relative col-span-1 row-span-1 rounded-3xl overflow-hidden bg-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100">
               <Image src="/products/tapet/1.webp" alt="Tapet" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-black/40 hover:bg-black/50 transition-colors flex items-center justify-center">
                  <h3 className="text-xl font-bold text-white border-2 border-white/30 px-4 py-2 rounded-xl backdrop-blur-sm">Tapet</h3>
               </div>
            </Link>

            {/* Canvas */}
            <Link href="/canvas" className="group relative col-span-1 row-span-1 rounded-3xl overflow-hidden bg-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100">
               <Image src="/products/canvas/1.webp" alt="Canvas" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-black/40 hover:bg-black/50 transition-colors flex items-center justify-center">
                  <h3 className="text-xl font-bold text-white border-2 border-white/30 px-4 py-2 rounded-xl backdrop-blur-sm">Canvas</h3>
               </div>
            </Link>

          </div>
        </div>
      </section>

      {/* --- 5. ALTE PRODUSE (SHOP PREVIEW) --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Alte Produse</h2>
              <p className="text-slate-500">Accesorii, standuri și produse standard din magazin.</p>
            </div>
            <Link href="/shop" className="hidden md:flex items-center text-indigo-600 font-bold hover:text-indigo-700 hover:underline decoration-2 underline-offset-4">
              Vezi Magazinul <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="transform hover:-translate-y-2 transition-transform duration-300">
                 <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 6. REVIEWS & FAQ --- */}
      <div className="bg-white py-24 border-t border-slate-100">
         <Reviews />
      </div>

      <div className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Întrebări Frecvente</h2>
            <FaqAccordion qa={HOMEPAGE_FAQ} />
          </div>
        </div>
      </div>

      {/* --- 7. FINAL CTA --- */}
      <section className="relative py-32 bg-slate-900 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[100px]"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
            Gata de print?
          </h2>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto mb-12">
            Profită de livrarea gratuită la comenzi peste 500 RON și dă viață proiectului tău.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-bold h-16 px-10 rounded-2xl text-lg shadow-2xl">
              <Link href="/shop">Începe Acum</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ROBOTUL DE CHAT - VIZIBIL */}
      <AssistantWidget />

    </main>
  );
}