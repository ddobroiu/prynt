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
export default function ProductCard({ product, imageHeightPx }: { product: Product; imageHeightPx?: number }) {
  const imgCandidates = product.images ?? [];
  const slugKey = String(product.slug ?? (product as any).routeSlug ?? product.id ?? "").toLowerCase();
  const genericSet = new Set<string>([
    "/products/banner/1.jpg",
    "/products/banner/2.jpg",
    "/products/banner/3.jpg",
    "/products/banner/4.jpg",
    "/products/canvas/1.jpg",
    "/products/canvas/2.jpg",
    "/products/canvas/3.jpg",
    "/products/afise/1.jpg",
    "/products/afise/2.jpg",
    "/products/afise/3.jpg",
    "/products/flayere/1.jpg",
    "/products/flayere/2.jpg",
    "/products/flayere/3.jpg",
    "/placeholder.png",
  ]);
  // Prefer an image that contains the product slug/id in its path (product-specific).
  let initialImg = imgCandidates.find((x) => !!x && slugKey && x.toLowerCase().includes(slugKey));
  if (!initialImg) {
    // Otherwise prefer the first non-generic image
    initialImg = imgCandidates.find((x) => !!x && !genericSet.has(x.toLowerCase())) ?? imgCandidates[0] ?? "/products/banner/1.jpg";
  }
  const priceNum = typeof product.price === "number" ? product.price : Number(product.price || 0);
  const categoryLower = String(product.category || "").toLowerCase();
  const isBanner = categoryLower === "bannere";
  const isCanvas = categoryLower === "canvas";
  const isAfise = categoryLower === "afise";
  const isFlayere = categoryLower === "flayere";
  // Special starting prices by category
  const priceDisplay = isBanner
    ? `De la ${Number(50).toFixed(0)} RON`
    : isCanvas
      ? `De la ${Number(79).toFixed(0)} RON`
      : isAfise
        ? `De la ${Number(3).toFixed(0)} RON`
        : isFlayere
          ? `De la ${Number(50).toFixed(0)} RON`
        : (Number.isFinite(priceNum) ? `De la ${priceNum.toFixed(0)} RON` : "—");

  // Route mapping by category
  const routeBase = isBanner ? "banner" : isCanvas ? "canvas" : categoryLower || "product";
  const productUrl = `/${routeBase}/${product.slug}`;
  return (
  <article className="card bg-linear-to-br from-white via-indigo-50 to-indigo-100 shadow-xl rounded-2xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-2xl h-full">
      <Link href={productUrl} className="block group" aria-label={`Configurează ${product.title}`}>
        <div className="w-full relative bg-gray-100 h-56 overflow-hidden" style={imageHeightPx ? { height: imageHeightPx } : undefined}>
          <img
            src={initialImg}
            alt={product.title ?? "Imagine produs"}
            loading="lazy"
            onError={(e) => {
              const el = e.currentTarget as HTMLImageElement;
              if (!el.dataset.fallback) {
                el.dataset.fallback = "1";
                el.src = isCanvas
                  ? "/products/canvas/1.jpg"
                  : isAfise
                    ? "/products/afise/1.jpg"
                    : isFlayere
                      ? "/products/flayere/1.jpg"
                      : "/products/banner/1.jpg";
              }
            }}
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            className="transition-opacity duration-300 group-hover:opacity-90 border-b border-indigo-100 block"
          />
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