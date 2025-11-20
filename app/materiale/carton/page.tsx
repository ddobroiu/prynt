import React from "react";
import ConfiguratorCarton from "@/components/ConfiguratorCarton";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Print pe Carton Ondulat & Mucava | Ambalaje & Standuri",
  description: "Soluții de print digital direct pe carton. Ideal pentru ambalaje personalizate, standuri POSM, decoruri evenimente. Reciclabil.",
  alternates: { canonical: "/materiale/carton" },
};

export default function CartonPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Carton", url: `${base}/materiale/carton` }]} />
      <ConfiguratorCarton productSlug="carton" />
    </>
  );
}