import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerCasaDeVanzarePage() {
  const product = {
    id: "banner-casa-de-vanzare",
    title: "Banner Casa de vânzare",
    description: "Banner personalizat pentru promovarea caselor de vânzare. Configurabil la dimensiuni și materiale.",
    image: "/products/banner/casa-de-vanzare.jpg",
    url: "https://prynt.ro/banner/casa-de-vanzare",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Casa de vânzare</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="casa-de-vanzare" productImage={product.image} />
      </main>
    </>
  );
}
