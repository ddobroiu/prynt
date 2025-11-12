"use client";

// Use the canonical CartProvider implementation (CartContext) so the whole app
// shares a single cart instance and the header updates live.
import { CartProvider } from "./CartContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}