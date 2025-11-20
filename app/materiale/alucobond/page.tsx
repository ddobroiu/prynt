import React from "react";
import ConfiguratorAlucobond from "@/components/ConfiguratorAlucobond";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Panouri Alucobond (Bond) Personalizate | Print UV | Prynt",
  description: "Print digital pe plăci compozite din aluminiu (bond). Ideal pentru firme luminoase, placări fațade, panouri rezistente la exterior.",
  alternates: { canonical: "/materiale/alucobond" },
};

export default function AlucobondPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Alucobond", url: `${base}/materiale/alucobond` }]} />
      <ConfiguratorAlucobond productSlug="alucobond" />
    </>
  );
}