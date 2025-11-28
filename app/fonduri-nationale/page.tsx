import React, { Suspense } from "react";
import FonduriEUConfigurator from "@/components/FonduriEUConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Kit Vizibilitate Fonduri Naționale | Start-Up Nation",
  description: "Panouri și plăci permanente pentru proiecte cu finanțare națională (Start-Up Nation, Femeia Antreprenor).",
  alternates: { canonical: "/fonduri-nationale" },
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