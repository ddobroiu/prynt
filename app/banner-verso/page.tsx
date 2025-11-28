import React, { Suspense } from "react";
import BannerVersoConfigurator from "@/components/BannerVersoConfigurator";
import { getProductBySlug } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Banner Față-Verso (Blockout) | Print Double Sided",
  description: "Bannere printate pe ambele fețe (blockout). Ideale pentru vizibilitate stradală maximă. Material opac rezistent.",
  alternates: { canonical: "/banner-verso" },
};

export default async function BannerVersoPage() {
  const product = getProductBySlug("banner-verso");
  const url = `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro"}/banner-verso`;

  return (
    <main className="min-h-screen bg-gray-50">
      {product && <ProductJsonLd product={product} url={url} />}
      
      <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
        <BannerVersoConfigurator productSlug="banner-verso" />
      </Suspense>
    </main>
  );
}