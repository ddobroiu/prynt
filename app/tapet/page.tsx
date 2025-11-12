import React from "react";
import TapetConfigurator from "@/components/TapetConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata = {
  title: "Tapet — Configurator",
  description: "Configurează Tapet Dreamscape: dimensiuni, material, finisaje și încarcă grafică. Preț instant și adaugă în coș.",
  alternates: { canonical: "/tapet" },
};

export default function Page() {
  const qa = [
    { question: "Pe ce suprafețe se aplică tapetul?", answer: "Pe pereți curați, netezi și amorsați. Urmează indicațiile de montaj ale adezivului folosit." },
    { question: "Se poate curăța?", answer: "Tapetele lavabile permit ștergere ușoară. Verifică specificațiile materialului ales." },
  { question: "Termene și livrare", answer: "Termen total (producție + livrare): 24–48 ore." },
  ];
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  return (
    <main style={{ padding: 16 }}>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Tapet", url: `${base}/tapet` }]} />
      <section>
        <TapetConfigurator />
      </section>
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </main>
  );
}