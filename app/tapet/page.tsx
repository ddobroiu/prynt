import React from "react";
import TapetConfigurator from "@/components/TapetConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";

export const metadata = {
  title: "Tapet — Configurator",
  description: "Configurează Tapet Dreamscape: dimensiuni, material, finisaje și încarcă grafică. Preț instant și adaugă în coș.",
};

export default function Page() {
  return (
    <main style={{ padding: 16 }}>
      <section>
        <TapetConfigurator />
      </section>
      <FaqJsonLd
        qa={[
          { question: "Pe ce suprafețe se aplică tapetul?", answer: "Pe pereți curați, netezi și amorsați. Urmează indicațiile de montaj ale adezivului folosit." },
          { question: "Se poate curăța?", answer: "Tapetele lavabile permit ștergere ușoară. Verifică specificațiile materialului ales." },
          { question: "Termene și livrare", answer: "Producție 1–2 zile lucrătoare, livrare 24–48h." },
        ]}
      />
    </main>
  );
}