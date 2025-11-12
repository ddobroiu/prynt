import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerServiceAutoPage() {
  const product = {
    id: "banner-service-auto",
    title: "Banner Service AUTO",
    description: "Banner pentru service auto — mentenanță, reparații și promoții.",
    image: "/products/banner/service-auto.jpg",
    url: "https://prynt.ro/banner/service-auto",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Service AUTO</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="service-auto" productImage={product.image} />
      </main>
    </>
  );
}
