import React from "react";
import FonduriEUConfigurator from "@/components/FonduriEUConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata = {
  title: "Fonduri REGIO — Configurator",
  description: "Selectează pachetul pentru Fonduri REGIO: comunicate, bannere, afișe, autocolante, panouri și plăci.",
  alternates: { canonical: "/fonduri-regio" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Sunt materialele conforme pentru REGIO?", answer: "Da, grafica și elementele de identificare sunt adaptate conform manualelor de identitate vizuală REGIO." },
    { question: "Pot modifica compoziția pachetului?", answer: "Da. Alege exact ce îți trebuie (comunicate, panouri, plăci etc.). Prețul se actualizează instant." },
  { question: "Termene și livrare", answer: "Termen total (producție + livrare): 24–48 ore. Urgențe la cerere." },
  ];
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Fonduri REGIO", url: `${base}/fonduri-regio` }]} />
      <FonduriEUConfigurator />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </>
  );
}
