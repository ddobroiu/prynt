"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * Structura unui produs din coș
 */
export type CartItem = {
  id: string;
  productId?: string;
  slug?: string;
  title?: string;
  width?: number;
  height?: number;
  price: number; // preț unitar
  quantity: number; // obligatoriu
  currency?: string;
  metadata?: Record<string, any>;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Partial<CartItem> & { price: number; id?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isLoaded: boolean;
};

const STORAGE_KEY = "cart";
const CartContext = createContext<CartContextType | undefined>(undefined);

function normalizeItem(raw: Partial<CartItem> & { price?: number; id?: string }): CartItem {
  const id = String(
    raw.id ??
    raw.productId ??
    `${raw.slug ?? "item"}-${Math.random().toString(36).slice(2, 9)}`
  );

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

  // 1. Încărcare din LocalStorage
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((p) =>
            normalizeItem({
              ...p,
              quantity: p.quantity ?? 1,
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

  // 2. Salvare în LocalStorage la orice modificare
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("[Cart] save failed", e);
    }
  }, [items, isLoaded]);

  // --- FUNCȚII ---

  function addItem(raw: Partial<CartItem> & { price: number; id?: string }) {
    const item = normalizeItem(raw);
    setItems((prev) => {
      // Căutăm dacă există deja un produs identic
      const idx = prev.findIndex(
        (p) => p.id === item.id || 
        (p.productId && item.productId && p.productId === item.productId && 
         JSON.stringify(p.metadata) === JSON.stringify(item.metadata) &&
         p.width === item.width && p.height === item.height)
      );

      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          quantity: copy[idx].quantity + item.quantity,
        };
        return copy;
      }

      return [...prev, item];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    setItems((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, quantity) };
        }
        return item;
      })
    );
  }

  function clearCart() {
    setItems([]);
  }

  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        cartTotal, 
        cartCount, 
        isLoaded 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}