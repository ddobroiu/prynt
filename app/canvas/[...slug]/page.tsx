import React from "react";
import { notFound } from "next/navigation";
import CanvasConfigurator from "@/components/CanvasConfigurator";
import { getAllProductSlugs, getProductBySlug, resolveProductForRequestedSlug } from "@/lib/products";
import type { Product } from "@/lib/products";

type Props = { params?: any };

export async function generateStaticParams() {
  const slugs = getAllProductSlugs();
  const filtered = slugs.filter((s) => {
    const p = getProductBySlug(s);
    return !!p && p.metadata?.category === "canvas";
  });
  return filtered.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: Props) {
  const resolved = await params;
  const raw = (resolved?.slug ?? []).join("/");
  const { product } = await resolveProductForRequestedSlug(String(raw));
  if (!product) return {};
  return {
    title: product.seo?.title || `${product.title} | Prynt`,
    description: product.seo?.description || product.description,
    openGraph: { title: product.seo?.title || product.title, description: product.description, images: product.images },
  };
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const slugParts: string[] = resolved?.slug ?? [];
  const joinedSlug = slugParts.join("/");

  const { product, initialWidth, initialHeight } = await resolveProductForRequestedSlug(String(joinedSlug));

  if (!product || product.metadata?.category !== "canvas") {
    return notFound();
  }

  return (
    <main style={{ padding: 16 }}>
      <section style={{ marginTop: 18 }}>
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", margin: 0 }}>
            {product.title || `Canvas ${joinedSlug}`}
          </h1>
          <p style={{ marginTop: 8, color: "#9ca3af", textAlign: "center", marginBottom: 0 }}>{product.description}</p>
        </header>

        <CanvasConfigurator productSlug={product.slug} initialWidth={initialWidth ?? undefined} initialHeight={initialHeight ?? undefined} />
      </section>
    </main>
  );
}