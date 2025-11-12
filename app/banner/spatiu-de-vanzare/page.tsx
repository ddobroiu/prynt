import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerSpatiuDeVanzarePage() {
  const product = {
    id: "banner-spatiu-de-vanzare",
    title: "Banner Spațiu de vânzare",
    description: "Banner pentru spații comerciale sau birouri de vânzare.",
    image: "/products/banner/spatiu-de-vanzare.jpg",
    url: "https://prynt.ro/banner/spatiu-de-vanzare",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Spațiu de vânzare</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="spatiu-de-vanzare" productImage={product.image} />
      </main>
    </>
  );
}
