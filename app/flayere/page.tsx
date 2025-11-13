"use client";

import React from "react";
import FlyerConfigurator from "@/components/FlyerConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import HowToJsonLd from "@/components/HowToJsonLd";
import HowToSection from "@/components/HowToSection";
import RevealBlock from "@/components/RevealBlock";
import CategorySeoContent from "@/components/CategorySeoContent";

export default function FlyerePage() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Ce gramaje și finisaje sunt disponibile?", answer: "Gramaje uzuale 130–300 g, lucios sau mat. Plastifiere la cerere." },
    { question: "Cum trimit fișierele corecte?", answer: "PDF cu bleed și margini de siguranță. Acceptăm și AI/PSD/JPG/PNG. Verificăm gratuit fișierele." },
  { question: "Termen de livrare?", answer: "Termen total (producție + livrare): 24–48 ore. Urgențe la cerere." },
  ];
  return (
    <main className="page py-10">
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Flyere", url: `${base}/flayere` }]} />
      <ServiceJsonLd name="Flyere promoționale" url={`${base}/flayere`} />
      <HowToJsonLd
        name="Cum comanzi flyere"
        steps={[
          { name: "Alege formatul", text: "Formate uzuale A6/A5/A4 în funcție de mesaj și buget." },
          { name: "Selectează hârtia și finisajul", text: "130–300 g, lucios sau mat, opțional plastifiere." },
          { name: "Încarcă fișierele", text: "PDF/AI/PSD/JPG/PNG acceptate. Verificare gratuită." },
          { name: "Preț instant și comandă", text: "Vezi prețul în timp real și finalizează comanda." },
          { name: "Livrare 24–48h", text: "Tipărire rapidă și livrare națională." },
        ]}
      />
      <FlyerConfigurator />
      <section className="mt-6 md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-2">
          <FaqAccordion qa={qa} fullWidth />
          <FaqJsonLd qa={qa} />
        </div>
        <aside className="mt-4 md:mt-0 space-y-4">
          <RevealBlock buttonLabel="Cum comand?">
            <HowToSection
              title="Cum comanzi flyere"
              steps={[
                "Alege formatul dorit (A6/A5/A4)",
                "Selectează hârtia și finisajul",
                "Încarcă fișierele sau adaugă linkul",
                "Vezi prețul instant și adaugă în coș",
                "Finalizează – livrare 24–48h",
              ]}
            />
          </RevealBlock>
          <RevealBlock buttonLabel="Citește mai mult">
            <CategorySeoContent kind="flayere" />
          </RevealBlock>
        </aside>
      </section>
    </main>
  );
}