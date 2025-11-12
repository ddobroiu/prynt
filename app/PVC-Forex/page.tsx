import React from "react";
import ConfiguratorPVCForex from "@/components/ConfiguratorPVCForex";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "PVC Forex - Configurator",
  description: "Configurare plăci PVC Forex (PVC spumă)",
  alternates: { canonical: "/pvc-forex" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Ce grosimi de PVC Forex aveți?", answer: "În mod uzual 3–10 mm, în funcție de stoc și aplicație. Selectează în configurator sau cere oferta." },
    { question: "Este potrivit pentru exterior?", answer: "PVC Forex este potrivit mai ales pentru interior; pentru exterior sugerăm materiale rigide alternative (alucobond) sau laminare potrivită." },
  ];
  return (
    <div>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "PVC Forex", url: `${base}/pvc-forex` }]} />
      <ConfiguratorPVCForex />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </div>
  );
}