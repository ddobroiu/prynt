"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  productId: string;
  slug?: string;
  title: string;
  width: number;
  height: number;
  price: number; // unit price
  quantity?: number;
  currency?: string;
  metadata?: Record<string, any>;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  isLoaded: boolean;
};

const STORAGE_KEY = "cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

function normalizeLoadedItem(raw: any): CartItem {
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((p) => normalizeLoadedItem(p));
          setItems(normalized);
        }
      }
    } catch (e) {
      console.warn("[Cart] load failed", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return; // nu scriem înainte să fim încărcați
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("[Cart] save failed", e);
    }
  }, [items, isLoaded]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (p) =>
          p.productId === item.productId &&
          p.width === item.width &&
          p.height === item.height &&
          p.slug === item.slug &&
          JSON.stringify(p.metadata ?? {}) === JSON.stringify(item.metadata ?? {})
      );
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: (copy[existingIndex].quantity || 1) + (item.quantity || 1),
        };
        return copy;
      }
      return [...prev, { ...item, quantity: item.quantity ?? 1 }];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((s, i) => s + (Number(i.price) || 0) * (i.quantity ?? 1), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, isLoaded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}