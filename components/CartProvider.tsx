"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  productId?: string;
  slug?: string;
  title?: string;
  width?: number;
  height?: number;
  price: number; // unit price
  quantity?: number;
  currency?: string;
  metadata?: Record<string, any>;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Partial<CartItem> & { price: number; id?: string }) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
  isLoaded: boolean;
};

const STORAGE_KEY = "cart";
const CartContext = createContext<CartContextType | undefined>(undefined);

function normalizeItem(raw: Partial<CartItem> & { price: number; id?: string }): CartItem {
  const id = String(raw.id ?? raw.productId ?? `${raw.slug ?? "item"}-${Math.random().toString(36).slice(2, 9)}`);
  const price = Number(raw.price ?? 0) || 0;
  const quantity = Math.max(1, Number(raw.quantity ?? 1) || 1);
  return {
    id,
    productId: raw.productId ? String(raw.productId) : undefined,
    slug: raw.slug,
    title: raw.title ?? raw.slug ?? "Produs",
    width: raw.width ? Number(raw.width) : undefined,
    height: raw.height ? Number(raw.height) : undefined,
    price,
    quantity,
    currency: raw.currency ?? "RON",
    metadata: raw.metadata,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // load from localStorage once on mount
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // basic normalization in case shape differs
          const normalized = parsed.map((p) =>
            normalizeItem({
              id: p.id,
              productId: p.productId ?? p.productId,
              slug: p.slug ?? p.productSlug,
              title: p.title ?? p.name,
              width: p.width ?? p.w,
              height: p.height ?? p.h,
              price: p.price ?? p.unitAmount ?? 0,
              quantity: p.quantity ?? 1,
              metadata: p.metadata ?? p.extras,
              currency: p.currency,
            })
          );
          setItems(normalized);
        }
      }
    } catch (e) {
      console.warn("[Cart] load failed", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // persist to localStorage after loaded
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("[Cart] save failed", e);
    }
  }, [items, isLoaded]);

  function addItem(raw: Partial<CartItem> & { price: number; id?: string }) {
    const item = normalizeItem(raw);
    setItems((prev) => {
      // merge by productId/slug/size/metadata to increase quantity if same product
      const idx = prev.findIndex(
        (p) =>
          (p.productId && item.productId && p.productId === item.productId) ||
          (p.slug && item.slug && p.slug === item.slug) ||
          p.id === item.id
      );

      // If we find identical by id/product/slug + same metadata (best-effort)
      if (idx >= 0) {
        const copy = [...prev];
        const sameMetadata =
          JSON.stringify(copy[idx].metadata ?? {}) === JSON.stringify(item.metadata ?? {});
        if (sameMetadata) {
          copy[idx] = {
            ...copy[idx],
            quantity: (Number(copy[idx].quantity ?? 1) || 1) + (Number(item.quantity ?? 1) || 1),
            price: Number(item.price) || copy[idx].price,
            title: item.title || copy[idx].title,
          };
          return copy;
        }
      }

      return [...prev, item];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0);
  const count = items.reduce((s, i) => s + (Number(i.quantity) || 1), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, count, isLoaded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}