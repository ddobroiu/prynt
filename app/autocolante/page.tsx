import React from "react";
import AutocolanteConfigurator from "@/components/AutocolanteConfigurator";

export const metadata = {
  title: "Autocolante — Configurează online | Prynt",
  description: "Configurează autocolante: dimensiuni, material, formă și încarcă grafică. Preț instant și adaugă în coș.",
};

export default function Page() {
  // Pagina server care reia componenta client AutocolanteConfigurator
  return (
    <main style={{ padding: 16 }}>
      <section>
        <AutocolanteConfigurator />
      </section>
    </main>
  );
}