'use client'; // Necesar pentru a folosi 'useState'

import React, { useState } from 'react';
import { PRODUCTS } from '@/lib/products';

// --- Components ---
const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
  </svg>
);

const TestimonialCard: React.FC<{ name: string; text: string; }> = ({ name, text }) => (
  <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 shadow-lg">
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
    <a
      href={href}
      className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 shadow-lg transition-all duration-300 hover:border-white/20 hover:shadow-indigo-500/20 hover:-translate-y-1"
    >
      {/* Wrapper imagine pătrat */}
      <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800">
        <img 
          src={image} 
          alt={title} 
          loading="lazy" 
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
  <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-1 text-sm text-indigo-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Configurează acum →
        </p>
      </div>
    </a>
);


// --- Page ---
export default function HomePage() {
  const [activeTab, setActiveTab] = useState('Publicitar');

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
      title: 'Fonduri UE',
      items: [
        { title: 'Fonduri PNRR', href: '/fonduri-pnrr', image: '/products/banner/1.webp' },
        { title: 'Fonduri REGIO', href: '/fonduri-regio', image: '/products/afise/1.webp' },
        { title: 'Fonduri Naționale', href: '/fonduri-nationale', image: '/products/autocolante/1.webp' },
      ],
    },
    {
      title: 'Publicitar',
      items: [
        { title: 'Afișe', href: '/afise', image: '/products/afise/1.webp' },
        { title: 'Flyere', href: '/flayere', image: '/products/flyere/1.webp' },
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
      title: 'Decor',
      items: [
        { title: 'Canvas', href: '/canvas', image: '/products/canvas/1.webp' },
        { title: 'Tapet', href: '/tapet', image: '/products/wallpaper/1.webp' },
      ],
    },
    {
      title: 'Materiale rigide',
      items: [
        { title: 'Plexiglas', href: '/plexiglass', image: '/products/plexiglass/1.webp' },
        { title: 'Alucobond', href: '/alucobond', image: '/products/alucobond/1.webp' },
        { title: 'Carton', href: '/carton', image: '/products/carton/1.webp' },
        { title: 'Polipropilenă', href: '/polipropilena', image: '/products/polipropilena/1.webp' },
        { title: 'PVC Forex', href: '/pvc-forex', image: '/products/PVC-Forex/1.webp' },
      ],
    },
  ];

  const testimonials = [
    { name: 'Andrei P.', text: 'Print impecabil, livrare rapidă. Recomand cu încredere!' },
    { name: 'Mădălina S.', text: 'Bannerele pentru eveniment au ieșit perfect. Mulțumesc!' },
    { name: 'George T.', text: 'Preț corect, suport prompt. Comand din nou!' },
  ];
  
  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white dark:bg-grid-zinc-800/[0.2]">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* --- HERO --- */}
        <section className="relative flex flex-col items-center justify-center pt-24 pb-20 text-center">
            <div className="absolute inset-0 top-1/4 bg-[radial-gradient(ellipse_at_center,rgba(12,74,220,0.1),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(12,74,220,0.2),transparent_60%)] -z-10" />
            <img
              src="/logo.png"
              alt="Prynt.ro Logo"
              width={120}
              height={120}
              className="mb-6 rounded-full border-2 border-zinc-200 dark:border-white/10 shadow-lg dark:shadow-2xl dark:shadow-black/50 transition-transform duration-300 hover:scale-105"
            />
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-black to-zinc-700 dark:from-white dark:to-zinc-400">
              Tipar digital de impact
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Transformăm ideile tale în realitate. Configurează online, vezi prețul instant și primești produsele ultra-rapid.
            </p>
            <div className="mt-8 flex gap-4">
                <a href="#configuratoare" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-indigo-500">
                    Vezi produsele
                    <ArrowRightIcon className="h-5 w-5" />
                </a>
            </div>
        </section>

        {/* --- CONFIGURATOARE --- */}
        <section id="configuratoare" className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white">Toate configuratoarele</h2>
            <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">Alege o categorie și personalizează-ți produsul în câteva secunde.</p>
          </div>
          
          <div className="mb-8 flex justify-center border-b border-zinc-200 dark:border-white/10">
            {CONFIG_GROUPS.map((group) => (
              <button
                key={group.title}
                onClick={() => setActiveTab(group.title)}
                className={`relative px-4 py-3 text-sm font-medium transition-colors duration-300 ${
                  activeTab === group.title
                    ? 'text-black dark:text-white'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {group.title}
                {activeTab === group.title && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></span>
                )}
              </button>
            ))}
          </div>

          <div>
            {CONFIG_GROUPS.map((group) => (
              <div
                key={group.title}
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-500 ${
                    activeTab === group.title ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
                }`}
              >
                {group.items.map((item) => (
                  <ConfiguratorCard key={item.href} {...item} />
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* --- DIN SHOP --- */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white">Modele populare din shop</h2>
             <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">Inspiră-te din modelele gata create de designerii noștri.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shopItems.map((p) => (
              <a
                key={p.id}
                href={p.href}
                className="group relative block overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/50 shadow-lg transition-all duration-300 hover:border-zinc-300 dark:hover:border-white/20 hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 hover:-translate-y-1"
              >
                {/* Wrapper imagine pătrat */}
                <div className="relative aspect-square w-full bg-zinc-100 dark:bg-zinc-800">
                  <img 
                    src={p.img} 
                    alt={p.title} 
                    loading="lazy" 
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="p-4 flex flex-col justify-end h-full">
                    <div>
                        <h3 className="text-lg font-bold text-white">{p.title}</h3>
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-indigo-300 font-bold">De la {Number(p.price).toFixed(0)} RON</span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                Vezi detalii
                            </span>
                        </div>
                    </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* --- DESPRE --- */}
        <section className="py-20">
            <div className="relative mx-auto max-w-4xl rounded-2xl border border-zinc-200 dark:border-indigo-500/30 bg-white dark:bg-zinc-900 p-8 text-center shadow-xl dark:shadow-2xl dark:shadow-indigo-900/20">
               <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">Peste 10 ani de experiență în print</h2>
               <p className="text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                 Suntem un centru de producție publicitară dedicat calității. Oferim prețuri transparente și livrare rapidă pentru ca ideile tale să devină produse fizice impecabile.
               </p>
            </div>
        </section>

        {/* --- REVIEW-URI --- */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white">Ce spun clienții noștri</h2>
            <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">Calitatea și rapiditatea sunt pilonii noștri.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((r) => (
              <TestimonialCard key={r.name} {...r} />
            ))}
          </div>
        </section>
      </div>

      {/* Footer global este randat din layout; evităm duplicarea aici */}
    </main>
  );
}