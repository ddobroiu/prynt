import { notFound } from "next/navigation";
import ProductJsonLd from "@/components/ProductJsonLd";
import { resolveProductForRequestedSlug, getAllProductSlugsByCategory } from "@/lib/products";
import CanvasConfigurator from "@/components/CanvasConfigurator";
import type { Product } from "@/lib/products";

type Props = { params?: Promise<{ slug?: string[] }> };

export async function generateStaticParams() {
  const slugs = getAllProductSlugsByCategory("canvas");
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: Props) {
  const resolved = await params;
  const raw = (resolved?.slug ?? []).join("/");
  const { product, isFallback } = await resolveProductForRequestedSlug(String(raw), "canvas");
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

  const { product, initialWidth, initialHeight } = await resolveProductForRequestedSlug(String(joinedSlug), "canvas");

  if (!product) return notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/canvas/${joinedSlug}`;

  return (
    <>
      <ProductJsonLd product={(product as Product)} url={url} />
      <CanvasConfigurator 
        productSlug={product.slug ?? product.routeSlug} 
        // FIX: Convertim null în undefined folosind operatorul ??
        initialWidth={initialWidth ?? undefined}
        initialHeight={initialHeight ?? undefined}
      />
    </>
  );
}