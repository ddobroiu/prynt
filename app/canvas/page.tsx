import React from "react";
import CanvasConfigurator from "@/components/CanvasConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";

export const metadata = {
  title: "Canvas — Configurează online | Prynt",
  description: "Configurează canvas: dimensiuni, material, ramă și încarcă grafică. Preț instant și adaugă în coș.",
};

export default function Page() {
  return (
    <main style={{ padding: 16 }}>
      <section>
        <CanvasConfigurator />
      </section>
      <FaqJsonLd
        qa={[
          { question: "Ce fișiere acceptați pentru canvas?", answer: "PDF/AI/PSD/JPG/PNG. Pentru rezultate bune, recomandăm imagini mari sau vectoriale." },
          { question: "Adăugați ramă?", answer: "Da, poți alege ramă din configurator. Întindem canvasul pe șasiu din lemn." },
          { question: "Termene și livrare", answer: "Producție 1–2 zile lucrătoare, livrare în 24–48h cu DPD." },
        ]}
      />
    </main>
  );
}