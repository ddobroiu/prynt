import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerCasaDeInchiriatPage() {
  const product = {
    id: "banner-casa-de-inchiriat",
    title: "Banner Casa de închiriat",
    description: "Banner personalizat pentru promovarea caselor de închiriat. Configurabil la dimensiuni și materiale.",
    image: "/products/banner/casa-de-inchiriat.jpg",
    url: "https://prynt.ro/banner/casa-de-inchiriat",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Casa de închiriat</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="casa-de-inchiriat" productImage={product.image} />
      </main>
    </>
  );
}
