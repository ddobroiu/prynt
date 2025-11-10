import React from "react";
import TapetConfigurator from "@/components/TapetConfigurator";

export const metadata = {
  title: "Tapet — Configurator",
  description: "Configurează Tapet Dreamscape: dimensiuni, material, finisaje și încarcă grafică. Preț instant și adaugă în coș.",
};

export default function Page() {
  return (
    <main style={{ padding: 16 }}>
      <section>
        <TapetConfigurator />
      </section>
    </main>
  );
}