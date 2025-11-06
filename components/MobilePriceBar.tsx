"use client";

export default function MobilePriceBar({
  total,
  disabled,
  onAddToCart,
  onShowSummary,
}: {
  total: number;
  disabled: boolean;
  onAddToCart: () => void;
  onShowSummary: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b0f19] p-3 lg:hidden">
      <div className="page flex items-center gap-3">
        <button
          className="btn-outline flex-1"
          onClick={onShowSummary}
          aria-label="Vezi sumar"
        >
          Sumar
        </button>
        <div className="flex-1 text-right">
          <div className="text-base font-bold">{total > 0 ? `${total.toFixed(2)} RON` : "—"}</div>
          <button
            onClick={onAddToCart}
            disabled={disabled}
            className="btn-primary mt-1 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Adaugă în coș
          </button>
        </div>
      </div>
    </div>
  );
}