import React from "react";
import FlyerConfigurator from "@/components/FlyerConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Flyere și Fluturași Publicitari | Print Digital & Offset",
  description: "Comandă flyere și fluturași publicitari online. Diverse dimensiuni (A4, A5, A6, DL) și tipuri de hârtie. Calitate superioară și livrare rapidă.",
  alternates: { canonical: "/flayere" },
};

export default function FlyerePage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Flyere", url: `${base}/flayere` }]} />
      <FlyerConfigurator productSlug="flyere" />
    </>
  );
}