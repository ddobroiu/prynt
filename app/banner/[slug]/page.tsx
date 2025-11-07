import { notFound } from "next/navigation";
import ProductJsonLd from "@/components/ProductJsonLd";
import { resolveProductForRequestedSlug } from "@/lib/products";
import type { Product } from "@/lib/products";

// static import al componentului client (BannerConfigurator trebuie să conțină 'use client')
import BannerConfigurator from "@/components/BannerConfigurator";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const { slug } = params as { slug: string };
  const { product, isFallback } = await resolveProductForRequestedSlug(String(slug));
  if (!product) return {};

  const metadata: any = {
    title: `${product.title} — ${product.minWidthCm}x${product.minHeightCm} | Prynt`,
    description: product.description,
    openGraph: { title: product.title, description: product.description, images: product.images },
  };

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
      {/* JSON-LD pentru SEO */}
      <ProductJsonLd product={product as Product} url={url} />

      {/* Am eliminat avertizarea fallback — pagina afișează doar configuratorul */}
      <section style={{ marginTop: 18 }}>
        <BannerConfigurator productSlug={product.slug} initialWidth={initialWidth} initialHeight={initialHeight} />
      </section>
    </main>
  );
}