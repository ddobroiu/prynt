import React from "react";
import ConfiguratorPlexiglass from "@/components/ConfiguratorPlexiglass";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import HowToJsonLd from "@/components/HowToJsonLd";
import HowToSection from "@/components/HowToSection";

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
      <ServiceJsonLd name="Print/decupare pe Plexiglass" url={`${base}/plexiglass`} />
      <HowToJsonLd
        name="Cum comanzi plexiglass tipărit/decupat"
        steps={[
          { name: "Alege grosimea și formatul", text: "Selectează grosimea (ex. 2–10 mm) și dimensiunile." },
          { name: "Opțiuni de finisare", text: "Găurire/decupare la cerere; menționează în detalii." },
          { name: "Încarcă fișierele", text: "PDF/AI/PSD/JPG/PNG; vectorial preferabil pentru tăieri exacte." },
          { name: "Preț & comandă", text: "Vezi prețul instant și finalizează." },
          { name: "Livrare 24–48h", text: "Ambalare sigură și livrare rapidă." },
        ]}
      />
      <ConfiguratorPlexiglass />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
      <HowToSection
        title="Cum comanzi plexiglass tipărit/decupat"
        steps={[
          "Alege grosimea și dimensiunile",
          "Adaugă cerințe de finisare (găuri/decupare)",
          "Încarcă fișierele",
          "Preț instant și adaugă în coș",
          "Finalizează – livrare 24–48h",
        ]}
      />
    </div>
  );
}