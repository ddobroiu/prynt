import React from "react";
import ConfiguratorAlucobond from "@/components/ConfiguratorAlucobond";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata = {
  title: "Alucobond - Configurator",
  description: "Configurare plăci Alucobond (Visual Bond PE / PVDF)",
};

export default function Page() {
  const qa = [
    { question: "Este alucobondul potrivit pentru exterior?", answer: "Da, alucobondul are stabilitate și rezistență la exterior, ideal pentru panouri durabile." },
    { question: "Faceți găurire/decupare?", answer: "Da, oferim prelucrare la cerere. Specifică în detalii comandă." },
  ];
  return (
    <div>
      <ConfiguratorAlucobond />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </div>
  );
}