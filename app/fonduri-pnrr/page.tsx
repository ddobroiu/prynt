import React from "react";
import FonduriEUConfigurator from "@/components/FonduriEUConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Kit Vizibilitate PNRR | Panouri, Plăci, Autocolante",
  description: "Comandă online kitul complet de vizibilitate pentru proiecte PNRR. Materiale obligatorii conform manualului de identitate vizuală: comunicate, afișe, plăci permanente.",
  alternates: { canonical: "/fonduri-pnrr" },
};

export default function FonduriPnrrPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Fonduri PNRR", url: `${base}/fonduri-pnrr` }]} />
      <FonduriEUConfigurator />
    </>
  );
}