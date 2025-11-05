"use client";

import React, { useState, useEffect } from 'react';
import { calculatePrice, PriceInput } from '../../lib/pricing-banner';
import { useCart } from '../../components/CartProvider';
import { Ruler, Layers, CheckCircle, Plus, Minus, ShoppingCart } from 'lucide-react';

// AM ȘTERS IMPORT-UL PENTRU SWITCH DE AICI

const BannerConfiguratorPage = () => {
    const { addItem } = useCart();
    const [input, setInput] = useState<PriceInput>({
        width_cm: 100,
        height_cm: 100,
        quantity: 1,
        material: "frontlit_440",
        want_wind_holes: false,
        want_hem_and_grommets: true,
    });

    const priceDetails = calculatePrice(input);

    const handleAddToCart = () => {
        if (!priceDetails || priceDetails.finalPrice <= 0) return;
        const productName = `Banner personalizat ${input.width_cm}x${input.height_cm}cm`;
        addItem({
            id: crypto.randomUUID(),
            name: productName,
            quantity: input.quantity,
            unitAmount: priceDetails.finalPrice / input.quantity,
            totalAmount: priceDetails.finalPrice,
        });
        alert(`${productName} a fost adăugat în coș!`);
    };

    const updateInput = (field: keyof PriceInput, value: any) => {
        setInput(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-gray-950 min-h-screen text-white">
            <div className="container mx-auto px-4 py-16">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                        Configurator Banner Publicitar
                    </h1>
                    <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                        Personalizează-ți bannerul pas cu pas și vezi prețul în timp real. Calitate garantată, livrare rapidă.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Coloana Stânga: Configurator */}
                    <div className="lg:col-span-3 space-y-8">
                        <ConfigSection icon={<Ruler />} title="1. Dimensiuni și Cantitate">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <NumberInput label="Lățime (cm)" value={input.width_cm} onChange={(v) => updateInput('width_cm', v)} />
                                <NumberInput label="Înălțime (cm)" value={input.height_cm} onChange={(v) => updateInput('height_cm', v)} />
                            </div>
                            <div className="mt-6">
                                <NumberInput label="Cantitate (buc)" value={input.quantity} onChange={(v) => updateInput('quantity', v)} />
                            </div>
                        </ConfigSection>

                        <ConfigSection icon={<Layers />} title="2. Material Banner">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <MaterialOption
                                    title="Frontlit 440g/mp"
                                    description="Standard, cel mai bun raport calitate-preț."
                                    selected={input.material === 'frontlit_440'}
                                    onClick={() => updateInput('material', 'frontlit_440')}
                                />
                                <MaterialOption
                                    title="Frontlit 510g/mp"
                                    description="Premium, mai gros și mai rezistent."
                                    selected={input.material === 'frontlit_510'}
                                    onClick={() => updateInput('material', 'frontlit_510')}
                                />
                            </div>
                        </ConfigSection>

                        <ConfigSection icon={<CheckCircle />} title="3. Finisaje Incluse">
                             <div className="space-y-4">
                                <ToggleOption
                                    label="Tiv și Capse de prindere"
                                    description="Întărire pe margini și inele metalice pentru prindere."
                                    checked={input.want_hem_and_grommets}
                                    onCheckedChange={(c) => updateInput('want_hem_and_grommets', c)}
                                />
                                <ToggleOption
                                    label="Găuri de vânt"
                                    description="Decupaje speciale pentru a reduce presiunea vântului."
                                    checked={input.want_wind_holes}
                                    onCheckedChange={(c) => updateInput('want_wind_holes', c)}
                                />
                            </div>
                        </ConfigSection>
                    </div>

                    {/* Coloana Dreapta: Sumar și Preț */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-8 bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-2xl shadow-indigo-900/20">
                            <h3 className="text-xl font-bold mb-4">Sumarul Comenzii</h3>
                            
                            <div className="aspect-video bg-gray-800 rounded-lg mb-6 flex items-center justify-center border border-dashed border-gray-600">
                                <p className="text-gray-500 text-sm">Previzualizare Banner</p>
                            </div>
                            
                            <div className="space-y-2 text-gray-300 mb-6">
                                <p>Dimensiuni: <span className="font-semibold text-white">{input.width_cm} x {input.height_cm} cm</span></p>
                                <p>Suprafață: <span className="font-semibold text-white">{priceDetails?.sqm_per_unit.toFixed(2)} mp/buc</span></p>
                                <p>Cantitate: <span className="font-semibold text-white">{input.quantity} buc.</span></p>
                                <p>Suprafață Totală: <span className="font-semibold text-white">{priceDetails?.total_sqm_taxable.toFixed(2)} mp</span></p>
                            </div>

                            <div className="border-t border-gray-700 pt-4">
                                <p className="text-gray-400 text-sm">Preț Total (fără TVA)</p>
                                <p className="text-4xl font-extrabold text-white my-2">
                                    {priceDetails?.finalPrice.toFixed(2)} RON
                                </p>
                                <p className="text-gray-500 text-xs">Taxa pe valoarea adăugată (TVA) se va calcula în coș.</p>
                            </div>
                            
                            <button 
                                onClick={handleAddToCart}
                                disabled={!priceDetails || priceDetails.finalPrice <= 0}
                                className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 text-lg rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={20} />
                                Adaugă în coș
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Componente ajutătoare pentru un cod mai curat ---

const ConfigSection: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
            <div className="text-indigo-400">{icon}</div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        {children}
    </div>
);

const NumberInput = ({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void; }) => {
    const handleChange = (increment: number) => {
        const newValue = Math.max(1, value + increment);
        onChange(newValue);
    };
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
            <div className="flex items-center">
                <button onClick={() => handleChange(-1)} className="p-3 bg-gray-700 rounded-l-md hover:bg-gray-600"><Minus size={16} /></button>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-center bg-gray-800 border-y border-gray-700 py-2.5 text-lg font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button onClick={() => handleChange(1)} className="p-3 bg-gray-700 rounded-r-md hover:bg-gray-600"><Plus size={16} /></button>
            </div>
        </div>
    );
};

const MaterialOption = ({ title, description, selected, onClick }: { title: string; description: string; selected: boolean; onClick: () => void; }) => (
    <div
        onClick={onClick}
        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selected ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'}`}
    >
        <p className="font-bold text-white">{title}</p>
        <p className="text-sm text-gray-400">{description}</p>
    </div>
);

// --- AICI ESTE CORECȚIA PRINCIPALĂ ---
// Am înlocuit componenta 'Switch' cu un 'input' de tip 'checkbox' standard, dar stilizat.
const ToggleOption = ({ label, description, checked, onCheckedChange }: { label: string; description: string; checked: boolean; onCheckedChange: (checked: boolean) => void; }) => (
     <label className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700 cursor-pointer">
        <div>
            <p className="font-semibold text-white">{label}</p>
            <p className="text-sm text-gray-400 max-w-xs">{description}</p>
        </div>
        <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            className="h-6 w-6 rounded-md bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
        />
    </label>
);

export default BannerConfiguratorPage;