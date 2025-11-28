"use client";

import React, { useState, useMemo } from "react";
import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Search, Filter, X, SlidersHorizontal } from "lucide-react";

// --- CONFIGURARE PREȚURI DE PORNIRE ---
// Acestea sunt prețurile "De la..." afișate în shop pentru sortare/filtrare
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

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Toate");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);

  // 1. Extragem categoriile unice și le formatăm
  const categories = useMemo(() => {
    const cats = new Set(PRODUCTS.map((p) => p.metadata?.category).filter(Boolean));
    return ["Toate", ...Array.from(cats)] as string[];
  }, []);

  // 2. Pregătim produsele cu prețuri corecte
  const allProducts = useMemo(() => {
    return PRODUCTS.map((p) => {
      const cat = String(p.metadata?.category ?? "").toLowerCase();
      // Folosim prețul din map sau fallback la priceBase
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
    });
  }, []);

  // 3. Logica de Filtrare
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // Filtru Categorie
      if (selectedCategory !== "Toate" && p.category !== selectedCategory) return false;

      // Filtru Search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const text = `${p.title} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
        if (!text.includes(term)) return false;
      }

      // Filtru Preț
      const min = parseFloat(priceRange.min) || 0;
      const max = parseFloat(priceRange.max) || Infinity;
      if (p.price < min || p.price > max) return false;

      return true;
    });
  }, [allProducts, selectedCategory, searchTerm, priceRange]);

  // Resetare filtre
  const clearFilters = () => {
    setSelectedCategory("Toate");
    setSearchTerm("");
    setPriceRange({ min: "", max: "" });
  };

  const hasActiveFilters = selectedCategory !== "Toate" || searchTerm !== "" || priceRange.min !== "" || priceRange.max !== "";

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER SHOP --- */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-white mb-4">
            Explorează Produsele
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Alege din gama noastră variată de materiale publicitare și decor. Configurează online și primești prețul instant.
          </p>
        </div>

        {/* --- TOOLBAR FILTRE --- */}
        <div className="sticky top-20 z-30 mb-10 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-xl p-4 transition-all">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            
            {/* 1. Căutare */}
            <div className="relative w-full lg:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder="Caută (ex: Banner, Autocolant...)"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-transparent focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* 2. Categorii (Desktop Pills) */}
            <div className="hidden lg:flex flex-wrap gap-2 justify-center flex-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white shadow-md scale-105"
                      : "bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {cat === "bannere" ? "Bannere" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* 3. Mobile Filter Toggle & Price */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50'}`}
              >
                <SlidersHorizontal size={18} />
                <span className="hidden sm:inline">Filtre Preț</span>
              </button>
              
              {/* Mobile Category Dropdown (visible only on small screens) */}
              <div className="lg:hidden w-full sm:w-auto">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl py-3 px-4 text-sm font-medium outline-none"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Expandable Filters Area */}
          {showFilters && (
             <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-700 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in slide-in-from-top-2">
                <div className="sm:col-span-2 flex items-center gap-4">
                   <div className="flex items-center gap-2 w-full">
                      <span className="text-sm text-zinc-500 whitespace-nowrap">Preț (RON):</span>
                      <input 
                        type="number" 
                        placeholder="Min" 
                        className="input-sm w-full bg-zinc-50 dark:bg-zinc-800 border rounded-lg px-3 py-2 text-sm"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      />
                      <span className="text-zinc-400">-</span>
                      <input 
                        type="number" 
                        placeholder="Max" 
                        className="input-sm w-full bg-zinc-50 dark:bg-zinc-800 border rounded-lg px-3 py-2 text-sm"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      />
                   </div>
                </div>
                <div className="flex justify-end">
                   {hasActiveFilters && (
                     <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1">
                        <X size={14} /> Resetează tot
                     </button>
                   )}
                </div>
             </div>
          )}
        </div>

        {/* --- GRID PRODUSE --- */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
              <Search size={32} className="text-zinc-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Niciun produs găsit</h3>
            <p className="text-zinc-500 mt-2">Încearcă să schimbi filtrele sau termenul de căutare.</p>
            <button onClick={clearFilters} className="mt-6 btn-outline px-6 py-2">
              Șterge filtrele
            </button>
          </div>
        )}

      </div>
    </main>
  );
}