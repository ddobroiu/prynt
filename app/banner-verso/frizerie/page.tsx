import ProductJsonLd from "@/components/ProductJsonLd";
import PlianteConfigurator from "@/components/PlianteConfigurator"; // înlocuiește cu AfișConfigurator dacă ai
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

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/afise/frizerie`;

  return (
    <main className="page py-10" style={{ padding: 16 }}>
      <ProductJsonLd product={product} url={url} />
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold">{product.title}</h1>
        <p className="mt-2 text-white/70 max-w-3xl">{product.description}</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <article className="prose lg:col-span-2">
          <h2>Afișe pentru salonul tău</h2>
          <p>Text unic despre cum folosești afișele pentru promoții, reduceri și vizibilitate locală. Exemple, specificații materiale și recomandări.</p>
          <h3>Specificații recomandate</h3>
          <ul>
            <li>Format A2 sau A1 pentru vizibilitate</li>
            <li>Hârtie couché 150–200g pentru interior</li>
            <li>Laminare pentru protecție</li>
          </ul>
        </article>

        <aside className="lg:col-span-1">
          <div className="card p-4">
            <h3 className="text-lg font-semibold mb-2">Configurează afișul</h3>
            <PlianteConfigurator productSlug={product.slug ?? product.routeSlug} initialWidth={undefined} initialHeight={undefined} />
          </div>
        </aside>
      </div>
    </main>
  );
}