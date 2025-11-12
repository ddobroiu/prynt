import React from "react";
import BannerVersoConfigurator from "@/components/BannerVersoConfigurator";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Banner Verso — Configurator",
  description: "Configurează un banner verso personalizat",
  alternates: { canonical: "/banner-verso" },
};

export default function BannerVersoPage() {
  // server component wrapping client configurator
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Ce este bannerul față-verso?", answer: "Banner printat pe material opac (blockout) vizibil pe ambele fețe, ideal pentru suspendare." },
  { question: "Termen de livrare?", answer: "Termen total (producție + livrare): 24–48 ore. Urgențe posibile la cerere." },
    { question: "Ce finisări oferim?", answer: "Tiv și capse, buzunare pentru bară, personalizabile în configurator sau la cerere." },
  ];
  return (
    <div>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Banner Verso", url: `${base}/banner-verso` }]} />
      <BannerVersoConfigurator productSlug="banner-verso" />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </div>
  );
}