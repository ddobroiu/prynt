import React from "react";
import AfiseConfigurator from "@/components/AfiseConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Afișe Personalizate | Print Digital Calitate Superioară",
  description: "Creează și comandă afișe personalizate online. Alege din multiple dimensiuni și materiale, de la hârtie standard la materiale speciale. Prețuri competitive și livrare rapidă.",
  alternates: { canonical: "/afise" },
};

export default function AfisePage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Afișe", url: `${base}/afise` }]} />
      <AfiseConfigurator productSlug="afise" />
    </>
  );
}