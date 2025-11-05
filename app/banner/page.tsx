"use client";

import { useState, useMemo, FC, ChangeEvent } from 'react';
import { Check, ShoppingCart, CheckCircle } from 'lucide-react';
// CALEA CORECTATĂ FINALĂ - am scos '-store' de la final
import { useCart } from '@/hooks/use-cart'; 
import { calculatePrice, PriceInput, BannerMaterial } from '@/lib/pricing-banner'; 

// --- DATE CONFIGURARE ---
const MATERIALS: { value: BannerMaterial; label: string; desc: string }[] = [
  { value: "frontlit_440", label: "Frontlit 440 g/mp", desc: "Standard, cel mai popular" },
  { value: "frontlit_510", label: "Frontlit 510 g/mp", desc: "Premium, mai rezistent" },
];

const FINISHES: { label: string; field: keyof PriceInput; desc: string }[] = [
  { label: "Tiv și capse la 50 cm", field: "want_hem_and_grommets", desc: "Finisaj standard pentru rezistență" },
  { label: "Găuri de vânt", field: "want_wind_holes", desc: "Recomandat pentru zone expuse la vânt" },
];

// --- COMPONENTE UI MODERNE ---

interface SelectCardProps {
    label: string;
    desc: string;
    value: BannerMaterial;
    currentSelection: BannerMaterial;
    onClick: (value: BannerMaterial) => void;
}

const SelectCard: FC<SelectCardProps> = ({ label, desc, value, currentSelection, onClick }) => (
    <button
        onClick={() => onClick(value)}
        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 ${
            currentSelection === value 
                ? 'border-indigo-600 bg-indigo-900/30 shadow-lg' 
                : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'
        }`}
    >
        <div className="flex justify-between items-center">
            <span className="font-semibold text-white">{label}</span>
            {currentSelection === value && <Check className="w-5 h-5 text-indigo-400" />}
        </div>
        <p className="text-sm text-gray-400 mt-1">{desc}</p>
    </button>
);

interface CheckboxOptionProps {
    label: string;
    desc: string;
    checked: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxOption: FC<CheckboxOptionProps> = ({ label, desc, checked, onChange }) => (
    <label className="flex items-start p-4 rounded-lg border border-gray-700 bg-gray-800/50 cursor-pointer hover:bg-gray-700/80 transition-colors">
        <input 
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="mt-1 w-5 h-5 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 focus:border-indigo-500 shrink-0"
        />
        <div className="ml-4">
            <span className="font-medium text-white/90">{label}</span>
            <p className="text-sm text-gray-400">{desc}</p>
        </div>
    </label>
);

interface NumberInputProps {
    label: string;
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    unit: string;
}

const NumberInput: FC<NumberInputProps> = ({ label, value, onChange, unit }) => (
    <div className="relative">
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input
            type="number"
            value={value}
            onChange={onChange}
            min="1"
            className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:ring-indigo-500 transition"
        />
        <span className="absolute right-4 top-10 text-gray-400">{unit}</span>
    </div>
);

// --- COMPONENTA PRINCIPALĂ A CONFIGURATORULUI ---
function BannerConfigurator() {
    const [input, setInput] = useState<PriceInput>({
        width_cm: 100,
        height_cm: 50,
        quantity: 1,
        material: "frontlit_440",
        want_wind_holes: false,
        want_hem_and_grommets: true,
    });
    const [showSuccess, setShowSuccess] = useState(false);
    
    const priceResult = useMemo(() => calculatePrice(input), [input]);
    const cart = useCart();

    const pricePerUnit = input.quantity > 0 && priceResult.finalPrice > 0
        ? (priceResult.finalPrice / input.quantity)
        : 0;

    const handleInputChange = (field: keyof PriceInput, value: string | number | boolean) => {
        setInput(prev => ({ ...prev, [field]: value }));
    };
    
    const handleAddToCart = () => {
        if (input.width_cm < 1 || input.height_cm < 1 || input.quantity < 1 || priceResult.finalPrice <= 0) {
            alert("Te rugăm să introduci dimensiuni și cantitate valide.");
            return;
        }

        const uniqueId = `banner-${input.material}-${input.width_cm}x${input.height_cm}-${input.want_hem_and_grommets}-${input.want_wind_holes}`;
        
        cart.addItem({
            id: uniqueId, 
            name: `Banner ${input.material.replace(/_/g, ' ')} ${input.width_cm}x${input.height_cm}cm`,
            quantity: input.quantity, 
            unitAmount: pricePerUnit,
            price: priceResult.finalPrice, 
        }); 
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto p-4 md:p-8">
            {/* Coloana de configurare */}
            <div className="lg:col-span-2 space-y-8">
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">1. Dimensiuni și Cantitate</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <NumberInput label="Lățime" value={input.width_cm} onChange={e => handleInputChange('width_cm', parseInt(e.target.value) || 0)} unit="cm" />
                        <NumberInput label="Înălțime" value={input.height_cm} onChange={e => handleInputChange('height_cm', parseInt(e.target.value) || 0)} unit="cm" />
                        <NumberInput label="Bucăți" value={input.quantity} onChange={e => handleInputChange('quantity', parseInt(e.target.value) || 1)} unit="buc" />
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">2. Material</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MATERIALS.map(mat => (
                            <SelectCard 
                                key={mat.value}
                                {...mat}
                                currentSelection={input.material}
                                onClick={value => handleInputChange('material', value)}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">3. Finisaje</h3>
                    <div className="space-y-4">
                        {FINISHES.map(fin => (
                            <CheckboxOption 
                                key={fin.field}
                                label={fin.label}
                                desc={fin.desc}
                                checked={!!input[fin.field]}
                                onChange={e => handleInputChange(fin.field, e.target.checked)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Coloana de preț și sumar */}
            <div className="lg:col-span-1 sticky top-8 self-start">
                <div className="bg-gray-800/50 rounded-xl shadow-2xl p-6 space-y-4 border border-gray-700">
                    <h3 className="text-lg font-bold text-white border-b border-gray-700 pb-3">Sumar Comandă</h3>
                    
                    <div className="flex justify-between text-gray-300">
                        <span>Suprafață taxabilă:</span>
                        <span className="font-medium text-white">{priceResult.total_sqm_taxable.toFixed(2)} m²</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                        <span>Preț bază (fără TVA):</span>
                        <span className="font-medium text-white">{priceResult.totalBasePrice.toFixed(2)} RON</span>
                    </div>
                    
                    <div className="border-t border-gray-700 my-4"></div>

                    <div className="flex justify-between items-center text-2xl font-bold text-white">
                        <span>TOTAL (cu TVA):</span>
                        <span>{priceResult.finalPrice.toFixed(2)} RON</span>
                    </div>
                    <div className="text-sm text-gray-400 text-right">Preț / bucată: {pricePerUnit.toFixed(2)} RON</div>

                    <button 
                        onClick={handleAddToCart}
                        disabled={priceResult.finalPrice <= 0}
                        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center space-x-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Adaugă în coș</span>
                    </button>
                    {showSuccess && (
                        <div className="flex items-center justify-center text-green-400 mt-3">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            <span>Adăugat cu succes!</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- PAGINA PRINCIPALĂ ---
export default function BannerPage() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Configurator Bannere Publicitare</h1>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">Creează bannerul perfect pentru afacerea ta în doar câțiva pași simpli.</p>
        </div>
        <BannerConfigurator />
      </div>
    </div>
  );
}