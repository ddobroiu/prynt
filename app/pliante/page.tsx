"use client";

import React from "react";
import PlianteConfigurator from "@/components/PlianteConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqAccordion from "@/components/FaqAccordion";

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
      <PlianteConfigurator />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </main>
  );
}