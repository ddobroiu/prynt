import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerVilaDeInchiriatPage() {
  const product = {
    id: "banner-vila-de-inchiriat",
    title: "Banner Vilă de închiriat",
    description: "Banner pentru vile și case de vacanță de închiriat.",
    image: "/products/banner/vila-de-inchiriat.jpg",
    url: "https://prynt.ro/banner/vila-de-inchiriat",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Vilă de închiriat</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="vila-de-inchiriat" productImage={product.image} />
      </main>
    </>
  );
}
