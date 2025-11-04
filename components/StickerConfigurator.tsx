"use client";

import { useMemo, useState } from "react";
import { money } from "../lib/format";
import { computeStickerPrice } from "../lib/pricing-sticker";
import { useCart } from "./CartProvider";

export default function StickerConfigurator() {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [qty, setQty] = useState(1);
  const [material, setMaterial] = useState<"lucios" | "mat">("lucios");
  const [laminare, setLaminare] = useState(false);

  const cart = useCart();

  const price = useMemo(() => {
    return computeStickerPrice({
      width,
      height,
      quantity: qty,
      material,
      laminare,
    });
  }, [width, height, qty, material, laminare]);

  function addToCart() {
    cart.addItem({
      id: "autocolant",
      name: "Autocolant personalizat",
      description: `${material}, ${laminare ? "cu laminare" : "fără laminare"}`,
      quantity: qty,
      unitAmount: price.unitPrice,
      totalAmount: price.total,
      meta: { width, height, material, laminare },
    } as any);
  }

  const inputCls =
    "mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none";

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Configurează autocolantul</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-white/70">Lățime (cm)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-sm text-white/70">Înălțime (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-sm text-white/70">Cantitate</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-sm text-white/70">Material</label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value as "lucios" | "mat")}
            className={inputCls}
          >
            <option value="lucios">Lucios</option>
            <option value="mat">Mat</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          id="laminare"
          type="checkbox"
          checked={laminare}
          onChange={(e) => setLaminare(e.target.checked)}
          className="accent-white"
        />
        <label htmlFor="laminare" className="text-sm text-white/80">
          Doresc laminare (protecție UV)
        </label>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
        <button
          onClick={addToCart}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90"
        >
          Adaugă în coș
        </button>
        <a
          href="/checkout"
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/20 bg-white/0 text-white hover:bg-white/10 text-center"
        >
          Mergi la finalizare
        </a>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-white/70">Preț / m²</span>
          <span className="font-semibold">{money(price.unitPrice)}</span>
        </div>
        <div className="mt-3 h-px bg-white/10" />
        <div className="mt-3 flex items-center justify-between text-base">
          <span>Total</span>
          <span className="font-bold">{money(price.total)}</span>
        </div>
      </div>
    </div>
  );
}
