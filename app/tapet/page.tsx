import React, { Suspense } from "react";
import TapetConfigurator from "@/components/TapetConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Tapet Personalizat | Print Fototapet la Comandă",
  description: "Decorează pereții cu tapet personalizat. Dimensiuni la comandă, materiale premium, adeziv opțional.",
  alternates: { canonical: "/tapet" },
};

export default async function TapetPage() {
  const product = getProductBySlug("tapet");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro"}/tapet`;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}
      
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <TapetConfigurator productSlug="tapet" />
      </Suspense>
    </main>
  );
}