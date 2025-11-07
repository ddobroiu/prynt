export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import React from "react";
import ProductJsonLd from "@/components/ProductJsonLd";
import { resolveProductForRequestedSlug, getAllProductSlugs } from "@/lib/products";
import type { Product } from "@/lib/products";
import BannerConfigurator from "@/components/BannerConfigurator";

type Props = { params?: any }; // params poate fi Promise, folosim any și await

export async function generateStaticParams() {
  const slugs = getAllProductSlugs();
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: Props) {
  // params poate fi Promise — trebuie să facem await
  const resolved = await params;
  const raw = (resolved?.slug ?? []).join("/");
  const { product, isFallback } = await resolveProductForRequestedSlug(String(raw));
  if (!product) return {};

  const metadata: any = {
    title: product.seo?.title || `${product.title} | Prynt`,
    description: product.seo?.description || product.description,
    openGraph: { title: product.seo?.title || product.title, description: product.description, images: product.images },
  };

  if (isFallback) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
}

export default async function Page({ params }: Props) {
  // params poate fi Promise — îl rezolvăm cu await
  const resolved = await params;
  const slugParts: string[] = resolved?.slug ?? [];
  const joinedSlug = slugParts.join("/");

  console.log(`[banner page] Requested slug: ${joinedSlug}`);

  const { product, initialWidth, initialHeight } = await resolveProductForRequestedSlug(String(joinedSlug));

  if (!product) {
    console.log(`[banner page] No product resolved for slug: ${joinedSlug} → 404`);
    return notFound();
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/banner/${joinedSlug}`;

  return (
    <main style={{ padding: 16 }}>
      <ProductJsonLd product={(product as Product)} url={url} />

      <section style={{ marginTop: 18 }}>
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>{product.title}</h1>
          <p style={{ marginTop: 8, color: "#9ca3af" }}>{product.description}</p>
        </header>

        <BannerConfigurator productSlug={product.slug} initialWidth={initialWidth ?? undefined} initialHeight={initialHeight ?? undefined} />
      </section>
    </main>
  );
}