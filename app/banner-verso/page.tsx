import React from "react";
import BannerVersoConfigurator from "@/components/BannerVersoConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import ProductJsonLd from "@/components/ProductJsonLd";

export const metadata = {
  title: "Banner Față-Verso (Blockout) | Print Digital Dublă Față | Prynt",
  description: "Banner publicitar printat pe ambele părți (față-verso) pe material Blockout opac. Vizibilitate maximă din ambele sensuri. Include capse și tiv.",
  keywords: ["banner fata verso", "banner blockout", "print dubla fata", "reclama stradala", "banner opac", "banner doua fete", "print outdoor"],
  alternates: { canonical: "/banner-verso" },
  openGraph: {
    title: "Banner Față-Verso (Blockout) | Prynt",
    description: "Print față-verso pe material opac premium. Ideal pentru expunere stradală.",
    type: "website",
    images: ["/products/banner/verso/1.webp"],
  },
};

export default function BannerVersoPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";

  return (
    <>
      <BreadcrumbsJsonLd 
        items={[
          { name: "Acasă", url: `${base}/` }, 
          { name: "Banner Față-Verso", url: `${base}/banner-verso` }
        ]} 
      />
      {/* Date structurate pentru Google */}
      <ProductJsonLd
        name="Banner Față-Verso (Blockout)"
        description="Banner imprimat pe ambele fețe (față-verso) pe material Blockout 610g cu inserție de carbon pentru opacitate totală. Finisaje incluse."
        image={`${base}/products/banner/verso/1.webp`}
        price="55.00" // Preț de bază
        currency="RON"
        brand="Prynt"
        availability="https://schema.org/InStock"
        url={`${base}/banner-verso`}
      />
      {/* FIX: Suspense pentru configurator */}
      <React.Suspense>
        <BannerVersoConfigurator productSlug="banner-verso" />
      </React.Suspense>
    </>
  );
}