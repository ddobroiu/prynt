import React from "react";
import ConfiguratorAlucobond from "@/components/ConfiguratorAlucobond";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import HowToJsonLd from "@/components/HowToJsonLd";

export const metadata = {
  title: "Alucobond — Configurează online | Prynt",
  description: "Configurează alucobond: dimensiuni, material, finisaje și încarcă grafică. Preț instant și adaugă în coș.",
  alternates: { canonical: "/alucobond" },
};

export default function Page() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Alucobond", url: `${base}/alucobond` }]} />
      <ServiceJsonLd name="Plăci Alucobond" url={`${base}/alucobond`} />
      <HowToJsonLd
        name="Cum comanzi o placă de alucobond la Prynt"
        steps={[
          { name: "Alege dimensiunea și materialul", text: "Completează lățimea/înălțimea și selectează materialul." },
          { name: "Configurează finisajele", text: "Alege tiv, capse sau alte opțiuni." },
          { name: "Încarcă fișierele", text: "Încarcă grafica sau lasă un link de descărcare." },
          { name: "Adaugă în coș", text: "Vezi prețul în timp real și finalizează comanda." },
        ]}
      />
      
      {/* Componenta ConfiguratorAlucobond gestionează acum întreaga pagină vizuală */}
      <ConfiguratorAlucobond />
    </>
  );
}
