// components/Providers.tsx
"use client";
import { CartProvider } from "./CartProvider";
// Dacă folosești și CheckoutProvider, importă-l aici

export default function Providers({ children }: { children: React.ReactNode }) {
  // Toate componentele din 'children' și 'Header' vor avea acces la CartProvider
  return <CartProvider>{children}</CartProvider>;
}