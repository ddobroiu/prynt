import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerNuBlocatiPage() {
  const product = {
    id: "banner-nu-blocati",
    title: "Banner NU BLOCATI!",
    description: "Banner pentru reducerea parkingului necorespunzător — mesaj clar și vizibil.",
    image: "/products/banner/nu-blocati.jpg",
    url: "https://prynt.ro/banner/nu-blocati",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner NU BLOCATI!</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="nu-blocati" productImage={product.image} />
      </main>
    </>
  );
}
