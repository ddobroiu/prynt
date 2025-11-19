import { notFound } from "next/navigation";
import ProductJsonLd from "@/components/ProductJsonLd";
import { resolveProductForRequestedSlug, getAllProductSlugsByCategory } from "@/lib/products";
import type { Product } from "@/lib/products";
import FonduriEUConfigurator from "@/components/FonduriEUConfigurator";

type Props = { params?: Promise<{ slug?: string[] }> };

export async function generateStaticParams() {
  const slugs = getAllProductSlugsByCategory("fonduri-nationale");
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: Props) {
  const resolved = await params;
  const raw = (resolved?.slug ?? []).join("/");
  const { product, isFallback } = await resolveProductForRequestedSlug(String(raw), "fonduri-nationale");
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

  const { product } = await resolveProductForRequestedSlug(String(joinedSlug), "fonduri-nationale");

  if (!product) return notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/fonduri-nationale/${joinedSlug}`;

  return (
    <>
      <ProductJsonLd product={(product as Product)} url={url} />
      <FonduriEUConfigurator />
    </>
  );
}