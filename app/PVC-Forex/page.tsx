import React from "react";
import ConfiguratorPVCForex from "@/components/ConfiguratorPVCForex";
import FaqJsonLd from "@/components/FaqJsonLd";

export const metadata = {
  title: "PVC Forex - Configurator",
  description: "Configurare plăci PVC Forex (PVC spumă)",
};

export default function Page() {
  return (
    <div>
      <ConfiguratorPVCForex />
      <FaqJsonLd
        qa={[
          { question: "Ce grosimi de PVC Forex aveți?", answer: "În mod uzual 3–10 mm, în funcție de stoc și aplicație. Selectează în configurator sau cere oferta." },
          { question: "Este potrivit pentru exterior?", answer: "PVC Forex este potrivit mai ales pentru interior; pentru exterior sugerăm materiale rigide alternative (alucobond) sau laminare potrivită." },
        ]}
      />
    </div>
  );
}