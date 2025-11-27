import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finalizare Comandă | Prynt.ro",
  description: "Completează datele de livrare și facturare pentru a finaliza comanda pe Prynt.ro.",
  robots: {
    index: false,
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
        {children}
    </div>
  );
}