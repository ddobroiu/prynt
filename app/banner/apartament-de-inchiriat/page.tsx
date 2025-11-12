import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerApartamentDeInchiriatPage() {
  const product = {
    id: "banner-apartament-de-inchiriat",
    title: "Banner Apartament de închiriat",
    description: "Banner personalizat pentru promovarea apartamentelor de închiriat. Configurabil la dimensiuni și materiale.",
    image: "/products/banner/apartament-de-inchiriat.jpg",
    url: "https://prynt.ro/banner/apartament-de-inchiriat",
    brand: "Prynt",
    offers: {
      priceCurrency: "RON",
      price: "Calculat la configurare",
      availability: "https://schema.org/InStock"
    }
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Apartament de închiriat</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="apartament-de-inchiriat" productImage={product.image} />
      </main>
    </>
  );
}
