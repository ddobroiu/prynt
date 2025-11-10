import Link from "next/link";

export default function ShopPage() {
  const categories = [
    { key: "bannere", label: "Bannere din stoc" },
    { key: "inchiriere", label: "Banner - închiriere" }
  ];

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Magazin</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((c) => (
          <Link
            key={c.key}
            href={`/shop/${c.key}`}
            className="block p-6 border rounded hover:shadow"
          >
            <h2 className="text-xl font-semibold">{c.label}</h2>
            <p className="text-sm text-muted-foreground">Vezi produsele disponibile</p>
          </Link>
        ))}
      </div>
    </main>
  );
}