// components/BannerConfigurator.tsx
"use client";

import React, { useMemo, useState } from "react";
import { useCart } from "./CartProvider"; 
import { calculatePrice, roundMoney, money, PriceInput, PriceOutput, BannerMaterial } from "../lib/pricing-banner"; 
// Presupunem că ai creat fișierul pricing-banner.ts și l-ai pus în directorul lib/

// --- COMPONENTA PRINCIPALĂ ---
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
    
    // Calculează prețul ori de câte ori inputul se schimbă
    const price = useMemo(() => calculatePrice(input), [input]);
    const cart = useCart();

    // Prețul per bucată (cu TVA), esențial pentru coș
    const pricePerUnit = input.quantity > 0 && price.finalPrice > 0
        ? roundMoney(price.finalPrice / input.quantity) 
        : 0;

    // Funcție helper pentru a seta input-urile numerice
    const setNumericInput = (field: keyof PriceInput, value: string) => {
        const num = parseInt(value, 10);
        setInput((p) => ({ ...p, [field]: isNaN(num) || num < 0 ? 0 : num }));
    };

    // Funcția de adăugare în coș (FIXATĂ și ROBUSTĂ)
    const handleAddToCart = () => {
        // 1. VALIDARE CRITICĂ: Fără cantitate sau dimensiuni valide, nu adăugăm.
        if (input.width_cm < 1 || input.height_cm < 1 || input.quantity < 1 || price.finalPrice <= 0) {
            alert("Te rugăm să introduci dimensiuni și cantitate valide și să aștepți calculul prețului (> 0 RON).");
            return;
        }

        // 2. ID Unic pentru configurarea curentă
        const uniqueId = [
            'banner', 
            input.material, 
            input.width_cm, 
            input.height_cm, 
            input.quantity, // Lăsăm quantity separat, deși îl punem și în obiect, pentru a crea un ID unic per configurație/comandă
            input.want_wind_holes ? 'g' : 'f', 
            input.want_hem_and_grommets ? 'c' : 'f', 
        ].join('-');

        // 3. Obiectul CartItem (folosim prețurile calculate)
        const item = {
            id: uniqueId, 
            name: `Banner ${input.material.replace('_', ' ')} - ${input.width_cm}x${input.height_cm}cm (x${input.quantity})`,
            quantity: input.quantity, 
            unitAmount: pricePerUnit, // Preț per bucată (cu TVA)
            totalAmount: price.finalPrice, // Prețul total al liniei (quantity * unitAmount)
        };

        // 4. Adaugă și afișează succes
        cart.addItem(item); 
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Configurează-ți Bannerul</h2>

            {/* Secțiune 1: Dimensiuni */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-indigo-400">1. Dimensiuni & Cantitate</h3>
                <div className="grid grid-cols-3 gap-4">
                    {/* Lățime */}
                    <label className="block">
                        <span className="text-sm font-medium text-white/80">Lățime (cm)</span>
                        <input
                            type="number"
                            min="10"
                            step="10"
                            value={input.width_cm}
                            onChange={(e) => setNumericInput('width_cm', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800 text-white p-3 focus:border-indigo-500 focus:ring-indigo-500 transition"
                        />
                    </label>
                    {/* Înălțime */}
                    <label className="block">
                        <span className="text-sm font-medium text-white/80">Înălțime (cm)</span>
                        <input
                            type="number"
                            min="10"
                            step="10"
                            value={input.height_cm}
                            onChange={(e) => setNumericInput('height_cm', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800 text-white p-3 focus:border-indigo-500 focus:ring-indigo-500 transition"
                        />
                    </label>
                    {/* Cantitate */}
                    <label className="block">
                        <span className="text-sm font-medium text-white/80">Cantitate (buc)</span>
                        <input
                            type="number"
                            min="1"
                            value={input.quantity}
                            onChange={(e) => setNumericInput('quantity', e.target.value)}
                            className="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800 text-white p-3 focus:border-indigo-500 focus:ring-indigo-500 transition"
                        />
                    </label>
                </div>
            </div>

            {/* Secțiune 2: Material */}
            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-indigo-400">2. Material</h3>
                <div className="flex gap-4">
                    {/* Material 440g */}
                    <button
                        onClick={() => setInput((p) => ({ ...p, material: "frontlit_440" }))}
                        className={`flex-1 rounded-xl p-4 text-center transition ${
                            input.material === "frontlit_440"
                                ? "bg-indigo-600 border-2 border-indigo-500 shadow-lg"
                                : "bg-gray-800 border-2 border-gray-700 hover:border-indigo-500"
                        }`}
                    >
                        <span className="font-bold text-white">Frontlit 440g</span>
                        <p className="text-xs text-white/70">Standard, interior/exterior scurt</p>
                    </button>
                    {/* Material 510g */}
                    <button
                        onClick={() => setInput((p) => ({ ...p, material: "frontlit_510" }))}
                        className={`flex-1 rounded-xl p-4 text-center transition ${
                            input.material === "frontlit_510"
                                ? "bg-indigo-600 border-2 border-indigo-500 shadow-lg"
                                : "bg-gray-800 border-2 border-gray-700 hover:border-indigo-500"
                        }`}
                    >
                        <span className="font-bold text-white">Frontlit 510g</span>
                        <p className="text-xs text-white/70">Premium, rezistent, exterior lung</p>
                    </button>
                </div>
            </div>

            {/* Secțiune 3: Finisaje */}
            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-indigo-400">3. Finisaje</h3>
                <div className="space-y-3">
                    {/* Tiv și Capse */}
                    <label className="flex items-center gap-4 rounded-xl p-4 bg-gray-800 border-2 border-gray-700 cursor-pointer hover:border-indigo-500 transition">
                        <input
                            type="checkbox"
                            checked={input.want_hem_and_grommets}
                            onChange={(e) => setInput((p) => ({ ...p, want_hem_and_grommets: e.target.checked }))}
                            className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 bg-gray-700 border-gray-600"
                        />
                        <span className="font-medium text-white">Tiv și Capse (Standard)</span>
                        <span className="ml-auto text-sm text-indigo-300 font-bold">+10%</span>
                    </label>
                    
                    {/* Găuri de vânt */}
                    <label className="flex items-center gap-4 rounded-xl p-4 bg-gray-800 border-2 border-gray-700 cursor-pointer hover:border-indigo-500 transition">
                        <input
                            type="checkbox"
                            checked={input.want_wind_holes}
                            onChange={(e) => setInput((p) => ({ ...p, want_wind_holes: e.target.checked }))}
                            className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 bg-gray-700 border-gray-600"
                        />
                        <span className="font-medium text-white">Găuri pentru Vânt (Mesh)</span>
                        <span className="ml-auto text-sm text-indigo-300 font-bold">+5%</span>
                    </label>
                </div>
            </div>

            {/* Secțiune 4: Sumar Preț și CTA */}
            <div className="border-t border-indigo-700/50 pt-6 space-y-3">
                
                {/* Detalii de calcul */}
                <div className="p-4 rounded-xl bg-gray-800/50 space-y-1">
                    <div className="flex justify-between items-center text-white/80 text-sm">
                        <span>Suprafață reală:</span>
                        <span>{price.total_sqm_calculated.toFixed(4)} mp</span>
                    </div>
                    <div className="flex justify-between items-center text-white/80 text-sm">
                        <span>Suprafață taxabilă:</span>
                        <span>
                            {price.total_sqm_taxable.toFixed(4)} mp 
                            {price.isMinAreaApplied && <span className="text-red-400 ml-2">(Min. 1 mp aplicat)</span>}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-white/80 font-medium pt-1">
                        <span>Preț / mp ajustat (fără TVA):</span>
                        <span>{money(price.pricePerSqmAdjusted)}</span>
                    </div>
                </div>

                {/* Preț Final Mare */}
                <div className="text-center bg-indigo-700/60 p-4 rounded-xl shadow-2xl shadow-indigo-900/50">
                    <p className="text-lg font-normal text-white/80">Total de Plată (TVA inclus 19%)</p>
                    <span className="text-5xl font-extrabold text-white block mt-1 tracking-tight">
                        {money(price.finalPrice)}
                    </span>
                    {pricePerUnit > 0 && (
                        <p className="text-sm font-normal text-white/70 mt-1">
                            {money(pricePerUnit)} / buc
                        </p>
                    )}
                </div>

                {/* Butoane CTA */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        className="w-full px-5 py-3 rounded-xl bg-indigo-600/90 text-white font-extrabold text-lg hover:bg-indigo-500 transition-colors shadow-xl shadow-indigo-500/40 disabled:bg-gray-500 disabled:shadow-none"
                        onClick={handleAddToCart}
                        // Dezactivează butonul dacă prețul este zero sau inputul e invalid
                        disabled={price.finalPrice <= 0 || input.width_cm < 1 || input.height_cm < 1 || input.quantity < 1} 
                    >
                        Adaugă în coș
                    </button>
                </div>
                
                {/* Feedback adăugare */}
                {showSuccess && (
                    <div className="p-3 bg-green-500/20 text-green-300 rounded-xl text-center font-semibold animate-fade-in">
                        Produs adăugat în coș!
                    </div>
                )}
            </div>
        </div>
    );
}