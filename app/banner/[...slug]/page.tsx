import { notFound } from "next/navigation";
import ProductJsonLd from "@/components/ProductJsonLd";
import BannerConfigurator from "@/components/BannerConfigurator";
import ProductCard from "@/components/ProductCard";
import InStockScroller from "@/components/InStockScroller";
import { resolveProductForRequestedSlug, getAllProductSlugsByCategory, PRODUCTS } from "@/lib/products";
import type { Product } from "@/lib/products";
type Props = { params?: any };

export async function generateStaticParams() {
  // folosește exact categoria din lib/products.ts (ex: "bannere")
  const slugs = getAllProductSlugsByCategory("bannere");
  return slugs.map((slug) => ({ slug: [slug] }));
}

export async function generateMetadata({ params }: Props) {
  const resolved = await params;
  const raw = (resolved?.slug ?? []).join("/");
  // folosește aceeași categorie "bannere"
  const { product, isFallback } = await resolveProductForRequestedSlug(String(raw), "bannere");
  if (!product) return {};
  const metadata: any = {
    title: product.seo?.title || `${product.title} | Prynt`,
    description: product.seo?.description || product.description,
    openGraph: { title: product.seo?.title || product.title, description: product.description, images: product.images },
  };
  if (isFallback) {
    metadata.robots = { index: false, follow: true };
  }
  return metadata;
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const slugParts: string[] = resolved?.slug ?? [];
  const joinedSlug = slugParts.join("/");

  // atenție: category = "bannere" (corespondent cu metadata.category din PRODUCTS)
  const { product, initialWidth, initialHeight } = await resolveProductForRequestedSlug(String(joinedSlug), "bannere");

  if (!product) {
    // dacă resolver nu a returnat produs — 404
    return notFound();
  }

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/banner/${joinedSlug}`;

  return (
    <main style={{ padding: 16 }}>
      <ProductJsonLd product={(product as Product)} url={url} />
      <section style={{ marginTop: 18 }}>
        <header style={{ marginBottom: 18 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", margin: 0 }}>{product.title}</h1>
          <p style={{ marginTop: 8, color: "#9ca3af", textAlign: "center", marginBottom: 0 }}>{product.description}</p>
        </header>

        {/* Configurator moved to bottom of the page */}
        <div style={{ marginTop: 14 }}>
          <BannerConfigurator renderOnlyConfigurator={true} productSlug={product.slug ?? product.routeSlug} initialWidth={initialWidth ?? undefined} initialHeight={initialHeight ?? undefined} productImage={product.images?.[0]} />
        </div>

        {/* In-stock scroller (shows ProductCard as on shop page) — appears AFTER configurator */}
        {(() => {
          const catKey = String(product.metadata?.category ?? "bannere").toLowerCase();
          // Show all products from the same category (exclude the current product)
          const inStock: Product[] = (PRODUCTS || []).filter((p) => {
            const pCat = String(p.metadata?.category ?? "").toLowerCase();
            const isSame = pCat === catKey;
            const isCurrent = (p.slug ?? p.routeSlug) === (product.slug ?? product.routeSlug);
            return isSame && !isCurrent;
          });
          if (!inStock || inStock.length === 0) return null;
          return (
            <div style={{ margin: "18px 0" }}>
              <div style={{ textAlign: "center", padding: "8px 0 12px" }}>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", background: "linear-gradient(90deg,#7c3aed,#6366f1)", WebkitBackgroundClip: "text", color: "transparent" }}>Produse similare</h3>
                <p style={{ margin: "6px 0 0", color: "#9ca3af", fontSize: 13 }}>Alte modele din aceeași categorie</p>
              </div>
              <div style={{ padding: 12 }}>
                <InStockScroller products={inStock} perPage={4} intervalMs={3500} />
              </div>
            </div>
          );
        })()}
      </section>
    </main>
  );
}