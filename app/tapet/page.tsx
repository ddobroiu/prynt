import React from "react";
import TapetConfigurator from "@/components/TapetConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Tapet Personalizat | Print Digital HD | Decor Pereți",
  description: "Transformă pereții cu tapet personalizat. Printam orice imagine sau grafică la dimensiunile dorite. Materiale premium, lavabile.",
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