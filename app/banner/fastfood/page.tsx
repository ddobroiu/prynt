import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerFastFoodPage() {
  const product = {
    id: "banner-fastfood",
    title: "Banner FastFood",
    description: "Banner pentru restaurante fast-food — meniuri, oferte și promoții.",
    image: "/products/banner/fastfood.jpg",
    url: "https://prynt.ro/banner/fastfood",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner FastFood</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="fastfood" productImage={product.image} />
      </main>
    </>
  );
}
