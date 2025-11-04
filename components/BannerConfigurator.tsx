"use client";

import { useMemo, useState } from "react";
import { computeBannerPrice, type BannerMaterial } from "../lib/pricing";

const MATERIALS: { value: BannerMaterial; label: string }[] = [
  { value: "frontlit_440", label: "Frontlit 440 g/mp" },
  { value: "frontlit_510", label: "Frontlit 510 g/mp" },
];

export default function BannerConfigurator() {
  const [width, setWidth] = useState(300);   // cm
  const [height, setHeight] = useState(100); // cm
  const [qty, setQty] = useState(1);
  const [material, setMaterial] = useState<BannerMaterial>("frontlit_440");
  const [wantWindHoles, setWantWindHoles] = useState(false);
  const [wantHemAndGrommets, setWantHemAndGrommets] = useState(false);

  const price = useMemo(() => {
    return computeBannerPrice({
      width_cm: width,
      height_cm: height,
      quantity: qty,
      material,
      want_wind_holes: wantWindHoles,
      want_hem_and_grommets: wantHemAndGrommets,
    });
  }, [width, height, qty, material, wantWindHoles, wantHemAndGrommets]);

  function addToCart() {
    alert(
      `Banner ${width}×${height} cm • ${qty} buc.\n` +
      `Total: ${price.total} RON`
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Card configurator */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold mb-6">Configurează bannerul</h2>

        {/* Dimensiuni */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white/70">Lățime (cm)</label>
            <input
              type="number" min={10} value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-white/70">Lungime (cm)</label>
            <input
              type="number" min={10} value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none"
            />
          </div>
        </div>

        {/* Cantitate */}
        <div className="mt-4">
          <label className="text-sm text-white/70">Cantitate</label>
          <input
            type="number" min={1} value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="mt-1 w-40 rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none"
          />
        </div>

        {/* Material */}
        <div className="mt-4">
          <label className="text-sm text-white/70">Material</label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value as BannerMaterial)}
            className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none"
          >
            {MATERIALS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {/* Opțiuni (nu arătăm procente, doar selecția) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm text-white/70">Găuri de vânt</label>
            <select
              value={wantWindHoles ? "da" : "nu"}
              onChange={(e) => setWantWindHoles(e.target.value === "da")}
              className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none"
            >
              <option value="nu">Nu doresc</option>
              <option value="da">Doresc</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-white/70">Tiv + capse</label>
            <select
              value={wantHemAndGrommets ? "da" : "nu"}
              onChange={(e) => setWantHemAndGrommets(e.target.value === "da")}
              className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none"
            >
              <option value="nu">Nu doresc</option>
              <option value="da">Doresc</option>
            </select>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={addToCart}
          className="mt-6 w-full md:w-auto px-5 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90"
        >
          Adaugă în coș
        </button>

        {/* Rezumat minimalist – DOAR sub buton */}
        <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-white/70">Suprafață</span>
            <span className="font-semibold">{price.sqm} m²</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-white/70">Preț / m²</span>
            <span className="font-semibold">{price.pricePerSqm} RON</span>
          </div>
          <div className="mt-3 h-px bg-white/10" />
          <div className="mt-3 flex items-center justify-between text-base">
            <span>Total</span>
            <span className="font-bold">{price.total} RON</span>
          </div>
        </div>
      </div>
    </div>
  );
}
