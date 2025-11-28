import React, { Suspense } from "react";
import CanvasConfigurator from "@/components/CanvasConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Tablouri Canvas Personalizate | Print pe Pânză",
  description: "Transformă pozele tale în tablouri canvas. Print de calitate pe pânză bumbac/poliester, întinsă pe șasiu de lemn. Livrare rapidă în toată România.",
  keywords: [
    "tablouri canvas",
    "canvas personalizat",
    "print pe pânză",
    "tablouri foto",
    "canvas pe șasiu",
    "decorațiuni perete",
    "cadouri personalizate",
    "pânză bumbac poliester"
  ],
  alternates: { canonical: "/canvas" },
  openGraph: {
    title: "Tablouri Canvas Personalizate | Print pe Pânză",
    description: "Transformă pozele tale în tablouri canvas. Print de calitate pe pânză bumbac/poliester, întinsă pe șasiu de lemn.",
    images: [{
      url: "/products/canvas/1.webp",
      width: 1200,
      height: 630,
      alt: "Tablouri canvas personalizate"
    }]
  }
};

export default async function CanvasPage() {
  const product = getProductBySlug("canvas");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro"}/canvas`;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}
      
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <CanvasConfigurator productSlug="canvas" />
      </Suspense>
    </main>
  );
}