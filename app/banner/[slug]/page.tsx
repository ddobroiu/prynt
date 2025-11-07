import Image from "next/image";
import { getProductBySlug } from "@/lib/products";
import DimensionEditor from "@/components/DimensionEditor";
import ProductJsonLd from "@/components/ProductJsonLd";
import { notFound } from "next/navigation";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props) {
  const product = await getProductBySlug(params.slug);
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
  const slug = params.slug;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/banner/${product.slug}`;

  return (
    <main style={{ padding: 16 }}>
      {/* JSON-LD for SEO */}
      <ProductJsonLd product={product} url={url} />

      <h1>{product.title}</h1>
      <p>{product.description}</p>

      <div style={{ maxWidth: 800 }}>
        <Image src={product.images[0]} alt={product.title} width={1200} height={800} style={{ width: "100%", height: "auto" }} />
      </div>

      <div style={{ marginTop: 16 }}>
        <strong>Pret de bază: </strong>
        {product.priceBase} {product.currency}
      </div>

      <section style={{ marginTop: 18 }}>
        <h2>Personalizează dimensiunea</h2>
        <DimensionEditor
          minWidth={product.minWidthCm}
          maxWidth={product.maxWidthCm}
          minHeight={product.minHeightCm}
          maxHeight={product.maxHeightCm}
          onAddToCart={(payload) => {
            console.log("add to cart", payload);
          }}
        />
      </section>
    </main>
  );
}