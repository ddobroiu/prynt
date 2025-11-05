"use client";

import React, { useState, useMemo, FC } from 'react';
import { Check, ShoppingCart, CheckCircle, Award, Zap, Shield } from 'lucide-react';

// IMPORTURILE FINALE, VALIDATE ȘI CORECTE
import { useCart } from '../../components/CartProvider'; 
import { calculatePrice, PriceInput, BannerMaterial, PriceOutput } from '../../lib/pricing-banner';

// --- COMPONENTE UI MODERNE ȘI REUTILIZABILE ---

// Card de selecție modern, pe care îl vom integra în noul design
const SelectionCard: FC<{ title: string; desc: string; isSelected: boolean; onClick: () => void; }> = ({ title, desc, isSelected, onClick }) => (
    <button 
        onClick={onClick} 
        className={`group w-full text-left p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-900 ring-indigo-500 ${
            isSelected 
                ? 'border-indigo-500 bg-indigo-900/30 shadow-lg' 
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
        }`}
    >
        <div className="flex justify-between items-center">
            <span className="font-semibold text-white">{title}</span>
            <div className={`w-6 h-6 flex items-center justify-center rounded-full transition-all duration-200 ${isSelected ? 'bg-indigo-600' : 'bg-gray-700 group-hover:bg-gray-600'}`}>
                {isSelected && <Check className="w-4 h-4 text-white" />}
            </div>
        </div>
        {desc && <p className="text-sm text-gray-400 mt-1">{desc}</p>}
    </button>
);

// --- COMPONENTA CONFIGURATOR, ADAPTATĂ PENTRU NOUL DESIGN ---

function BannerConfigurator() {
    const [input, setInput] = useState<PriceInput>({ width_cm: 100, height_cm: 200, quantity: 1, material: "frontlit_440", want_wind_holes: false, want_hem_and_grommets: true });
    const [showSuccess, setShowSuccess] = useState(false);
    const priceResult: PriceOutput = useMemo(() => calculatePrice(input), [input]);
    const cart = useCart();
    const pricePerUnit = input.quantity > 0 && priceResult.finalPrice > 0 ? (priceResult.finalPrice / input.quantity) : 0;

    const handleInputChange = (field: keyof PriceInput, value: any) => setInput(prev => ({ ...prev, [field]: value }));
    
    const handleAddToCart = () => {
        if (input.width_cm < 1 || input.height_cm < 1 || input.quantity < 1) return;
        const uniqueId = `banner-${input.material}-${input.width_cm}x${input.height_cm}-${input.want_hem_and_grommets}-${input.want_wind_holes}`;
        cart.addItem({ id: uniqueId, name: `Banner ${input.material.replace(/_/g, ' ')} ${input.width_cm}x${input.height_cm}cm`, quantity: input.quantity, unitAmount: pricePerUnit, totalAmount: priceResult.finalPrice });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const MATERIALS = [{ value: "frontlit_440", label: "Frontlit 440g", desc: "Standard, uz general" }, { value: "frontlit_510", label: "Frontlit 510g", desc: "Premium, extra-rezistent" }];
    const FINISHES = [{ label: "Tiv și capse", field: "want_hem_and_grommets", desc: "Întăritură și prindere" }, { label: "Găuri de vânt", field: "want_wind_holes", desc: "Pentru zone expuse" }];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-indigo-400 mb-4 text-center">Configurator Instant</h2>
            
            <div>
                <h3 className="text-md font-semibold text-gray-300 mb-3">Dimensiuni & Cantitate</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div><label className="text-xs text-gray-400">Lățime (cm)</label><input type="number" value={input.width_cm} onChange={e => handleInputChange('width_cm', parseInt(e.target.value) || 0)} className="w-full bg-gray-700/50 border border-indigo-700 rounded-lg p-2.5 text-white" /></div>
                    <div><label className="text-xs text-gray-400">Înălțime (cm)</label><input type="number" value={input.height_cm} onChange={e => handleInputChange('height_cm', parseInt(e.target.value) || 0)} className="w-full bg-gray-700/50 border border-indigo-700 rounded-lg p-2.5 text-white" /></div>
                    <div><label className="text-xs text-gray-400">Cantitate</label><input type="number" value={input.quantity} onChange={e => handleInputChange('quantity', parseInt(e.target.value) || 1)} className="w-full bg-gray-700/50 border border-indigo-700 rounded-lg p-2.5 text-white" /></div>
                </div>
            </div>

            <div>
                <h3 className="text-md font-semibold text-gray-300 mb-3">Material</h3>
                <div className="grid grid-cols-1 gap-4">{MATERIALS.map(m => <SelectionCard key={m.value} title={m.label} desc={m.desc} isSelected={input.material === m.value} onClick={() => handleInputChange('material', m.value)} />)}</div>
            </div>

            <div>
                <h3 className="text-md font-semibold text-gray-300 mb-3">Finisaje</h3>
                <div className="grid grid-cols-1 gap-4">{FINISHES.map(f => <SelectionCard key={f.field} title={f.label} desc={f.desc} isSelected={!!input[f.field as keyof PriceInput]} onClick={() => handleInputChange(f.field as keyof PriceInput, !input[f.field as keyof PriceInput])} />)}</div>
            </div>

            <div className="border-t border-indigo-700/50 pt-6 space-y-3">
                 <div className="flex justify-between items-center text-white/80 font-medium">
                    <span>Preț final / mp:</span>
                    <span>{(priceResult.pricePerSqmBase).toFixed(2)} RON</span>
                </div>
                <div className="flex justify-between items-center text-white/80 font-medium">
                    <span>Suprafață taxabilă:</span>
                    <span>{priceResult.total_sqm_taxable.toFixed(2)} mp</span>
                </div>
            </div>

            <div className="text-center bg-indigo-700/20 border border-indigo-600/50 p-4 rounded-xl">
                <p className="text-lg font-medium text-indigo-300">Total (TVA inclus)</p>
                <span className="text-5xl font-extrabold text-white block mt-1 tracking-tight">{priceResult.finalPrice.toFixed(2)} RON</span>
            </div>

            <button
                className="w-full px-5 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 transition-all duration-200 transform hover:scale-[1.02] shadow-xl shadow-indigo-500/30 disabled:bg-gray-600 disabled:shadow-none disabled:transform-none"
                onClick={handleAddToCart}
                disabled={priceResult.finalPrice <= 0}
            >
                Adaugă în coș
            </button>
            {showSuccess && <div className="flex items-center justify-center text-green-400 mt-2 gap-2"><CheckCircle className="w-5 h-5" /><span>Produs adăugat cu succes!</span></div>}
        </div>
    );
}

// --- PAGINA PRINCIPALĂ, STRUCTURATĂ DUPĂ DESIGNUL DUMNEAVOASTRĂ ---
export default function BannerPage() {
    const badges = [
        { icon: Award, title: "Calitate Premium", desc: "Print de înaltă rezoluție, culori vii." },
        { icon: Zap, title: "Preț Instant", desc: "Fără cereri de ofertă, vezi prețul pe loc." },
        { icon: Shield, title: "Livrare Rapidă", desc: "Producție în 1-3 zile lucrătoare." },
    ];

    return (
        <div className="bg-gray-950 text-white">
            <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 border-b border-indigo-700/50 pb-6">
                    Configurează Bannerul Tău
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    
                    {/* Coloana din stânga (mai lată): Imaginea și Descrierea */}
                    <div className="lg:col-span-3">
                        <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/20 border border-indigo-700/50">
                            <img src="/products/banner/1.jpg" alt="Banner Frontlit Personalizat" className="w-full h-auto object-cover" />
                        </div>

                        <div className="bg-gray-900/70 p-6 md:p-8 rounded-2xl shadow-xl border border-indigo-700/50">
                            <h2 className="text-2xl font-bold text-indigo-400 mb-4">Despre Bannerele Frontlit</h2>
                            <div className="space-y-4 text-white/80 prose prose-invert max-w-none">
                                <p>Bannerele Frontlit sunt cea mai populară soluție pentru publicitatea exterioară. Materialul din PVC este rezistent la intemperii (apă, soare) și la variații de temperatură. Sistemul nostru de calcul ia în considerare dimensiunile pentru a determina suprafața totală (mp) și a aplica prețul corespunzător.</p>
                                <p>Pentru o durată de viață maximă, recomandăm alegerea opțiunii <strong>Tiv + Capse</strong>, care rigidizează marginile și previne ruperea materialului în jurul capselor.</p>
                            </div>

                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {badges.map((b, i) => (
                                    <div key={i} className="rounded-xl border border-indigo-700/50 bg-gray-800/50 p-4 text-center">
                                        <b.icon className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                                        <div className="text-md font-bold text-indigo-300">{b.title}</div>
                                        <div className="text-sm text-white/70 mt-1">{b.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Coloana din dreapta (mai îngustă): Configuratorul Sticky */}
                    <aside className="lg:col-span-2">
                        <div className="lg:sticky lg:top-8">
                            <div className="rounded-2xl border-2 border-indigo-500/30 bg-gray-900/50 backdrop-blur-md p-6 md:p-8 shadow-2xl shadow-indigo-900/40">
                                <BannerConfigurator />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
