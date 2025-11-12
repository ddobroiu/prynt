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
};

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0] ?? "/placeholder.png";
  const priceNum = typeof product.price === "number" ? product.price : Number(product.price || 0);
  const priceDisplay = Number.isFinite(priceNum) ? priceNum.toFixed(2) : "—";

  return (
    <article className="card bg-white/95 overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-2xl">
      <Link href={`/product/${product.slug}`} className="block" aria-label={`Vezi produs ${product.title}`}>
        <div className="w-full h-48 relative bg-gray-100 group">
          <Image src={img} alt={product.title ?? "Imagine produs"} fill style={{ objectFit: "cover" }} className="transition-opacity duration-300 group-hover:opacity-90 border-b border-white/10" />
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-ui">{product.title}</h3>
          <p className="text-sm text-muted flex-1 mt-2">{product.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-lg font-bold text-indigo-300">{priceDisplay} RON</div>
            <div className={`text-sm font-medium ${product.stock > 0 ? "badge-success px-2 py-1 rounded" : "text-red-400"}`}>
              {product.stock > 0 ? `În stoc: ${product.stock}` : "Stoc epuizat"}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}