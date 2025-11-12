import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerGarsonieraDeInchiriatPage() {
  const product = {
    id: "banner-garsoniera-de-inchiriat",
    title: "Banner Garsonieră de închiriat",
    description: "Banner pentru promovarea garsonierelor de închiriat. Configurabil la dimensiuni și materiale.",
    image: "/products/banner/garsoniera-de-inchiriat.jpg",
    url: "https://prynt.ro/banner/garsoniera-de-inchiriat",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Garsonieră de închiriat</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="garsoniera-de-inchiriat" productImage={product.image} />
      </main>
    </>
  );
}
