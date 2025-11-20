import React from "react";
import AutocolanteConfigurator from "@/components/AutocolanteConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Autocolante și Etichete Personalizate | Print Digital & Cut",
  description: "Comandă autocolante și etichete personalizate online. Vinyl rezistent, hârtie, tăiere pe contur (die-cut). Calitate foto și livrare rapidă.",
  alternates: { canonical: "/autocolante" },
};

export default function AutocolantePage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";

  return (
    <>
      <BreadcrumbsJsonLd 
        items={[
          { name: "Acasă", url: `${base}/` }, 
          { name: "Autocolante", url: `${base}/autocolante` }
        ]} 
      />
      <AutocolanteConfigurator productSlug="autocolante" />
    </>
  );
}