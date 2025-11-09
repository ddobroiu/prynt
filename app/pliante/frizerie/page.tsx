import ProductJsonLd from "@/components/ProductJsonLd";
import PlianteConfigurator from "@/components/PlianteConfigurator";
import SeoToggle from "@/components/SeoToggle";
import { getProductBySlug } from "@/lib/products";
import type { Product } from "@/lib/products";

export async function generateMetadata() {
  const prod = getProductBySlug("pliante-frizerie");
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.prynt.ro").replace(/\/$/, "");
  const url = `${base}/pliante/frizerie`;
  if (!prod) return { title: "Pliante | Prynt" };

  return {
    title: prod.seo?.title || `${prod.title} | Prynt`,
    description: prod.seo?.description || prod.description,
    openGraph: { title: prod.seo?.title || prod.title, description: prod.description, images: prod.images, url },
    alternates: { canonical: url },
  };
}

export default function Page() {
  const product = getProductBySlug("pliante-frizerie") as Product | undefined;
  if (!product) {
    return (
      <main style={{ padding: 32 }}>
        <h1>Pliante</h1>
        <p>Pagina temporar indisponibilă.</p>
      </main>
    );
  }

  // SEO-rich HTML for the collapsed section (server-rendered so bots can see it)
  const seoHtml = `
    <h2>Pliante pentru frizerii — cum te ajută să aduci clienți</h2>
    <p>Pliantele sunt un instrument de marketing local eficient: ideale pentru promoții, fidelizare și comunicare directă cu publicul din zona salonului. La Prynt oferim servicii complete: design, tipărire și livrare. Pliantele pot conține oferte speciale, reduceri pentru prima tunsă și cupoane pentru fidelizare, toate optimizate pentru conversii.</p>

    <h3>Beneficii pentru frizerii</h3>
    <ul>
      <li>Creștere vizibilitate locală și atragere clienți noi prin distribuție locală.</li>
      <li>Cost eficient pe unitate în tiraje medii și mari.</li>
      <li>Design personalizat cu call-to-action clar (programări, oferte).</li>
      <li>Opțiuni multiple pentru hârtie și finisaje: hârtie couché, mat/glossy, laminare.</li>
    </ul>

    <h3>Specificații tehnice recomandate</h3>
    <p>Formate populare: A6 (105×148 mm), A5 (148×210 mm). Hârtie recomandată: 115–170 g/mp. Pentru materiale promoționale cu imagini folosește 300 DPI și profil de culoare CMYK. Bleed 3 mm pentru siguranța tăierii.</p>

    <h3>Exemple de utilizare</h3>
    <p>Pliante pentru pachete: tuns + spălat; flyere pentru oferte sezoniere; cupoane pentru fidelizare integrate în pliante.</p>

    <h3>Cum comand</h3>
    <ol>
      <li>Alege formatul și tirajul în configuratorul de mai sus.</li>
      <li>Încarcă fișierul tău (PDF recomandat) sau solicită design profesional de la echipa noastră.</li>
      <li>Finalizează plata și alege opțiunea de livrare sau ridicare din sediu.</li>
    </ol>

    <h3>Întrebări frecvente</h3>
    <h4>Cât durează producția?</h4>
    <p>După aprobare artwork: 2–4 zile lucrătoare în funcție de tiraj și finisaje.</p>

    <h4>Ce formate de fișier acceptați?</h4>
    <p>PDF/X-1a sau PDF standard, culori CMYK, imagini la 300 DPI. Putem ajuta la verificarea fișierelor înainte de tipărire.</p>

    <h3>SEO keywords & synonyms</h3>
    <p>pliante frizerie, pliante salon, flyere frizerie, pliante A5 frizerie, imprimare pliante frizerie, pliante promotional frizerie</p>
  `;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/pliante/frizerie`;

  return (
    <main className="page py-10" style={{ padding: 16 }}>
      <ProductJsonLd product={product} url={url} />

      {/* Configurator afișat complet, vizibil imediat */}
      <section className="mb-10">
        <h1 className="text-3xl font-extrabold mb-4">{product.title}</h1>
        <div className="card p-6">
          <PlianteConfigurator productSlug={product.slug ?? product.routeSlug} initialWidth={undefined} initialHeight={undefined} />
        </div>
      </section>

      {/* Conținut SEO bogat — ascuns inițial sub buton "Citește mai mult" */}
      <section style={{ marginTop: 24 }}>
        <SeoToggle content={seoHtml} collapsedHeight={0} />
      </section>
    </main>
  );
}