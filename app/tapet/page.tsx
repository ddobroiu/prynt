import React from "react";
import TapetConfigurator from "@/components/TapetConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import HowToJsonLd from "@/components/HowToJsonLd";
import HowToSection from "@/components/HowToSection";
import RevealBlock from "@/components/RevealBlock";
import CategorySeoContent from "@/components/CategorySeoContent";

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
      <ServiceJsonLd name="Tapet personalizat" url={`${base}/tapet`} />
      <HowToJsonLd
        name="Cum comanzi tapet personalizat"
        steps={[
          { name: "Măsoară peretele", text: "Notează lățimea și înălțimea utile, adaugă o marjă de siguranță." },
          { name: "Alege materialul", text: "Tapet texturat/lavabil în funcție de spațiu și întreținere." },
          { name: "Încarcă designul", text: "PDF/AI/PSD/JPG/PNG; recomandat fișier mare pentru claritate." },
          { name: "Preț & comandă", text: "Vezi prețul instant și finalizează." },
          { name: "Livrare 24–48h", text: "Ambalare și livrare rapidă." },
        ]}
      />
      <section>
        <TapetConfigurator />
      </section>
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
      <RevealBlock buttonLabel="Cum comand?">
        <HowToSection
          title="Cum comanzi tapet personalizat"
          steps={[
            "Măsoară peretele (lățime × înălțime)",
            "Alege materialul potrivit (texturat/lavabil)",
            "Încarcă designul",
            "Preț instant și adaugă în coș",
            "Finalizează – livrare 24–48h",
          ]}
        />
      </RevealBlock>
      <RevealBlock buttonLabel="Citește mai mult">
        <CategorySeoContent kind="tapet" />
      </RevealBlock>
    </main>
  );
}