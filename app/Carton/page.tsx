import React from "react";
import ConfiguratorCarton from "@/components/ConfiguratorCarton";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata = {
  title: "Carton - Configurator",
  description: "Configurare Carton Ondulat și Carton reciclat",
};

export default function Page() {
  const qa = [
    { question: "Ce grosimi de carton sunt disponibile?", answer: "Diverse grosimi și finisaje, conform opțiunilor din configurator. Putem recomanda în funcție de aplicație." },
    { question: "Puteți bigui/cresta cartonul?", answer: "Da, oferim finisaje la cerere. Specifică detaliile în comandă." },
  ];
  return (
    <div>
      <ConfiguratorCarton />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </div>
  );
}