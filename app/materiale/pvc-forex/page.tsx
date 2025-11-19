import React from "react";
import ConfiguratorPVCForex from "@/components/ConfiguratorPVCForex";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Plăci PVC Forex Personalizate | Print Digital UV",
  description: "Comandă plăci din PVC expandat (Forex) personalizate. Material ușor și rigid, ideal pentru panouri publicitare, signalistică și decorări.",
  alternates: { canonical: "/materiale/pvc-forex" },
};

export default function PVCForexPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd 
        items={[
          { name: "Acasă", url: `${base}/` }, 
          { name: "Materiale", url: `${base}/materiale` }, 
          { name: "PVC Forex", url: `${base}/materiale/pvc-forex` }
        ]} 
      />
      <ConfiguratorPVCForex productSlug="pvc-forex" productType="pvc-forex" />
    </>
  );
}