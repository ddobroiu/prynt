"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
// Importul de tip 'CartItem' a fost eliminat, iar tipul este definit mai jos.
// import type { CartItem } from "../lib/types"; 

// --- DEFINIȚII DE TIP LOCALE ---

// Am definit structura CartItem pentru a rezolva eroarea 'Cannot find module ../lib/types'
interface CartItem {
  id: string; // ID unic (de exemplu, ID-ul de produs + opțiuni configurate)
  name: string;
  quantity: number;
  unitAmount: number; // Prețul pe bucată (fără TVA, de preferat)
  totalAmount: number; // Prețul total al liniei (quantity * unitAmount)
  // Pot fi adăugate și alte câmpuri: material, dimensiuni, optiuni etc.
}


type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // load/save localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      // Regula de unire: Caută un element cu același ID.
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        const mergedQty = copy[idx].quantity + item.quantity;
        // Folosește unitAmount din elementul existent pentru a menține consistența
        const unit = copy[idx].unitAmount; 
        
        // Verificare suplimentară: Dacă unitAmount-ul din item-ul nou e diferit, 
        // probabil că ar trebui tratat ca un produs nou (dar simplificăm aici).
        
        copy[idx] = { ...copy[idx], quantity: mergedQty, totalAmount: unit * mergedQty };
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
    <CartContext.Provider value={{ items, addItem, removeItem, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};