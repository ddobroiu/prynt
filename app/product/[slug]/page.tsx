import Image from "next/image";
import BannerConfigurator from "../../../components/BannerConfigurator";

type Product = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  price: number | string;
  stock: number;
  images?: string[];
  config?: any;
};

async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
    const url = `${base}/api/products?slug=${encodeURIComponent(slug)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error("product API error:", res.status);
      return null;
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("fetchProduct failed:", err);
    return null;
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const product = await fetchProduct(slug);

  if (!product) {
    return (
      <main className="container mx-auto py-16">
        <h1 className="text-2xl font-bold">Produs negăsit</h1>
        <p>Produsul nu există sau datele nu sunt disponibile.</p>
      </main>
    );
  }

  const img = product.images?.[0] ?? "/placeholder.png";

  return (
    <main className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="w-full h-96 relative bg-gray-100">
            <Image src={img} alt={product.title} fill style={{ objectFit: "contain" }} />
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <BannerConfigurator product={product} />
        </div>
      </div>
    </main>
  );
}