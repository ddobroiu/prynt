"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
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
type DesignOption = "upload" | "configure" | "pro";
const PRO_DESIGN_FEE = 50; // RON (o singură dată pe comandă)

const BannerConfiguratorPage: React.FC = () => {
  const { addItem, items } = useCart();

  const [input, setInput] = useState<PriceInput>({
    width_cm: 100,
    height_cm: 100,
    quantity: 1,
    material: "frontlit_440",
    want_wind_holes: false,
    want_hem_and_grommets: true,
  });

  const [activeImage, setActiveImage] = useState<string>(GALLERY[0]);
  const priceDetails = useMemo(() => calculatePrice(input), [input]);

  // Grafică
  const [designOption, setDesignOption] = useState<DesignOption>("upload");
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkPreview, setArtworkPreview] = useState<string | null>(null);
  const hasProDesignInCart = items.some((i) => i.id === "design-pro");

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

  const handleArtworkChange = (file: File | null) => {
    setArtworkFile(file);
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setArtworkPreview(url);
    } else {
      setArtworkPreview(null);
    }
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

    const artworkSuffix =
      designOption === "upload" && artworkFile
        ? ` (cu grafică încărcată: ${artworkFile.name})`
        : "";

    addItem({
      id: uniqueId,
      name: `Banner ${input.material === "frontlit_510" ? "Frontlit 510g/mp" : "Frontlit 440g/mp"} - ${input.width_cm}x${input.height_cm}cm${artworkSuffix}`,
      quantity: input.quantity,
      unitAmount,
      totalAmount,
    });

    // Taxa de grafică profesională — o singură dată pe comandă
    if (designOption === "pro" && !hasProDesignInCart) {
      addItem({
        id: "design-pro",
        name: "Serviciu grafică profesională",
        quantity: 1,
        unitAmount: PRO_DESIGN_FEE,
        totalAmount: PRO_DESIGN_FEE,
      });
    }

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
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Configurator Banner</h1>
          <p className="mt-2 text-white/70">Alege dimensiunile, materialul, finisajele și opțiunile de grafică. Vezi prețul în timp real.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* STÂNGA: CONFIGURATOR */}
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

            {/* 4. Grafică */}
            <ConfigSection icon={<CheckCircle />} title="4. Grafică">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Am grafică (upload) */}
                <button
                  type="button"
                  onClick={() => setDesignOption("upload")}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    designOption === "upload" ? "border-indigo-500 bg-indigo-900/20" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                >
                  <div className="font-bold text-white">Am grafică</div>
                  <div className="text-xs text-white/70">Încarcă fișierul tău (PDF, AI, PSD, JPG, PNG)</div>
                </button>

                {/* Configurează online */}
                <button
                  type="button"
                  onClick={() => setDesignOption("configure")}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    designOption === "configure" ? "border-indigo-500 bg-indigo-900/20" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                >
                  <div className="font-bold text-white">Configurează online</div>
                  <div className="text-xs text-white/70">Creează grafica în browser (în curând)</div>
                </button>

                {/* Cumpără grafică profesională */}
                <button
                  type="button"
                  onClick={() => setDesignOption("pro")}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    designOption === "pro" ? "border-indigo-500 bg-indigo-900/20" : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                >
                  <div className="font-bold text-white">Cumpără grafică profesională</div>
                  <div className="text-xs text-white/70">+{PRO_DESIGN_FEE} RON (o singură dată/comandă)</div>
                </button>
              </div>

              {/* Sub-opțiuni */}
              {designOption === "upload" && (
                <div className="rounded-lg mt-4 p-4 bg-gray-800/60 border border-gray-700">
                  <label className="block text-sm font-medium text-white/80 mb-2">Încarcă fișier</label>
                  <input
                    type="file"
                    accept=".pdf,.ai,.psd,.jpg,.jpeg,.png"
                    onChange={(e) => handleArtworkChange(e.target.files?.[0] || null)}
                    className="block w-full text-white file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white hover:file:bg-indigo-500"
                  />
                  {artworkFile && (
                    <div className="mt-3 text-white/80 text-sm">
                      Selectat: <strong>{artworkFile.name}</strong>
                    </div>
                  )}
                  {artworkPreview && (
                    <div className="mt-3">
                      <img
                        src={artworkPreview}
                        alt="Previzualizare grafică"
                        className="max-h-48 rounded-lg border border-gray-700"
                      />
                    </div>
                  )}
                  <p className="mt-2 text-xs text-white/60">
                    Notă: încărcarea finală a fișierului se va face la checkout sau prin email după plasarea comenzii.
                  </p>
                </div>
              )}

              {designOption === "configure" && (
                <div className="rounded-lg mt-4 p-4 bg-gray-800/60 border border-gray-700">
                  <p className="text-sm text-white/80 mb-3">
                    Vei putea crea grafica ta direct în browser. Pagina de configurator urmează în curând.
                  </p>
                  <Link
                    href="/banner/editor"
                    className="inline-block rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-500"
                  >
                    Configurează
                  </Link>
                </div>
              )}

              {designOption === "pro" && (
                <div className="rounded-lg mt-4 p-4 bg-gray-800/60 border border-gray-700">
                  <p className="text-sm text-white/80">
                    Un designer te va contacta pentru a prelua detaliile grafice după plasarea comenzii. Taxa se aplică o singură dată pe comandă (+{PRO_DESIGN_FEE} RON).
                  </p>
                  {hasProDesignInCart && (
                    <p className="text-xs text-white/60 mt-2">
                      Taxa de grafică profesională este deja în coș.
                    </p>
                  )}
                </div>
              )}
            </ConfigSection>
          </div>

          {/* DREAPTA: SUMAR + GALERIE */}
          <div className="lg:col-span-2">
            <div className="space-y-6 lg:sticky lg:top-6">
              {/* Galerie */}
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

              {/* Sumar */}
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
                  {designOption === "pro" && !hasProDesignInCart && (
                    <p className="text-xs text-white/80 mt-2">
                      + {PRO_DESIGN_FEE.toFixed(2)} RON (grafică profesională — se va adăuga o singură dată la coș)
                    </p>
                  )}
                  {designOption === "pro" && hasProDesignInCart && (
                    <p className="text-xs text-white/60 mt-2">
                      Taxa de grafică profesională este deja în coș (o singură dată pe comandă).
                    </p>
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

/* ——— Componente UI ——— */

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