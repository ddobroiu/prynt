import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerSpatiuDeInchiriatPage() {
  const product = {
    id: "banner-spatiu-de-inchiriat",
    title: "Banner Spațiu de închiriat",
    description: "Banner pentru spații comerciale sau birouri de închiriat.",
    image: "/products/banner/spatiu-de-inchiriat.jpg",
    url: "https://prynt.ro/banner/spatiu-de-inchiriat",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Spațiu de închiriat</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="spatiu-de-inchiriat" productImage={product.image} />
      </main>
    </>
  );
}
