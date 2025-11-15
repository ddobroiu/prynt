import React from "react";
import PlianteConfigurator from "@/components/PlianteConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pliante Personalizate | Tipar Pliante Online",
  description: "Creează și comandă pliante personalizate pentru afacerea ta. Alege tipul de împăturire, grosimea hârtiei și încarcă designul tău. Calitate superioară și livrare rapidă.",
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