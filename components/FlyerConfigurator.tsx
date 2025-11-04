// components/FlyerConfigurator.tsx
"use client";

import { useMemo, useState } from "react";
import { useCart } from "./CartProvider";
import { money } from "../lib/format";
import {
  computeFlyerPrice,
  type FlyerFormat,
  type PaperGsm,
  type PrintSide,
} from "../lib/pricing-flyer";

const FORMATS: FlyerFormat[] = ["A6", "A5", "A4", "A3"];
const PAPERS: PaperGsm[] = [130, 170, 250];

export default function FlyerConfigurator() {
  const [format, setFormat] = useState<FlyerFormat>("A5");
  const [paper, setPaper] = useState<PaperGsm>(130);
  const [side, setSide] = useState<PrintSide>("single");
  const [lam, setLam] = useState(false);
  const [qty, setQty] = useState(100);

  const cart = useCart();

  const price = useMemo(() => {
    return computeFlyerPrice({
      format,
      paper,
      side,
      lamination: lam,
      quantity: qty,
    });
  }, [format, paper, side, lam, qty]);

  function addToCart() {
    const id = `flyer-${format}-${paper}gsm-${side}-lam-${lam}-q${qty}`;
    cart.addItem({
      id,
      name: "Flayer",
      description: `${format} • ${paper} g/mp • ${side === "double" ? "față/verso" : "față"}${lam ? " • laminare" : ""}`,
      quantity: qty,
      unitAmount: price.unitPrice,
      totalAmount: price.total,
      meta: {
        format,
        paper,
        side,
        lamination: lam,
      },
    } as any);
  }

  const inputCls =
    "mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold mb-6">Configurează flayerul</h2>

        {/* rând 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-white/70">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as FlyerFormat)}
              className={inputCls}
            >
              {FORMATS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-white/70">Hârtie</label>
            <select
              value={paper}
              onChange={(e) => setPaper(Number(e.target.value) as PaperGsm)}
              className={inputCls}
            >
              {PAPERS.map((p) => (
                <option key={p} value={p}>{p} g/mp</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-white/70">Printare</label>
            <select
              value={side}
              onChange={(e) => setSide(e.target.value as PrintSide)}
              className={inputCls}
            >
              <option value="single">Față</option>
              <option value="double">Față/verso</option>
            </select>
          </div>
        </div>

        {/* rând 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="text-sm text-white/70">Laminare</label>
            <select
              value={lam ? "da" : "nu"}
              onChange={(e) => setLam(e.target.value === "da")}
              className={inputCls}
            >
              <option value="nu">Nu</option>
              <option value="da">Da</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-white/70">Tiraj (buc.)</label>
            <div className="mt-1 flex gap-2">
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-40 rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none"
              />
              <div className="flex flex-wrap gap-2">
                {[100, 250, 500, 1000, 2500, 5000].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQty(q)}
                    className={`px-3 py-2 rounded-lg text-sm border ${
                      qty === q
                        ? "bg-white text-black border-white"
                        : "bg-black/20 border-white/20 hover:bg-white/10"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
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
