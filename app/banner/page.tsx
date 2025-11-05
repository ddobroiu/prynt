"use client";

import React, { useMemo, useState } from "react";
import { useCart } from "../../components/CartProvider";
import { calculatePrice, roundMoney, PriceInput } from "../../lib/pricing-banner";
import {
  Star,
  ShieldCheck,
  Truck,
  Ruler,
  Layers,
  Hammer,
  Scissors,
  BadgeCheck,
  ShoppingCart,
} from "lucide-react";

type MaterialKey = "frontlit_440" | "frontlit_510";
const MATERIALS: Record<
  MaterialKey,
  { title: string; desc: string; image: string; badge?: string }
> = {
  frontlit_440: {
    title: "Frontlit 440g/mp",
    desc: "Standard, cel mai bun raport calitate-preț.",
    image: "/products/banner/frontlit-440.jpg",
    badge: "Best value",
  },
  frontlit_510: {
    title: "Frontlit 510g/mp",
    desc: "Premium, durabilitate și rigiditate superioare.",
    image: "/products/banner/frontlit-510.jpg",
    badge: "Premium",
  },
};

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

  const price = useMemo(() => calculatePrice(input), [input]);
  const [activeImage, setActiveImage] = useState<string>(
    MATERIALS[input.material as MaterialKey].image
  );

  // Preț pe unitate (TVA inclus)
  const pricePerUnit =
    input.quantity > 0 && price.finalPrice > 0 ? roundMoney(price.finalPrice / input.quantity) : 0;

  const updateInput = <K extends keyof PriceInput>(key: K, val: PriceInput[K]) => {
    setInput((prev) => {
      const next = { ...prev, [key]: val };
      // dacă schimbăm materialul, actualizăm și imaginea principală
      if (key === "material") {
        const mat = MATERIALS[val as MaterialKey];
        if (mat) setActiveImage(mat.image);
      }
      return next;
    });
  };

  const setNumeric = (key: "width_cm" | "height_cm" | "quantity", value: number) => {
    const safe = Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 1;
    updateInput(key, safe as any);
  };

  const handleAddToCart = () => {
    if (input.width_cm < 1 || input.height_cm < 1 || input.quantity < 1 || price.finalPrice <= 0) {
      alert("Te rugăm să setezi dimensiuni/cantitate valide și să aștepți calculul prețului (> 0 RON).");
      return;
    }

    // ID determinist bazat pe configurație (permite agregare corectă în coș)
    const uniqueId = [
      "banner",
      input.material,
      input.width_cm,
      input.height_cm,
      input.want_wind_holes ? "g" : "f", // g=gauri vant, f=fara
      input.want_hem_and_grommets ? "c" : "f", // c=capsare+tiv, f=fara
    ].join("-");

    const unitAmount = pricePerUnit;
    const totalAmount = roundMoney(unitAmount * input.quantity);

    addItem({
      id: uniqueId,
      name: `Banner ${MATERIALS[input.material as MaterialKey]?.title || input.material} - ${input.width_cm}x${input.height_cm}cm`,
      quantity: input.quantity,
      unitAmount,
      totalAmount,
    });

    // feedback vizual simplu
    const toast = document.getElementById("added-toast");
    if (toast) {
      toast.style.opacity = "1";
      setTimeout(() => (toast.style.opacity = "0"), 1800);
    } else {
      alert("Produs adăugat în coș!");
    }
  };

  const material = MATERIALS[input.material as MaterialKey];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* HERO vizual */}
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src="/products/banner/hero-banner.jpg"
            alt="Banner publicitar"
            className="w-full h-[320px] object-cover opacity-40"
            loading="lazy"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-600/20 text-indigo-200 px-3 py-1 text-xs mb-4">
              <BadgeCheck className="h-4 w-4" />
              Interfață modernizată
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Banner publicitar — configurare rapidă, rezultate premium
            </h1>
            <p className="mt-4 text-white/80 text-lg">
              Alege dimensiunile, materialul și finisajele. Vezi prețul în timp real și adaugă în coș
              instant. Livrare rapidă în toată țara.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-white/80 text-sm">
              <span className="inline-flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400" /> 4.9/5 din 120+ recenzii
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Calitate garantată
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck className="h-4 w-4 text-cyan-400" /> Livrare 24–48h
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Toast adăugat în coș */}
      <div
        id="added-toast"
        className="pointer-events-none fixed left-1/2 -translate-x-1/2 top-4 z-50 transition-opacity duration-300 opacity-0"
      >
        <div className="rounded-full bg-emerald-600/90 text-white px-4 py-2 text-sm shadow-lg shadow-emerald-900/30">
          Produs adăugat în coș!
        </div>
      </div>

      {/* Conținut principal */}
      <section className="max-w-7xl mx-auto px-4 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Stânga: Galerie + detalii produs */}
          <div className="lg:col-span-3 space-y-8">
            {/* Galerie */}
            <div className="rounded-2xl border border-white/10 bg-gray-900/40 p-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-900 border border-white/10">
                <img
                  src={activeImage}
                  alt={material?.title || "Banner"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {[material.image, "/products/banner/closeup-print.jpg", "/products/banner/outdoor.jpg", "/products/banner/indoor.jpg"].map(
                  (src, idx) => (
                    <button
                      key={idx}
                      className={`rounded-lg overflow-hidden border ${
                        activeImage === src ? "border-indigo-500" : "border-white/10 hover:border-white/30"
                      }`}
                      onClick={() => setActiveImage(src)}
                      aria-label="Schimbă imaginea"
                    >
                      <img src={src} alt="Prezentare banner" className="w-full h-20 object-cover" loading="lazy" />
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Detalii / Features */}
            <div className="rounded-2xl border border-white/10 bg-gray-900/40 p-6 space-y-6">
              <h2 className="text-2xl font-bold">De ce să alegi bannerele noastre</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Feature icon={<Layers />} title="Materiale de calitate">
                  Frontlit 440g (standard) sau 510g (premium) pentru durabilitate și aspect impecabil.
                </Feature>
                <Feature icon={<Hammer />} title="Finisaje profesionale">
                  Tiv și capse standard incluse; opțional, perforații pentru vânt (mesh-look).
                </Feature>
                <Feature icon={<Truck />} title="Livrare rapidă">
                  Expediere în 24–48 ore. Ambalare sigură pentru protecție la transport.
                </Feature>
              </div>
              <ul className="text-white/80 list-disc pl-5 space-y-2">
                <li>Tipărire full-color, rezoluție înaltă, rezistentă la intemperii.</li>
                <li>Consultanță gratuită pentru fișierele de print.</li>
                <li>Prețuri transparente și TVA inclus.</li>
              </ul>
            </div>
          </div>

          {/* Dreapta: Configurator + sumar (sticky) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-8 space-y-6">
              {/* Configurator */}
              <div className="rounded-2xl border border-indigo-700/40 bg-gray-900/70 p-6">
                <h2 className="text-xl font-bold mb-6">Configurează produsul</h2>

                {/* Dimensiuni */}
                <ConfigCard icon={<Ruler />} title="Dimensiuni și Cantitate">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <NumberInput
                      label="Lățime (cm)"
                      value={input.width_cm}
                      onChange={(v) => setNumeric("width_cm", v)}
                      min={10}
                      step={5}
                    />
                    <NumberInput
                      label="Înălțime (cm)"
                      value={input.height_cm}
                      onChange={(v) => setNumeric("height_cm", v)}
                      min={10}
                      step={5}
                    />
                    <NumberInput
                      label="Cantitate (buc)"
                      value={input.quantity}
                      onChange={(v) => setNumeric("quantity", v)}
                      min={1}
                      step={1}
                    />
                  </div>
                </ConfigCard>

                {/* Material */}
                <ConfigCard icon={<Layers />} title="Material">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(Object.keys(MATERIALS) as MaterialKey[]).map((key) => {
                      const m = MATERIALS[key];
                      const selected = input.material === key;
                      return (
                        <button
                          key={key}
                          onClick={() => updateInput("material", key)}
                          className={`text-left rounded-xl border p-4 transition ${
                            selected
                              ? "border-indigo-500 bg-indigo-600/20 shadow-lg"
                              : "border-white/10 bg-gray-800/70 hover:border-white/30"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={m.image}
                              alt={m.title}
                              className="w-14 h-14 object-cover rounded-lg border border-white/10"
                              loading="lazy"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{m.title}</p>
                                {m.badge && (
                                  <span className="text-[10px] uppercase tracking-wide bg-indigo-600/30 text-indigo-200 px-2 py-0.5 rounded-full">
                                    {m.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-white/70">{m.desc}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ConfigCard>

                {/* Finisaje */}
                <ConfigCard icon={<Scissors />} title="Finisaje">
                  <div className="space-y-3">
                    <Toggle
                      label="Tiv și capse (Standard)"
                      checked={input.want_hem_and_grommets}
                      onChange={(v) => updateInput("want_hem_and_grommets", v)}
                    />
                    <Toggle
                      label="Găuri pentru vânt (Mesh look)"
                      checked={input.want_wind_holes}
                      onChange={(v) => updateInput("want_wind_holes", v)}
                    />
                  </div>
                </ConfigCard>

                {/* Preț și CTA */}
                <div className="mt-6 rounded-xl border border-white/10 bg-gray-900/80 p-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-white/60 text-sm">Preț total (TVA inclus)</p>
                      <p className="text-3xl md:text-4xl font-extrabold mt-1">
                        {price.finalPrice > 0 ? `${price.finalPrice.toFixed(2)} RON` : "—"}
                      </p>
                      {pricePerUnit > 0 && (
                        <p className="text-white/60 text-xs mt-1">{pricePerUnit.toFixed(2)} RON / buc</p>
                      )}
                    </div>
                    <button
                      onClick={handleAddToCart}
                      disabled={price.finalPrice <= 0}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-500 disabled:bg-gray-600"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Adaugă în coș
                    </button>
                  </div>
                </div>
              </div>

              {/* Card încredere / shipping */}
              <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-6">
                <h3 className="font-bold text-white mb-3">Informații livrare și suport</h3>
                <ul className="text-sm text-white/80 space-y-2">
                  <li className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-cyan-400" />
                    Livrare națională 24–48h prin curier.
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Garantăm calitatea printului și a materialelor.
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    Suport rapid pe email: contact@prynt.ro
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

/* ==== Componente UI locale (fără a afecta logica) ==== */

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-gray-900/50 p-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-indigo-400">{icon}</span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-white/80">{children}</p>
    </div>
  );
}

function ConfigCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-gray-900/60 p-5">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-indigo-400">{icon}</span>
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  min = 1,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
}) {
  const update = (delta: number) => onChange(Math.max(min, value + delta));
  return (
    <label className="block">
      <span className="text-sm font-medium text-white/80">{label}</span>
      <div className="mt-1 flex items-center rounded-lg border border-white/10 bg-gray-800/70">
        <button
          type="button"
          onClick={() => update(-step)}
          className="px-3 py-2 text-white/80 hover:text-white disabled:opacity-50"
          disabled={value <= min}
          aria-label="Scade"
        >
          −
        </button>
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(Math.max(min, parseInt(e.target.value || "0", 10)))}
          className="w-full bg-transparent px-2 py-2 text-center outline-none"
        />
        <button
          type="button"
          onClick={() => update(step)}
          className="px-3 py-2 text-white/80 hover:text-white"
          aria-label="Crește"
        >
          +
        </button>
      </div>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-white/10 bg-gray-800/60 px-4 py-3">
      <span className="text-sm">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-indigo-600"
      />
    </label>
  );
}

export default BannerConfiguratorPage;