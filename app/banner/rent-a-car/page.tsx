import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerRentACarPage() {
  const product = {
    id: "banner-rent-a-car",
    title: "Banner RENT A CAR",
    description: "Banner pentru închirieri auto — flote, oferte și contact rapid.",
    image: "/products/banner/rent-a-car.jpg",
    url: "https://prynt.ro/banner/rent-a-car",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner RENT A CAR</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="rent-a-car" productImage={product.image} />
      </main>
    </>
  );
}
