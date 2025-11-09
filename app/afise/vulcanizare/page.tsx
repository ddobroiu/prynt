import ProductJsonLd from "@/components/ProductJsonLd";
import PlianteConfigurator from "@/components/PlianteConfigurator"; // or a specific AfisConfigurator if you have one
import SeoToggle from "@/components/SeoToggle";
import { getProductBySlug } from "@/lib/products";
import type { Product } from "@/lib/products";

export async function generateMetadata() {
  const prod = getProductBySlug("afise-vulcanizare");
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const url = `${base}/afise/vulcanizare`;
  if (!prod) return { title: "Afișe | Prynt" };

  return {
    title: prod.seo?.title || `${prod.title} | Prynt`,
    description: prod.seo?.description || prod.description,
    openGraph: { title: prod.seo?.title || prod.title, description: prod.description, images: prod.images, url },
    alternates: { canonical: url },
  };
}

export default function Page() {
  const product = getProductBySlug("afise-vulcanizare") as Product | undefined;
  if (!product) return <main style={{ padding: 32 }}><h1>Afișe</h1></main>;

  const seoHtml = `
    <h2>Afișe pentru vulcanizări — formate și materiale recomandate</h2>
    <p>Afișele A2/A1 sunt recomandate pentru anunțuri de service și oferte. Folosește texte scurte, imagini cu servicii și un CTA clar pentru programări.</p>
    <h3>Specificații</h3>
    <ul><li>A2 (420×594 mm), A1 (594×841 mm)</li><li>Hârtie couché 150–250 g/mp; laminare opțională</li></ul>
    <h3>FAQ</h3><p>Pentru tiraje mici contactați suportul.</p>
  `;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/afise/vulcanizare`;

  return (
    <main className="page py-10" style={{ padding: 16 }}>
      <ProductJsonLd product={product} url={url} />

      <section className="mb-10">
        <h1 className="text-3xl font-extrabold mb-4">{product.title}</h1>
        <div className="card p-6">
          <PlianteConfigurator productSlug={product.slug ?? product.routeSlug} initialWidth={undefined} initialHeight={undefined} />
        </div>
      </section>

      <section>
        <SeoToggle content={seoHtml} collapsedHeight={0} />
      </section>
    </main>
  );
}