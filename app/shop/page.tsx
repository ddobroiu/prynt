"use client";
import { useState } from "react";
import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

// Extrage categoriile unice din produse
const categories = Array.from(new Set(PRODUCTS.map(p => p.metadata?.category).filter(Boolean)));

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Găsește prețul minim și maxim din produse
  // Pentru bannere afișăm prețul de pornire 50 RON ("de la 50") în listă și în filtre
  const prices = PRODUCTS.map(p => {
    const cat = String(p.metadata?.category ?? "").toLowerCase();
    if (cat === "bannere") return 50;
    if (cat === "canvas") return 79;
    if (cat === "flayere") return 50;
    if (cat === "afise") return 3;
    if (cat === "autocolante") return 5;
    if (cat === "tapet") return 45;
    return p.priceBase ?? 0;
  });
  const realMin = Math.min(...prices);
  const realMax = Math.max(...prices);

  // Setează maxPrice default la realMax dacă e 0
  const effectiveMaxPrice = maxPrice > 0 ? maxPrice : realMax;

  // Adapt products la ProductCard props
  const products = PRODUCTS.map((p) => {
    const category = String(p.metadata?.category ?? "").toLowerCase();
    const startingPrice = category === "bannere" ? 50 : category === "canvas" ? 79 : category === "flayere" ? 50 : category === "afise" ? 3 : category === "autocolante" ? 5 : category === "tapet" ? 45 : p.priceBase ?? 0;
    return {
      id: p.id,
      slug: p.routeSlug || p.slug || p.id,
      title: p.title,
      description: p.description,
      price: startingPrice,
      stock: 10, // TODO: Replace with real stock if available
      images: p.images,
      category: p.metadata?.category ?? "",
      tags: p.tags ?? [],
    } as any;
  });

  // Normalizare pentru căutare (case/diacritice-insensitive)
  function normalize(s: string) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ș|ş/g, "s")
      .replace(/ț|ţ/g, "t");
  }

  // Filtrare după categorie, preț și căutare
  const filtered = products.filter((p: any) => {
    const inCategory = selectedCategory ? p.category === selectedCategory : true;
    const inPrice = p.price >= minPrice && p.price <= effectiveMaxPrice;
    const term = normalize(searchTerm);
    const hay = normalize(`${p.title} ${p.description || ""} ${Array.isArray(p.tags) ? p.tags.join(" ") : ""}`);
    const inSearch = term ? hay.includes(term) : true;
    return inCategory && inPrice && inSearch;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900">Shop</h1>

      {/* Toolbar modernă: căutare + filtre */}
      <div className="mb-8 rounded-2xl border border-indigo-100 bg-white/70 backdrop-blur p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="field-label">Caută produse</label>
            <input
              aria-label="Caută produse după nume"
              type="text"
              className="input"
              placeholder="Ex: Tapet, Banner, Canvas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Categorie</label>
            <select
              aria-label="Filtrează după categorie"
              className="select"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="">Toate</option>
              {categories.map(cat => (
                <option key={cat} value={cat as string}>{cat as string}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Preț minim</label>
              <input
                aria-label="Preț minim"
                type="number"
                className="input"
                min={realMin}
                max={realMax}
                value={minPrice}
                onChange={e => setMinPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="field-label">Preț maxim</label>
              <input
                aria-label="Preț maxim"
                type="number"
                className="input"
                min={realMin}
                max={realMax}
                value={maxPrice || realMax}
                onChange={e => setMaxPrice(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="text-gray-500">Rezultate: <span className="font-semibold text-indigo-700">{filtered.length}</span></div>
          <div className="flex gap-2">
            {(selectedCategory || minPrice || maxPrice || searchTerm) && (
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                onClick={() => { setSelectedCategory(""); setMinPrice(0); setMaxPrice(0); setSearchTerm(""); }}
              >
                Resetează filtrele
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">Niciun produs găsit.</div>
        ) : (
          filtered.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </main>
  );
}
