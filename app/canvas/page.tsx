import React from "react";
import CanvasConfigurator from "@/components/CanvasConfigurator";

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
    </main>
  );
}