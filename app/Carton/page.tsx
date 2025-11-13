import React from "react";
import ConfiguratorCarton from "@/components/ConfiguratorCarton";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ServiceJsonLd from "@/components/ServiceJsonLd";

export const metadata = {
  title: "Carton - Configurator",
  description: "Configurare Carton Ondulat și Carton reciclat",
  alternates: { canonical: "/carton" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Ce grosimi de carton sunt disponibile?", answer: "Diverse grosimi și finisaje, conform opțiunilor din configurator. Putem recomanda în funcție de aplicație." },
    { question: "Puteți bigui/cresta cartonul?", answer: "Da, oferim finisaje la cerere. Specifică detaliile în comandă." },
  ];
  return (
    <div>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Carton", url: `${base}/carton` }]} />
      <ServiceJsonLd name="Print pe carton" url={`${base}/carton`} />
      <ConfiguratorCarton />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </div>
  );
}