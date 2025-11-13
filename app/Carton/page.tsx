import React from "react";
import ConfiguratorCarton from "@/components/ConfiguratorCarton";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import HowToJsonLd from "@/components/HowToJsonLd";
import HowToSection from "@/components/HowToSection";
import RevealBlock from "@/components/RevealBlock";
import CategorySeoContent from "@/components/CategorySeoContent";

export const metadata = {
  title: "Carton - Configurator",
  description: "Configurare Carton Ondulat și Carton reciclat",
  alternates: { canonical: "/carton" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Ce grosimi de carton sunt disponibile?", answer: "Diverse grosimi și finisaje, conform opțiunilor din configurator. Putem recomanda în funcție de aplicație." },
    { question: "Puteți bigui/cresta cartonul?", answer: "Da, oferim finisaje la cerere. Specifică detaliile în comandă." },
  ];
  return (
    <main className="page py-10">
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Carton", url: `${base}/carton` }]} />
      <ServiceJsonLd name="Print pe carton" url={`${base}/carton`} />
      <HowToJsonLd
        name="Cum comanzi print pe carton"
        steps={[
          { name: "Alege formatul și grosimea", text: "Selectează dimensiunea și grosimea cartonului." },
          { name: "Finisaje opționale", text: "Big/brozare/crestat/laminare după necesități (dacă sunt disponibile)." },
          { name: "Încarcă fișierul", text: "PDF/AI/PSD/JPG/PNG acceptate. Verificare gratuită." },
          { name: "Preț & adăugare în coș", text: "Vezi prețul instant și finalizează comanda." },
          { name: "Livrare 24–48h", text: "Expediere rapidă." },
        ]}
      />
      <ConfiguratorCarton />
      <section className="mt-6 md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-2">
          <FaqAccordion qa={qa} fullWidth />
          <FaqJsonLd qa={qa} />
        </div>
        <aside className="mt-4 md:mt-0 space-y-4">
          <RevealBlock buttonLabel="Cum comand?">
            <HowToSection
              title="Cum comanzi print pe carton"
              steps={[
                "Alege formatul și grosimea",
                "Selectează finisajele necesare",
                "Încarcă fișierele",
                "Preț instant și adaugă în coș",
                "Finalizează – livrare 24–48h",
              ]}
            />
          </RevealBlock>
          <RevealBlock buttonLabel="Citește mai mult">
            <CategorySeoContent kind="carton" />
          </RevealBlock>
        </aside>
      </section>
    </main>
  );
}