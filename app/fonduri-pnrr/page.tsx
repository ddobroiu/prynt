import React, { Suspense } from "react";
import FonduriEUConfigurator from "@/components/FonduriEUConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Kit Vizibilitate PNRR | Panouri, Plăci, Autocolante",
  description: "Comandă online kitul complet de vizibilitate pentru proiecte PNRR. Materiale obligatorii conform manualului de identitate vizuală. Panouri, plăci rigide, autocolante.",
  keywords: [
    "panouri PNRR",
    "kit vizibilitate PNRR",
    "materiale PNRR",
    "identitate vizuală PNRR",
    "proiecte PNRR",
    "fonduri europene",
    "plăci PNRR",
    "autocolante PNRR"
  ],
  alternates: { canonical: "/fonduri-pnrr" },
  openGraph: {
    title: "Kit Vizibilitate PNRR | Panouri, Plăci, Autocolante",
    description: "Comandă online kitul complet de vizibilitate pentru proiecte PNRR. Materiale obligatorii conform manualului de identitate vizuală.",
    images: [{
      url: "/products/banner/banner-1.webp",
      width: 1200,
      height: 630,
      alt: "Kit vizibilitate PNRR"
    }],
    type: "website"
  }
};

export default function FonduriPnrrPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <main className="min-h-screen bg-gray-50">
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Fonduri PNRR", url: `${base}/fonduri-pnrr` }]} />
      
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <FonduriEUConfigurator />
      </Suspense>
    </main>
  );
}