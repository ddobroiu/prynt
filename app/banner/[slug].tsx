import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { getAllProducts, getProductBySlug, Product } from "../../lib/products";
import ProductJsonLd from "../../components/ProductJsonLd";
import DimensionEditor from "../../components/DimensionEditor";

type Props = {
  product: Product;
};

export default function ProductPage({ product }: Props) {
  if (!product) return <div>Produsul nu a fost găsit</div>;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/bannere/${product.slug}`;

  return (
    <>
      <Head>
        <title>{`${product.title} — ${product.minWidthCm}x${product.minHeightCm} | Magazin`}</title>
        <meta name="description" content={product.description.slice(0, 160)} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.images[0]} />
      </Head>

      <ProductJsonLd product={product} url={url} />

      <main style={{ padding: 16 }}>
        <h1>{product.title}</h1>
        <p>{product.description}</p>

        <div style={{ maxWidth: 800 }}>
          <Image
            src={product.images[0]}
            alt={product.title}
            width={1200}
            height={800}
            style={{ width: "100%", height: "auto" }}
          />
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
            onPriceChange={(p) => {
              /* optional: actualizează UI */
            }}
            onAddToCart={(payload) => {
              // Aici poți integra logica de coș (localStorage / API)
              console.log("add to cart", payload);
            }}
          />
        </section>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const products = await getAllProducts();
  const paths = products.map((p) => ({ params: { slug: p.slug } }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug as string;
  const product = await getProductBySlug(slug);
  if (!product) return { notFound: true, revalidate: 60 };
  return { props: { product }, revalidate: 60 };
};