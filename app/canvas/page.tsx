import React from "react";
import CanvasConfigurator from "@/components/CanvasConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import HowToJsonLd from "@/components/HowToJsonLd";
import HowToSection from "@/components/HowToSection";
import RevealBlock from "@/components/RevealBlock";
import CategorySeoContent from "@/components/CategorySeoContent";

export const metadata = {
  title: "Canvas — Configurează online | Prynt",
  description: "Configurează canvas: dimensiuni, material, ramă și încarcă grafică. Preț instant și adaugă în coș.",
  alternates: { canonical: "/canvas" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Ce fișiere acceptați pentru canvas?", answer: "PDF/AI/PSD/JPG/PNG. Pentru rezultate bune, recomandăm imagini mari sau vectoriale." },
    { question: "Adăugați ramă?", answer: "Da, poți alege ramă din configurator. Întindem canvasul pe șasiu din lemn." },
  { question: "Termene și livrare", answer: "Termen total (producție + livrare): 24–48 ore." },
  ];
  return (
    <main className="page py-10">
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Canvas", url: `${base}/canvas` }]} />
      <ServiceJsonLd name="Tablouri canvas" url={`${base}/canvas`} />
      <HowToJsonLd
        name="Cum comanzi tablouri canvas"
        steps={[
          { name: "Alege dimensiunea", text: "Selectează dimensiunea dorită sau introdu una personalizată." },
          { name: "Alege șasiul/ramă", text: "Opțional ramă; canvas întins pe șasiu din lemn." },
          { name: "Încarcă imaginea", text: "PDF/AI/PSD/JPG/PNG – recomandat fișiere mari pentru claritate." },
          { name: "Preț & comandă", text: "Vezi prețul instant și finalizează." },
          { name: "Livrare 24–48h", text: "Ambalare sigură și livrare rapidă." },
        ]}
      />
      <section>
        <CanvasConfigurator />
      </section>
      <section className="mt-6 md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-2">
          <FaqAccordion qa={qa} fullWidth />
          <FaqJsonLd qa={qa} />
        </div>
        <aside className="mt-4 md:mt-0 space-y-4">
          <RevealBlock buttonLabel="Cum comand?">
            <HowToSection
              title="Cum comanzi tablouri canvas"
              steps={[
                "Alege dimensiunea potrivită",
                "Selectează șasiul/ramă (opțional)",
                "Încarcă imaginea",
                "Vezi prețul instant și adaugă în coș",
                "Finalizează – livrare 24–48h",
              ]}
            />
          </RevealBlock>
          <RevealBlock buttonLabel="Citește mai mult">
            <CategorySeoContent kind="canvas" />
          </RevealBlock>
        </aside>
      </section>
    </main>
  );
}