import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductJsonLd from "@/components/ProductJsonLd";
import { resolveProductForRequestedSlug, getAllProductSlugsByCategory } from "@/lib/products";
import type { Product } from "@/lib/products";
import FlyerConfigurator from "@/components/FlyerConfigurator";

type Props = { params: Promise<{ slug?: string[] }> };

export async function generateStaticParams() {
  const slugs = getAllProductSlugsByCategory("flayere");
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: Props) {
  const resolved = await params;
  const raw = (resolved?.slug ?? []).join("/");
  const { product, isFallback } = await resolveProductForRequestedSlug(String(raw), "flayere");
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

  const { product } = await resolveProductForRequestedSlug(String(joinedSlug), "flayere");

  if (!product) return notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/flayere/${joinedSlug}`;

  return (
    <>
      <ProductJsonLd product={(product as Product)} url={url} />
      
      <main className="min-h-screen bg-gray-50">
        <Suspense fallback={<div className="h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}>
          <FlyerConfigurator productSlug={product.slug ?? product.routeSlug} />
        </Suspense>

        {product.contentHtml && (
           <section className="py-16 bg-white border-t border-gray-100">
             <div className="container mx-auto px-4 max-w-4xl">
               <article 
                 className="prose prose-lg prose-indigo mx-auto prose-h2:text-3xl prose-h2:font-bold prose-h3:text-xl prose-img:rounded-xl"
                 dangerouslySetInnerHTML={{ __html: product.contentHtml }}
               />
             </div>
           </section>
        )}
      </main>
    </>
  );
}