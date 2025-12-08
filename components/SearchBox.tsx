"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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

type SearchBoxProps = {
  placeholder?: string;
  className?: string;
  onSelect?: (result: SearchResult) => void;
  showCategories?: boolean;
  autoFocus?: boolean;
};

export default function SearchBox({ 
  placeholder = "Caută produse...", 
  className = "",
  onSelect,
  showCategories = true,
  autoFocus = false
}: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounce search
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`);
      const data: SearchResponse = await response.json();
      setResults(data.results || []);
      setIsOpen(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
  }, [performSearch]);

  useEffect(() => {
    debouncedSearch(query);
    
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query, debouncedSearch]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectResult(results[selectedIndex]);
        } else if (query.length >= 2) {
          // Search page redirect
          router.push(`/search?q=${encodeURIComponent(query)}`);
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    const categoryPath = result.category === "bannere" ? "banner" : result.category;
    const url = `/${categoryPath}/${result.slug}`;
    
    if (onSelect) {
      onSelect(result);
    } else {
      router.push(url);
    }
    
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-black rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryNames: Record<string, string> = {
      "bannere": "Bannere",
      "afise": "Afișe", 
      "autocolante": "Autocolante",
      "pliante": "Pliante",
      "flayere": "Flyere",
      "canvas": "Canvas",
      "tapet": "Tapet",
      "carton": "Carton",
      "alucobond": "Alucobond",
      "plexiglass": "Plexiglass",
      "polipropilena": "Polipropilena",
      "pvc-forex": "PVC Forex"
    };
    return categoryNames[category] || category;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 transition-colors ${isLoading ? 'text-blue-500' : 'text-gray-400'}`} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 text-sm text-black dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 border border-slate-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all bg-white dark:bg-zinc-900"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          autoFocus={autoFocus}
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-700 dark:text-gray-400 hover:text-black dark:hover:text-gray-200 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
          {results.length > 0 ? (
            <>
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                    index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectResult(result)}
                >
                  {/* Product Image */}
                  <div className="w-12 h-12 relative shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    {result.images?.[0] ? (
                      <Image
                        src={result.images[0]}
                        alt={result.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {highlightMatch(result.title, query)}
                    </div>
                    <div className="text-xs text-slate-800 dark:text-gray-500 mt-1 line-clamp-2">
                      {highlightMatch(result.description.slice(0, 80), query)}
                      {result.description.length > 80 && "..."}
                    </div>
                    {showCategories && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {getCategoryDisplayName(result.category)}
                        </span>
                        {result.priceBase && (
                          <span className="text-xs text-slate-800 dark:text-gray-500">
                            de la {result.priceBase} RON
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* View all results link */}
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className="block p-3 text-center text-sm text-blue-600 hover:bg-blue-50 font-medium border-t border-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Vezi toate rezultatele ({results.length}+)
              </Link>
            </>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-slate-800 dark:text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Niciun rezultat pentru &quot;{query}&quot;</p>
              <Link 
                href={`/search?q=${encodeURIComponent(query)}`}
                className="text-blue-600 hover:text-blue-700 text-sm mt-1 inline-block"
                onClick={() => setIsOpen(false)}
              >
                Caută în toate produsele →
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}