"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

// Datele produselor (aceleași ca în Hero, pentru consistență)
const ALL_CONFIGURATORS = [
  {
    id: 'banner',
    title: 'Bannere Outdoor',
    description: 'Rezistente UV, tiv & capse incluse. Cea mai bună vizibilitate.',
    image: '/products/banner/1.webp',
    link: '/banner',
    badge: 'Top Vânzări'
  },
  {
    id: 'autocolante',
    title: 'Autocolante & Stickere',
    description: 'Print & Cut pe contur. Orice formă, orice dimensiune.',
    image: '/products/autocolante/1.webp',
    link: '/autocolante',
    badge: 'Popular'
  },
  {
    id: 'tapet',
    title: 'Tapet Personalizat',
    description: 'Textură premium, lavabil, dintr-o bucată. Decor unic.',
    image: '/products/tapet/1.webp',
    link: '/tapet',
    badge: 'Nou'
  },
  {
    id: 'afise',
    title: 'Afișe & Postere',
    description: 'Calitate HD pe hârtie foto sau blueback.',
    image: '/products/afise/1.webp',
    link: '/afise'
  },
  {
    id: 'canvas',
    title: 'Tablouri Canvas',
    description: 'Transformă fotografiile în artă. Pânză bumbac.',
    image: '/products/canvas/1.webp',
    link: '/canvas'
  },
  {
    id: 'pliante',
    title: 'Pliante & Flyere',
    description: 'Promovare eficientă. Tiraje mici sau mari.',
    image: '/products/pliante/1.webp',
    link: '/pliante'
  },
  {
    id: 'banner-verso',
    title: 'Banner Față-Verso',
    description: 'Vizibilitate din ambele sensuri. Blockout.',
    image: '/products/banner/verso/1.webp',
    link: '/banner-verso'
  },
  {
    id: 'pvc',
    title: 'Plăci PVC / Forex',
    description: 'Panouri rigide pentru semnalistică durabilă.',
    image: '/products/materiale/PVC-Forex/1.webp',
    link: '/materiale/pvc-forex'
  },
  {
    id: 'plexiglass',
    title: 'Plexiglass Printat',
    description: 'Aspect sticlă, elegant și modern. Print UV.',
    image: '/products/materiale/plexiglass/1.webp',
    link: '/materiale/plexiglass'
  },
  {
    id: 'alucobond',
    title: 'Alucobond (Bond)',
    description: 'Panouri sandwich aluminiu. Ultra-rezistente.',
    image: '/products/materiale/alucobond/1.webp',
    link: '/materiale/alucobond'
  },
  {
    id: 'carton',
    title: 'Carton Ondulat',
    description: 'Print direct pe carton. Ambalaje și prototipuri.',
    image: '/products/materiale/carton/1.webp',
    link: '/materiale/carton'
  },
  {
    id: 'polipropilena',
    title: 'Polipropilenă',
    description: 'Material celular ușor, ideal imobiliare.',
    image: '/products/materiale/polipropilena/1.webp',
    link: '/materiale/polipropilena'
  },
  {
    id: 'fonduri-pnrr',
    title: 'Panouri PNRR',
    description: 'Panouri obligatorii proiecte. Template inclus.',
    image: '/products/banner/1.webp',
    link: '/fonduri-pnrr'
  },
  {
    id: 'fonduri-regio',
    title: 'Panouri Regio',
    description: 'Vizibilitate proiecte europene.',
    image: '/products/banner/1.webp',
    link: '/fonduri-regio'
  }
];

export default function ConfiguratorsPage() {
  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Header Section */}
      <div className="bg-slate-50 border-b border-slate-100 py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 text-indigo-600 text-sm font-bold mb-6 shadow-sm">
             <Sparkles className="w-4 h-4" />
             <span>Alege Produsul</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Ce vrei să <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">configurezi</span> azi?
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Toate produsele noastre sunt 100% personalizabile. Alege categoria, încarcă grafica sau creează una nouă, și vezi prețul instant.
          </p>
        </div>
      </div>

      {/* Grid Produse */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {ALL_CONFIGURATORS.map((product) => (
            <Link 
              key={product.id} 
              href={product.link}
              className="group flex flex-col bg-white rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 overflow-hidden hover:shadow-xl hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Zona Imagine */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Zona Continut */}
              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6 line-clamp-2 flex-1">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Configurabil</span>
                  <span className="flex items-center gap-1 text-sm font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                    Start <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}