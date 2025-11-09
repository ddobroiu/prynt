import ProductJsonLd from "@/components/ProductJsonLd";
import PlianteConfigurator from "@/components/PlianteConfigurator"; // folosește afiș configurator dacă-l ai
import SeoToggle from "@/components/SeoToggle";
import { getProductBySlug } from "@/lib/products";
import type { Product } from "@/lib/products";

export async function generateMetadata() {
  const prod = getProductBySlug("afise-frizerie");
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const url = `${base}/afise/frizerie`;
  if (!prod) return { title: "Afișe | Prynt" };

  return {
    title: prod.seo?.title || `${prod.title} | Prynt`,
    description: prod.seo?.description || prod.description,
    openGraph: { title: prod.seo?.title || prod.title, description: prod.description, images: prod.images, url },
    alternates: { canonical: url },
  };
}

export default function Page() {
  const product = getProductBySlug("afise-frizerie") as Product | undefined;
  if (!product) return <main style={{ padding: 32 }}><h1>Afișe</h1></main>;

  const seoHtml = `
    <h2>Afișe pentru frizerii — formate, materiale și sfaturi de design</h2>
    <p>Afișele A2/A1 sunt foarte eficiente pentru anunțuri și promoții vizibile. Recomandăm utilizarea imaginilor clare, mesaje scurte și contrast bun pentru vizibilitate din depărtare.</p>
    <h3>Materiale</h3>
    <ul>
      <li>Hârtie couché 150–200 g/mp pentru interior</li>
      <li>Backlit/ vinyl pentru exterior cu laminare UV pentru protecție</li>
    </ul>
    <h3>Specificații tehnice</h3>
    <p>Trimite fișiere la 300 DPI, format CMYK, bleed 3–5 mm. Pentru afiș exterior recomandăm laminate și materiale rezistente la intemperii.</p>
    <h3>FAQ</h3>
    <p><strong>Pot comanda un singur afis?</strong> Da — acceptăm comenzi în tiraj mic.</p>
  `;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/afise/frizerie`;

  return (
    <main className="page py-10" style={{ padding: 16 }}>
      <ProductJsonLd product={product} url={url} />

      <section className="mb-8">
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