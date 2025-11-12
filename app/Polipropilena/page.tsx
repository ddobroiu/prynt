import React from "react";
import ConfiguratorPolipropilena from "@/components/ConfiguratorPolipropilena";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Polipropilenă - Configurator",
  description: "Configurare Akyplac Alb (polipropilenă) 3mm / 5mm",
  alternates: { canonical: "/polipropilena" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Pentru ce este potrivită polipropilena celulară?", answer: "Pentru panouri temporare, semnalistică ușoară, display-uri. Rezistentă și ușoară." },
    { question: "Se poate printa pe ambele fețe?", answer: "Da, putem printa față/verso conform cerințelor. Specifică în comandă." },
  ];
  return (
    <div>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Polipropilenă", url: `${base}/polipropilena` }]} />
      <ConfiguratorPolipropilena />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </div>
  );
}