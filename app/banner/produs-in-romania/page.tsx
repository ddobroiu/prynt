import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerProdusInRomaniaPage() {
  const product = {
    id: "banner-produs-in-romania",
    title: "Banner Produs în România",
    description: "Banner promotional 'Produs în România' — ideal pentru magazine și producători locali.",
    image: "/products/banner/produs-in-romania.jpg",
    url: "https://prynt.ro/banner/produs-in-romania",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Produs în România</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="produs-in-romania" productImage={product.image} />
      </main>
    </>
  );
}
