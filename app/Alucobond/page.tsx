import React from "react";
import ConfiguratorAlucobond from "@/components/ConfiguratorAlucobond";
import FaqJsonLd from "@/components/FaqJsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ServiceJsonLd from "@/components/ServiceJsonLd";

export const metadata = {
  title: "Alucobond - Configurator",
  description: "Configurare plăci Alucobond (Visual Bond PE / PVDF)",
  alternates: { canonical: "/alucobond" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || process.env.PUBLIC_BASE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const qa = [
    { question: "Este alucobondul potrivit pentru exterior?", answer: "Da, alucobondul are stabilitate și rezistență la exterior, ideal pentru panouri durabile." },
    { question: "Faceți găurire/decupare?", answer: "Da, oferim prelucrare la cerere. Specifică în detalii comandă." },
  ];
  return (
    <div>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Alucobond", url: `${base}/alucobond` }]} />
      <ServiceJsonLd name="Print pe Alucobond / panouri compozite" url={`${base}/alucobond`} />
      <ConfiguratorAlucobond />
      <FaqAccordion qa={qa} />
      <FaqJsonLd qa={qa} />
    </div>
  );
}