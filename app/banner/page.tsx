import React from "react";
import BannerConfigurator from "@/components/BannerConfigurator";
import InStockScroller from "@/components/InStockScroller";
import { PRODUCTS } from "@/lib/products";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";

export const metadata = {
  title: "Banner — Configurează online | Prynt",
  description: "Configurează bannerul: dimensiuni, material, finisaje și încarcă grafică. Preț instant și adaugă în coș.",
};

export default function Page() {
  // Server page that reuses the client BannerConfigurator.
  // We intentionally DO NOT render any visible header here to avoid duplication
  // — the BannerConfigurator component is responsible for showing the page title/UI.
  const qa = [
    { question: "Ce rezoluție este recomandată pentru bannere?", answer: "Recomandăm 100–150 dpi la scara 1:1 pentru vizualizare de la distanță. Acceptăm PDF/AI/PSD/JPG/PNG." },
  { question: "Care este termenul de producție?", answer: "Termen total (producție + livrare): 24–48 ore. Urgențele se pot prioritiza la cerere." },
    { question: "Faceți capse și tiv?", answer: "Da, oferim tiv și capse la distanțe standard sau la cerere. Alege opțiunile în configurator." },
    { question: "Pot primi BAT înainte de print?", answer: "Da, la cerere trimitem BAT digital. Corecții minore sunt gratuite; DTP complex la cerere." },
    { question: "Metode de plată?", answer: "Ramburs la curier sau card online securizat. Factura este emisă electronic." },
  ];
  return (
    <main style={{ padding: 16 }}>
      <section>
        <BannerConfigurator />
      </section>
      {/* Produse similare section removed as requested */}

      {/* Optional SEO/extra content can go here, but not the visual H1 to avoid duplication */}
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </main>
  );
}