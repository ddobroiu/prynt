"use client";

import React, { useMemo, useState } from "react";
import { useCart } from "./CartProvider";
import { calculatePrice, roundMoney, PriceInput } from "../lib/pricing-banner";

export default function BannerConfigurator() {
  const [input, setInput] = useState<PriceInput>({
    width_cm: 100,
    height_cm: 100,
    quantity: 1,
    material: "frontlit_440",
    want_wind_holes: false,
    want_hem_and_grommets: true,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const price = useMemo(() => calculatePrice(input), [input]);
  const cart = useCart();

  // Preț per unitate (număr, TVA inclus, rotunjit)
  const pricePerUnit = input.quantity > 0 && price.finalPrice > 0
    ? roundMoney(price.finalPrice / input.quantity)
    : 0;

  const setNumericInput = (field: keyof PriceInput, value: string) => {
    const num = parseInt(value, 10);
    setInput((p) => ({ ...p, [field]: isNaN(num) || num < 0 ? 0 : num }));
  };

  const handleAddToCart = () => {
    if (input.width_cm < 1 || input.height_cm < 1 || input.quantity < 1 || price.finalPrice <= 0) {
      alert("Te rugăm să introduci dimensiuni și cantitate valide și să aștepți calculul prețului (> 0 RON).");
      return;
    }

    // ID unic pentru configurație (exclude quantity pentru a permite agregarea)
    const uniqueId = [
      'banner',
      input.material,
      input.width_cm,
      input.height_cm,
      input.want_wind_holes ? 'g' : 'f',
      input.want_hem_and_grommets ? 'c' : 'f',
    ].join('-');

    // calcule clare: unitAmount = preț pe bucată, totalAmount = unitAmount * quantity
    const unitAmount = pricePerUnit;
    const totalAmount = roundMoney(unitAmount * input.quantity);

    const item = {
      id: uniqueId,
      name: `Banner ${input.material.replace('_', ' ')} - ${input.width_cm}x${input.height_cm}cm`,
      quantity: input.quantity,
      unitAmount,
      totalAmount,
    };

    cart.addItem(item);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Configurează-ți Bannerul</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-indigo-400">1. Dimensiuni & Cantitate</h3>
        <div className="grid grid-cols-3 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-white/80">Lățime (cm)</span>
            <input type="number" min={10} step={10} value={input.width_cm}
              onChange={(e) => setNumericInput('width_cm', e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800 text-white p-3" />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-white/80">Înălțime (cm)</span>
            <input type="number" min={10} step={10} value={input.height_cm}
              onChange={(e) => setNumericInput('height_cm', e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800 text-white p-3" />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-white/80">Cantitate (buc)</span>
            <input type="number" min={1} value={input.quantity}
              onChange={(e) => setNumericInput('quantity', e.target.value)}
              className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800 text-white p-3" />
          </label>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-semibold text-indigo-400">2. Material</h3>
        <div className="flex gap-4">
          <button onClick={() => setInput((p) => ({ ...p, material: "frontlit_440" }))}
            className={`flex-1 rounded-xl p-4 text-center transition ${input.material === "frontlit_440" ? "bg-indigo-600 border-2 border-indigo-500 shadow-lg" : "bg-gray-800 border-2 border-gray-700"}`}>
            <span className="font-bold text-white">Frontlit 440g</span>
            <p className="text-xs text-white/70">Standard</p>
          </button>

          <button onClick={() => setInput((p) => ({ ...p, material: "frontlit_510" }))}
            className={`flex-1 rounded-xl p-4 text-center transition ${input.material === "frontlit_510" ? "bg-indigo-600 border-2 border-indigo-500 shadow-lg" : "bg-gray-800 border-2 border-gray-700"}`}>
            <span className="font-bold text-white">Frontlit 510g</span>
            <p className="text-xs text-white/70">Premium</p>
          </button>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-semibold text-indigo-400">3. Finisaje</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-4 rounded-xl p-4 bg-gray-800 border-2 border-gray-700 cursor-pointer">
            <input type="checkbox" checked={input.want_hem_and_grommets}
              onChange={(e) => setInput((p) => ({ ...p, want_hem_and_grommets: e.target.checked }))}
              className="h-5 w-5" />
            <span className="font-medium text-white">Tiv și Capse (Standard)</span>
          </label>

          <label className="flex items-center gap-4 rounded-xl p-4 bg-gray-800 border-2 border-gray-700 cursor-pointer">
            <input type="checkbox" checked={input.want_wind_holes}
              onChange={(e) => setInput((p) => ({ ...p, want_wind_holes: e.target.checked }))}
              className="h-5 w-5" />
            <span className="font-medium text-white">Găuri pentru Vânt (Mesh)</span>
          </label>
        </div>
      </div>

      <div className="border-t border-indigo-700/50 pt-6 space-y-3">
        <div className="p-4 rounded-xl bg-gray-800/50">
          <div className="flex justify-between items-center text-white/80 text-sm">
            <span>Preț final (TVA inclus):</span>
            <span className="font-bold">{price.finalPrice ? `${price.finalPrice.toFixed(2)} RON` : "—"}</span>
          </div>
          {pricePerUnit > 0 && (
            <div className="text-sm text-white/70 mt-1">
              {pricePerUnit.toFixed(2)} RON / buc
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={handleAddToCart}
            disabled={price.finalPrice <= 0 || input.width_cm < 1 || input.height_cm < 1 || input.quantity < 1}
            className="w-full px-5 py-3 rounded-xl bg-indigo-600 text-white font-extrabold hover:bg-indigo-500">
            Adaugă în coș
          </button>
        </div>

        {showSuccess && (
          <div className="p-3 bg-green-500/20 text-green-300 rounded-xl text-center font-semibold">
            Produs adăugat în coș!
          </div>
        )}
      </div>
    </div>
  );
}