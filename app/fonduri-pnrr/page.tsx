import React from "react";
import FonduriEUConfigurator from "@/components/FonduriEUConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";

export const metadata = {
  title: "Fonduri PNRR — Configurator",
  description: "Selectează pachetul pentru Fonduri PNRR: comunicate, bannere, afișe, autocolante, panouri și plăci.",
  alternates: { canonical: "/fonduri-pnrr" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Fonduri PNRR", url: `${base}/fonduri-pnrr` }]} />
      <FonduriEUConfigurator />
      <FaqJsonLd
        qa={[
          { question: "Respectă pachetul cerințele de identitate vizuală PNRR?", answer: "Da. Seturile și textele sunt conforme ghidurilor de comunicare PNRR și pot fi adaptate proiectului tău." },
          { question: "Ce intră în pachet?", answer: "Poți alege comunicate, bannere, afișe, autocolante, panouri și plăci – toate în același configurator, cu preț calculat instant." },
          { question: "Termene și livrare", answer: "Producție 1–3 zile lucrătoare, livrare 24–48h prin curier. Pentru urgențe, contactează-ne." },
          { question: "Cum trimit textele și siglele?", answer: "Încarci fișierul sau lași un link (Drive/WeTransfer). Poți scrie observații în ‘Detalii comandă’." },
        ]}
      />
    </>
  );
}
