import React from "react";
import ConfiguratorPolipropilena from "@/components/ConfiguratorPolipropilena";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata = {
  title: "Polipropilenă - Configurator",
  description: "Configurare Akyplac Alb (polipropilenă) 3mm / 5mm",
};

export default function Page() {
  const qa = [
    { question: "Pentru ce este potrivită polipropilena celulară?", answer: "Pentru panouri temporare, semnalistică ușoară, display-uri. Rezistentă și ușoară." },
    { question: "Se poate printa pe ambele fețe?", answer: "Da, putem printa față/verso conform cerințelor. Specifică în comandă." },
  ];
  return (
    <div>
      <ConfiguratorPolipropilena />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </div>
  );
}