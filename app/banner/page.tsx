import React from "react";
import BannerConfigurator from "@/components/BannerConfigurator";
import InStockScroller from "@/components/InStockScroller";
import { PRODUCTS } from "@/lib/products";
import FaqJsonLd from "@/components/FaqJsonLd";

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
      {/* Scroller with 4 products per view: show other products in the 'bannere' category */}
      <section style={{ marginTop: 24 }}>
        {(() => {
          const cat = "bannere";
          const all = (PRODUCTS || []).filter((p: any) => String(p.metadata?.category ?? p.category ?? "").toLowerCase() === cat);
          if (!all || all.length === 0) return null;
          // exclude generic templates if needed - show all for now
          return (
            <div>
          <div style={{ textAlign: "center", marginBottom: 12 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: 0.6, textTransform: "uppercase", background: "linear-gradient(90deg,#7c3aed,#6366f1)", WebkitBackgroundClip: "text", color: "transparent" }}>Produse similare</h2>
            <div style={{ height: 6 }} />
            <p style={{ margin: 0, color: "#9ca3af", fontSize: 13 }}>Vezi alte modele și dimensiuni disponibile</p>
          </div>
              <InStockScroller products={all as any} perPage={4} intervalMs={3500} />
            </div>
          );
        })()}
      </section>

      {/* Optional SEO/extra content can go here, but not the visual H1 to avoid duplication */}
      <FaqJsonLd
        qa={[
          { question: "Ce rezoluție este recomandată pentru bannere?", answer: "Recomandăm 100–150 dpi la scara 1:1 pentru vizualizare de la distanță. Acceptăm PDF/AI/PSD/JPG/PNG." },
          { question: "Care este termenul de producție?", answer: "De regulă 1–2 zile lucrătoare, apoi curier 24–48h. Urgențele se pot prioritiza la cerere." },
          { question: "Faceți capse și tiv?", answer: "Da, oferim tiv și capse la distanțe standard sau la cerere. Alege opțiunile în configurator." },
          { question: "Pot primi BAT înainte de print?", answer: "Da, la cerere trimitem BAT digital. Corecții minore sunt gratuite; DTP complex la cerere." },
          { question: "Metode de plată?", answer: "Ramburs la curier sau card online securizat. Factura este emisă electronic." },
        ]}
      />
    </main>
  );
}