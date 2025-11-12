import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerFructeSiLegumePage() {
  const product = {
    id: "banner-fructe-si-legume",
    title: "Banner FRUCTE SI LEGUME",
    description: "Banner pentru piețe sau magazine cu fructe și legume — culori vii și text clar.",
    image: "/products/banner/fructe-si-legume.jpg",
    url: "https://prynt.ro/banner/fructe-si-legume",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner FRUCTE SI LEGUME</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="fructe-si-legume" productImage={product.image} />
      </main>
    </>
  );
}
