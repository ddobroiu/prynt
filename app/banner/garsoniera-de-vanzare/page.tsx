import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerGarsonieraDeVanzarePage() {
  const product = {
    id: "banner-garsoniera-de-vanzare",
    title: "Banner Garsonieră de vânzare",
    description: "Banner pentru promovarea garsonierelor de vânzare. Configurabil la dimensiuni și materiale.",
    image: "/products/banner/garsoniera-de-vanzare.jpg",
    url: "https://prynt.ro/banner/garsoniera-de-vanzare",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Garsonieră de vânzare</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="garsoniera-de-vanzare" productImage={product.image} />
      </main>
    </>
  );
}
