import React from "react";
import FonduriEUConfigurator from "@/components/FonduriEUConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata = {
  title: "Fonduri Naționale — Configurator",
  description: "Selectează pachetul pentru Fonduri Naționale: comunicate, bannere, afișe, autocolante, panouri și plăci.",
  alternates: { canonical: "/fonduri-nationale" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Ce documente/grafici trebuie să ofer?", answer: "Textele obligatorii, siglele și orice cerințe specifice proiectului. Le poți încărca sau trimite prin link." },
    { question: "Pot primi o machetă pentru aprobare?", answer: "Da, la cerere trimitem BAT digital înainte de tipar. Corecțiile simple sunt gratuite." },
  { question: "Termene și livrare", answer: "Termen total (producție + livrare): 24–48 ore. Urgențe la cerere." },
  ];
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Fonduri Naționale", url: `${base}/fonduri-nationale` }]} />
      <FonduriEUConfigurator />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </>
  );
}
