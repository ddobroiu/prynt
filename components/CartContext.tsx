"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  productId: string;
  slug?: string;
  title: string;
  width: number;
  height: number;
  price: number;
  quantity?: number;
  currency?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function normalizeLoadedItem(raw: any): CartItem {
  // If the shape already matches, return with defaults
  if (raw && typeof raw === "object" && "price" in raw && "width" in raw && "height" in raw) {
    return {
      id: String(raw.id ?? `${raw.productId ?? "p"}-${raw.width ?? 0}x${raw.height ?? 0}`),
      productId: String(raw.productId ?? raw.id ?? ""),
      slug: raw.slug ?? raw.productSlug ?? "",
      title: raw.title ?? raw.name ?? "Produs",
      width: Number(raw.width ?? 0),
      height: Number(raw.height ?? 0),
      price: Number(raw.price ?? raw.unitAmount ?? raw.totalAmount ?? 0),
      quantity: Number(raw.quantity ?? 1),
      currency: raw.currency ?? raw.currencyCode ?? "RON",
    };
  }

  // Handle older shape examples: { name, unitAmount, totalAmount }
  if (raw && typeof raw === "object" && ("unitAmount" in raw || "totalAmount" in raw || "name" in raw)) {
    // try to extract dimensions from id if possible: e.g. "banner-1-120x60"
    const id = String(raw.id ?? raw.name ?? `item-${Math.random().toString(36).slice(2, 8)}`);
    const dimMatch = id.match(/(\d{1,4})x(\d{1,4})/);
    const width = dimMatch ? Number(dimMatch[1]) : Number(raw.width ?? 0);
    const height = dimMatch ? Number(dimMatch[2]) : Number(raw.height ?? 0);
    return {
      id,
      productId: String(raw.productId ?? id),
      slug: raw.slug ?? "",
      title: raw.title ?? raw.name ?? "Produs",
      width: width,
      height: height,
      price: Number(raw.unitAmount ?? raw.totalAmount ?? raw.price ?? 0),
      quantity: Number(raw.quantity ?? 1),
      currency: raw.currency ?? "RON",
    };
  }

  // Fallback very defensive
  return {
    id: String(raw?.id ?? `item-${Math.random().toString(36).slice(2, 8)}`),
    productId: String(raw?.productId ?? raw?.id ?? ""),
    slug: raw?.slug ?? "",
    title: raw?.title ?? raw?.name ?? "Produs",
    width: Number(raw?.width ?? 0),
    height: Number(raw?.height ?? 0),
    price: Number(raw?.price ?? raw?.unitAmount ?? 0),
    quantity: Number(raw?.quantity ?? 1),
    currency: raw?.currency ?? "RON",
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // load & normalize from localStorage at mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      console.log("[Cart] load from localStorage:", raw);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((r) => normalizeLoadedItem(r));
          setItems(normalized);
          console.log("[Cart] normalized loaded items:", normalized);
        }
      }
    } catch (e) {
      console.warn("[Cart] load failed", e);
    }
  }, []);

  // save (store normalized shape)
  useEffect(() => {
    try {
      console.log("[Cart] saving to localStorage:", items);
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (e) {
      console.warn("[Cart] save failed", e);
    }
  }, [items]);

  function addItem(item: CartItem) {
    console.log("[Cart] addItem called", item);
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (p) => p.productId === item.productId && p.width === item.width && p.height === item.height
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
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}