import React from "react";
import BannerConfigurator from "@/components/BannerConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Bannere Publicitare Personalizate | Frontlit 440g & 510g | Prynt",
  description: "Comandă bannere publicitare outdoor personalizate. Print digital de mari dimensiuni, finisaje incluse (tiv și capse). Rezistente la apă și UV.",
  alternates: { canonical: "/banner" },
};

export default function BannerPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";

  return (
    <>
      <BreadcrumbsJsonLd 
        items={[
          { name: "Acasă", url: `${base}/` }, 
          { name: "Banner", url: `${base}/banner` }
        ]} 
      />
      <BannerConfigurator productSlug="banner" />
    </>
  );
}