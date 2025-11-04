"use client";
import { useMemo, useState } from "react";
import { computeBannerPrice, type BannerFinish, type BannerMaterial } from "../lib/pricing";

const MATERIALS: { value: BannerMaterial; label: string }[] = [
  { value: "frontlit_440", label: "Frontlit 440g (standard)" },
  { value: "mesh_370", label: "Mesh 370g (rezistent vânt)" },
  { value: "blackout_610", label: "Blackout 610g (opac)" },
];

const FINISHES: { value: BannerFinish; label: string }[] = [
  { value: "fara_finisare", label: "Fără finisare" },
  { value: "capse_30cm", label: "Capse din 30 în 30 cm" },
  { value: "buzunar_5cm", label: "Buzunar 5 cm" },
  { value: "tiv_termic", label: "Tiv termic" },
];

export default function BannerConfigurator() {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(100);
  const [material, setMaterial] = useState<BannerMaterial>("frontlit_440");
  const [finish, setFinish] = useState<BannerFinish>("capse_30cm");
  const [qty, setQty] = useState(1);
  const [file, setFile] = useState<File | null>(null);

  const price = useMemo(() => computeBannerPrice({
    width_cm: width, height_cm: height, material, finish, quantity: qty,
  }), [width, height, material, finish, qty]);

  function addToCart() {
    alert(`Banner ${width}×${height} cm — ${qty} buc.\nTotal: ${price.total} RON`);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* configurator */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-2xl font-semibold mb-5">Configurare Banner</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white/70">Lățime (cm)</label>
            <input type="number" min={10} value={width} onChange={e=>setWidth(Number(e.target.value))}
              className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none"/>
          </div>
          <div>
            <label className="text-sm text-white/70">Înălțime (cm)</label>
            <input type="number" min={10} value={height} onChange={e=>setHeight(Number(e.target.value))}
              className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none"/>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm text-white/70">Material</label>
            <select value={material} onChange={e=>setMaterial(e.target.value as any)}
              className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none">
              {MATERIALS.map(m=> <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-white/70">Finisare</label>
            <select value={finish} onChange={e=>setFinish(e.target.value as any)}
              className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none">
              {FINISHES.map(f=> <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm text-white/70">Cantitate</label>
          <input type="number" min={1} value={qty} onChange={e=>setQty(Number(e.target.value))}
            className="mt-1 w-40 rounded-lg bg-black/30 border border-white/10 px-3 py-2 outline-none"/>
        </div>

        <div className="mt-4">
          <label className="text-sm text-white/70">Fișier (PDF/PNG/JPG)</label>
          <input type="file" accept=".pdf,.png,.jpg,.jpeg"
            onChange={e=>setFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-black hover:file:bg-white/90"/>
          {file && <p className="mt-2 text-sm text-white/70">Selectat: {file.name}</p>}
        </div>

        <button onClick={addToCart} className="mt-6 px-5 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90">
          Adaugă în coș
        </button>
      </div>

      {/* rezumat */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-2xl font-semibold mb-5">Rezumat & Preț</h3>
        <ul className="space-y-2 text-sm text-white/80">
          <li>Dimensiune: <b>{width}</b> × <b>{height}</b> cm</li>
          <li>Suprafață: <b>{price.sqm}</b> m²</li>
          <li>Perimetru: <b>{price.perimeterM}</b> m</li>
          <li>Preț unitar: <b>{price.unitPrice}</b> RON</li>
          <li>Subtotal: <b>{price.subtotal}</b> RON</li>
          <li>Discount: <b>{price.discount}</b> RON</li>
          <li>Total: <b>{price.total}</b> RON</li>
        </ul>
      </div>
    </div>
  );
}
