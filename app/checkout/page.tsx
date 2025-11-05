"use client";

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { Address, Billing, CartItem } from '../../types';
import { X } from 'lucide-react'; // Iconiță pentru butonul de ștergere

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    const [address, setAddress] = useState<Address>({ nume_prenume: '', email: '', telefon: '', judet: '', localitate: '', strada_nr: '' });
    const [billing, setBilling] = useState<Billing>({ tip_factura: 'persoana_fizica' });
    const [sameAsDelivery, setSameAsDelivery] = useState(true); // Starea pentru checkbox
    const [paymentMethod, setPaymentMethod] = useState('ramburs');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [judete, setJudete] = useState<string[]>([]);
    
    // Funcție pentru a șterge un produs din coș
    const removeFromCart = (itemId: string) => {
        setCart(currentCart => currentCart.filter(item => item.id !== itemId));
    };
    
    const handleCUI = async (cui: string) => {
        // Logica ta pentru Oblio
    };

    useEffect(() => {
        const listaJudete = ["Alba", "Arad", "Arges", "Bacau", "Bihor", "Bistrita-Nasaud", "Botosani", "Brasov", "Braila", "Bucuresti", "Buzau", "Caras-Severin", "Calarasi", "Cluj", "Constanta", "Covasna", "Dambovita", "Dolj", "Galati", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomita", "Iasi", "Ilfov", "Maramures", "Mehedinti", "Mures", "Neamt", "Olt", "Prahova", "Satu Mare", "Salaj", "Sibiu", "Suceava", "Teleorman", "Timis", "Tulcea", "Vaslui", "Valcea", "Vrancea"];
        setJudete(listaJudete);
        setCart([
            { id: '1', name: 'Banner personalizat', quantity: 1, unitAmount: 225.00, totalAmount: 225.00 },
            { id: '2', name: 'Banner personalizat 107x100cm', quantity: 1, unitAmount: 41.20, totalAmount: 41.20 },
        ]);
    }, []);

    const setJudet = (judet: string, type: 'delivery' | 'billing') => {
        if (type === 'delivery') {
            setAddress(a => ({...a, judet: judet}));
        } else {
            setBilling(b => ({...b, judet: judet}));
        }
    };
    
    const subtotal = cart.reduce((acc, item) => acc + item.totalAmount, 0);
    const costLivrare = 19.99;
    const totalPlata = subtotal > 0 ? subtotal + costLivrare : 0;

    const stripeOptions = {
        mode: 'payment' as const,
        amount: Math.round(totalPlata * 100),
        currency: 'ron',
        appearance: { theme: 'night' as const },
    };

    return (
        <div className="container mx-auto px-4 py-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                <div className="lg:col-span-2">
                    <Elements stripe={stripePromise} options={stripeOptions}>
                        <CheckoutForm 
                            address={address}
                            setAddress={setAddress}
                            billing={billing}
                            setBilling={setBilling}
                            cart={cart}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            sameAsDelivery={sameAsDelivery}
                            setSameAsDelivery={setSameAsDelivery} // Trimitem starea checkbox-ului
                            judete={judete}
                            setJudet={setJudet}
                            handleCUI={handleCUI}
                        />
                    </Elements>
                </div>

                <div className="lg:col-span-1 bg-gray-900 border border-gray-700 rounded-2xl p-8 h-fit">
                    <h2 className="text-2xl font-bold text-white mb-6">Sumar Comandă</h2>
                    {cart.length > 0 ? (
                        <div className="space-y-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex-grow">
                                        <span>{item.name} x {item.quantity}</span>
                                        <p className="text-sm text-gray-400">{item.totalAmount.toFixed(2)} RON</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400 p-2">
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                            <hr className="border-gray-700 my-4" />
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>{subtotal.toFixed(2)} RON</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Livrare:</span>
                                <span>{costLivrare.toFixed(2)} RON</span>
                            </div>
                            <hr className="border-gray-700 my-4" />
                            <div className="flex justify-between font-bold text-xl">
                                <span>TOTAL:</span>
                                <span>{totalPlata.toFixed(2)} RON</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-400">Coșul de cumpărături este gol.</p>
                    )}
                </div>
            </div>
        </div>
    );
}