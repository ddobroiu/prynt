import { notFound } from "next/navigation";
import ProductJsonLd from "@/components/ProductJsonLd";
import { resolveProductForRequestedSlug, getAllProductSlugsByCategory } from "@/lib/products";
import type { Product } from "@/lib/products";
import ConfiguratorPlexiglass from "@/components/ConfiguratorPlexiglass";

type Props = { params?: Promise<{ slug?: string[] }> };

export async function generateStaticParams() {
  // Categoria în lib/products.ts trebuie să fie "plexiglass" sau "plexiglas"
  const slugs = getAllProductSlugsByCategory("plexiglass");
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: Props) {
  const resolved = await params;
  const raw = (resolved?.slug ?? []).join("/");
  const { product, isFallback } = await resolveProductForRequestedSlug(String(raw), "plexiglass");
  if (!product) return {};

  const metadata: any = {
    title: product.seo?.title || `${product.title} | Prynt`,
    description: product.seo?.description || product.description,
    openGraph: { 
      title: product.seo?.title || product.title, 
      description: product.description, 
      images: product.images 
    },
  };
  if (isFallback) metadata.robots = { index: false, follow: true };
  return metadata;
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const slugParts: string[] = resolved?.slug ?? [];
  const joinedSlug = slugParts.join("/");

  const { product, initialWidth, initialHeight } = await resolveProductForRequestedSlug(String(joinedSlug), "plexiglass");

  if (!product) return notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/materiale/plexiglass/${joinedSlug}`;

  return (
    <>
      <ProductJsonLd product={(product as Product)} url={url} />
      <ConfiguratorPlexiglass 
        productSlug={product.slug ?? product.routeSlug} 
        initialWidth={initialWidth}
        initialHeight={initialHeight}
      />
    </>
  );
}