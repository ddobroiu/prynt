import React from "react";
import BannerConfigurator from "@/components/BannerConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import HowToJsonLd from "@/components/HowToJsonLd";

export const metadata = {
  title: "Banner — Configurează online | Prynt",
  description: "Configurează bannerul: dimensiuni, material, finisaje și încarcă grafică. Preț instant și adaugă în coș.",
  alternates: { canonical: "/banner" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Banner", url: `${base}/banner` }]} />
      <ServiceJsonLd name="Bannere publicitare" url={`${base}/banner`} />
      <HowToJsonLd
        name="Cum comanzi un banner la Prynt"
        steps={[
          { name: "Alege dimensiunea și materialul", text: "Completează lățimea/înălțimea și selectează materialul." },
          { name: "Configurează finisajele", text: "Alege tiv, capse sau alte opțiuni." },
          { name: "Încarcă fișierele", text: "Încarcă grafica sau lasă un link de descărcare." },
          { name: "Adaugă în coș", text: "Vezi prețul în timp real și finalizează comanda." },
        ]}
      />
      
      {/* Componenta BannerConfigurator gestionează acum întreaga pagină vizuală */}
      <BannerConfigurator />
    </>
  );
}