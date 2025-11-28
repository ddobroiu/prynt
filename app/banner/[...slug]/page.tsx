import { notFound } from "next/navigation";
import { Suspense } from "react"; // <--- IMPORT OBLIGATORIU
import ProductJsonLd from "@/components/ProductJsonLd";
import { resolveProductForRequestedSlug, getAllProductSlugsByCategory } from "@/lib/products";
import type { Product } from "@/lib/products";
import BannerConfigurator from "@/components/BannerConfigurator";

type Props = { params?: Promise<{ slug?: string[] }> };

export async function generateStaticParams() {
  const slugs = getAllProductSlugsByCategory("banner");
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: Props) {
  const resolved = await params;
  const raw = (resolved?.slug ?? []).join("/");
  const { product, isFallback } = await resolveProductForRequestedSlug(String(raw), "banner");
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

  const { product, initialWidth, initialHeight } = await resolveProductForRequestedSlug(String(joinedSlug), "banner");

  if (!product) return notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/banner/${joinedSlug}`;

  // LOGICA IMAGINE ROBUSTĂ
  const slugKey = String(product.slug ?? product.id ?? "").toLowerCase();
  const genericSet = new Set<string>(["/products/banner/1.webp","/products/banner/2.webp","/products/banner/3.webp","/products/banner/4.webp","/placeholder.png"]);
  const imgs = product.images ?? [];
  let img = imgs.find((x) => !!x && slugKey && x.toLowerCase().includes(slugKey));
  if (!img) img = imgs.find((x) => !!x && !genericSet.has(x.toLowerCase())) ?? imgs[0] ?? "/products/banner/1.webp";

  return (
    <>
      <ProductJsonLd product={(product as Product)} url={url} />
      <main className="min-h-screen bg-gray-50">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        }>
          <BannerConfigurator 
            productSlug={product.slug ?? product.routeSlug} 
            initialWidth={initialWidth ?? undefined}
            initialHeight={initialHeight ?? undefined}
            productImage={img}
          />
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