import React from "react";
import ConfiguratorPlexiglass from "@/components/ConfiguratorPlexiglass";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Plexiglass - Configurator",
  description: "Configurare Plexiglass alb și transparent",
  alternates: { canonical: "/plexiglass" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Ce grosimi de plexiglas oferiți?", answer: "Diverse grosimi (ex. 2–10 mm) în funcție de stoc; selectează din configurator sau cere o ofertă." },
    { question: "Se poate decupa la formă?", answer: "Da, putem debita și finisa plexiglasul la cerere. Menționează în detalii comandă." },
  ];
  return (
    <div>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Plexiglass", url: `${base}/plexiglass` }]} />
      <ConfiguratorPlexiglass />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </div>
  );
}