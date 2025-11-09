import { notFound } from "next/navigation";
import ProductJsonLd from "@/components/ProductJsonLd";
import PlianteConfigurator from "@/components/PlianteConfigurator";
import SeoToggle from "@/components/SeoToggle";
import { resolveProductForRequestedSlug, getAllProductSlugsByCategory } from "@/lib/products";
import type { Product } from "@/lib/products";
type Props = { params?: any };

export async function generateStaticParams() {
  const slugs = getAllProductSlugsByCategory("pliante");
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: Props) {
  const resolved = await params;
  const raw = (resolved?.slug ?? []).join("/");
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const { product, isFallback } = await resolveProductForRequestedSlug(String(raw), "pliante");
  if (!product) return {};
  const url = `${base}/pliante/${raw}`;
  const metadata: any = {
    title: product.seo?.title || `${product.title} | Prynt`,
    description: product.seo?.description || product.description,
    openGraph: { title: product.seo?.title || product.title, description: product.description, images: product.images, url },
  };
  if (isFallback) {
    metadata.robots = { index: false, follow: true };
    metadata.alternates = { canonical: `${base}/pliante` };
  } else {
    metadata.alternates = { canonical: url };
  }
  return metadata;
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const slugParts: string[] = resolved?.slug ?? [];
  const joinedSlug = slugParts.join("/");

  const { product, initialWidth, initialHeight } = await resolveProductForRequestedSlug(String(joinedSlug), "pliante");

  if (!product) return notFound();

  // Build a rich SEO block server-side (so crawlers can index content even if collapsed client-side)
  const seoHtml = `
    <h2>${product.title}</h2>
    <p>${product.description}</p>
    <h3>Specificații recomandate</h3>
    <p>Formate: A6, A5. Hârtie: 115–170 g/mp. Pliere: simplă/dublă. Imagini la 300 DPI, profil CMYK.</p>
    <h3>De ce să alegi pliante pentru salon</h3>
    <p>Pliantele sunt ideale pentru promovare locală, anunțuri de oferte și fidelizare clienți.</p>
  `;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/pliante/${joinedSlug}`;

  return (
    <main style={{ padding: 16 }}>
      <ProductJsonLd product={(product as Product)} url={url} />

      {/* Configurator first */}
      <section className="mb-10">
        <h1 className="text-3xl font-extrabold mb-4">{product.title}</h1>
        <div className="card p-6">
          <PlianteConfigurator productSlug={product.slug ?? product.routeSlug} initialWidth={initialWidth ?? undefined} initialHeight={initialHeight ?? undefined} />
        </div>
      </section>

      {/* SEO content collapsed */}
      <section>
        <SeoToggle content={seoHtml} collapsedHeight={0} />
      </section>
    </main>
  );
}