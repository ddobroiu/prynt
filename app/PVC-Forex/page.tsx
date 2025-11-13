import React from "react";
import ConfiguratorPVCForex from "@/components/ConfiguratorPVCForex";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import HowToJsonLd from "@/components/HowToJsonLd";
import HowToSection from "@/components/HowToSection";
import RevealBlock from "@/components/RevealBlock";
import CategorySeoContent from "@/components/CategorySeoContent";

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
    <main className="page py-10">
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "PVC Forex", url: `${base}/pvc-forex` }]} />
      <ServiceJsonLd name="Print pe PVC Forex" url={`${base}/pvc-forex`} />
      <HowToJsonLd
        name="Cum comanzi print pe PVC Forex"
        steps={[
          { name: "Alege grosimea și dimensiunea", text: "Selectează grosimea plăcii (ex. 3–10 mm) și dimensiunile." },
          { name: "Opțiuni de montaj", text: "Găuri/șablon la cerere, menționează în detalii comandă." },
          { name: "Încarcă fișierele", text: "PDF/AI/PSD/JPG/PNG; verificare gratuită înainte de tipar." },
          { name: "Preț & comandă", text: "Vezi prețul instant și finalizează." },
          { name: "Livrare 24–48h", text: "Expediere rapidă." },
        ]}
      />
      <ConfiguratorPVCForex />
      <section className="mt-6 md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-2">
          <FaqAccordion qa={qa} fullWidth />
          <FaqJsonLd qa={qa} />
        </div>
        <aside className="mt-4 md:mt-0 space-y-4">
          <RevealBlock buttonLabel="Cum comand?">
            <HowToSection
              title="Cum comanzi PVC Forex tipărit"
              steps={[
                "Alege grosimea și dimensiunile",
                "Adaugă opțiuni de montaj dacă e cazul",
                "Încarcă fișierele",
                "Preț instant și adaugă în coș",
                "Finalizează – livrare 24–48h",
              ]}
            />
          </RevealBlock>
          <RevealBlock buttonLabel="Citește mai mult">
            <CategorySeoContent kind="pvc-forex" />
          </RevealBlock>
        </aside>
      </section>
    </main>
  );
}