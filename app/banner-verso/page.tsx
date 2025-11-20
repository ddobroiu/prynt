import React from "react";
import BannerVersoConfigurator from "@/components/BannerVersoConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Banner Verso (Blockout) | Print Digital Față-Verso | Prynt",
  description: "Comandă banner blockout printat față-verso pentru vizibilitate maximă. Material rezistent, opac, ideal pentru expunere stradală.",
  alternates: { canonical: "/banner-verso" },
};

export default function BannerVersoPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";

  return (
    <>
      <BreadcrumbsJsonLd 
        items={[
          { name: "Acasă", url: `${base}/` }, 
          { name: "Banner Verso", url: `${base}/banner-verso` }
        ]} 
      />
      <BannerVersoConfigurator productSlug="banner-verso" />
    </>
  );
}