import React, { Suspense } from "react";
import FlyerConfigurator from "@/components/FlyerConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Flyere Ieftine | A6, A5, DL | Tipografie Online",
  description: "Comandă flyere pentru promovare stradală sau evenimente. Prețuri mici, tiraje flexibile și livrare rapidă. Hârtie 130g, 170g, 250g mat sau lucios.",
  keywords: [
    "flyere ieftine",
    "flyere A6 A5 DL",
    "tipar flyere",
    "flyere promovare",
    "flyere evenimente",
    "tipografie online",
    "flyere personalizate",
    "hârtie mat lucios"
  ],
  alternates: { canonical: "/flayere" },
  openGraph: {
    title: "Flyere Ieftine | A6, A5, DL | Tipografie Online",
    description: "Comandă flyere pentru promovare stradală sau evenimente. Prețuri mici, tiraje flexibile și livrare rapidă.",
    images: [{
      url: "/products/flayere/1.webp",
      width: 1200,
      height: 630,
      alt: "Flyere ieftine A6 A5 DL"
    }]
  }
};

export default async function FlayerePage() {
  const product = getProductBySlug("flayere"); // Sau "flyer" depinde de cum e în products.ts
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro"}/flayere`;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}
      
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <FlyerConfigurator productSlug="flayere" />
      </Suspense>
    </main>
  );
}