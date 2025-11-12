import React from "react";
import ProductJsonLd from "./ProductJsonLd";
import PlianteConfigurator from "./PlianteConfigurator";
import BannerConfigurator from "./BannerConfigurator";
import CanvasConfigurator from "./CanvasConfigurator";
import AutocolanteConfigurator from "./AutocolanteConfigurator";
import SeoToggle from "./SeoToggle";
import type { LandingInfo } from "@/lib/landingData";

type Props = {
  category: string;
  landing: LandingInfo;
  initialWidth?: number | undefined;
  initialHeight?: number | undefined;
};

export default function LandingTemplate({ category, landing, initialWidth, initialHeight }: Props) {
  const ConfigMap: Record<string, React.ElementType> = {
    pliante: PlianteConfigurator,
    bannere: BannerConfigurator,
    canvas: CanvasConfigurator,
    autocolante: AutocolanteConfigurator,
    afise: PlianteConfigurator,
    flyer: PlianteConfigurator,
  };

  const Config = ConfigMap[category] ?? PlianteConfigurator;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/${category}/${landing.key}`;

  // Minimal ProductJsonLd shape (adjust fields as needed)
  const jsonProduct: any = {
    name: landing.title,
    description: landing.seoDescription ?? landing.shortDescription,
    image: landing.images ?? [],
  };

  return (
    <main className="page py-10" style={{ padding: 16 }}>
      <ProductJsonLd product={jsonProduct} url={url} />
      <section className="mb-8">
        <h1 className="text-4xl font-extrabold mb-3">{landing.title}</h1>
  <p className="text-muted mb-6">{landing.shortDescription}</p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="card p-4 sticky" style={{ top: 24 }}>
              <h3 className="text-lg font-semibold mb-3">Configurează acum</h3>
              <Config productSlug={landing.productRouteSlug ?? landing.key} initialWidth={initialWidth} initialHeight={initialHeight} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <SeoToggle content={landing.contentHtml ?? "<p>Informații suplimentare.</p>"} collapsedHeight={0} />
          </div>
        </div>
      </section>
    </main>
  );
}