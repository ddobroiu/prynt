import React from "react";
import BannerConfigurator from "@/components/BannerConfigurator";

export const metadata = {
  title: "Banner — Configurează online | Prynt",
  description: "Configurează bannerul: dimensiuni, material, finisaje și încarcă grafică. Preț instant și adaugă în coș.",
};

export default function Page() {
  // Server page that reuses the client BannerConfigurator.
  // We intentionally DO NOT render any visible header here to avoid duplication
  // — the BannerConfigurator component is responsible for showing the page title/UI.
  return (
    <main style={{ padding: 16 }}>
      <section>
        <BannerConfigurator />
      </section>

      {/* Optional SEO/extra content can go here, but not the visual H1 to avoid duplication */}
    </main>
  );
}