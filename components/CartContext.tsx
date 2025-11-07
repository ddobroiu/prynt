"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string; // unique id for this configuration
  productId: string;
  slug?: string;
  title: string;
  width: number;
  height: number;
  price: number; // unit price (per item)
  quantity?: number;
  currency?: string;
  metadata?: Record<string, any>; // optional extra data (artworkUrl, designOption, etc.)
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
};

const STORAGE_KEY = "cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

function normalizeLoadedItem(raw: any): CartItem {
  // Defensive normalization for older/localStorage shapes
  return {
    id: String(raw?.id ?? `${raw?.productId ?? "item"}-${Math.random().toString(36).slice(2, 9)}`),
    productId: String(raw?.productId ?? raw?.id ?? ""),
    slug: raw?.slug ?? raw?.productSlug ?? undefined,
    title: raw?.title ?? raw?.name ?? "Produs",
    width: Number(raw?.width ?? raw?.w ?? 0),
    height: Number(raw?.height ?? raw?.h ?? 0),
    price: Number(raw?.price ?? raw?.unitAmount ?? 0),
    quantity: Number(raw?.quantity ?? 1),
    currency: raw?.currency ?? "RON",
    metadata: raw?.metadata ?? raw?.extras ?? undefined,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      console.log("[Cart] load from localStorage:", raw);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((p) => normalizeLoadedItem(p));
          setItems(normalized);
          console.log("[Cart] loaded items (normalized):", normalized);
        }
      }
    } catch (e) {
      console.warn("[Cart] load failed", e);
    }
  }, []);

  // save to localStorage whenever items change
  useEffect(() => {
    try {
      console.log("[Cart] saving to localStorage:", items);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("[Cart] save failed", e);
    }
  }, [items]);

  function addItem(item: CartItem) {
    console.log("[Cart] addItem called", item);
    setItems((prev) => {
      // Merge identical product config (same productId + width + height + same metadata fingerprint)
      const existingIndex = prev.findIndex(
        (p) =>
          p.productId === item.productId &&
          p.width === item.width &&
          p.height === item.height &&
          p.slug === item.slug &&
          // simple metadata fingerprint: stringify (ok for small objects)
          JSON.stringify(p.metadata ?? {}) === JSON.stringify(item.metadata ?? {})
      );
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: (copy[existingIndex].quantity || 1) + (item.quantity || 1),
        };
        console.log("[Cart] updated items", copy);
        return copy;
      }
      const newItems = [...prev, { ...item, quantity: item.quantity ?? 1 }];
      console.log("[Cart] new items", newItems);
      return newItems;
    });
  }

  function removeItem(id: string) {
    console.log("[Cart] removeItem", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    console.log("[Cart] clearCart");
    setItems([]);
  }

  const total = items.reduce((s, i) => s + i.price * (i.quantity ?? 1), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}