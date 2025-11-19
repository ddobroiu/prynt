import React from "react";
import FonduriEUConfigurator from "@/components/FonduriEUConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Kit Vizibilitate Regio (POR) | Panouri și Plăci Permanente",
  description: "Comandă online kitul de vizibilitate pentru proiecte finanțate prin Programul Operațional Regional (Regio). Panouri, autocolante și comunicate conforme.",
  alternates: { canonical: "/fonduri-regio" },
};

export default function FonduriRegioPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Fonduri Regio", url: `${base}/fonduri-regio` }]} />
      <FonduriEUConfigurator />
    </>
  );
}