import React from "react";
import BannerVersoConfigurator from "@/components/BannerVersoConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Banner Față-Verso Personalizat | Printare Calitate Superioară",
  description: "Creează și comandă bannere față-verso durabile. Folosim material blockout pentru opacitate perfectă. Prețuri avantajoase și livrare rapidă.",
  alternates: { canonical: "/banner-verso" },
};

export default function BannerVersoPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Banner Față-Verso", url: `${base}/banner-verso` }]} />
      <BannerVersoConfigurator productSlug="banner-verso" />
    </>
  );
}