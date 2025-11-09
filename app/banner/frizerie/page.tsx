import ProductJsonLd from "@/components/ProductJsonLd";
import BannerConfigurator from "@/components/BannerConfigurator";
import SeoToggle from "@/components/SeoToggle";
import { getProductBySlug } from "@/lib/products";
import type { Product } from "@/lib/products";

export async function generateMetadata() {
  const prod = getProductBySlug("banner-frizerie");
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const url = `${base}/banner/frizerie`;
  if (!prod) return { title: "Bannere | Prynt" };

  return {
    title: prod.seo?.title || `${prod.title} | Prynt`,
    description: prod.seo?.description || prod.description,
    openGraph: { title: prod.seo?.title || prod.title, description: prod.description, images: prod.images, url },
    alternates: { canonical: url },
  };
}

export default function Page() {
  const product = getProductBySlug("banner-frizerie") as Product | undefined;
  if (!product) return <main style={{ padding: 32 }}><h1>Banner</h1></main>;

  const seoHtml = `
    <h2>Bannere pentru frizerii — materiale, finisaje și montaj</h2>
    <p>Bannere rezistente pentru exterior și interior, ideale pentru semnalistică sau promoții. Material recomandat: frontlit 440–510 g/mp. Finisaje: tiv, capse, găuri pentru vânt (opțional).</p>
    <h3>Recomandări</h3>
    <ul>
      <li>Dimensiuni frecvente pentru exterior: 200×100 cm, 300×100 cm</li>
      <li>Material: frontlit 440 g/mp (standard) sau 510 g/mp pentru durabilitate</li>
      <li>Finisaje incluse: tiv, capse; găuri pentru vânt +10%</li>
    </ul>
    <h3>FAQ</h3>
    <p><strong>Ce înseamnă tiv?</strong> Tivul golește marginea și o întărește pentru a putea pune capse și a montajul sigur.</p>
  `;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/banner/frizerie`;

  return (
    <main className="page py-10" style={{ padding: 16 }}>
      <ProductJsonLd product={product} url={url} />

      <section className="mb-8">
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