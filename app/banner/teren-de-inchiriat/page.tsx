import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerTerenDeInchiriatPage() {
  const product = {
    id: "banner-teren-de-inchiriat",
    title: "Banner Teren de închiriat",
    description: "Banner pentru terenuri de închiriat — teren, parcele, loturi.",
    image: "/products/banner/teren-de-inchiriat.jpg",
    url: "https://prynt.ro/banner/teren-de-inchiriat",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Teren de închiriat</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="teren-de-inchiriat" productImage={product.image} />
      </main>
    </>
  );
}
