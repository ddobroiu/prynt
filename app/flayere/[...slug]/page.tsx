import React from "react";
import { notFound } from "next/navigation";
import AutocolanteConfigurator from "@/components/AutocolanteConfigurator";
import { getAllProductSlugs, getProductBySlug, resolveProductForRequestedSlug } from "@/lib/products";
import type { Product } from "@/lib/products";

type Props = { params?: any };

export async function generateStaticParams() {
  // preluăm toate slug-urile existente și trimitem doar pe cele din categoria autocolante
  const slugs = getAllProductSlugs();
  const filtered = slugs.filter((s) => {
    const p = getProductBySlug(s);
    return !!p && p.metadata?.category === "autocolante";
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

  if (!product || product.metadata?.category !== "autocolante") {
    return notFound();
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/autocolante/${joinedSlug}`;

  return (
    <main style={{ padding: 16 }}>
      {/* SEO structured data / optional */}
      <section style={{ marginTop: 18 }}>
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", margin: 0 }}>
            {product.title || `Autocolant ${joinedSlug}`}
          </h1>
          <p style={{ marginTop: 8, color: "#9ca3af", textAlign: "center", marginBottom: 0 }}>{product.description}</p>
        </header>

        <AutocolanteConfigurator productSlug={product.slug} initialWidth={initialWidth ?? undefined} initialHeight={initialHeight ?? undefined} />
      </section>
    </main>
  );
}