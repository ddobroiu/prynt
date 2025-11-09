import ProductJsonLd from "@/components/ProductJsonLd";
import BannerConfigurator from "@/components/BannerConfigurator";
import SeoToggle from "@/components/SeoToggle";
import { getProductBySlug } from "@/lib/products";
import type { Product } from "@/lib/products";

export async function generateMetadata() {
  const prod = getProductBySlug("banner-vulcanizare");
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const url = `${base}/banner/vulcanizare`;
  if (!prod) return { title: "Bannere | Prynt" };

  return {
    title: prod.seo?.title || `${prod.title} | Prynt`,
    description: prod.seo?.description || prod.description,
    openGraph: { title: prod.seo?.title || prod.title, description: prod.description, images: prod.images, url },
    alternates: { canonical: url },
  };
}

export default function Page() {
  const product = getProductBySlug("banner-vulcanizare") as Product | undefined;
  if (!product) return <main style={{ padding: 32 }}><h1>Banner</h1></main>;

  const seoHtml = `
    <h2>Bannere pentru vulcanizări — semnalistică outdoor</h2>
    <p>Bannere rezistente pentru exterior, ideale pentru a anunța servicii și promoții. Material recomandat: frontlit 440–510 g/mp, tiv și capse incluse.</p>
    <h3>Specificații</h3>
    <ul><li>Dimensiuni personalizate</li><li>Finisaje: tiv & capse, găuri pentru vânt (opțional)</li></ul>
  `;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/banner/vulcanizare`;

  return (
    <main className="page py-10" style={{ padding: 16 }}>
      <ProductJsonLd product={product} url={url} />

      <section className="mb-10">
        <h1 className="text-3xl font-extrabold mb-4">{product.title}</h1>
        <div className="card p-6">
          <BannerConfigurator productSlug={product.slug ?? product.routeSlug} initialWidth={product.width_cm ?? undefined} initialHeight={product.height_cm ?? undefined} />
        </div>
      </section>

      <section>
        <SeoToggle content={seoHtml} collapsedHeight={0} />
      </section>
    </main>
  );
}