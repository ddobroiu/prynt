// components/BannerConfigurator.tsx
"use client";

import { useMemo, useState } from "react";
import { computeBannerPrice, type BannerMaterial } from "../lib/pricing";
import { useCart } from "./CartProvider";
import { money } from "../lib/format";

const MATERIALS: { value: BannerMaterial; label: string }[] = [
  { value: "frontlit_440", label: "Frontlit 440 g/mp" },
  { value: "frontlit_510", label: "Frontlit 510 g/mp" }, // +10% în calcule, invizibil în UI
];

export default function BannerConfigurator() {
  const [width, setWidth] = useState<number>(300);   // cm
  const [height, setHeight] = useState<number>(100); // cm
  const [qty, setQty] = useState<number>(1);
  const [material, setMaterial] = useState<BannerMaterial>("frontlit_440");
  const [wantWindHoles, setWantWindHoles] = useState<boolean>(false);          // Găuri de vânt (+10% invizibil)
  const [wantHemAndGrommets, setWantHemAndGrommets] = useState<boolean>(false); // Tiv + capse (+10% invizibil)
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const cart = useCart();

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

  function clampNum(n: number, min = 1, max = 100000) {
    if (Number.isNaN(n)) return min;
    return Math.min(Math.max(n, min), max);
  }

  function addToCart() {
    const safeWidth = clampNum(width, 10, 20000);
    const safeHeight = clampNum(height, 10, 20000);
    const safeQty = clampNum(qty, 1, 9999);

    // ID unic pe bază de configurație
    const id = `banner-${safeWidth}x${safeHeight}-${material}-wind-${wantWindHoles}-hem-${wantHemAndGrommets}`;

    const item = {
      id,
      name: "Banner personalizat",
      description: `${safeWidth}×${safeHeight} cm • ${material} • ${wantWindHoles ? "găuri vânt" : "fără găuri"} • ${wantHemAndGrommets ? "tiv+capse" : "fără t/c"}`,
      quantity: safeQty,
      unitAmount: Number(price.unitPrice),            // fără TVA; setezi valuta în NEXT_PUBLIC_CURRENCY
      totalAmount: Number(price.unitPrice) * safeQty,
      meta: {
        width_cm: safeWidth,
        height_cm: safeHeight,
        material,
        wind: wantWindHoles,
        hem_grommets: wantHemAndGrommets,
        sqm: price.sqm,
        pricePerSqm: price.pricePerSqm,
      },
    };

    cart.addItem(item as any);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold mb-6">Configurează bannerul</h2>

        {/* Dimensiuni */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white/70">Lățime (cm)</label>
            <input
              type="number"
              inputMode="numeric"
              min={10}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-white/70">Lungime (cm)</label>
            <input
              type="number"
              inputMode="numeric"
              min={10}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none"
            />
          </div>
        </div>

        {/* Cantitate */}
        <div className="mt-4">
          <label className="text-sm text-white/70">Cantitate</label>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={qty}
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

        {/* Mic feedback după adăugare */}
        {justAdded && (
          <div className="mt-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-2 text-sm">
            Produsul a fost adăugat în coș.
          </div>
        )}

        {/* Rezumat minimalist – DOAR sub butoane */}
        <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-white/70">Suprafață</span>
            <span className="font-semibold">{price.sqm} m²</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-white/70">Preț / m²</span>
            <span className="font-semibold">{money(price.pricePerSqm)}</span>
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
