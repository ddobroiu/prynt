import React from "react";
import AfiseConfigurator from "@/components/AfiseConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Afișe — Print digital | Prynt",
  description: "Alege formatul A3..A0 sau S5/S7, materiale Blueback / Whiteback / Satin / Foto sau hârtie 150/300 g (lucioasă/mată). Preț instant și adaugă în coș.",
  alternates: { canonical: "/afise" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Cum încarc grafica pentru afișe?", answer: "Poți încărca fișiere PDF/AI/PSD/JPG/PNG direct în configurator sau ne poți lăsa un link de descărcare (Drive/WeTransfer). Verificăm gratuit fișierele înainte de print." },
  { question: "Care este termenul de livrare?", answer: "Termen total (producție + livrare): 24–48 ore. Pentru urgențe, contactează-ne pentru prioritizare." },
    { question: "Primesc o probă (BAT) înainte de tipar?", answer: "La cerere, trimitem BAT digital pentru confirmare. Corecțiile simple sunt gratuite; DTP avansat se oferă la cerere." },
    { question: "Cum aleg dimensiunea corectă?", answer: "Selectează din configurator formatul dorit (A3–A0, S5/S7 etc.). Prețul se actualizează instant. Pentru recomandări, scrie-ne." },
    { question: "Ce metode de plată acceptați?", answer: "Poți plăti ramburs la curier sau online cu cardul (plată securizată). Factura o primești electronic." },
    { question: "Se pot returna afișele personalizate?", answer: "Produsele personalizate nu se returnează, dar remediem rapid orice neconformitate conform legislației în vigoare." },
  ];
  return (
    <main style={{ padding: 16 }}>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Afișe", url: `${base}/afise` }]} />
      <section>
        <AfiseConfigurator />
      </section>
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </main>
  );
}