import React, { Suspense } from "react";
import ConfiguratorCarton from "@/components/ConfiguratorCarton";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Print pe Carton Ondulat & Fagure | Soluții Eco",
  description: "Carton printat digital pentru display-uri, cutii și POSM. Soluții ușoare și reciclabile.",
  alternates: { canonical: "/materiale/carton" },
};

export default async function CartonPage() {
  const product = getProductBySlug("carton");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro"}/materiale/carton`;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}
      
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <ConfiguratorCarton productSlug="carton" />
      </Suspense>
    </main>
  );
}