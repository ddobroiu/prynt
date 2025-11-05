// components/CartProvider.tsx
"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// --- DEFINIȚII DE TIP LOCALE (CartItem) ---
interface CartItem {
  id: string; // ID unic (ID_PRODUS-DIMENSIUNE-MATERIAL-ETC)
  name: string; // Numele produsului afișat (ex: "Banner 440g - 100x200cm")
  quantity: number; // Numărul de bucăți
  unitAmount: number; // Prețul pe bucată (cu TVA)
  totalAmount: number; // Prețul total al acestei linii (quantity * unitAmount)
}

// --- DEFINIȚII DE TIP (CartContext) ---
type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: number; // Totalul întregului coș
  count: number; // Numărul total de bucăți
  isLoaded: boolean; // CRITICAL: Indicator că datele au fost încărcate din localStorage
};

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    // Aceasta se întâmplă dacă useCart este apelat în afara CartProvider
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}


export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // Stare nouă

  // 1. ÎNCĂRCAREA DATELOR (Rulează O SINGURĂ DATĂ)
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return; 
      
      const raw = localStorage.getItem("cart");
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch (e) {
        console.error("Eroare la citirea coșului din localStorage:", e);
    } finally {
        // Indiferent dacă a reușit sau nu, marcăm datele ca fiind încărcate
        setIsLoaded(true); 
    }
  }, []);

  // 2. SALVAREA DATELOR (Rulează la fiecare schimbare a 'items' ȘI după încărcarea inițială)
  useEffect(() => {
    // Salvăm doar după ce s-au încărcat datele inițiale
    if (isLoaded) { 
        try {
            localStorage.setItem("cart", JSON.stringify(items));
        } catch (e) {
            console.error("Eroare la salvarea coșului în localStorage:", e);
        }
    }
  }, [items, isLoaded]);

  // LOGICA DE ADĂUGARE
  const addItem = (item: CartItem) => {
    setItems((prev) => {
      // Căutăm dacă există deja un produs cu același ID
      const idx = prev.findIndex((p) => p.id === item.id);
      
      if (idx >= 0) {
        // Dacă ID-ul există, actualizăm cantitatea și totalul
        const copy = [...prev];
        const mergedQty = copy[idx].quantity + item.quantity;
        const unit = copy[idx].unitAmount; 
        
        copy[idx] = { 
            ...copy[idx], 
            quantity: mergedQty, 
            totalAmount: unit * mergedQty // Recalculăm totalul liniei
        };
        return copy;
      }
      // Dacă ID-ul nu există, adăugăm un nou articol
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => setItems((p) => p.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  // Calculează totalul și numărul de bucăți
  const total = useMemo(() => items.reduce((s, i) => s + i.totalAmount, 0), [items]);
  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addItem, 
        removeItem, 
        clear, 
        total, 
        count,
        isLoaded // Adaugat isLoaded în context
      }}
    >
      {children}
    </CartContext.Provider>
  );
}