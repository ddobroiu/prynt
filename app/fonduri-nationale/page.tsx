import React from "react";
import FonduriEUConfigurator from "@/components/FonduriEUConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

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
    </>
  );
}
