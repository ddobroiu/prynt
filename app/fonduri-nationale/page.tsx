import React, { Suspense } from "react";
import FonduriEUConfigurator from "@/components/FonduriEUConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Kit Vizibilitate Fonduri Naționale | Start-Up Nation",
  description: "Panouri și plăci permanente pentru proiecte cu finanțare națională (Start-Up Nation, Femeia Antreprenor, IMM Invest). Conforme cu regulamentele de vizibilitate.",
  keywords: [
    "panouri start-up nation",
    "kit vizibilitate fonduri naționale",
    "materiale start-up",
    "femeia antreprenor panouri",
    "IMM invest vizibilitate",
    "fonduri naționale românia",
    "plăci permanente proiecte"
  ],
  alternates: { canonical: "/fonduri-nationale" },
  openGraph: {
    title: "Kit Vizibilitate Fonduri Naționale | Start-Up Nation",
    description: "Panouri și plăci permanente pentru proiecte cu finanțare națională (Start-Up Nation, Femeia Antreprenor).",
    images: [{
      url: "/products/banner/banner-1.webp",
      width: 1200,
      height: 630,
      alt: "Kit vizibilitate fonduri naționale"
    }],
    type: "website"
  }
};

export default function FonduriNationalePage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <main className="min-h-screen bg-gray-50">
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Fonduri Naționale", url: `${base}/fonduri-nationale` }]} />
      
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <FonduriEUConfigurator />
      </Suspense>
    </main>
  );
}