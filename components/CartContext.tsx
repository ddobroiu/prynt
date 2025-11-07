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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.warn("Cart load failed", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch (e) {
      console.warn("Cart save failed", e);
    }
  }, [items]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const existingIndex = prev.findIndex((p) => p.productId === item.productId && p.width === item.width && p.height === item.height && p.price === item.price);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = { ...copy[existingIndex], quantity: (copy[existingIndex].quantity || 1) + (item.quantity || 1) };
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

  const total = items.reduce((s, i) => s + i.price * (i.quantity ?? 1), 0);

  return <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}