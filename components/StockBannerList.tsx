import StockBannerCard, { type StockBanner } from "./StockBannerCard";

export default function StockBannerList({ items }: { items: StockBanner[] }) {
  if (!items?.length) return null;

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Bannere în stoc</h2>
        <span className="text-sm text-white/60">{items.length} oferte</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <StockBannerCard key={it.id} item={it} />
        ))}
      </div>
    </section>
  );
}
