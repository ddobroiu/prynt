import React from "react";
import ProductJsonLd from "./ProductJsonLd";
import PlianteConfigurator from "./PlianteConfigurator";
import BannerConfigurator from "./BannerConfigurator";
import CanvasConfigurator from "./CanvasConfigurator";
import AutocolanteConfigurator from "./AutocolanteConfigurator";
// import AfișConfigurator if you have it; else reuse PlianteConfigurator for afise
// import AfisConfigurator from "./AfisConfigurator";
import SeoToggle from "./SeoToggle";

type Props = {
  category: string;           // e.g. "pliante", "bannere"
  landing: import("@/lib/landingData").LandingInfo;
  productSlug?: string | undefined; // optional product slug (if you want to hook to PRODUCT)
  initialWidth?: number | undefined;
  initialHeight?: number | undefined;
};

export default function LandingTemplate({ category, landing, productSlug, initialWidth, initialHeight }: Props) {
  // choose configurator component by category
  const ConfigMap: Record<string, React.ElementType> = {
    pliante: PlianteConfigurator,
    bannere: BannerConfigurator,
    canvas: CanvasConfigurator,
    autocolante: AutocolanteConfigurator,
    afise: PlianteConfigurator, // replace with AfisConfigurator if you have it
    flyer: PlianteConfigurator,
  };

  const Config = ConfigMap[category] ?? PlianteConfigurator;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/${category}/${landing.key}`;

  return (
    <main className="page py-10" style={{ padding: 16 }}>
      <ProductJsonLd
        product={{
          id: landing.productRouteSlug ?? landing.key,
          title: landing.title,
          description: landing.seoDescription ?? landing.shortDescription,
          images: landing.images ?? [],
          priceBase: landing.priceBase ?? 0,
          currency: "RON",
        } as any}
        url={url}
      />

      <section className="mb-8">
        <h1 className="text-4xl font-extrabold mb-3">{landing.title}</h1>
        <p className="text-white/70 mb-6">{landing.shortDescription}</p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="card p-4 sticky" style={{ top: 24 }}>
              <h3 className="text-lg font-semibold mb-3">Configurează acum</h3>
              <Config productSlug={productSlug ?? landing.productRouteSlug} initialWidth={initialWidth} initialHeight={initialHeight} />
            </div>
          </div>

          <div className="lg:col-span-2">
            {/* SEO content - collapsed by SeoToggle */}
            <SeoToggle content={landing.contentHtml ?? "<p>Informații suplimentare.</p>"} collapsedHeight={0} />
          </div>
        </div>
      </section>
    </main>
  );
}