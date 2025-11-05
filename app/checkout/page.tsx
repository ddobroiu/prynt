"use client";

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { Address, Billing, CartItem } from '../../types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    const [address, setAddress] = useState<Address>({ nume_prenume: '', email: '', telefon: '', judet: '', localitate: '', strada_nr: '' });
    const [billing, setBilling] = useState<Billing>({ tip_factura: 'persoana_fizica' });
    const [sameAsDelivery, setSameAsDelivery] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('ramburs');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [judete, setJudete] = useState<string[]>([]);
    
    const handleCUI = async (cui: string) => {
        try {
            const response = await fetch(`/api/oblio/cif?cif=${cui}`);
            const data = await response.json();
            if (data.status === 200 && data.data) {
                const info = data.data;
                setBilling(b => ({
                    ...b,
                    tip_factura: 'companie',
                    cui: cui,
                    name: info.denumire,
                    address: `${info.adresa}, ${info.judet}`
                }));
            }
        } catch (error) {
            console.error("Eroare CUI:", error);
        }
    };

    useEffect(() => {
        const listaJudete = ["Alba", "Arad", "Arges", "Bacau", "Bihor", "Bistrita-Nasaud", "Botosani", "Brasov", "Braila", "Bucuresti", "Buzau", "Caras-Severin", "Calarasi", "Cluj", "Constanta", "Covasna", "Dambovita", "Dolj", "Galati", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomita", "Iasi", "Ilfov", "Maramures", "Mehedinti", "Mures", "Neamt", "Olt", "Prahova", "Satu Mare", "Salaj", "Sibiu", "Suceava", "Teleorman", "Timis", "Tulcea", "Vaslui", "Valcea", "Vrancea"];
        setJudete(listaJudete);
        setCart([
            { id: '1', name: 'Banner personalizat', quantity: 1, unitAmount: 225.00, totalAmount: 225.00 },
            { id: '2', name: 'Banner personalizat 107x100cm', quantity: 1, unitAmount: 41.20, totalAmount: 41.20 },
        ]);
    }, []);

    const setJudet = (judet: string) => {
        setAddress(a => ({...a, judet: judet}));
    };

    const options = {
        mode: 'payment' as const,
        amount: 1099, // Trebuie calculat dinamic din coș
        currency: 'ron',
        appearance: { theme: 'night' as const },
    };

    return (
        <div className="container mx-auto px-4 py-12 text-white">
            <div className="grid grid-cols-1">
                <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm 
                        address={address}
                        setAddress={setAddress}
                        billing={billing}
                        setBilling={setBilling}
                        cart={cart}
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                        sameAsDelivery={sameAsDelivery}
                        setSameAsDelivery={setSameAsDelivery}
                        judete={judete}
                        setJudet={setJudet}
                        handleCUI={handleCUI}
                    />
                </Elements>
            </div>
        </div>
    );
}