'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image"; // IMPORT NOU
import AssistantWidget from "@/components/AssistantWidget";
import Link from "next/link";

// --- Hooks ---
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

// --- Data ---
const CONFIG_GROUPS = [
  {
    title: 'Publicitar',
    items: [
      { title: 'Afișe', href: '/afise', image: '/products/afise/1.webp' },
      { title: 'Flyere', href: '/flayere', image: '/products/flayere/1.webp' },
      { title: 'Pliante', href: '/pliante', image: '/products/pliante/1.webp' },
      { title: 'Autocolante', href: '/autocolante', image: '/products/autocolante/1.webp' },
    ],
  },
  {
    title: 'Banner',
    items: [
      { title: 'Banner Simplu', href: '/banner', image: '/products/banner/1.webp' },
      { title: 'Banner Față-Verso', href: '/banner-verso', image: '/products/banner/verso/1.webp' },
    ],
  },
  {
    title: 'Fonduri UE',
    items: [
      { title: 'Fonduri PNRR', href: '/fonduri-pnrr', image: '/products/banner/1.webp' },
      { title: 'Fonduri REGIO', href: '/fonduri-regio', image: '/products/afise/1.webp' },
      { title: 'Fonduri Naționale', href: '/fonduri-nationale', image: '/products/autocolante/1.webp' },
    ],
  },
  {
    title: 'Decor',
    items: [
      { title: 'Canvas', href: '/canvas', image: '/products/canvas/1.webp' },
      { title: 'Tapet', href: '/tapet', image: '/products/tapet/1.webp' },
    ],
  },
  {
    title: 'Materiale Rigide',
    items: [
      { title: 'Plexiglas', href: '/materiale/plexiglass', image: '/products/materiale/plexiglass/1.webp' },
      { title: 'Alucobond', href: '/materiale/alucobond', image: '/products/materiale/alucobond/1.webp' },
      { title: 'Carton', href: '/materiale/carton', image: '/products/materiale/carton/1.webp' },
      { title: 'Polipropilenă', href: '/materiale/polipropilena', image: '/products/materiale/polipropilena/1.webp' },
      { title: 'PVC Forex', href: '/materiale/pvc-forex', image: '/products/materiale/PVC-Forex/1.webp' },
    ],
  },
];

const testimonials = [
  { name: 'Andrei P.', text: 'Print impecabil, livrare rapidă. Recomand cu încredere!' },
  { name: 'Mădălina S.', text: 'Bannerele pentru eveniment au ieșit perfect. Mulțumesc!' },
  { name: 'George T.', text: 'Preț corect, suport prompt. Comand din nou!' },
];

// --- Components ---
const CategoryCard = ({ title, href, image }: { title: string; href: string; image: string }) => (
  <Link
    href={href}
    className="group relative flex h-48 w-full flex-col justify-end overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
  >
    {/* Imagine Background cu Next Image */}
    <div className="absolute inset-0 h-full w-full">
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        priority={false}
      />
    </div>
    
    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
    
    {/* Content */}
    <div className="relative z-10 p-5">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-indigo-300 opacity-0 transform translate-y-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
        <span>Configurează</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
      </div>
    </div>
  </Link>
);

const TestimonialCard = ({ name, text }: { name: string; text: string }) => (
  <div className="rounded-2xl border border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900 p-6 shadow-lg transition-all hover:shadow-xl">
    <div className="flex gap-1 text-yellow-400 mb-3">
      {[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
    </div>
    <p className="text-zinc-600 dark:text-zinc-300 italic">“{text}”</p>
    <p className="mt-4 text-sm font-bold text-zinc-900 dark:text-white">— {name}</p>
  </div>
);

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('Publicitar');
  const isMounted = useMounted();

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-indigo-500 selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.15),transparent_70%)]" />
        
        <div className="mx-auto max-w-4xl text-center">
          <div className={`inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-300 mb-6 backdrop-blur-sm transition-all duration-700 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
            Tipografie Online & Large Format
          </div>
          
          <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6 transition-all duration-700 delay-100 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Dăm viață <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">ideilor tale.</span>
          </h1>
          
          <p className={`text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed transition-all duration-700 delay-200 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Producție publicitară premium, livrare rapidă în toată țara. <br className="hidden md:block" />
            Configurează produsele online sau discută cu asistentul nostru virtual.
          </p>
        </div>
      </section>

      {/* --- ASISTENT VIRTUAL (CENTRAL) --- */}
      <section className="relative z-20 -mt-8 mb-24 px-4">
        <div className={`transition-all duration-1000 delay-300 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Wrapper cu glow effect */}
            <div className="mx-auto max-w-5xl relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-3xl blur opacity-20 dark:opacity-40 animate-pulse-slow"></div>
                <AssistantWidget />
            </div>
        </div>
      </section>

      {/* --- CATEGORII PRODUSE --- */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">Ce vrei să printezi azi?</h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400">Alege o categorie pentru a începe configurarea.</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CONFIG_GROUPS.map((group) => (
              <button
                key={group.title}
                onClick={() => setActiveTab(group.title)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTab === group.title
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black shadow-md transform scale-105'
                    : 'bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                }`}
              >
                {group.title}
              </button>
            ))}
          </div>

          {/* Grid Produse */}
          <div className="min-h-[400px]">
            {CONFIG_GROUPS.map((group) => (
              activeTab === group.title && (
                <div key={group.title} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {group.items.map((item) => (
                    <CategoryCard key={item.href} {...item} />
                  ))}
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALE & INFO --- */}
      <section className="py-24 border-t border-zinc-100 dark:border-white/5">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Calitate garantată, de fiecare dată.</h2>
                    <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                        Folosim echipamente de ultimă generație pentru a asigura culori vibrante și finisaje precise. Fie că ai nevoie de un singur banner sau de o campanie completă, tratăm fiecare comandă cu aceeași seriozitate.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">24-48h</div>
                            <div className="text-sm text-zinc-500">Livrare Rapidă</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">10+</div>
                            <div className="text-sm text-zinc-500">Ani Experiență</div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6">
                    {testimonials.map((t, i) => (
                        <div key={i} className={i === 1 ? 'md:translate-x-8' : ''}>
                            <TestimonialCard {...t} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

    </main>
  );
}