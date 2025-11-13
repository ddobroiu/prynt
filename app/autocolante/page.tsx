import React from "react";
import AutocolanteConfigurator from "@/components/AutocolanteConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import HowToJsonLd from "@/components/HowToJsonLd";
import HowToSection from "@/components/HowToSection";
import RevealBlock from "@/components/RevealBlock";
import CategorySeoContent from "@/components/CategorySeoContent";

export const metadata = {
  title: "Autocolante — Configurează online | Prynt",
  description: "Configurează autocolante: dimensiuni, material, formă și încarcă grafică. Preț instant și adaugă în coș.",
  alternates: { canonical: "/autocolante" },
};

export default function Page() {
  // Pagina server care reia componenta client AutocolanteConfigurator
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Cum încarc grafica pentru autocolante?", answer: "În configurator poți încărca PDF/AI/PSD/JPG/PNG sau poți lăsa un link de descărcare. Verificăm gratuit fișierele." },
  { question: "Cât durează producția și livrarea?", answer: "Termen total (producție + livrare): 24–48 ore. Pentru urgențe, contactează-ne." },
    { question: "Puteți decupa la formă?", answer: "Da, putem decupa la contur conform graficii. Specifică în detalii comandă sau atașează fișier cu contur (cut path)." },
    { question: "Ce materiale folosiți?", answer: "Autocolant polimeric/monomeric cu opțiuni de laminare la cerere. Recomandăm materialul în funcție de aplicație (interior/exterior)." },
    { question: "Cum plătesc?", answer: "Ramburs la curier sau card online securizat. Factura este emisă electronic." },
    { question: "Retur pentru produse personalizate?", answer: "Produsele personalizate nu se pot returna, dar remediem orice neconformitate rapid." },
  ];
  return (
    <main className="page py-10">
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Autocolante", url: `${base}/autocolante` }]} />
      <ServiceJsonLd name="Autocolante personalizate" url={`${base}/autocolante`} />
      <HowToJsonLd
        name="Cum comanzi autocolante decupate la contur"
        steps={[
          { name: "Alege materialul", text: "Monomeric pentru campanii scurte, Polimeric pentru exterior mediu; opțional laminare mată/lucioasă." },
          { name: "Dimensiuni și formă", text: "Setează dimensiunea și descrie forma sau include un cut-path în fișier." },
          { name: "Încarcă fișierele", text: "PDF/AI/PSD/JPG/PNG acceptate. Verificare gratuită." },
          { name: "Preț instant și comandă", text: "Vezi prețul în timp real și finalizează comanda." },
          { name: "Livrare 24–48h", text: "Procesare rapidă și livrare oriunde în țară." },
        ]}
      />
      <section>
        <AutocolanteConfigurator />
      </section>
      <section className="mt-6 md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-2">
          <FaqAccordion qa={qa} fullWidth />
          <FaqJsonLd qa={qa} />
        </div>
        <aside className="mt-4 md:mt-0 space-y-4">
          <RevealBlock buttonLabel="Cum comand?">
            <HowToSection
              title="Cum comanzi autocolante"
              steps={[
                "Alege materialul (monomeric/polimeric) și opțional laminarea",
                "Setează dimensiunea și forma (inclusiv cut-path)",
                "Încarcă fișierele sau adaugă linkul",
                "Vezi prețul instant și adaugă în coș",
                "Finalizează – livrare 24–48h",
              ]}
            />
          </RevealBlock>
          <RevealBlock buttonLabel="Citește mai mult">
            <CategorySeoContent kind="autocolante" />
          </RevealBlock>
        </aside>
      </section>
    </main>
  );
}