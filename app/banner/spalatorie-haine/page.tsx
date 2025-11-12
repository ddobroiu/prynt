import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerSpalatorieHainePage() {
  const product = {
    id: "banner-spalatorie-haine",
    title: "Banner Spălătorie Haine",
    description: "Banner pentru spălătorii — servicii, prețuri și oferte.",
    image: "/products/banner/spalatorie-haine.jpg",
    url: "https://prynt.ro/banner/spalatorie-haine",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Spălătorie Haine</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="spalatorie-haine" productImage={product.image} />
      </main>
    </>
  );
}
