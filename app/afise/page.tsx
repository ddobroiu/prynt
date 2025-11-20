import React from "react";
import AfiseConfigurator from "@/components/AfiseConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Afișe Publicitare Personalizate | Print Digital | Prynt",
  description: "Comandă afișe publicitare (postere) online. Formate A3, A2, A1, A0, 50x70, 70x100. Hârtie lucioasă sau mată, print indoor/outdoor.",
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