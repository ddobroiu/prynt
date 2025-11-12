
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

  // Găsește prețul minim și maxim din produse
  const prices = PRODUCTS.map(p => p.priceBase ?? 0);
  const realMin = Math.min(...prices);
  const realMax = Math.max(...prices);

  // Setează maxPrice default la realMax dacă e 0
  const effectiveMaxPrice = maxPrice > 0 ? maxPrice : realMax;

  // Adapt products la ProductCard props
  const products = PRODUCTS.map((p) => ({
    id: p.id,
    slug: p.routeSlug || p.slug || p.id,
    title: p.title,
    description: p.description,
    price: p.priceBase ?? 0,
    stock: 10, // TODO: Replace with real stock if available
    images: p.images,
    category: p.metadata?.category ?? "",
  }));

  // Filtrare după categorie și preț
  const filtered = products.filter(p => {
    const inCategory = selectedCategory ? p.category === selectedCategory : true;
    const inPrice = p.price >= minPrice && p.price <= effectiveMaxPrice;
    return inCategory && inPrice;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-900">Shop</h1>
      <form className="mb-10 flex flex-wrap gap-6 items-end bg-white/5 p-4 rounded-xl shadow">
        <div className="w-56">
          <label className="field-label">Categorie</label>
          <select
            aria-label="Filtrează după categorie"
            className="select"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">Toate</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="w-32">
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
        <div className="w-32">
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
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">Niciun produs găsit.</div>
        ) : (
          filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </main>
  );
}
