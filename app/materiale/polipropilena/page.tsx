import React, { Suspense } from "react";
import ConfiguratorPolipropilena from "@/components/ConfiguratorPolipropilena";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Print pe Polipropilenă Celulară | Panouri Ușoare",
  description: "Polipropilenă celulară (coroplast) printată. Material economic și ușor pentru panouri imobiliare și semnalistică temporară.",
  alternates: { canonical: "/materiale/polipropilena" },
};

export default async function PolipropilenaPage() {
  const product = getProductBySlug("polipropilena");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro"}/materiale/polipropilena`;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}
      
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <ConfiguratorPolipropilena productSlug="polipropilena" />
      </Suspense>
    </main>
  );
}