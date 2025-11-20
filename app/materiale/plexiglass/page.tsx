import React from "react";
import ConfiguratorPlexiglass from "@/components/ConfiguratorPlexiglass";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";

export const metadata = {
  title: "Print pe Plexiglass (Sticlă Acrilică) | Transparent sau Alb",
  description: "Tablouri și panouri din plexiglass imprimate UV. Aspect premium, lucios, profunzime a imaginii. Disponibil transparent sau opal.",
  alternates: { canonical: "/materiale/plexiglass" },
};

export default function PlexiglassPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Plexiglass", url: `${base}/materiale/plexiglass` }]} />
      <ConfiguratorPlexiglass productSlug="plexiglass" />
    </>
  );
}