import RollupConfigurator from "@/components/RollupConfigurator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rollup Banner - Sistem Retractabil Premium | Prynt.ro",
  description:
    "Rollup banner profesional cu casetă aluminiu și print Blueback 440g. Dimensiuni: 85cm, 100cm, 120cm, 150cm. Portabil, montaj rapid, perfect pentru evenimente și expoziții.",
  keywords: [
    "rollup banner",
    "roll up",
    "banner retractabil",
    "sistem rollup",
    "afisaj portabil",
    "banner expoziție",
    "rollup profesional",
    "banner evenimente",
    "caseta aluminiu",
    "blueback 440g",
  ],
  alternates: { canonical: "/rollup" },
  openGraph: {
    title: "Rollup Banner - Sistem Retractabil Premium",
    description:
      "Banner retractabil profesional cu casetă aluminiu. Include print Blueback 440g și geantă transport. Montaj rapid, fără unelte.",
    images: [{
      url: "/products/rollup/rollup-1.webp",
      width: 1200,
      height: 630,
      alt: "Rollup banner retractabil profesional"
    }],
    type: "website",
  },
};

export default function RollupPage() {
  return <RollupConfigurator productSlug="rollup" />;
}
