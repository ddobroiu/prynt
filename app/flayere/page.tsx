"use client";

import React from "react";
import FlyerConfigurator from "@/components/FlyerConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";

export default function FlyerePage() {
  return (
    <main className="page py-10">
      <FlyerConfigurator />
      <FaqJsonLd
        qa={[
          { question: "Ce gramaje și finisaje sunt disponibile?", answer: "Gramaje uzuale 130–300 g, lucios sau mat. Plastifiere la cerere." },
          { question: "Cum trimit fișierele corecte?", answer: "PDF cu bleed și margini de siguranță. Acceptăm și AI/PSD/JPG/PNG. Verificăm gratuit fișierele." },
          { question: "Termen de livrare?", answer: "1–2 zile producție + 24–48h curier. Urgențe la cerere." },
        ]}
      />
    </main>
  );
}