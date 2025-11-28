import React, { Suspense } from "react";
import ConfiguratorPVCForex from "@/components/ConfiguratorPVCForex";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Print pe PVC Forex | Plăci Rigide Personalizate",
  description: "Panouri PVC Forex printate direct UV. Grosimi 1-10mm. Ideale pentru semnalistică, tablouri și panouri de expoziție.",
  alternates: { canonical: "/materiale/pvc-forex" },
};

export default async function PvcForexPage() {
  const product = getProductBySlug("pvc-forex");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro"}/materiale/pvc-forex`;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}
      
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <ConfiguratorPVCForex productSlug="pvc-forex" />
      </Suspense>
    </main>
  );
}