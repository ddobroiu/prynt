import React from "react";
import ConfiguratorPolipropilena from "@/components/ConfiguratorPolipropilena";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Polipropilenă Celulară (Akylux) | Panouri Imobiliare",
  description: "Print pe polipropilenă celulară, materialul standard pentru panouri imobiliare 'DE VÂNZARE'. Ușor, ieftin, rezistent la exterior.",
  alternates: { canonical: "/materiale/polipropilena" },
};

export default function PolipropilenaPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Polipropilenă", url: `${base}/materiale/polipropilena` }]} />
      <ConfiguratorPolipropilena productSlug="polipropilena" />
    </>
  );
}