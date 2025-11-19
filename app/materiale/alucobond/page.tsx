import React from "react";
import ConfiguratorAlucobond from "@/components/ConfiguratorAlucobond";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Panouri Alucobond Personalizate | Print Digital UV",
  description: "Comandă panouri din Alucobond (Bond) imprimate direct. Material compozit rigid, ideal pentru fațade, reclame și signalistică durabilă.",
  alternates: { canonical: "/alucobond" },
};

export default function AlucobondPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Alucobond", url: `${base}/alucobond` }]} />
      <ConfiguratorAlucobond productSlug="alucobond" />
    </>
  );
}