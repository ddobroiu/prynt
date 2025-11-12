import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerVulcanizarePage() {
  const product = {
    id: "banner-vulcanizare",
    title: "Banner Vulcanizare",
    description: "Banner pentru service-uri de vulcanizare — servicii și oferte.",
    image: "/products/banner/vulcanizare.jpg",
    url: "https://prynt.ro/banner/vulcanizare",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Vulcanizare</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="vulcanizare" productImage={product.image} />
      </main>
    </>
  );
}
