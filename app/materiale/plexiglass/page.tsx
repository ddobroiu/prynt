import React, { Suspense } from "react";
import ConfiguratorPlexiglass from "@/components/ConfiguratorPlexiglass";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Print pe Plexiglass | Plăci Acrilice Transparente/Albe",
  description: "Plexiglass printat UV. Aspect premium, sticlă acrilică. Disponibil transparent sau alb, diverse grosimi.",
  alternates: { canonical: "/materiale/plexiglass" },
};

export default async function PlexiglassPage() {
  const product = getProductBySlug("plexiglass");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro"}/materiale/plexiglass`;
  const productImage = product?.images?.[0] || "/products/materiale/plexiglass/plexiglass-1.webp";

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}
      
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <ConfiguratorPlexiglass productSlug="plexiglass" productImage={productImage} />
      </Suspense>
    </main>
  );
}