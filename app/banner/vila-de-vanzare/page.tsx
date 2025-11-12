import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerVilaDeVanzarePage() {
  const product = {
    id: "banner-vila-de-vanzare",
    title: "Banner Vilă de vânzare",
    description: "Banner pentru vile și case de vânzare.",
    image: "/products/banner/vila-de-vanzare.jpg",
    url: "https://prynt.ro/banner/vila-de-vanzare",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Vilă de vânzare</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="vila-de-vanzare" productImage={product.image} />
      </main>
    </>
  );
}
