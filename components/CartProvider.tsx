// components/CartProvider.tsx
"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// --- DEFINIȚII DE TIP LOCALE (CartItem) ---
interface CartItem {
  id: string;
  name: string;
  quantity: number;
  unitAmount: number;
  totalAmount: number;
  artworkUrl?: string; // link public către fișierul de grafică (dacă există)
}

// --- DEFINIȚII DE TIP (CartContext) ---
type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: number; // Totalul întregului coș
  count: number; // Numărul total de bucăți
  isLoaded: boolean; // Date încărcate din localStorage
};

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load din localStorage
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem("cart");
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Eroare la citirea coșului din localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // 2. Save în localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("cart", JSON.stringify(items));
      } catch (e) {
        console.error("Eroare la salvarea coșului în localStorage:", e);
      }
    }
  }, [items, isLoaded]);

  // Adăugare + merge cantități + păstrează artworkUrl dacă vine
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