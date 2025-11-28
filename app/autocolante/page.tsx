import React, { Suspense } from "react";
import AutocolanteConfigurator from "@/components/AutocolanteConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Autocolante Personalizate | Print & Decupaj pe Contur",
  description: "Autocolante PVC, etichete și stickere personalizate. Rezistente la exterior, opțiuni de laminare și tăiere pe contur. Comandă online! Adeziv puternic și durabil.",
  keywords: [
    "autocolante personalizate",
    "stickere vinyl",
    "etichete adezive",
    "autocolante exterior",
    "decupaj pe contur",
    "autocolante PVC",
    "laminare autocolante",
    "adeziv puternic"
  ],
  alternates: { canonical: "/autocolante" },
  openGraph: {
    title: "Autocolante Personalizate | Print & Decupaj pe Contur",
    description: "Autocolante PVC, etichete și stickere personalizate. Rezistente la exterior, opțiuni de laminare și tăiere pe contur. Comandă online!",
    images: [{
      url: "/products/autocolante/1.webp",
      width: 1200,
      height: 630,
      alt: "Autocolante personalizate PVC"
    }]
  }
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