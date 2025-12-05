"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Search } from 'lucide-react';

// Datele produselor (toate configuratoarele disponibile)
const ALL_CONFIGURATORS = [
  {
    id: 'banner',
    title: 'Bannere Outdoor',
    description: 'Rezistente UV, tiv & capse incluse. Cea mai bună vizibilitate.',
    image: '/products/banner/banner-1.webp',
    link: '/banner',
    badge: 'Top Vânzări',
    category: 'outdoor'
  },
  {
    id: 'autocolante',
    title: 'Autocolante & Stickere',
    description: 'Print & Cut pe contur. Orice formă, orice dimensiune.',
    image: '/products/autocolante/autocolante-1.webp',
    link: '/autocolante',
    badge: 'Popular',
    category: 'indoor'
  },
  {
    id: 'tapet',
    title: 'Tapet Personalizat',
    description: 'Textură premium, lavabil, dintr-o bucată. Decor unic.',
    image: '/products/tapet/tapet-1.webp',
    link: '/tapet',
    badge: 'Nou',
    category: 'interior'
  },
  {
    id: 'afise',
    title: 'Afișe & Postere',
    description: 'Calitate HD pe hârtie foto sau blueback.',
    image: '/products/afise/afise-1.webp',
    link: '/afise',
    category: 'print'
  },
  {
    id: 'canvas',
    title: 'Tablouri Canvas',
    description: 'Transformă fotografiile în artă. Pânză bumbac.',
    image: '/products/canvas/canvas-1.webp',
    link: '/canvas',
    category: 'interior'
  },
  {
    id: 'pliante',
    title: 'Pliante & Flyere',
    description: 'Promovare eficientă. Tiraje mici sau mari.',
    image: '/products/pliante/pliante-1.webp',
    link: '/pliante',
    category: 'print'
  },
  {
    id: 'flayere',
    title: 'Flyere',
    description: 'Promovare rapidă și eficientă. Format compact.',
    image: '/products/flayere/flayere-1.webp',
    link: '/flayere',
    category: 'print'
  },
  {
    id: 'banner-verso',
    title: 'Banner Față-Verso',
    description: 'Vizibilitate din ambele sensuri. Blockout.',
    image: '/products/banner/verso/banner-verso-1.webp',
    link: '/banner-verso',
    category: 'outdoor'
  },
  {
    id: 'rollup',
    title: 'Rollup Banner',
    description: 'Sistem retractabil portabil. Perfect pentru evenimente.',
    image: '/products/rollup/rollup-1.webp',
    link: '/rollup',
    category: 'outdoor'
  },
  {
    id: 'window-graphics',
    title: 'Window Graphics',
    description: 'Folie perforată pentru geamuri. Vizibilitate dublă.',
    image: '/products/window-graphics/window-graphics-1.webp',
    link: '/window-graphics',
    category: 'outdoor'
  },
  {
    id: 'pvc',
    title: 'Plăci PVC / Forex',
    description: 'Panouri rigide pentru semnalistică durabilă.',
    image: '/products/materiale/PVC-Forex/pvc-forex-1.webp',
    link: '/materiale/pvc-forex',
    category: 'rigide'
  },
  {
    id: 'plexiglass',
    title: 'Plexiglass Printat',
    description: 'Aspect sticlă, elegant și modern. Print UV.',
    image: '/products/materiale/plexiglass/plexiglass-1.webp',
    link: '/materiale/plexiglass',
    category: 'rigide'
  },
  {
    id: 'alucobond',
    title: 'Alucobond (Bond)',
    description: 'Panouri sandwich aluminiu. Ultra-rezistente.',
    image: '/products/materiale/alucobond/alucobond-1.webp',
    link: '/materiale/alucobond',
    category: 'rigide'
  },
  {
    id: 'carton',
    title: 'Carton Ondulat',
    description: 'Print direct pe carton. Ambalaje și prototipuri.',
    image: '/products/materiale/carton/carton-1.webp',
    link: '/materiale/carton',
    category: 'rigide'
  },
  {
    id: 'polipropilena',
    title: 'Polipropilenă',
    description: 'Material celular ușor, ideal imobiliare.',
    image: '/products/materiale/polipropilena/polipropilena-1.webp',
    link: '/materiale/polipropilena',
    category: 'rigide'
  },
  {
    id: 'fonduri-pnrr',
    title: 'Panouri PNRR',
    description: 'Panouri obligatorii proiecte. Template inclus.',
    image: '/products/banner/banner-1.webp',
    link: '/fonduri-pnrr',
    category: 'fonduri'
  },
  {
    id: 'fonduri-regio',
    title: 'Panouri Regio',
    description: 'Vizibilitate proiecte europene.',
    image: '/products/banner/banner-1.webp',
    link: '/fonduri-regio',
    category: 'fonduri'
  },
  {
    id: 'fonduri-nationale',
    title: 'Panouri Fonduri Naționale',
    description: 'Panouri pentru proiecte cu finanțare națională.',
    image: '/products/banner/banner-1.webp',
    link: '/fonduri-nationale',
    category: 'fonduri'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'Toate' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'print', label: 'Print' },
  { id: 'interior', label: 'Interior' },
  { id: 'rigide', label: 'Rigide' },
  { id: 'fonduri', label: 'Fonduri UE' },
];

export default function ConfiguratorsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConfigurators = ALL_CONFIGURATORS.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-8">
               <Sparkles className="w-4 h-4" />
               <span>18 Configuratoare Disponibile</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              Alege ce vrei să
              <span className="block mt-2 text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600">
                configurezi online
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
              Personalizare completă. Preț instant. Livrare rapidă în toată țara.
            </p>

            {/* Search Bar - Premium Design */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200/50">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Caută configurator... (ex: bannere, canvas, pvc)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 rounded-2xl text-lg text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Pills - Clean & Modern */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-y border-slate-200/60 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-4 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const count = cat.id === 'all' ? ALL_CONFIGURATORS.length : ALL_CONFIGURATORS.filter(p => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {cat.label}
                  <span className={`ml-2 ${selectedCategory === cat.id ? 'text-white/70' : 'text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <p className="text-sm text-slate-500">
            {filteredConfigurators.length === ALL_CONFIGURATORS.length 
              ? `Afișez toate cele ${ALL_CONFIGURATORS.length} configuratoare` 
              : `${filteredConfigurators.length} rezultate găsite`}
          </p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Șterge căutarea
            </button>
          )}
        </div>
      </div>

      {/* Premium Grid */}
      <div className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredConfigurators.map((product) => (
            <Link 
              key={product.id} 
              href={product.link}
              className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200/60 hover:border-indigo-200 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-linear-to-br from-slate-100 to-slate-50">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-xs font-bold text-indigo-600 shadow-lg">
                    {product.badge}
                  </div>
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Configurabil</span>
                  <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-sm group-hover:gap-3 transition-all">
                    Începe
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredConfigurators.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Niciun rezultat găsit</h3>
            <p className="text-slate-500 mb-6">Încearcă alt termen de căutare sau selectează o categorie diferită.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Resetează filtrele
            </button>
          </div>
        )}
      </div>
    </main>
  );
}