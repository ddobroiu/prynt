"use client";

import React, { useMemo, useRef } from "react";
import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface RelatedProductsProps {
  category: string; // ex: "bannere", "afise", "canvas"
  title?: string;
  maxProducts?: number;
}

// Prețuri de pornire pentru produsele din shop
const STARTING_PRICES: Record<string, number> = {
  bannere: 50,
  canvas: 79,
  flayere: 50,
  afise: 3,
  autocolante: 5,
  tapet: 150,
  "pvc-forex": 45,
  alucobond: 120,
  plexiglass: 80,
  carton: 30,
  polipropilena: 40,
};

export default function RelatedProducts({ 
  category, 
  title = "Design-uri Populare",
  maxProducts = 12 
}: RelatedProductsProps) {
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  // Filtrăm și pregătim produsele din categoria specificată
  const relatedProducts = useMemo(() => {
    const filtered = PRODUCTS
      .filter(p => {
        const productCategory = String(p.metadata?.category ?? "").toLowerCase();
        return productCategory === category.toLowerCase();
      })
      .map(p => {
        const cat = String(p.metadata?.category ?? "").toLowerCase();
        const price = STARTING_PRICES[cat] ?? p.priceBase ?? 0;
        
        return {
          id: p.id,
          slug: p.routeSlug || p.slug || p.id,
          title: p.title,
          description: p.description,
          price: price,
          images: p.images,
          category: p.metadata?.category ?? "",
          tags: p.tags ?? [],
        };
      })
      .slice(0, maxProducts);
    
    return filtered;
  }, [category, maxProducts]);

  // Dacă nu avem produse, nu afișăm nimic
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-linear-to-br from-slate-50 via-white to-indigo-50/20 py-12 sm:py-16 border-t border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - pe un singur rând */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-linear-to-b from-indigo-600 to-purple-600 rounded-full"></div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {title}
            </h2>
          </div>
          
          <a 
            href="/shop" 
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md text-sm"
          >
            Vezi toate
            <Sparkles className="w-4 h-4" />
          </a>
        </div>

        {/* Carousel cu Săgeți */}
        <div className="relative group">
          
          {/* Săgeată Stânga */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white border-2 border-slate-200 text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-lg transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Container Scrollabil */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 overflow-x-scroll scroll-smooth pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {relatedProducts.map((product) => (
              <div key={product.id} className="w-[85vw] sm:w-[calc(20%-1.2rem)] shrink-0">
                <ProductCard product={product as any} />
              </div>
            ))}
          </div>

          {/* Săgeată Dreapta */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white border-2 border-slate-200 text-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            aria-label="Scroll Right"
          >
            <ChevronRight size={24} />
          </button>

        </div>

        {/* Link Mobile */}
        <div className="mt-8 text-center sm:hidden">
          <a 
            href="/shop" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            Vezi toate produsele
            <Sparkles className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}

