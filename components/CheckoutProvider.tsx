"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  unitAmount: number;
  totalAmount: number;
  artworkUrl?: string; // link către fișierul încărcat
}

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: number;
  count: number;
  isLoaded: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem("cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {}
  }, [items, isLoaded]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        const mergedQty = copy[idx].quantity + item.quantity;
        const unit = copy[idx].unitAmount;
        copy[idx] = {
          ...copy[idx],
          quantity: mergedQty,
          totalAmount: unit * mergedQty,
          artworkUrl: item.artworkUrl ?? copy[idx].artworkUrl,
        };
        return copy;
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => setItems((p) => p.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const total = useMemo(() => items.reduce((s, i) => s + i.totalAmount, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, total, count, isLoaded }}>
      {children}
    </CartContext.Provider>
  );
}