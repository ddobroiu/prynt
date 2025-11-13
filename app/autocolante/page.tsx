import React from "react";
import AutocolanteConfigurator from "@/components/AutocolanteConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ServiceJsonLd from "@/components/ServiceJsonLd";

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
    <main style={{ padding: 16 }}>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Autocolante", url: `${base}/autocolante` }]} />
      <ServiceJsonLd name="Autocolante personalizate" url={`${base}/autocolante`} />
      <section>
        <AutocolanteConfigurator />
      </section>
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </main>
  );
}