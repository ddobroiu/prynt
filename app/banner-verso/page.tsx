import React from "react";
import BannerVersoConfigurator from "@/components/BannerVersoConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";

export const metadata = {
  title: "Banner Verso — Configurator",
  description: "Configurează un banner verso personalizat",
};

export default function BannerVersoPage() {
  // server component wrapping client configurator
  return (
    <div>
      <BannerVersoConfigurator productSlug="banner-verso" />
      <FaqJsonLd
        qa={[
          { question: "Ce este bannerul față-verso?", answer: "Banner printat pe material opac (blockout) vizibil pe ambele fețe, ideal pentru suspendare." },
          { question: "Termen de livrare?", answer: "Producție 1–2 zile, livrare 24–48h. Urgențe posibile la cerere." },
          { question: "Ce finisări oferim?", answer: "Tiv și capse, buzunare pentru bară, personalizabile în configurator sau la cerere." },
        ]}
      />
    </div>
  );
}