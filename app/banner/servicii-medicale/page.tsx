import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerServiciiMedicalePage() {
  const product = {
    id: "banner-servicii-medicale",
    title: "Banner Servicii Medicale",
    description: "Banner pentru clinici și cabinete medicale — servicii, program și contact.",
    image: "/products/banner/servicii-medicale.jpg",
    url: "https://prynt.ro/banner/servicii-medicale",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Servicii Medicale</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="servicii-medicale" productImage={product.image} />
      </main>
    </>
  );
}
