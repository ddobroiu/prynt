"use client";

import React from "react";
import PlianteConfigurator from "@/components/PlianteConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import HowToJsonLd from "@/components/HowToJsonLd";
import HowToSection from "@/components/HowToSection";
import RevealBlock from "@/components/RevealBlock";
import CategorySeoContent from "@/components/CategorySeoContent";

export default function PliantePage() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Ce formate și plieri aveți pentru pliante?", answer: "Formate uzuale (A6–A4) și plieri diverse (bi/tri pli). Alege din configurator." },
  { question: "Termen de producție și livrare", answer: "Termen total (producție + livrare): 24–48 ore. Urgențe la cerere." },
    { question: "Fișiere acceptate", answer: "PDF/AI/PSD/JPG/PNG. Verificăm gratuit fișierele înainte de tipar." },
  ];
  return (
    <main className="page py-10">
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Pliante", url: `${base}/pliante` }]} />
      <ServiceJsonLd name="Pliante personalizate" url={`${base}/pliante`} />
      <HowToJsonLd
        name="Cum comanzi pliante"
        steps={[
          { name: "Alege formatul și plierea", text: "Formate A6–A4; bi pli, tri pli etc. în funcție de conținut." },
          { name: "Selectează gramaj și finisaj", text: "130–300 g, lucios/mat; opțional plastifiere." },
          { name: "Încarcă fișierele", text: "PDF/AI/PSD/JPG/PNG acceptate. Verificare gratuită." },
          { name: "Preț instant și comandă", text: "Vezi prețul în timp real și finalizează comanda." },
          { name: "Livrare 24–48h", text: "Tipărire rapidă și livrare în toată țara." },
        ]}
      />
      <PlianteConfigurator />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
      <RevealBlock buttonLabel="Cum comand?">
        <HowToSection
          title="Cum comanzi pliante"
          steps={[
            "Alege formatul (A6–A4) și tipul de pliere",
            "Selectează gramajul hârtiei și finisajul",
            "Încarcă fișierele (PDF/AI/PSD/JPG/PNG)",
            "Vezi prețul instant și adaugă în coș",
            "Finalizează – livrare 24–48h",
          ]}
        />
      </RevealBlock>
      <RevealBlock buttonLabel="Citește mai mult">
        <CategorySeoContent kind="pliante" />
      </RevealBlock>
    </main>
  );
}