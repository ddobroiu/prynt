import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerTerenMpDeVanzarePage() {
  const product = {
    id: "banner-teren-mp-de-vanzare",
    title: "Banner Teren + Mp de vânzare",
    description: "Banner pentru terenuri și suprafețe de vânzare (mp).",
    image: "/products/banner/teren-mp-de-vanzare.jpg",
    url: "https://prynt.ro/banner/teren-mp-de-vanzare",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Teren + Mp de vânzare</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="teren-mp-de-vanzare" productImage={product.image} />
      </main>
    </>
  );
}
