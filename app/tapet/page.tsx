import React from "react";
import TapetConfigurator from "@/components/TapetConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tapet Personalizat | Imprimare Tapet Decorativ",
  description: "Creează un decor unic cu tapet personalizat. Introdu dimensiunile peretelui, alege materialul și încarcă designul tău. Calitate superioară și montaj ușor.",
  alternates: { canonical: "/tapet" },
};

export default function TapetPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Tapet", url: `${base}/tapet` }]} />
      <TapetConfigurator productSlug="tapet" />
    </>
  );
}