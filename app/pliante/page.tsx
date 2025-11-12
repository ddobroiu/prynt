"use client";

import React from "react";
import PlianteConfigurator from "@/components/PlianteConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";

export default function PliantePage() {
  return (
    <main className="page py-10">
      <PlianteConfigurator />
      <FaqJsonLd
        qa={[
          { question: "Ce formate și plieri aveți pentru pliante?", answer: "Formate uzuale (A6–A4) și plieri diverse (bi/tri pli). Alege din configurator." },
          { question: "Termen de producție și livrare", answer: "1–2 zile lucrătoare producție, 24–48h livrare. Urgențe la cerere." },
          { question: "Fișiere acceptate", answer: "PDF/AI/PSD/JPG/PNG. Verificăm gratuit fișierele înainte de tipar." },
        ]}
      />
    </main>
  );
}