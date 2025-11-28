import React, { Suspense } from "react";
import FonduriEUConfigurator from "@/components/FonduriEUConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Kit Vizibilitate PNRR | Panouri, Plăci, Autocolante",
  description: "Comandă online kitul complet de vizibilitate pentru proiecte PNRR. Materiale obligatorii conform manualului de identitate vizuală.",
  alternates: { canonical: "/fonduri-pnrr" },
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