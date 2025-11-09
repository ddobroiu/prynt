import ProductJsonLd from "@/components/ProductJsonLd";
import PlianteConfigurator from "@/components/PlianteConfigurator";
import SeoToggle from "@/components/SeoToggle";
import { getProductBySlug } from "@/lib/products";
import type { Product } from "@/lib/products";

export async function generateMetadata() {
  const prod = getProductBySlug("pliante-vulcanizare");
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const url = `${base}/pliante/vulcanizare`;
  if (!prod) return { title: "Pliante | Prynt" };

  return {
    title: prod.seo?.title || `${prod.title} | Prynt`,
    description: prod.seo?.description || prod.description,
    openGraph: { title: prod.seo?.title || prod.title, description: prod.description, images: prod.images, url },
    alternates: { canonical: url },
  };
}

export default function Page() {
  const product = getProductBySlug("pliante-vulcanizare") as Product | undefined;
  if (!product) return <main style={{ padding: 32 }}><h1>Pliante</h1></main>;

  const seoHtml = `
    <h2>Pliante pentru vulcanizări — atrage clienți cu oferte clare</h2>
    <p>Pliantele pentru service auto și vulcanizări sunt ideal de folosit pentru promoții sezoniere (schimb de anvelope, verificări de iarnă/vară), pachete de service și oferte de fidelizare. Recomandăm formatele A6/A5, hârtie 115–170 g/mp și layout cu CTA clar.</p>
    <h3>Beneficii</h3>
    <ul>
      <li>Promovezi oferte de schimb anvelope și lubrifiere</li>
      <li>Cupone şi pachete pentru fidelizare</li>
      <li>Distribuție locală rapidă pentru vizibilitate imediată</li>
    </ul>
    <h3>Specificații tehnice</h3>
    <p>Trimite fișiere la 300 DPI, profil CMYK, bleed 3 mm. Formate recomandate: A6 (105×148), A5 (148×210).</p>
    <h3>FAQ</h3>
    <p><strong>Pot imprima pliante pentru campanii sezoniere?</strong> Da — tiraje flexibile și livrare rapidă.</p>
  `;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/pliante/vulcanizare`;

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