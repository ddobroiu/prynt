import React from "react";
import PlianteConfigurator from "@/components/PlianteConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Pliante Personalizate (Flyere Pliate) | A4, A5, DL | Prynt",
  description: "Comandă pliante publicitare online. Diverse tipuri de pliere (simplă, C, Z), hârtie 135g-250g. Calitate excelentă și prețuri mici.",
  alternates: { canonical: "/pliante" },
};

export default function PliantePage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Pliante", url: `${base}/pliante` }]} />
      <PlianteConfigurator productSlug="pliante" />
    </>
  );
}