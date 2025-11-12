import React from "react";
import ConfiguratorPolipropilena from "@/components/ConfiguratorPolipropilena";
import FaqJsonLd from "@/components/FaqJsonLd";

export const metadata = {
  title: "Polipropilenă - Configurator",
  description: "Configurare Akyplac Alb (polipropilenă) 3mm / 5mm",
};

export default function Page() {
  return (
    <div>
      <ConfiguratorPolipropilena />
      <FaqJsonLd
        qa={[
          { question: "Pentru ce este potrivită polipropilena celulară?", answer: "Pentru panouri temporare, semnalistică ușoară, display-uri. Rezistentă și ușoară." },
          { question: "Se poate printa pe ambele fețe?", answer: "Da, putem printa față/verso conform cerințelor. Specifică în comandă." },
        ]}
      />
    </div>
  );
}