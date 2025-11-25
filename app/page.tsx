"use client";

import React, { useRef } from 'react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { 
  FileImage, StickyNote, Scroll, LayoutTemplate, Layers, Box, Scan, Package, Frame, Flag, ChevronLeft, ChevronRight
} from 'lucide-react';

// Componente
import HeroCarousel from '@/components/HeroCarousel';
import AssistantSection from '@/components/AssistantSection';

// --- NAVIGARE RAPIDĂ (Reintrodusă aici) ---
const QUICK_NAV_ITEMS: { name: string; icon: LucideIcon; href: string; color: string; bg: string }[] = [
  { name: "Bannere", icon: FileImage, href: "/banner", color: "text-blue-600", bg: "bg-blue-50" },
  { name: "Autocolante", icon: StickyNote, href: "/autocolante", color: "text-emerald-600", bg: "bg-emerald-50" },
  { name: "Afișe", icon: LayoutTemplate, href: "/afise", color: "text-purple-600", bg: "bg-purple-50" },
  { name: "Tapet", icon: Scroll, href: "/tapet", color: "text-orange-600", bg: "bg-orange-50" },
  { name: "Canvas", icon: Frame, href: "/canvas", color: "text-pink-600", bg: "bg-pink-50" },
  { name: "Pliante", icon: Layers, href: "/pliante", color: "text-indigo-600", bg: "bg-indigo-50" },
  { name: "Rigide", icon: Box, href: "/materiale/pvc-forex", color: "text-slate-600", bg: "bg-slate-50" },
  { name: "Plexiglass", icon: Scan, href: "/materiale/plexiglass", color: "text-cyan-600", bg: "bg-cyan-50" },
  { name: "Bond", icon: Box, href: "/materiale/alucobond", color: "text-gray-600", bg: "bg-gray-100" },
  { name: "Carton", icon: Package, href: "/materiale/carton", color: "text-amber-700", bg: "bg-amber-50" },
  { name: "Polipropilenă", icon: Box, href: "/materiale/polipropilena", color: "text-lime-600", bg: "bg-lime-50" },
  { name: "Proiecte", icon: Flag, href: "/fonduri-pnrr", color: "text-blue-800", bg: "bg-blue-50" },
];

export default function HomePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-white selection:bg-indigo-100">
      
      {/* 1. HERO */}
      <HeroCarousel />

      {/* 2. STICKY NAV (AICI, nu în Header) */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-sm transition-all">
        <div className="container mx-auto px-0 sm:px-4 relative group">
            
            {/* Buton Stânga */}
            <div className="absolute left-0 top-0 bottom-0 z-20 bg-gradient-to-r from-white via-white/95 to-transparent pl-2 pr-4 flex items-center">
                <button 
                  onClick={scrollLeft}
                  className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all active:scale-90 flex items-center justify-center"
                  aria-label="Scroll Left"
                >
                  <ChevronLeft size={20} />
                </button>
            </div>

            {/* Container Scrollabil */}
            <div 
                ref={scrollContainerRef}
                className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-3 no-scrollbar snap-x scroll-smooth px-10 sm:px-12"
            >
                {QUICK_NAV_ITEMS.map((item) => (
                    <Link 
                        key={item.name} 
                        href={item.href}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors shrink-0 snap-start group select-none border border-transparent hover:border-slate-100"
                    >
                        <div className={`p-1.5 rounded-lg ${item.bg} ${item.color} group-hover:scale-110 transition-transform shadow-sm`}>
                            <item.icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 whitespace-nowrap">
                          {item.name}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Buton Dreapta */}
            <div className="absolute right-0 top-0 bottom-0 z-20 bg-gradient-to-l from-white via-white/95 to-transparent pr-2 pl-4 flex items-center">
                <button 
                  onClick={scrollRight}
                  className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all active:scale-90 flex items-center justify-center"
                  aria-label="Scroll Right"
                >
                  <ChevronRight size={20} />
                </button>
            </div>

        </div>
      </div>

      {/* 3. ASSISTANT SECTION */}
      <AssistantSection />

    </main>
  );
}