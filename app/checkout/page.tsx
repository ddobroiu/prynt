// app/checkout/page.tsx
"use client";
import React, { useState } from 'react';
import { useCart } from '../../components/CartProvider'; // Ajustează calea
import { ArrowLeft, Trash2, Loader2, CheckCircle } from 'lucide-react'; // Iconițe

// Utilitară pentru formatarea banilor
const money = (num: number) => `${num.toFixed(2)} RON`;

export default function CheckoutPage() {
    const { items, total, count, removeItem, clear } = useCart();
    const [formData, setFormData] = useState({
        nume: '',
        telefon: '',
        email: '',
        adresa: '',
        oras: '',
        judet: '',
        mentiuni: '',
    });
    const [loading, setLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'error'>('idle');

    if (!items.length) {
        return (
            <div className="mx-auto max-w-2xl py-20 text-center text-white">
                <h1 className="text-3xl font-bold text-indigo-400 mb-4">Coșul tău este gol!</h1>
                <p className="text-lg mb-6 text-white/70">Începe prin a configura un produs.</p>
                <a href="/banner" className="inline-flex items-center px-6 py-3 bg-indigo-600 rounded-full text-white font-semibold hover:bg-indigo-500 transition-colors">
                    <ArrowLeft size={18} className="mr-2" />
                    Configurează un Banner
                </a>
            </div>
        );
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setOrderStatus('idle');

        // Adaugă produsele și datele clientului
        const orderData = {
            ...formData,
            items: items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                unitAmount: item.unitAmount,
                totalAmount: item.totalAmount,
            })),
            cartTotal: total,
            paymentMethod: 'Plata la Livrare (Ramburs)',
        };

        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                setOrderStatus('success');
                clear(); // Golește coșul după plasarea comenzii
            } else {
                setOrderStatus('error');
            }
        } catch (error) {
            console.error("Eroare la plasarea comenzii:", error);
            setOrderStatus('error');
        } finally {
            setLoading(false);
        }
    };
    
    // Mesaj de succes la plasarea comenzii
    if (orderStatus === 'success') {
         return (
            <div className="mx-auto max-w-2xl py-20 text-center text-white">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
                <h1 className="text-4xl font-extrabold text-white mb-4">Comanda a fost plasată cu succes!</h1>
                <p className="text-xl mb-8 text-white/80">
                    Îți mulțumim! Vei primi un email de confirmare în scurt timp.
                </p>
                <a href="/" className="inline-flex items-center px-6 py-3 bg-indigo-600 rounded-full text-white font-semibold hover:bg-indigo-500 transition-colors">
                    <ArrowLeft size={18} className="mr-2" />
                    Înapoi la prima pagină
                </a>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-12">
            <h1 className="text-4xl font-extrabold text-indigo-400 mb-10">Finalizare Comandă</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Coloana 1: Sumarul Coșului */}
                <div className="lg:col-span-1 p-6 rounded-2xl border border-indigo-700/50 bg-gray-900 h-fit lg:sticky lg:top-24">
                    <h2 className="text-2xl font-bold text-white mb-5 border-b border-indigo-700/50 pb-3">
                        Sumar ({count} {count === 1 ? 'produs' : 'produse'})
                    </h2>

                    <ul className="space-y-4 mb-6">
                        {items.map((item) => (
                            <li key={item.id} className="flex justify-between items-start border-b border-gray-700/50 pb-3 last:border-b-0">
                                <div className="flex-1 pr-4">
                                    <p className="font-semibold text-white">{item.name}</p>
                                    <p className="text-sm text-white/70">
                                        {item.quantity} buc. x {money(item.unitAmount)} / buc.
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-white">{money(item.totalAmount)}</p>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 hover:text-red-400 transition-colors text-xs mt-1 flex items-center gap-1"
                                        aria-label={`Elimină ${item.name}`}
                                    >
                                        <Trash2 size={12} />
                                        Elimină
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="pt-4 border-t border-indigo-500/50">
                        <div className="flex justify-between items-center text-xl font-extrabold text-white">
                            <span>Total de Plată:</span>
                            <span className="text-indigo-400">{money(total)}</span>
                        </div>
                        <p className="text-xs text-white/70 mt-2">Plata se face **ramburs** la primirea coletului.</p>
                    </div>
                </div>

                {/* Coloana 2: Formularul de Livrare */}
                <div className="lg:col-span-2 p-6 rounded-2xl border border-indigo-700/50 bg-gray-900">
                    <h2 className="text-2xl font-bold text-white mb-5 border-b border-indigo-700/50 pb-3">
                        Detalii de Livrare
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Rand 1 */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <InputField name="nume" label="Nume și Prenume (sau Denumire Firmă)" type="text" value={formData.nume} onChange={handleChange} required />
                            <InputField name="telefon" label="Telefon" type="tel" value={formData.telefon} onChange={handleChange} required />
                        </div>
                        {/* Rand 2 */}
                        <InputField name="email" label="Email" type="email" value={formData.email} onChange={handleChange} required />
                        {/* Rand 3 (Adresă) */}
                        <div className="grid sm:grid-cols-3 gap-6">
                            <InputField name="oras" label="Oraș" type="text" value={formData.oras} onChange={handleChange} required />
                            <InputField name="judet" label="Județ" type="text" value={formData.judet} onChange={handleChange} required />
                            <InputField name="adresa" label="Adresă completă (Strada, Nr, Bloc, Scara, Ap)" type="text" value={formData.adresa} onChange={handleChange} required className="sm:col-span-3" />
                        </div>
                        {/* Rand 4 (Mentiuni) */}
                        <div>
                            <label htmlFor="mentiuni" className="block text-sm font-medium text-white/90 mb-1">
                                Mentiuni suplimentare (Opțional)
                            </label>
                            <textarea
                                id="mentiuni"
                                name="mentiuni"
                                rows={3}
                                value={formData.mentiuni}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-indigo-700/50 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Metodă de plată */}
                        <div className="pt-4">
                            <h3 className="text-xl font-bold text-white mb-3">Metodă de Plată</h3>
                            <div className="p-4 rounded-xl border-2 border-indigo-500 bg-indigo-900/50 text-white">
                                **Plata la Livrare (Ramburs)**
                                <p className="text-sm text-white/70 mt-1">Vei plăti suma de {money(total)} curierului la primirea coletului.</p>
                            </div>
                        </div>

                        {/* Buton Plasare Comandă */}
                        <button
                            type="submit"
                            disabled={loading || orderStatus === 'success'}
                            className="w-full mt-6 flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-extrabold text-lg hover:bg-indigo-500 transition-colors shadow-xl shadow-indigo-500/40 disabled:bg-gray-600 disabled:shadow-none"
                        >
                            {loading ? (
                                <><Loader2 size={24} className="animate-spin mr-2" /> Se plasează comanda...</>
                            ) : orderStatus === 'error' ? (
                                'Eroare la plasarea comenzii'
                            ) : (
                                `Plasează Comanda Acum - ${money(total)}`
                            )}
                        </button>
                        
                        {orderStatus === 'error' && (
                            <p className="text-red-500 text-center">A apărut o eroare. Te rugăm să reîncerci sau să ne contactezi.</p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

// Componentă utilitară pentru inputuri
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string;
    type: string;
    value: string;
}

const InputField: React.FC<InputFieldProps> = ({ name, label, type, value, onChange, required, className = '' }) => (
    <div className={className}>
        <label htmlFor={name} className="block text-sm font-medium text-white/90 mb-1">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full rounded-lg border border-indigo-700/50 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
        />
    </div>
);