import React from "react";
import FonduriEUConfigurator from "@/components/FonduriEUConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Kit Vizibilitate Fonduri Naționale | Start-Up Nation, Femeia Antreprenor",
  description: "Comandă online kitul complet de vizibilitate pentru proiecte cu finanțare națională. Plăcuțe, autocolante și afișe conform manualului de identitate vizuală.",
  alternates: { canonical: "/fonduri-nationale" },
};

export default function FonduriNationalePage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Fonduri Naționale", url: `${base}/fonduri-nationale` }]} />
      {/* Folosim același configurator, structura kit-ului fiind similară */}
      <FonduriEUConfigurator />
    </>
  );
}