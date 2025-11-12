import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerCabinetStomatologicPage() {
  const product = {
    id: "banner-cabinet-stomatologic",
    title: "Banner Cabinet Stomatologic",
    description: "Banner pentru cabinete stomatologice — informare, program și oferte.",
    image: "/products/banner/cabinet-stomatologic.jpg",
    url: "https://prynt.ro/banner/cabinet-stomatologic",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner Cabinet Stomatologic</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="cabinet-stomatologic" productImage={product.image} />
      </main>
    </>
  );
}
