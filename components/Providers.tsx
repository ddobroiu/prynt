"use client";

// Use the canonical CartProvider implementation (CartContext) so the whole app
// shares a single cart instance and the header updates live.
import { CartProvider } from "./CartContext";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  );
}