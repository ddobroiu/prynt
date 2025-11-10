import Image from "next/image";
import Link from "next/link";

type Product = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  price: number;
  stock: number;
  images?: string[];
  attributes?: Record<string, string>;
};

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0] ?? "/placeholder.png";
  return (
    <article className="border rounded overflow-hidden flex flex-col">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="w-full h-48 relative bg-gray-100">
          <Image src={img} alt={product.title} fill style={{ objectFit: "cover" }} />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold">{product.title}</h3>
          <p className="text-sm text-gray-600 flex-1">{product.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-lg font-bold">{product.price.toFixed(2)} RON</div>
            <div className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
              {product.stock > 0 ? `În stoc: ${product.stock}` : "Stoc epuizat"}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}