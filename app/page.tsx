'use client';

import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '@/lib/products';
import AssistantWidget from "@/components/AssistantWidget"; // Importăm noul widget
import Link from "next/link"; // Pentru navigare

// --- Hooks ---
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

// --- Components ---
const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
  </svg>
);

const TestimonialCard: React.FC<{ name: string; text: string; }> = ({ name, text }) => (
  <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 shadow-lg transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-500/20 hover:-translate-y-1">
    <p className="text-lg italic text-zinc-300">“{text}”</p>
    <p className="mt-4 font-semibold text-zinc-400">— {name}</p>
  </div>
);

interface ConfiguratorItem {
  title: string;
  href: string;
  image: string;
}

const ConfiguratorCard: React.FC<ConfiguratorItem> = ({ title, href, image }) => (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 shadow-lg transition-all duration-300 hover:border-white/20 hover:shadow-indigo-500/20 hover:-translate-y-1"
    >
      <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800">
        <img 
          src={image} 
          alt={title} 
          loading="lazy" 
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-1 text-sm text-indigo-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Configurează acum →
        </p>
      </div>
    </Link>
);

// --- Page ---
export default function HomePage() {
  const [activeTab, setActiveTab] = useState('Publicitar');
  const isMounted = useMounted();

  const shopItems = PRODUCTS.slice(0, 8).map((p) => {
    const category = String(p.metadata?.category ?? '').toLowerCase();
    const slug = String(p.routeSlug ?? p.slug ?? p.id);
    return {
      id: p.id,
      title: p.title,
      desc: p.description ?? '',
      img: p.images?.[0] ?? '/products/banner/1.webp',
      href: category === 'bannere' ? `/banner/${slug}` : `/${category}/${slug}`,
      price: category === 'bannere' ? 50 : (p.priceBase ?? 0),
    };
  });

  const CONFIG_GROUPS: { title: string; items: ConfiguratorItem[] }[] = [
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
        { title: 'Banner', href: '/banner', image: '/products/banner/1.webp' },
        { title: 'Banner față-verso', href: '/banner-verso', image: '/products/banner/verso/1.webp' },
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
      title: 'Materiale rigide',
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
  
  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* --- HERO --- */}
      <section className="relative flex flex-col items-center justify-center pt-24 pb-20 text-center overflow-hidden">
          <div className="absolute inset-0 top-1/4 bg-[radial-gradient(ellipse_at_center,rgba(12,74,220,0.1),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(12,74,220,0.2),transparent_60%)] -z-10 animate-pulse-slow" />
          <img
            src="/logo.png"
            alt="Prynt.ro Logo"
            width={120}
            height={120}
            className={`mb-6 rounded-full border-2 border-zinc-200 dark:border-white/10 shadow-lg dark:shadow-2xl dark:shadow-black/50 transition-all duration-700 hover:scale-105 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          />
          <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-black to-zinc-700 dark:from-white dark:to-zinc-400 transition-all duration-700 delay-200 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Tipar digital de impact
          </h1>
          <p className={`mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 transition-all duration-700 delay-300 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Transformăm ideile tale în realitate. Configurează online, vezi prețul instant și primești produsele ultra-rapid.
          </p>
          <div className={`mt-8 flex gap-4 transition-all duration-700 delay-[400ms] ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <a href="#configuratoare" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-indigo-500">
                  Vezi produsele
                  <ArrowRightIcon className="h-5 w-5" />
              </a>
          </div>
      </section>

      {/* --- CONSULTANT VIRTUAL (NOU) --- */}
      <section className="py-16 bg-indigo-50 dark:bg-zinc-900/30 border-y border-indigo-100 dark:border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">Ai nevoie de o ofertă rapidă?</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 max-w-2xl mx-auto">
              Discută cu asistentul nostru virtual. Este conectat direct la sistemul nostru de prețuri și te poate ajuta să calculezi costurile instant pentru orice proiect.
            </p>
          </div>
          
          {/* Componenta de Chat */}
          <AssistantWidget />
          
        </div>
      </section>

      {/* --- CONFIGURATOARE --- */}
      <section id="configuratoare" className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white">Configurează Produsul Tău</h2>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">Alege o categorie și personalizează-ți produsul în câteva secunde.</p>
        </div>
        
        <div className="mb-8 flex flex-wrap justify-center gap-2 border-b border-zinc-200 dark:border-white/10 pb-4">
          {CONFIG_GROUPS.map((group) => (
            <button
              key={group.title}
              onClick={() => setActiveTab(group.title)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === group.title
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {group.title}
            </button>
          ))}
        </div>

        <div className="relative min-h-[300px]">
          {CONFIG_GROUPS.map((group) => (
            activeTab === group.title && (
              <div key={group.title} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
                {group.items.map((item) => (
                  <ConfiguratorCard key={item.href} {...item} />
                ))}
              </div>
            )
          ))}
        </div>
      </section>

      {/* --- DIN SHOP --- */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white">Modele populare</h2>
             <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">Inspiră-te din modelele gata create de designerii noștri.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shopItems.map((p) => (
              <Link
                key={p.id}
                href={p.href}
                className="group relative block overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800">
                  <img 
                    src={p.img} 
                    alt={p.title} 
                    loading="lazy" 
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-1">{p.title}</h3>
                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">De la {Number(p.price).toFixed(0)} RON</span>
                        <span className="text-xs font-medium text-zinc-500 group-hover:text-indigo-500 transition-colors">
                            Vezi detalii →
                        </span>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- DESPRE --- */}
      <section className="py-20 container mx-auto px-4">
          <div className="relative mx-auto max-w-4xl rounded-2xl border border-zinc-200 dark:border-indigo-500/30 bg-white dark:bg-zinc-900 p-8 sm:p-12 text-center shadow-xl dark:shadow-2xl dark:shadow-indigo-900/20">
             <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">Peste 10 ani de experiență în print</h2>
             <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
               Suntem un centru de producție publicitară dedicat calității. Oferim prețuri transparente și livrare rapidă pentru ca ideile tale să devină produse fizice impecabile.
             </p>
          </div>
      </section>

      {/* --- REVIEW-URI --- */}
      <section className="py-16 bg-zinc-50 dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white">Ce spun clienții</h2>
            <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">Calitatea și rapiditatea sunt pilonii noștri.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((r) => (
              <TestimonialCard key={r.name} {...r} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}