import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerLaMultiAniPage() {
  const product = {
    id: "banner-la-multi-ani",
    title: "Banner La mulți ani!",
    description: "Banner aniversar pentru sărbători și evenimente.",
    image: "/products/banner/la-multi-ani.jpg",
    url: "https://prynt.ro/banner/la-multi-ani",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner La mulți ani!</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="la-multi-ani" productImage={product.image} />
      </main>
    </>
  );
}
