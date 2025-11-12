import React from "react";
import FonduriEUConfigurator from "@/components/FonduriEUConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";

export const metadata = {
  title: "Fonduri Naționale — Configurator",
  description: "Selectează pachetul pentru Fonduri Naționale: comunicate, bannere, afișe, autocolante, panouri și plăci.",
  alternates: { canonical: "/fonduri-nationale" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Fonduri Naționale", url: `${base}/fonduri-nationale` }]} />
      <FonduriEUConfigurator />
      <FaqJsonLd
        qa={[
          { question: "Ce documente/grafici trebuie să ofer?", answer: "Textele obligatorii, siglele și orice cerințe specifice proiectului. Le poți încărca sau trimite prin link." },
          { question: "Pot primi o machetă pentru aprobare?", answer: "Da, la cerere trimitem BAT digital înainte de tipar. Corecțiile simple sunt gratuite." },
          { question: "Termene și livrare", answer: "Producție 1–3 zile, apoi 24–48h curier. Urgențe la cerere." },
        ]}
      />
    </>
  );
}
