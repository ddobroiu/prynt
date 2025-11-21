import React from "react";
import BannerConfigurator from "@/components/BannerConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Bannere Publicitare Personalizate | Print Outdoor Calitate Foto | Prynt",
  description: "Comandă online bannere publicitare personalizate (Frontlit). Print outdoor rezistent la apă și UV, tiv și capse incluse. Livrare rapidă în toată țara.",
  keywords: ["banner personalizat", "print outdoor", "banner publicitar", "frontlit", "mesh", "banner ieftin", "print digital", "reclama stradala"],
  alternates: { canonical: "/banner" },
  openGraph: {
    title: "Bannere Publicitare Personalizate | Prynt",
    description: "Bannere imprimate la rezoluție înaltă, finisaje complete incluse.",
    type: "website",
    images: ["/products/banner/1.webp"],
  },
};

export default function BannerPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";

  return (
    <>
      <BreadcrumbsJsonLd 
        items={[
          { name: "Acasă", url: `${base}/` }, 
          { name: "Bannere Publicitare", url: `${base}/banner` }
        ]} 
      />
      {/* Date structurate pentru Google (Rich Snippets) */}
      <ProductJsonLd
        name="Banner Publicitar Personalizat (Frontlit)"
        description="Banner outdoor din material PVC Frontlit (440g sau 510g), imprimat la rezoluție foto, rezistent la intemperii. Include tiv perimetral și capse de prindere."
        image={`${base}/products/banner/1.webp`}
        price="35.00" // Preț de bază
        currency="RON"
        brand="Prynt"
        availability="https://schema.org/InStock"
        url={`${base}/banner`}
      />
      <BannerConfigurator productSlug="banner" />
    </>
  );
}