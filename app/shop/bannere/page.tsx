import ProductCard from "../../../components/ProductCard";

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

async function fetchBannere(): Promise<Product[]> {
  try {
    // Folosim URL relativ; Next.js rezolvă pe server. Poți înlocui cu NEXT_PUBLIC_SITE_URL dacă preferi absolute.
    const res = await fetch(`/api/products?category=bannere`, { cache: "no-store" });
    if (!res.ok) {
      // Pentru debugging: aruncăm sau returnăm array gol
      const txt = await res.text();
      console.error("products API error:", res.status, txt);
      return [];
    }

    const data = await res.json();

    // Acceptăm fie un array direct, fie un obiect { products: [...] }
    if (Array.isArray(data)) return data as Product[];
    if (data && Array.isArray(data.products)) return data.products as Product[];

    // Dacă primim altceva, logăm pentru debugging și returnăm array gol
    console.error("Unexpected products response shape:", data);
    return [];
  } catch (err) {
    console.error("fetchBannere failed:", err);
    return [];
  }
}

export default async function BannerePage() {
  const products = await fetchBannere();

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Bannere din stoc</h1>

      {products.length === 0 ? (
        <p>Momentan nu avem bannere în stoc sau datele nu sunt disponibile.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}