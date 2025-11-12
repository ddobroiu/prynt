import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerTerenDeVanzarePage() {
  const product = {
    id: "banner-teren-de-vanzare",
    title: "Banner Teren de vânzare",
    description: "Banner pentru terenuri de vânzare — teren, parcele, loturi.",
    image: "/products/banner/teren-de-vanzare.jpg",
    url: "https://prynt.ro/banner/teren-de-vanzare",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Teren de vânzare</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="teren-de-vanzare" productImage={product.image} />
      </main>
    </>
  );
}
