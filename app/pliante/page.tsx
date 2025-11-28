import React, { Suspense } from "react";
import PlianteConfigurator from "@/components/PlianteConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Pliante și Flyere Publicitare | Tipar Digital Rapid",
  description: "Pliante împăturite (biguite) sau flyere simple. Diverse dimensiuni și tipuri de hârtie. Calculează prețul instant online.",
  alternates: { canonical: "/pliante" },
};

export default async function PliantePage() {
  const product = getProductBySlug("pliante");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro"}/pliante`;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}
      
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <PlianteConfigurator productSlug="pliante" />
      </Suspense>
    </main>
  );
}