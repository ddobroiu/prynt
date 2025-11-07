import { resolveProductForRequestedSlug, getAllProductSlugs } from "@/lib/products";
import AutocolanteConfigurator from "@/components/AutocolanteConfigurator";

export async function generateStaticParams() {
  const slugs = getAllProductSlugs("autocolante"); // recomand să accepti un optional category param
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: any) {
  const resolved = await params;
  const raw = (resolved?.slug ?? []).join("/");
  const { product, isFallback } = await resolveProductForRequestedSlug(String(raw), "autocolante");
  if (!product) return {};
  return {
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.description,
    openGraph: { title: product.seo?.title || product.title, images: product.images },
    robots: isFallback ? { index: false, follow: true } : undefined,
  };
}

export default async function Page({ params }: any) {
  const resolved = await params;
  const joinedSlug = (resolved?.slug ?? []).join("/");
  const { product, initialWidth, initialHeight } = await resolveProductForRequestedSlug(String(joinedSlug), "autocolante");
  if (!product) return notFound();

  return (
    <main style={{ padding: 16 }}>
      <section style={{ marginTop: 18 }}>
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", margin: 0 }}>
            {product.title}
          </h1>
          <p style={{ marginTop: 8, color: "#9ca3af", textAlign: "center", marginBottom: 0 }}>{product.description}</p>
        </header>

        <AutocolanteConfigurator productSlug={product.slug} initialWidth={initialWidth} initialHeight={initialHeight} />
      </section>
    </main>
  );
}