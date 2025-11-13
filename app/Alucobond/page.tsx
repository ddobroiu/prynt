import React from "react";
import ConfiguratorAlucobond from "@/components/ConfiguratorAlucobond";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import HowToJsonLd from "@/components/HowToJsonLd";
import HowToSection from "@/components/HowToSection";
import RevealBlock from "@/components/RevealBlock";
import CategorySeoContent from "@/components/CategorySeoContent";

export const metadata = {
  title: "Alucobond - Configurator",
  description: "Configurare plăci Alucobond (Visual Bond PE / PVDF)",
  alternates: { canonical: "/alucobond" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Este alucobondul potrivit pentru exterior?", answer: "Da, alucobondul are stabilitate și rezistență la exterior, ideal pentru panouri durabile." },
    { question: "Faceți găurire/decupare?", answer: "Da, oferim prelucrare la cerere. Specifică în detalii comandă." },
  ];
  return (
    <main className="page py-10">
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Alucobond", url: `${base}/alucobond` }]} />
      <ServiceJsonLd name="Print pe Alucobond / panouri compozite" url={`${base}/alucobond`} />
      <HowToJsonLd
        name="Cum comanzi panouri Alucobond"
        steps={[
          { name: "Alege grosimea și dimensiunea", text: "Selectează grosimea potrivită și dimensiunile dorite." },
          { name: "Opțiuni de prelucrare", text: "Găurire, decupare, frezare la cerere – menționează în detalii." },
          { name: "Încarcă fișierele", text: "PDF/AI/PSD/JPG/PNG; vectorial preferabil pentru tăieri exacte." },
          { name: "Preț & comandă", text: "Vezi prețul instant și finalizează." },
          { name: "Livrare 24–48h", text: "Ambalare sigură și livrare rapidă." },
        ]}
      />
      <ConfiguratorAlucobond />
      <section className="mt-6 md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-2">
          <FaqAccordion qa={qa} fullWidth />
          <FaqJsonLd qa={qa} />
        </div>
        <aside className="mt-4 md:mt-0 space-y-4">
          <RevealBlock buttonLabel="Cum comand?">
            <HowToSection
              title="Cum comanzi panouri Alucobond"
              steps={[
                "Alege grosimea și dimensiunile",
                "Adaugă opțiuni de prelucrare (găuri/decupare/frezare)",
                "Încarcă fișierele",
                "Preț instant și adaugă în coș",
                "Finalizează – livrare 24–48h",
              ]}
            />
          </RevealBlock>
          <RevealBlock buttonLabel="Citește mai mult">
            <CategorySeoContent kind="alucobond" />
          </RevealBlock>
        </aside>
      </section>
    </main>
  );
}