import { notFound } from "next/navigation";
import ProductJsonLd from "@/components/ProductJsonLd";
import TapetConfigurator from "@/components/TapetConfigurator";
import { resolveProductForRequestedSlug, getAllProductSlugsByCategory } from "@/lib/products";
import type { Product } from "@/lib/products";
type Props = { params?: any };

// IMPORTANT: folosește exact categoria din lib/products.ts pentru tapet (ex: "tapet")
// Dacă în PRODUCTS ai folosit alt nume pentru categorie (ex: "wallpaper" sau "tapete"), înlocuiește "tapet" mai jos cu acel nume.
export async function generateStaticParams() {
  const slugs = getAllProductSlugsByCategory("tapet");
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: Props) {
  const resolved = await params;
  const raw = (resolved?.slug ?? []).join("/");
  const { product, isFallback } = await resolveProductForRequestedSlug(String(raw), "tapet");
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
  const resolved = await params;
  const slugParts: string[] = resolved?.slug ?? [];
  const joinedSlug = slugParts.join("/");

  // Atenție: folosește aceeași categorie ca mai sus
  const { product, initialWidth, initialHeight } = await resolveProductForRequestedSlug(String(joinedSlug), "tapet");

  if (!product) {
    return notFound();
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/tapet/${joinedSlug}`;

  return (
    <main style={{ padding: 16 }}>
      <ProductJsonLd product={(product as Product)} url={url} />
      <section style={{ marginTop: 18 }}>
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", margin: 0 }}>{product.title}</h1>
          <p style={{ marginTop: 8, color: "#9ca3af", textAlign: "center", marginBottom: 0 }}>{product.description}</p>
        </header>

        <TapetConfigurator productSlug={product.slug ?? product.routeSlug} />
      </section>
    </main>
  );
}