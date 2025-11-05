"use client";

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Address, Billing, CartItem } from '../../types';
import CheckoutForm from './CheckoutForm';
import { X } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    const [address, setAddress] = useState<Address>({ nume_prenume: '', email: '', telefon: '', judet: '', localitate: '', strada_nr: '' });
    const [billing, setBilling] = useState<Billing>({ tip_factura: 'persoana_fizica' });
    const [sameAsDelivery, setSameAsDelivery] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('ramburs');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [judete, setJudete] = useState<string[]>([]);
    
    // Funcția de a scoate produse din coș
    const removeFromCart = (itemId: string) => {
        setCart(currentCart => currentCart.filter(item => item.id !== itemId));
    };
    
    // Funcția pentru CUI (logica ta)
    const handleCUI = async (cui: string) => { /* ... logica ta Oblio ... */ };

    // Încărcare județe și coș (simulat)
    useEffect(() => {
        const listaJudete = ["Alba", "Arad", "Arges", "Bacau", "Bihor", "Bistrita-Nasaud", "Botosani", "Brasov", "Braila", "Bucuresti", "Buzau", "Caras-Severin", "Calarasi", "Cluj", "Constanta", "Covasna", "Dambovita", "Dolj", "Galati", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomita", "Iasi", "Ilfov", "Maramures", "Mehedinti", "Mures", "Neamt", "Olt", "Prahova", "Satu Mare", "Salaj", "Sibiu", "Suceava", "Teleorman", "Timis", "Tulcea", "Vaslui", "Valcea", "Vrancea"];
        setJudete(listaJudete);
        
        // Simulare încărcare coș
        setCart([
            { id: '1', name: 'Banner personalizat 100x100cm', quantity: 1, unitAmount: 38.50, totalAmount: 38.50 },
        ]);
    }, []);

    // Funcția de a seta județul pentru livrare sau facturare
    const setJudet = (judet: string, type: 'delivery' | 'billing') => {
        if (type === 'delivery') setAddress(a => ({...a, judet: judet}));
        else setBilling(b => ({...b, judet: judet}));
    };
    
    // Calcule pentru total
    const subtotal = cart.reduce((acc, item) => acc + item.totalAmount, 0);
    const costLivrare = 19.99;
    const totalPlata = subtotal > 0 ? subtotal + costLivrare : 0;

    const stripeOptions = {
        mode: 'payment' as const,
        amount: Math.round(totalPlata * 100),
        currency: 'ron',
    };

    return (
        <div className="bg-[#0b0f19] min-h-screen text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-extrabold tracking-tight mb-8">Finalizează comanda</h1>
                
                {cart.length === 0 ? (
                    <p>Coșul tău este gol.</p>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Coloana principală cu formularul */}
                        <div className="lg:col-span-2">
                             <Elements stripe={stripePromise} options={stripeOptions}>
                                <CheckoutForm
                                    address={address} setAddress={setAddress}
                                    billing={billing} setBilling={setBilling}
                                    cart={cart}
                                    paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                                    sameAsDelivery={sameAsDelivery} setSameAsDelivery={setSameAsDelivery}
                                    judete={judete}
                                    setJudet={setJudet}
                                    handleCUI={handleCUI}
                                />
                            </Elements>
                        </div>

                        {/* Coloana laterală cu sumarul comenzii */}
                        <div className="bg-[#1c2135] p-6 rounded-lg shadow-lg h-fit">
                            <h2 className="text-xl font-bold border-b border-gray-600 pb-4 mb-4">Sumar Comandă</h2>
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <div>
                                            <p className="font-semibold">{item.name} x {item.quantity}</p>
                                            <p className="text-gray-400">{item.unitAmount.toFixed(2)} RON</p>
                                        </div>
                                        <div className="flex items-center">
                                            <p className="font-semibold mr-4">{item.totalAmount.toFixed(2)} RON</p>
                                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-gray-600 mt-4 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <p>Subtotal</p>
                                    <p>{subtotal.toFixed(2)} RON</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p>Livrare</p>
                                    <p>{costLivrare.toFixed(2)} RON</p>
                                </div>
                                <div className="flex justify-between text-lg font-bold mt-2">
                                    <p>TOTAL</p>
                                    <p>{totalPlata.toFixed(2)} RON</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}