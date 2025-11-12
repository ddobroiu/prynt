import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerDeInchiriatPage() {
  const product = {
    id: "banner-de-inchiriat",
    title: "Banner De închiriat",
    description: "Banner pentru oferte generale de închiriere. Configurabil la dimensiuni și materiale.",
    image: "/products/banner/de-inchiriat.jpg",
    url: "https://prynt.ro/banner/de-inchiriat",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner De închiriat</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="de-inchiriat" productImage={product.image} />
      </main>
    </>
  );
}
