import Image from "next/image";
import { getProductBySlug, Product } from "@/lib/products";
import ProductJsonLd from "@/components/ProductJsonLd";
import ProductClient from "@/components/ProductClient";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

function parseSlugWithSize(slugWithSize: string) {
  const m = slugWithSize.match(/^(.*)-(\d{1,4})x(\d{1,4})$/);
  if (m) {
    return { baseSlug: m[1], width: Number(m[2]), height: Number(m[3]) };
  }
  return { baseSlug: slugWithSize, width: undefined, height: undefined };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = (await params) as { slug: string };
  const { baseSlug } = parseSlugWithSize(slug);
  const product = await getProductBySlug(baseSlug);
  if (!product) return {};
  return {
    title: `${product.title} — ${product.minWidthCm}x${product.minHeightCm} | Prynt`,
    description: product.description,
    openGraph: { title: product.title, description: product.description, images: product.images },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = (await params) as { slug: string };
  const parsed = parseSlugWithSize(slug);
  const product = await getProductBySlug(parsed.baseSlug);
  if (!product) return notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/banner/${slug}`;

  return (
    <main style={{ padding: 16 }}>
      <ProductJsonLd product={product as Product} url={url} />

      <h1 style={{ marginBottom: 6 }}>{product.title}</h1>
      <p style={{ marginTop: 0, color: "#888" }}>{product.description}</p>

      <div style={{ maxWidth: 800, marginTop: 12 }}>
        <Image src={product.images[0]} alt={product.title} width={1200} height={800} style={{ width: "100%", height: "auto", borderRadius: 6 }} />
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Pret de bază: </strong>
        {product.priceBase} {product.currency}
      </div>

      <section style={{ marginTop: 18 }}>
        <h2>Personalizează dimensiunea și materialul</h2>
        <ProductClient product={product} initialWidth={parsed.width} initialHeight={parsed.height} />
      </section>
    </main>
  );
}