import React from "react";
import ConfiguratorPlexiglass from "@/components/ConfiguratorPlexiglass";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plăci Plexiglas Personalizate | Print UV Plexiglas",
  description: "Comandă online plăci de plexiglas (sticlă acrilică) personalizate prin imprimare UV. Alege între plexiglas alb sau transparent, diverse grosimi și încarcă designul tău.",
  alternates: { canonical: "/materiale/plexiglass" },
};

export default function PlexiglassPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Materiale", url: `${base}/materiale` }, { name: "Plexiglas", url: `${base}/materiale/plexiglass` }]} />
      <ConfiguratorPlexiglass productSlug="plexiglas" />
    </>
  );
}