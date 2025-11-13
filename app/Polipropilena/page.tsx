import React from "react";
import ConfiguratorPolipropilena from "@/components/ConfiguratorPolipropilena";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import HowToJsonLd from "@/components/HowToJsonLd";
import HowToSection from "@/components/HowToSection";
import RevealBlock from "@/components/RevealBlock";
import CategorySeoContent from "@/components/CategorySeoContent";

export const metadata = {
  title: "Polipropilenă - Configurator",
  description: "Configurare Akyplac Alb (polipropilenă) 3mm / 5mm",
  alternates: { canonical: "/polipropilena" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Pentru ce este potrivită polipropilena celulară?", answer: "Pentru panouri temporare, semnalistică ușoară, display-uri. Rezistentă și ușoară." },
    { question: "Se poate printa pe ambele fețe?", answer: "Da, putem printa față/verso conform cerințelor. Specifică în comandă." },
  ];
  return (
    <div>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Polipropilenă", url: `${base}/polipropilena` }]} />
      <ServiceJsonLd name="Panouri din polipropilenă celulară" url={`${base}/polipropilena`} />
      <HowToJsonLd
        name="Cum comanzi panouri din polipropilenă"
        steps={[
          { name: "Alege grosimea și dimensiunea", text: "Selectează grosimea (ex. 3/5 mm) și dimensiunile panourilor." },
          { name: "Față/verso", text: "Alege printul pe o față sau pe ambele fețe în funcție de aplicație." },
          { name: "Încarcă fișierele", text: "PDF/AI/PSD/JPG/PNG; vectorial preferabil pentru text/grafice." },
          { name: "Preț & comandă", text: "Vezi prețul instant și finalizează comanda." },
          { name: "Livrare 24–48h", text: "Expediere rapidă în țară." },
        ]}
      />
      <ConfiguratorPolipropilena />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
      <RevealBlock buttonLabel="Cum comand?">
        <HowToSection
          title="Cum comanzi panouri din polipropilenă"
          steps={[
            "Alege grosimea și dimensiunile",
            "Selectează față/verso",
            "Încarcă fișierele",
            "Preț instant și adaugă în coș",
            "Finalizează – livrare 24–48h",
          ]}
        />
      </RevealBlock>
      <RevealBlock buttonLabel="Citește mai mult">
        <CategorySeoContent kind="polipropilena" />
      </RevealBlock>
    </div>
  );
}