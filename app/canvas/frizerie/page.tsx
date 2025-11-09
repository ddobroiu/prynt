import ProductJsonLd from "@/components/ProductJsonLd";
import CanvasConfigurator from "@/components/CanvasConfigurator";
import SeoToggle from "@/components/SeoToggle";
import { getProductBySlug } from "@/lib/products";
import type { Product } from "@/lib/products";

export async function generateMetadata() {
  const prod = getProductBySlug("canvas-frizerie");
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const url = `${base}/canvas/frizerie`;
  if (!prod) return { title: "Canvas | Prynt" };

  return {
    title: prod.seo?.title || `${prod.title} | Prynt`,
    description: prod.seo?.description || prod.description,
    openGraph: { title: prod.seo?.title || prod.title, description: prod.description, images: prod.images, url },
    alternates: { canonical: url },
  };
}

export default function Page() {
  const product = getProductBySlug("canvas-frizerie") as Product | undefined;
  if (!product) return <main style={{ padding: 32 }}><h1>Canvas</h1></main>;

  const seoHtml = `
    <h2>Canvas pentru frizerii — decor și identitate vizuală</h2>
    <p>Canvas-urile aduc o notă profesională în salon: afișe de brand, portofolii, imagini cu lucrări. Recomandăm pânză Fine Art și șasiu de lemn stabil.</p>
    <h3>Beneficii</h3>
    <ul><li>Aspect premium și durabilitate</li><li>Print de înaltă fidelitate a culorilor</li></ul>
    <h3>Specificații</h3>
    <p>Max width recomandată: 310 cm; livrare și montaj opțional.</p>
  `;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/canvas/frizerie`;

  return (
    <main className="page py-10" style={{ padding: 16 }}>
      <ProductJsonLd product={product} url={url} />

      <section className="mb-8">
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