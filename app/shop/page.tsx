import React, { Suspense } from "react";
import ShopPageContent from "./ShopPageContent";

export const metadata = {
  title: "Shop – Toate Produsele | Prynt",
  description: "Explorează toate produsele noastre de tipar digital. Bannere, afișe, canvas, autocolante, materiale rigide. Configurează și comandă online cu prețuri instant și livrare rapidă.",
  keywords: [
    "shop tipar digital",
    "produse print",
    "magazin online",
    "bannere afișe canvas",
    "autocolante materiale",
    "comandă online",
    "configuratoare instant",
    "livrare rapidă"
  ],
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop – Toate Produsele | Prynt",
    description: "Explorează toate produsele noastre de tipar digital. Bannere, afișe, canvas, autocolante, materiale rigide. Configurează și comandă online.",
    type: "website",
    images: [{
      url: "/products/banner/1.webp",
      width: 1200,
      height: 630,
      alt: "Shop Prynt - Produse tipar digital"
    }]
  }
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container py-20 text-center">Se încarcă produsele...</div>}>
      <ShopPageContent />
    </Suspense>
  );
}