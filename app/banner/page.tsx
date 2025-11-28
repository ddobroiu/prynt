import React, { Suspense } from "react";
import BannerConfigurator from "@/components/BannerConfigurator";
import { getProductBySlug } from "@/lib/products"; // Import corectat
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Bannere Publicitare Personalizate | Print Outdoor & Indoor",
  description: "Configurează online bannere publicitare (frontlit). Prețuri de la 9€/mp, finisaje incluse (tiv, capse). Livrare rapidă în toată țara. Rezistente la UV și vreme.",
  keywords: [
    "bannere publicitare",
    "bannere PVC",
    "bannere outdoor", 
    "bannere personalizate",
    "tipar bannere",
    "bannere rezistente",
    "publicitate exterior",
    "bannere tivite capsate",
    "frontlit banner"
  ],
  alternates: { canonical: "/banner" },
  openGraph: {
    title: "Bannere Publicitare Personalizate | Print Outdoor & Indoor",
    description: "Configurează online bannere publicitare (frontlit). Prețuri de la 9€/mp, finisaje incluse (tiv, capse). Livrare rapidă în toată țara.",
    images: [{
      url: "/products/banner/1.webp",
      width: 1200,
      height: 630,
      alt: "Bannere publicitare outdoor rezistente"
    }]
  }
};

export default async function BannerPage() {
  const product = getProductBySlug("banner");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro"}/banner`;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}
      
      {/* FIX: Suspense pentru configurator */}
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <BannerConfigurator productSlug="banner" />
      </Suspense>
    </main>
  );
}