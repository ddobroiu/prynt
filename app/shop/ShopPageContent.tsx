"use client";

import React, { useState, useMemo } from "react";
import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import SearchBox from "@/components/SearchBox";
import { Search, Filter, X, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

// --- CONFIGURARE ---
const PRODUCTS_PER_PAGE = 16;

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
  const [currentPage, setCurrentPage] = useState(1);

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

  // 4. Paginare
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset la pagina 1 când se schimbă filtrele
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, priceRange]);

  // Resetare filtre
  const clearFilters = () => {
    setSelectedCategory("Toate");
    setSearchTerm("");
    setPriceRange({ min: "", max: "" });
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory !== "Toate" || searchTerm !== "" || priceRange.min !== "" || priceRange.max !== "";

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30 py-8 sm:py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- HEADER SHOP --- */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-linear-to-b from-indigo-600 to-purple-600 rounded-full"></div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Toate Produsele
            </h1>
          </div>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl ml-7">
            Descoperă întreaga noastră gamă de produse pentru print digital. Configurează online, vezi prețul instant și primește rapid.
          </p>
        </div>

        {/* --- TOOLBAR FILTRE --- */}
        <div className="sticky top-16 sm:top-20 z-30 mb-8 sm:mb-12 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-slate-200/50 p-4 sm:p-6 transition-all">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start lg:items-center">
            
            {/* 1. Căutare */}
            <div className="w-full lg:flex-1 lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <SearchBox 
                  placeholder="Caută produse..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                  onSelect={(result) => {
                    const categoryPath = result.category === "bannere" ? "banner" : result.category;
                    window.location.href = `/${categoryPath}/${result.slug}`;
                  }}
                />
              </div>
            </div>

            {/* 2. Categorii Pills */}
            <div className="hidden lg:flex flex-wrap gap-2 flex-1 justify-center">
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105"
                  }`}
                >
                  {cat === "bannere" ? "Bannere" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* 3. Filter Toggle + Mobile Category */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Mobile Category Dropdown */}
              <div className="lg:hidden flex-1">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>
                      {c === "bannere" ? "Bannere" : c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  showFilters 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <SlidersHorizontal size={18} />
                <span className="hidden sm:inline">Preț</span>
              </button>
            </div>
          </div>

          {/* Expandable Price Filters */}
          {showFilters && (
             <div className="mt-5 pt-5 border-t border-slate-100 animate-in slide-in-from-top-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                   <span className="text-sm font-semibold text-slate-700">Interval Preț (RON):</span>
                   <div className="flex items-center gap-3 flex-1">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        className="w-full sm:w-32 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      />
                      <span className="text-slate-400 font-bold">—</span>
                      <input 
                        type="number" 
                        placeholder="Max" 
                        className="w-full sm:w-32 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      />
                   </div>
                   {hasActiveFilters && (
                     <button 
                       onClick={clearFilters} 
                       className="shrink-0 text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                     >
                        <X size={16} /> Resetează
                     </button>
                   )}
                </div>
             </div>
          )}
        </div>

        {/* --- GRID PRODUSE --- */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-900">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'produs găsit' : 'produse găsite'}
                {totalPages > 1 && (
                  <span className="ml-2 text-slate-500">
                    • Pagina {currentPage} din {totalPages}
                  </span>
                )}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>

            {/* PAGINARE */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Previous Button */}
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                    currentPage === 1
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md'
                  }`}
                >
                  <ChevronLeft size={20} />
                  <span className="hidden sm:inline">Înapoi</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first, last, current, and adjacent pages
                    const showPage = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    const showEllipsis = 
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2);

                    if (showEllipsis) {
                      return <span key={page} className="text-slate-400 px-2">...</span>;
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`min-w-11 h-11 rounded-xl font-semibold transition-all ${
                          currentPage === page
                            ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 scale-110'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:scale-105'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => {
                    setCurrentPage(prev => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                    currentPage === totalPages
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md'
                  }`}
                >
                  <span className="hidden sm:inline">Înainte</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 sm:py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 mb-6 shadow-inner">
              <Search size={36} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Niciun produs găsit</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Nu am găsit produse care să corespundă criteriilor tale. Încearcă să ajustezi filtrele.
            </p>
            {hasActiveFilters && (
              <button 
                onClick={clearFilters} 
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-105"
              >
                <X size={18} />
                Șterge toate filtrele
              </button>
            )}
          </div>
        )}

      </div>
    </main>
  );
}