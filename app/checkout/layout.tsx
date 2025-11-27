import React from "react";
import { Metadata } from "next";
import CheckoutProvider from "@/components/CheckoutProvider"; // Asigură-te că ai acest provider sau șterge-l dacă nu e folosit

export const metadata: Metadata = {
  title: "Finalizare Comandă | Prynt.ro",
  description: "Completează datele de livrare și facturare pentru a finaliza comanda pe Prynt.ro.",
  robots: {
    index: false, // Recomandat: Nu vrem ca pagina de checkout să apară în Google
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
        {/* Dacă ai nevoie de un Provider specific pentru checkout (ex: Stripe Elements), îl pui aici */}
        {children}
    </div>
  );
}