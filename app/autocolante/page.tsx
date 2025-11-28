import React, { Suspense } from "react";
import AutocolanteConfigurator from "@/components/AutocolanteConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Autocolante Personalizate | Print & Decupaj pe Contur",
  description: "Autocolante PVC, etichete și stickere personalizate. Rezistente la exterior, opțiuni de laminare și tăiere pe contur. Comandă online!",
  alternates: { canonical: "/autocolante" },
};

export default async function AutocolantePage() {
  const product = getProductBySlug("autocolante");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro"}/autocolante`;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}
      
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <AutocolanteConfigurator productSlug="autocolante" />
      </Suspense>
    </main>
  );
}