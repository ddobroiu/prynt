import React, { Suspense } from "react";
import FonduriEUConfigurator from "@/components/FonduriEUConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Kit Vizibilitate Regio (POR) | Panouri Temporare",
  description: "Materiale de vizibilitate pentru Programul Operațional Regional (Regio). Panouri temporare și plăci permanente conform normelor UE.",
  keywords: [
    "panouri regio",
    "kit vizibilitate POR",
    "program operațional regional",
    "materiale regio",
    "panouri temporare UE",
    "fonduri europene regio",
    "identitate vizuală POR"
  ],
  alternates: { canonical: "/fonduri-regio" },
  openGraph: {
    title: "Kit Vizibilitate Regio (POR) | Panouri Temporare",
    description: "Materiale de vizibilitate pentru Programul Operațional Regional (Regio). Panouri temporare și plăci permanente.",
    images: [{
      url: "/products/banner/banner-1.webp",
      width: 1200,
      height: 630,
      alt: "Kit vizibilitate Regio POR"
    }],
    type: "website"
  }
};

export default function FonduriRegioPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <main className="min-h-screen bg-gray-50">
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Fonduri Regio", url: `${base}/fonduri-regio` }]} />
      
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <FonduriEUConfigurator />
      </Suspense>
    </main>
  );
}