import React from "react";
import ConfiguratorPVCForex from "@/components/ConfiguratorPVCForex";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Plăci PVC (Forex) Personalizate | Print Direct UV | Prynt",
  description: "Print digital pe plăci PVC expandat (Forex). Material ușor, perfect pentru signalistică indoor, panouri expoziționale, decor.",
  alternates: { canonical: "/materiale/pvc-forex" },
};

export default function PVCForexPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "PVC Forex", url: `${base}/materiale/pvc-forex` }]} />
      <ConfiguratorPVCForex productSlug="pvc-forex" />
    </>
  );
}