import React from "react";
import CanvasConfigurator from "@/components/CanvasConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata = {
  title: "Canvas — Configurează online | Prynt",
  description: "Configurează canvas: dimensiuni, material, ramă și încarcă grafică. Preț instant și adaugă în coș.",
};

export default function Page() {
  const qa = [
    { question: "Ce fișiere acceptați pentru canvas?", answer: "PDF/AI/PSD/JPG/PNG. Pentru rezultate bune, recomandăm imagini mari sau vectoriale." },
    { question: "Adăugați ramă?", answer: "Da, poți alege ramă din configurator. Întindem canvasul pe șasiu din lemn." },
  { question: "Termene și livrare", answer: "Termen total (producție + livrare): 24–48 ore." },
  ];
  return (
    <main style={{ padding: 16 }}>
      <section>
        <CanvasConfigurator />
      </section>
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </main>
  );
}