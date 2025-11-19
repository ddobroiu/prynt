import { notFound } from "next/navigation";
import ProductJsonLd from "@/components/ProductJsonLd";
import { resolveProductForRequestedSlug, getAllProductSlugsByCategory } from "@/lib/products";
import type { Product } from "@/lib/products";
import ConfiguratorPVCForex from "@/components/ConfiguratorPVCForex";

type Props = { params?: Promise<{ slug?: string[] }> };

export async function generateStaticParams() {
  // Asigură-te că în lib/products.ts categoria este "pvc-forex"
  const slugs = getAllProductSlugsByCategory("pvc-forex");
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: Props) {
  const resolved = await params;
  const raw = (resolved?.slug ?? []).join("/");
  const { product, isFallback } = await resolveProductForRequestedSlug(String(raw), "pvc-forex");
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

  const { product, initialWidth, initialHeight } = await resolveProductForRequestedSlug(String(joinedSlug), "pvc-forex");

  if (!product) return notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/materiale/pvc-forex/${joinedSlug}`;

  return (
    <>
      <ProductJsonLd product={(product as Product)} url={url} />
      <ConfiguratorPVCForex 
        productSlug={product.slug ?? product.routeSlug} 
        initialWidth={initialWidth}
        initialHeight={initialHeight}
        productType="pvc-forex"
      />
    </>
  );
}