import ProductJsonLd from "@/components/ProductJsonLd";
import CanvasConfigurator from "@/components/CanvasConfigurator";
import SeoToggle from "@/components/SeoToggle";
import { getProductBySlug } from "@/lib/products";
import type { Product } from "@/lib/products";

export async function generateMetadata() {
  const prod = getProductBySlug("canvas-vulcanizare");
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const url = `${base}/canvas/vulcanizare`;
  if (!prod) return { title: "Canvas | Prynt" };

  return {
    title: prod.seo?.title || `${prod.title} | Prynt`,
    description: prod.seo?.description || prod.description,
    openGraph: { title: prod.seo?.title || prod.title, description: prod.description, images: prod.images, url },
    alternates: { canonical: url },
  };
}

export default function Page() {
  const product = getProductBySlug("canvas-vulcanizare") as Product | undefined;
  if (!product) return <main style={{ padding: 32 }}><h1>Canvas</h1></main>;

  const seoHtml = `
    <h2>Canvas pentru vulcanizări — decorează spațiul cu branding</h2>
    <p>Canvas-urile pot afișa portofolii, oferte sau imagini cu echipamente. Recomandăm pânză Fine Art și montaj pe șasiu din lemn.</p>
    <h3>Specificații</h3>
    <p>Dimensiuni personalizate, culori durabile și print de înaltă calitate.</p>
  `;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/canvas/vulcanizare`;

  return (
    <main className="page py-10" style={{ padding: 16 }}>
      <ProductJsonLd product={product} url={url} />

      <section className="mb-10">
        <h1 className="text-3xl font-extrabold mb-4">{product.title}</h1>
        <div className="card p-6">
          <CanvasConfigurator productSlug={product.slug ?? product.routeSlug} initialWidth={product.width_cm ?? undefined} initialHeight={product.height_cm ?? undefined} />
        </div>
      </section>

      <section>
        <SeoToggle content={seoHtml} collapsedHeight={0} />
      </section>
    </main>
  );
}