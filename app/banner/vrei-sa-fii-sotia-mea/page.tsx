import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerVreiSaFiiSotiaMeaPage() {
  const product = {
    id: "banner-vrei-sa-fii-sotia-mea",
    title: "Banner Vrei să fii soția mea?",
    description: "Banner personalizat pentru declarații originale și surprize.",
    image: "/products/banner/vrei-sa-fii-sotia-mea.jpg",
    url: "https://prynt.ro/banner/vrei-sa-fii-sotia-mea",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Vrei să fii soția mea?</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="vrei-sa-fii-sotia-mea" productImage={product.image} />
      </main>
    </>
  );
}
