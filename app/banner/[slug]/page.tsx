import Image from "next/image";
import { getProductBySlug, Product } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";
import ProductClient from "@/components/ProductClient";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

// generateMetadata: unwrap params (params can be a Promise)
export async function generateMetadata({ params }: Props) {
  const { slug } = (await params) as { slug: string };
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.title} — ${product.minWidthCm}x${product.minHeightCm} | Magazin`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images,
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = (await params) as { slug: string };
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/banner/${product.slug}`;

  return (
    <main style={{ padding: 16 }}>
      {/* Product structured data for SEO (server-side safe) */}
      <ProductJsonLd product={product as Product} url={url} />

      <h1 style={{ marginBottom: 6 }}>{product.title}</h1>
      <p style={{ marginTop: 0, color: "#666" }}>{product.description}</p>

      <div style={{ maxWidth: 800, marginTop: 12 }}>
        {/* next/image requires remote host configured in next.config */}
        <Image
          src={product.images[0]}
          alt={product.title}
          width={1200}
          height={800}
          style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: 6 }}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Pret de bază: </strong>
        {product.priceBase} {product.currency}
      </div>

      <section style={{ marginTop: 18 }}>
        <h2>Personalizează dimensiunea</h2>

        {/* ProductClient is a Client Component that contains interactive handlers (cart, fetch, etc.) */}
        <ProductClient product={product} />
      </section>
    </main>
  );
}