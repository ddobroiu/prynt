import React, { Suspense } from "react";
import ConfiguratorAlucobond from "@/components/ConfiguratorAlucobond";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Print pe Alucobond (Dibond) | Panouri Compozit",
  description: "Panouri tip bond (aluminiu compozit) printate UV. Extrem de rezistente, ideale pentru fațade și firme luminoase.",
  alternates: { canonical: "/materiale/alucobond" },
};

export default async function AlucobondPage() {
  const product = getProductBySlug("alucobond");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro"}/materiale/alucobond`;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}
      
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <ConfiguratorAlucobond productSlug="alucobond" />
      </Suspense>
    </main>
  );
}