"use client";

import React, { useMemo, useState } from "react";
import { useCart } from "../../components/CartProvider";
import { calculatePrice, roundMoney, PriceInput } from "../../lib/pricing-banner";
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart } from "lucide-react";

const GALLERY = [
  "/products/banner/1.jpg",
  "/products/banner/2.jpg",
  "/products/banner/3.jpg",
  "/products/banner/4.jpg",
] as const;

type MaterialKey = "frontlit_440" | "frontlit_510";

const BannerConfiguratorPage: React.FC = () => {
  const { addItem } = useCart();

  const [input, setInput] = useState<PriceInput>({
    width_cm: 100,
    height_cm: 100,
    quantity: 1,
    material: "frontlit_440",
    want_wind_holes: false,
    want_hem_and_grommets: true,
  });

  const priceDetails = useMemo(() => calculatePrice(input), [input]);
  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);

  const pricePerUnit =
    input.quantity > 0 && priceDetails.finalPrice > 0
      ? roundMoney(priceDetails.finalPrice / input.quantity)
      : 0;

  const updateInput = <K extends keyof PriceInput>(key: K, val: PriceInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: val }));
  };

  const setNumeric = (key: "width_cm" | "height_cm" | "quantity", value: number) => {
    const safe = Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
    updateInput(key, safe as any);
  };

  const handleAddToCart = () => {
    if (!priceDetails || priceDetails.finalPrice <= 0) return;

    // ID determinist (agregare corectă în coș pentru aceeași configurație)
    const uniqueId = [
      "banner",
      input.material,
      input.width_cm,
      input.height_cm,
      input.want_wind_holes ? "g" : "f",
      input.want_hem_and_grommets ? "c" : "f",
    ].join("-");

    const unitAmount = pricePerUnit;
    const totalAmount = roundMoney(unitAmount * input.quantity);

    addItem({
      id: uniqueId,
      name: `Banner ${input.material === "frontlit_510" ? "Frontlit 510g/mp" : "Frontlit 440g/mp"} - ${input.width_cm}x${input.height_cm}cm`,
      quantity: input.quantity,
      unitAmount,
      totalAmount,
    });

    const toast = document.getElementById("added-toast");
    if (toast) {
      toast.style.opacity = "1";
      setTimeout(() => (toast.style.opacity = "0"), 1400);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Toast scurt */}
      <div
        id="added-toast"
        className="pointer-events-none fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-emerald-600/90 px-4 py-2 text-sm font-medium text-white shadow-2xl shadow-emerald-900/40 opacity-0 transition-opacity"
      >
        Produs adăugat în coș
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Header sobru, ca înainte */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Configurator Banner</h1>
          <p className="mt-2 text-white/70">Alege dimensiunile, materialul și finisajele. Vezi prețul în timp real.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* STÂNGA: CONFIGURATOR (stil apropiat de cel vechi) */}
          <div className="lg:col-span-3 space-y-8">
            <ConfigSection icon={<Ruler />} title="1. Dimensiuni și Cantitate">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NumberInput label="Lățime (cm)" value={input.width_cm} onChange={(v) => setNumeric("width_cm", v)} />
                <NumberInput label="Înălțime (cm)" value={input.height_cm} onChange={(v) => setNumeric("height_cm", v)} />
                <NumberInput label="Cantitate (buc)" value={input.quantity} onChange={(v) => setNumeric("quantity", v)} />
              </div>
            </ConfigSection>

            <ConfigSection icon={<Layers />} title="2. Material Banner">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MaterialOption
                  title="Frontlit 440g/mp"
                  description="Standard, echilibru bun calitate-preț"
                  selected={input.material === "frontlit_440"}
                  onClick={() => updateInput("material", "frontlit_440")}
                />
                <MaterialOption
                  title="Frontlit 510g/mp"
                  description="Premium, mai rigid și mai durabil"
                  selected={input.material === "frontlit_510"}
                  onClick={() => updateInput("material", "frontlit_510")}
                />
              </div>
            </ConfigSection>

            <ConfigSection icon={<CheckCircle />} title="3. Finisaje">
              <div className="space-y-3">
                <label className="flex items-center gap-3 rounded-lg bg-gray-800/60 border border-gray-700 px-4 py-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={input.want_hem_and_grommets}
                    onChange={(e) => updateInput("want_hem_and_grommets", e.target.checked)}
                  />
                  <span className="text-sm">Tiv și capse (standard)</span>
                </label>
                <label className="flex items-center gap-3 rounded-lg bg-gray-800/60 border border-gray-700 px-4 py-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={input.want_wind_holes}
                    onChange={(e) => updateInput("want_wind_holes", e.target.checked)}
                  />
                  <span className="text-sm">Găuri pentru vânt (mesh-look)</span>
                </label>
              </div>
            </ConfigSection>
          </div>

          {/* DREAPTA: SUMAR + GALERIE (în spiritul “Sumar Comandă” anterior) */}
          <div className="lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              {/* Galerie modernă dar discretă */}
              <div className="rounded-2xl bg-gray-900/50 border border-gray-700/60 p-4">
                <div className="aspect-video overflow-hidden rounded-xl border border-white/10 bg-black">
                  <img
                    src={activeImage}
                    alt="Banner preview"
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {GALLERY.map((src) => (
                    <button
                      key={src}
                      onClick={() => setActiveImage(src)}
                      className={`overflow-hidden rounded-md border transition ${
                        activeImage === src ? "border-indigo-500" : "border-white/10 hover:border-white/30"
                      }`}
                      aria-label="Previzualizare"
                    >
                      <img src={src} alt="Thumb" className="h-20 w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sumar ca înainte, cu detalii esențiale */}
              <div className="rounded-2xl bg-gray-900/50 border border-gray-700/60 p-6">
                <h2 className="text-xl font-bold border-b border-gray-700 pb-4 mb-4">Sumar Comandă</h2>

                <div className="space-y-2 text-white/80 text-sm">
                  <p>
                    Dimensiuni:{" "}
                    <span className="text-white font-semibold">
                      {input.width_cm} x {input.height_cm} cm
                    </span>
                  </p>
                  <p>
                    Cantitate: <span className="text-white font-semibold">{input.quantity} buc</span>
                  </p>
                  <p>
                    Material:{" "}
                    <span className="text-white font-semibold">
                      {input.material === "frontlit_510" ? "Frontlit 510g/mp" : "Frontlit 440g/mp"}
                    </span>
                  </p>
                </div>

                <div className="border-t border-gray-700 mt-4 pt-4">
                  <p className="text-white/60 text-sm">Preț total</p>
                  <p className="text-4xl font-extrabold text-white my-2">
                    {priceDetails?.finalPrice.toFixed(2)} RON
                  </p>
                  {pricePerUnit > 0 && (
                    <p className="text-xs text-white/60">{pricePerUnit.toFixed(2)} RON / buc</p>
                  )}
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!priceDetails || priceDetails.finalPrice <= 0}
                  className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 text-lg rounded-lg hover:bg-indigo-500 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Adaugă în coș
                </button>
              </div>

              {/* Notă scurtă, discretă */}
              <div className="rounded-2xl bg-gray-900/40 border border-gray-700/50 p-4 text-xs text-white/60">
                Print durabil. Livrare rapidă. Suport: contact@prynt.ro
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

/* ——— Componente UI (ca în varianta veche) ——— */

const ConfigSection: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({
  icon,
  title,
  children,
}) => (
  <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6">
    <div className="flex items-center gap-3 mb-5">
      <div className="text-indigo-400">{icon}</div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
    {children}
  </div>
);

const NumberInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) => {
  const handleChange = (increment: number) => {
    const newValue = Math.max(1, value + increment);
    onChange(newValue);
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="flex items-center">
        <button onClick={() => handleChange(-1)} className="p-3 bg-gray-700 rounded-l-md hover:bg-gray-600">
          <Minus size={16} />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-full text-center bg-gray-800 border-y border-gray-700 py-2.5 text-lg font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button onClick={() => handleChange(1)} className="p-3 bg-gray-700 rounded-r-md hover:bg-gray-600">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

const MaterialOption = ({
  title,
  description,
  selected,
  onClick,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`text-left p-4 rounded-lg border-2 transition-all ${
      selected ? "border-indigo-500 bg-indigo-900/20" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
    }`}
  >
    <p className="font-bold text-white">{title}</p>
    <p className="text-sm text-gray-400">{description}</p>
  </button>
);

export default BannerConfiguratorPage;