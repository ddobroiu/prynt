"use client";

import React from "react";
import PlianteConfigurator from "@/components/PlianteConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";

export default function PliantePage() {
  const qa = [
    { question: "Ce formate și plieri aveți pentru pliante?", answer: "Formate uzuale (A6–A4) și plieri diverse (bi/tri pli). Alege din configurator." },
  { question: "Termen de producție și livrare", answer: "Termen total (producție + livrare): 24–48 ore. Urgențe la cerere." },
    { question: "Fișiere acceptate", answer: "PDF/AI/PSD/JPG/PNG. Verificăm gratuit fișierele înainte de tipar." },
  ];
  return (
    <main className="page py-10">
      <PlianteConfigurator />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </main>
  );
}