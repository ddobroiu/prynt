import BannerConfigurator from "@/components/BannerConfigurator";
import ProductJsonLd from "@/components/ProductJsonLd";

export default function BannerBarbershopPage() {
  const product = {
    id: "banner-barbershop",
    title: "Banner BARBERSHOP",
    description: "Banner pentru barbershop — logo, oferte și program.",
    image: "/products/banner/barbershop.jpg",
    url: "https://prynt.ro/banner/barbershop",
  };

  return (
    <>
      <ProductJsonLd product={product} url={product.url} />
      <main className="page py-8">
        <h1 className="text-3xl font-bold mb-4">Banner BARBERSHOP</h1>
        <p className="mb-6 text-lg text-muted">{product.description}</p>
        <BannerConfigurator productSlug="barbershop" productImage={product.image} />
      </main>
    </>
  );
}
