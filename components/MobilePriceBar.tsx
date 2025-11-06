"use client";

type Props = {
  total: number;
  currency?: string; // implicit RON
  disabled?: boolean;
  onAddToCart?: () => void;
  onShowSummary?: () => void;
};

export default function MobilePriceBar({
  total,
  currency = "RON",
  disabled,
  onAddToCart,
  onShowSummary,
}: Props) {
  const fmt = new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden border-t border-gray-800 bg-gray-950/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
        <div className="flex-1">
          <div className="text-xs text-white/60">Total</div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {total > 0 ? fmt(total) : "—"}
          </div>
        </div>

        {onShowSummary && (
          <button
            type="button"
            onClick={onShowSummary}
            className="px-4 py-2 rounded-lg border border-white/10 text-white/90 hover:bg-white/5 text-sm"
          >
            Vezi sumar
          </button>
        )}

        {onAddToCart && (
          <button
            type="button"
            onClick={onAddToCart}
            disabled={disabled}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
          >
            Adaugă în coș
          </button>
        )}
      </div>
    </div>
  );
}