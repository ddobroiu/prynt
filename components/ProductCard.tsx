import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  price: number | string;
  stock: number;
  images?: string[];
  attributes?: Record<string, string>;
  category?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0] ?? "/placeholder.png";
  const priceNum = typeof product.price === "number" ? product.price : Number(product.price || 0);
  const isBanner = String(product.category || "").toLowerCase() === "bannere";
  // For banners show a 'De la 50 RON' starting price instead of a fixed 250
  const priceDisplay = isBanner ? `De la ${Number(50).toFixed(0)} RON` : (Number.isFinite(priceNum) ? `De la ${priceNum.toFixed(0)} RON` : "—");

  const productUrl = isBanner ? `/banner/${product.slug}` : `/product/${product.slug}`;
  return (
    <article className="card bg-gradient-to-br from-white via-indigo-50 to-indigo-100 shadow-xl rounded-2xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-2xl h-full">
      <Link href={productUrl} className="block group" aria-label={`Configurează ${product.title}`}>
        <div className="w-full h-56 relative bg-gray-100">
          <Image src={img} alt={product.title ?? "Imagine produs"} fill style={{ objectFit: "cover" }} className="transition-opacity duration-300 group-hover:opacity-90 border-b border-indigo-100" />
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-2xl font-bold text-indigo-900 mb-2">{product.title}</h3>
          <p className="text-base text-muted flex-1 mb-4">{product.description}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-bold text-indigo-600">{priceDisplay}</span>
            <button type="button" className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-500 transition">Configurează</button>
          </div>
        </div>
      </Link>
    </article>
  );
}