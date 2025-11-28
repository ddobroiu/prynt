import React, { Suspense } from "react";
import AfiseConfigurator from "@/components/AfiseConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Afișe și Postere Personalizate | A4, A3, A2, A1, A0",
  description: "Print afișe publicitare la rezoluție înaltă. Hârtie foto, blueback sau whiteback. Configurează dimensiunea și tirajul online.",
  alternates: { canonical: "/afise" },
};

export default async function AfisePage() {
  const product = getProductBySlug("afise");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro"}/afise`;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}
      
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <AfiseConfigurator productSlug="afise" />
      </Suspense>
    </main>
  );
}