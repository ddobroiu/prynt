import Image from "next/image";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import ProductJsonLd from "@/components/ProductJsonLd";
import { resolveProductForRequestedSlug } from "@/lib/products";
import type { Product } from "@/lib/products";

const BannerConfigurator = dynamic(() => import("@/components/BannerConfigurator"), { ssr: false });

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const { slug } = params as { slug: string };
  const { product, isFallback } = await resolveProductForRequestedSlug(String(slug));

  if (!product) return {};

  const metadata: any = {
    title: `${product.title} — ${product.minWidthCm}x${product.minHeightCm} | Prynt`,
    description: product.description,
    openGraph: { title: product.title, description: product.description, images: product.images },
  };

  // If this is a generic fallback page, discourage indexing (optional)
  if (isFallback) {
    metadata.robots = { index: false, follow: true };
  }

  return metadata;
}

export default async function Page({ params }: Props) {
  const { slug } = params as { slug: string };
  const { product, initialWidth, initialHeight, isFallback } = await resolveProductForRequestedSlug(String(slug));

  if (!product) return notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/banner/${slug}`;

  // Render server-side product info and mount client configurator
  return (
    <main style={{ padding: 16 }}>
      <ProductJsonLd product={product as Product} url={url} />

      <h1 style={{ marginBottom: 6 }}>{product.title}</h1>
      <p style={{ marginTop: 0, color: "#888" }}>{product.description}</p>

      <div style={{ maxWidth: 800, marginTop: 12 }}>
        {/* next/image requires valid src; product.images[0] should be a usable url or a public path */}
        <Image
          src={product.images[0]}
          alt={product.title}
          width={1200}
          height={800}
          style={{ width: "100%", height: "auto", borderRadius: 6 }}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Pret de bază: </strong>
        {product.priceBase} {product.currency}
      </div>

      <section style={{ marginTop: 18 }}>
        <h2>Personalizează dimensiunea și materialul</h2>

        {/* BannerConfigurator is a client component (ssr: false).
            We pass productSlug (server-known product slug) and initial dimension values. */}
        <BannerConfigurator
          productSlug={product.slug}
          initialWidth={initialWidth}
          initialHeight={initialHeight}
        />

        {isFallback && (
          <div style={{ marginTop: 10, color: "#ffa500" }}>
            Observație: nu s‑a găsit un produs exact pentru această denumire — se folosește configuratorul generic.
          </div>
        )}
      </section>
    </main>
  );
}