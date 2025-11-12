"use client";

import React from "react";
import FlyerConfigurator from "@/components/FlyerConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";

export default function FlyerePage() {
  const qa = [
    { question: "Ce gramaje și finisaje sunt disponibile?", answer: "Gramaje uzuale 130–300 g, lucios sau mat. Plastifiere la cerere." },
    { question: "Cum trimit fișierele corecte?", answer: "PDF cu bleed și margini de siguranță. Acceptăm și AI/PSD/JPG/PNG. Verificăm gratuit fișierele." },
  { question: "Termen de livrare?", answer: "Termen total (producție + livrare): 24–48 ore. Urgențe la cerere." },
  ];
  return (
    <main className="page py-10">
      <FlyerConfigurator />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </main>
  );
}