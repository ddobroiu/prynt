// components/CanvasConfigurator.tsx
"use client";

import { useMemo, useState } from "react";
import { useCart } from "./CartProvider";
import { money } from "../lib/format";
import {
  computeCanvasPrice,
  type CanvasShape,
  type CanvasSize,
} from "../lib/pricing-canvas";

const RECT_SIZES: CanvasSize[] = ["30x40", "40x60", "60x90"];
const SQUARE_SIZES: CanvasSize[] = ["30x30", "40x40", "60x60", "90x90"];

export default function CanvasConfigurator() {
  const [shape, setShape] = useState<CanvasShape>("rect");
  const [size, setSize] = useState<CanvasSize>("30x40");
  const [qty, setQty] = useState<number>(1);

  const cart = useCart();

  // ajustează automat dimensiunile când se schimbă forma
  function onShapeChange(next: CanvasShape) {
    setShape(next);
    const list = next === "rect" ? RECT_SIZES : SQUARE_SIZES;
    if (!list.includes(size)) setSize(list[0]);
  }

  const price = useMemo(() => {
    return computeCanvasPrice({ shape, size, quantity: qty });
  }, [shape, size, qty]);

  function addToCart() {
    const id = `canvas-${shape}-${size}`;
    cart.addItem({
      id,
      name: "Canvas pe șasiu",
      description: `${shape === "rect" ? "Dreptunghi" : "Pătrat"} • ${size}`,
      quantity: qty,
      unitAmount: price.unitPrice,
      totalAmount: price.total,
      meta: { shape, size },
    } as any);
  }

  const inputCls =
    "mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none";

  const sizeOptions = shape === "rect" ? RECT_SIZES : SQUARE_SIZES;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold mb-6">Configurează canvasul</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Formă */}
          <div>
            <label className="text-sm text-white/70">Formă</label>
            <select
              value={shape}
              onChange={(e) => onShapeChange(e.target.value as CanvasShape)}
              className={inputCls}
            >
              <option value="rect">Dreptunghi</option>
              <option value="square">Pătrat</option>
            </select>
          </div>

          {/* Dimensiune */}
          <div>
            <label className="text-sm text-white/70">Dimensiune</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as CanvasSize)}
              className={inputCls}
            >
              {sizeOptions.map((s) => (
                <option key={s} value={s}>
                  {s.replace("x", " x ")} cm
                </option>
              ))}
            </select>
          </div>

          {/* Cantitate */}
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
        </div>

        {/* CTA */}
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

        {/* Rezumat minimalist */}
        <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-white/70">Preț / buc.</span>
            <span className="font-semibold">{money(price.unitPrice)}</span>
          </div>
          <div className="mt-3 h-px bg-white/10" />
          <div className="mt-3 flex items-center justify-between text-base">
            <span>Total</span>
            <span className="font-bold">{money(price.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
