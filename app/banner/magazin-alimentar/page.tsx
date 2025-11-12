import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerMagazinAlimentarPage() {
  const product = {
    id: "banner-magazin-alimentar",
    title: "Banner MAGAZIN ALIMENTAR",
    description: "Banner pentru magazine alimentare — promoții, orar și produse proaspete.",
    image: "/products/banner/magazin-alimentar.jpg",
    url: "https://prynt.ro/banner/magazin-alimentar",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner MAGAZIN ALIMENTAR</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="magazin-alimentar" productImage={product.image} />
      </main>
    </>
  );
}
