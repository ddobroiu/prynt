"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter, X, SlidersHorizontal, Grid3X3, List, ChevronDown } from "lucide-react";
import SearchBox from "@/components/SearchBox";
import ProductCard from "@/components/ProductCard";
import ProductCardCompact from "@/components/ProductCardCompact";

type SearchResult = {
  id: string;
  slug: string;
  title: string;
  description: string;
  images?: string[];
  category: string;
  tags?: string[];
  priceBase?: number;
  score: number;
};

type SearchResponse = {
  results: SearchResult[];
  total: number;
  query: string;
  category: string;
};

const CATEGORIES = [
  { key: "toate", label: "Toate" },
  { key: "bannere", label: "Bannere" },
  { key: "afise", label: "Afișe" },
  { key: "autocolante", label: "Autocolante" },
  { key: "pliante", label: "Pliante" },
  { key: "flayere", label: "Flyere" },
  { key: "canvas", label: "Canvas" },
  { key: "tapet", label: "Tapet" },
  { key: "carton", label: "Carton" },
  { key: "alucobond", label: "Alucobond" },
  { key: "plexiglass", label: "Plexiglass" },
  { key: "polipropilena", label: "Polipropilena" },
  { key: "pvc-forex", label: "PVC Forex" },
];

const SORT_OPTIONS = [
  { key: "relevance", label: "Relevanță" },
  { key: "price_asc", label: "Preț: crescător" },
  { key: "price_desc", label: "Preț: descrescător" },
  { key: "title", label: "Nume A-Z" },
];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "toate");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("price_min") || "",
    max: searchParams.get("price_max") || ""
  });

  // Search function
  const performSearch = async () => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("q", query);
      params.set("limit", "50");
      if (category !== "toate") params.set("category", category);

      const response = await fetch(`/api/search?${params.toString()}`);
      const data: SearchResponse = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Update URL and search when parameters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category !== "toate") params.set("category", category);
    if (sortBy !== "relevance") params.set("sort", sortBy);
    if (priceRange.min) params.set("price_min", priceRange.min);
    if (priceRange.max) params.set("price_max", priceRange.max);

    const newUrl = `/search${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", newUrl);

    performSearch();
  }, [query, category, sortBy, priceRange]);

  // Initial search from URL params
  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, []);

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];

    // Price filtering
    if (priceRange.min || priceRange.max) {
      const min = parseFloat(priceRange.min) || 0;
      const max = parseFloat(priceRange.max) || Infinity;
      filtered = filtered.filter(item => {
        const price = item.priceBase || 0;
        return price >= min && price <= max;
      });
    }

    // Sorting
    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => (a.priceBase || 0) - (b.priceBase || 0));
        break;
      case "price_desc":
        filtered.sort((a, b) => (b.priceBase || 0) - (a.priceBase || 0));
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "relevance":
      default:
        filtered.sort((a, b) => b.score - a.score);
        break;
    }

    return filtered;
  }, [results, priceRange, sortBy]);

  const handleClearFilters = () => {
    setQuery("");
    setCategory("toate");
    setSortBy("relevance");
    setPriceRange({ min: "", max: "" });
    setResults([]);
  };

  const hasActiveFilters = category !== "toate" || priceRange.min || priceRange.max || sortBy !== "relevance";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Caută Produse
          </h1>
          
          {/* Main Search */}
          <div className="mb-6">
            <SearchBox 
              placeholder="Caută bannere, afișe, autocolante..."
              className="w-full max-w-2xl"
              autoFocus
            />
          </div>

          {/* Quick Stats */}
          {query && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  Căutăm produsele...
                </div>
              ) : (
                <span>
                  {filteredAndSortedResults.length} rezultate pentru &quot;<strong>{query}</strong>&quot;
                  {category !== "toate" && (
                    <span> în categoria <strong>{CATEGORIES.find(c => c.key === category)?.label}</strong></span>
                  )}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Filters & Controls */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === cat.key
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
                >
                  <List size={18} />
                </button>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  showFilters || hasActiveFilters
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50"
                }`}
              >
                <SlidersHorizontal size={16} />
                Filtre
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preț minim (RON)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preț maxim (RON)
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                />
              </div>
              <div className="flex items-end">
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    <X size={16} />
                    Resetează filtrele
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {!query ? (
          <div className="text-center py-16">
            <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Începe să cauți
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Caută după numele produsului, categorie sau cuvinte cheie pentru a găsi exact ce îți trebuie.
            </p>
          </div>
        ) : filteredAndSortedResults.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredAndSortedResults.map((result) => {
              // Transform result to match ProductCard expected props
              const productForCard = {
                id: result.id,
                slug: result.slug,
                title: result.title,
                description: result.description,
                images: result.images || [],
                priceBase: result.priceBase || 0,
                metadata: { category: result.category },
                tags: result.tags || []
              };

              return viewMode === "grid" ? (
                <ProductCard key={result.id} product={productForCard as any} />
              ) : (
                <ProductCardCompact key={result.id} product={productForCard as any} />
              );
            })}
          </div>
        ) : isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Căutăm produsele...</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Niciun rezultat găsit
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              Nu am găsit produse pentru &quot;{query}&quot;. 
              Încearcă să modifici termenul de căutare sau să folosești filtre diferite.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Resetează căutarea
              </button>
              <button
                onClick={() => router.push("/shop")}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Vezi toate produsele
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-black py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Se încarcă căutarea...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}