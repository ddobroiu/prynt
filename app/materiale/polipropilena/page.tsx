import React from "react";
import ConfiguratorPolipropilena from "@/components/ConfiguratorPolipropilena";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Plăci Polipropilenă Celulară (Akyplac) | Print Digital",
  description: "Comandă panouri din polipropilenă (Akyplac). Material ușor, structură tip fagure, rezistent la apă. Ideal pentru panouri imobiliare și șantier.",
  alternates: { canonical: "/materiale/polipropilena" },
};

export default function PolipropilenaPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Materiale", url: `${base}/materiale` }, { name: "Polipropilenă", url: `${base}/materiale/polipropilena` }]} />
      <ConfiguratorPolipropilena productSlug="polipropilena" />
    </>
  );
}