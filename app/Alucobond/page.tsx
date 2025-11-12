import React from "react";
import ConfiguratorAlucobond from "@/components/ConfiguratorAlucobond";
import FaqJsonLd from "@/components/FaqJsonLd";

export const metadata = {
  title: "Alucobond - Configurator",
  description: "Configurare plăci Alucobond (Visual Bond PE / PVDF)",
};

export default function Page() {
  return (
    <div>
      <ConfiguratorAlucobond />
      <FaqJsonLd
        qa={[
          { question: "Este alucobondul potrivit pentru exterior?", answer: "Da, alucobondul are stabilitate și rezistență la exterior, ideal pentru panouri durabile." },
          { question: "Faceți găurire/decupare?", answer: "Da, oferim prelucrare la cerere. Specifică în detalii comandă." },
        ]}
      />
    </div>
  );
}