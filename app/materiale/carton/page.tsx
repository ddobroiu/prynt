// app/carton/page.tsx
import { notFound } from "next/navigation";
import ProductJsonLd from "@/components/ProductJsonLd";
import { resolveProductForRequestedSlug, getAllProductSlugsByCategory } from "@/lib/products";
import type { Product } from "@/lib/products";
import CartonConfigurator from "@/components/ConfiguratorCarton";

type Props = { params?: any };

export async function generateMetadata({ params }: Props) {
  const resolved = await params;
  const raw = (resolved?.slug ?? []).join("/");
  const { product, isFallback } = await resolveProductForRequestedSlug(String(raw), "carton");
  if (!product) return {};
  const metadata: any = {
    title: product.seo?.title || `${product.title} | Prynt`,
    description: product.seo?.description || product.description,
    openGraph: { title: product.seo?.title || product.title, description: product.description, images: product.images },
  };
  if (isFallback) metadata.robots = { index: false, follow: true };
  return metadata;
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const slugParts: string[] = resolved?.slug ?? [];
  const joinedSlug = slugParts.join("/");

  const { product, initialWidth, initialHeight } = await resolveProductForRequestedSlug(String(joinedSlug), "carton");

  if (!product) return notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/carton/${joinedSlug}`;

  return (
    <main style={{ padding: 16 }}>
      <ProductJsonLd product={(product as Product)} url={url} />
      <section style={{ marginTop: 18 }}>
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", margin: 0 }}>{product.title}</h1>
          <p style={{ marginTop: 8, color: "#9ca3af", textAlign: "center", marginBottom: 0 }}>{product.description}</p>
        </header>
        <CartonConfigurator productSlug={product.slug ?? product.routeSlug} />
      </section>
    </main>
  );
}