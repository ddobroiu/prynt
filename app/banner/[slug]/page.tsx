import { notFound } from "next/navigation";
import React from "react";
import ProductJsonLd from "@/components/ProductJsonLd";
import { resolveProductForRequestedSlug, getAllProductSlugs } from "@/lib/products";
import type { Product } from "@/lib/products";
import BannerConfigurator from "@/components/BannerConfigurator";

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  // statically generate pages for all products in PRODUCTS (top pages)
  const slugs = getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = params as { slug: string };
  const { product, isFallback } = await resolveProductForRequestedSlug(String(slug));
  if (!product) return {};

  const metadata: any = {
    title: product.seo?.title || `${product.title} | Prynt`,
    description: product.seo?.description || product.description,
    openGraph: { title: product.seo?.title || product.title, description: product.description, images: product.images },
  };

  // If page is fallback (generated from slug parse) tell bots not to index (optional)
  if (isFallback) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
}

export default async function Page({ params }: Props) {
  const { slug } = params as { slug: string };
  const { product, initialWidth, initialHeight } = await resolveProductForRequestedSlug(String(slug));

  if (!product) return notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/banner/${slug}`;

  return (
    <main style={{ padding: 16 }}>
      {/* JSON-LD for Product (improves indexability) */}
      <ProductJsonLd product={(product as Product)} url={url} />

      <section style={{ marginTop: 18 }}>
        {/* Page header / SEO visible content */}
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>{product.title}</h1>
          <p style={{ marginTop: 8, color: "#9ca3af" }}>{product.description}</p>
        </header>

        {/* Configurator prefilled with product dims */}
        <BannerConfigurator productSlug={product.slug} initialWidth={initialWidth ?? undefined} initialHeight={initialHeight ?? undefined} />
      </section>
    </main>
  );
}