import React from "react";
import CanvasConfigurator from "@/components/CanvasConfigurator";
import BreadcrumbsJsonLd from "@/components/BreadcrumbsJsonLd";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tablouri Canvas Personalizate | Imprimare Foto pe Pânză",
  description: "Transformă-ți amintirile în artă! Comandă tablouri canvas personalizate, imprimate la calitate fotografică. Alege dimensiunea, cu sau fără șasiu de lemn, și încarcă imaginea ta.",
  alternates: { canonical: "/canvas" },
};

export default function CanvasPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro";
  return (
    <>
      <BreadcrumbsJsonLd items={[{ name: "Acasă", url: `${base}/` }, { name: "Canvas", url: `${base}/canvas` }]} />
      <CanvasConfigurator productSlug="canvas" />
    </>
  );
}