"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { Address, Billing, CartItem, FormState } from '../../types';
import FormInput from '../../components/FormInput';
import { User, Mail, Phone, Building } from 'lucide-react';

interface CheckoutFormProps {
    address: Address;
    setAddress: Dispatch<SetStateAction<Address>>;
    billing: Billing;
    setBilling: Dispatch<SetStateAction<Billing>>;
    cart: CartItem[];
    paymentMethod: string;
    setPaymentMethod: Dispatch<SetStateAction<string>>;
    sameAsDelivery: boolean;
    setSameAsDelivery: Dispatch<SetStateAction<boolean>>;
    judete: string[];
    setJudet: (judet: string, type: 'delivery' | 'billing') => void;
    handleCUI: (cui: string) => void;
}

export default function CheckoutForm({
    address, setAddress, billing, setBilling, cart, paymentMethod, setPaymentMethod, sameAsDelivery, setSameAsDelivery, judete, setJudet, handleCUI
}: CheckoutFormProps) {
    const stripe = useStripe();
    const [formState, setFormState] = useState<FormState>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [cuiValue, setCuiValue] = useState('');

    useEffect(() => {
        if (sameAsDelivery) {
            setBilling(b => ({
                ...b,
                name: b.tip_factura === 'companie' ? b.name : address.nume_prenume,
                judet: address.judet,
                localitate: address.localitate,
                strada_nr: address.strada_nr,
            }));
        }
    }, [sameAsDelivery, address, setBilling, billing.tip_factura]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('loading');
        setErrorMessage('');
        
        // Ascunde formularul vechi și pregătește containerul pentru Stripe dacă se plătește cu card
        if (paymentMethod === 'card') {
             const formElement = e.target as HTMLFormElement;
             formElement.style.display = 'none'; // Ascunde formularul curent
        }

        const orderData = { address, billing, cart };

        if (paymentMethod === 'ramburs') {
            try {
                const response = await fetch('/api/order/create', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify(orderData) 
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'A apărut o eroare la crearea comenzii.');
                alert(`Comandă ramburs plasată cu succes! Factura: ${result.invoiceLink}`);
                window.location.href = '/';
            } catch (error: any) {
                setFormState('error');
                setErrorMessage(error.message);
            }
        } else if (paymentMethod === 'card') {
            if (!stripe || cart.length === 0) {
                setErrorMessage("Stripe nu este gata sau coșul este gol.");
                setFormState('error');
                return;
            }
            try {
                const res = await fetch('/api/stripe/checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData),
                });
                const { clientSecret } = await res.json();
                if (!clientSecret) throw new Error("Client secret invalid de la server.");
                await stripe.initEmbeddedCheckout({ clientSecret });
            } catch (error: any) {
                setErrorMessage(error.message || 'A apărut o eroare la plată.');
                setFormState('error');
                 const formElement = e.target as HTMLFormElement;
                 formElement.style.display = 'block'; // Re-afișează formularul dacă apare o eroare
            }
        }
         // Nu reseta starea la 'idle' pentru card, deoarece formularul Stripe preia controlul
        if (paymentMethod !== 'card') {
            setFormState('idle');
        }
    };

    return (
        <>
            {/* Acest container va fi folosit de Stripe PENTRU A MONTA formularul de plată */}
            <div id="checkout"></div>

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* Secțiunea 1: Date Livrare */}
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">1. Date Livrare</h2>
                    {/* ... câmpurile pentru livrare ... */}
                </div>

                {/* Secțiunea 2: Date Facturare */}
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">2. Date Facturare</h2>
                    {/* ... logica pentru facturare, checkbox, CUI etc. ... */}
                </div>

                {/* ======================================================== */}
                {/* SECȚIUNEA 3: METODĂ DE PLATĂ (AM PUS-O LA LOC ACUM) */}
                {/* ======================================================== */}
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">3. Metodă de Plată</h2>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <button type="button" onClick={() => setPaymentMethod('ramburs')} className={`flex-1 p-4 rounded-lg border text-center transition-colors ${paymentMethod === 'ramburs' ? 'bg-indigo-600 border-indigo-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}>
                            Plată la livrare (Ramburs)
                        </button>
                        <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 p-4 rounded-lg border text-center transition-colors ${paymentMethod === 'card' ? 'bg-indigo-600 border-indigo-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}>
                            Plată cu Cardul Online
                        </button>
                    </div>
                </div>

                <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-transform" disabled={formState === 'loading' || cart.length === 0}>
                    {formState === 'loading' ? 'Se procesează...' : (paymentMethod === 'card' ? 'Continuă spre plată' : 'Plasează Comanda')}
                </button>
                {errorMessage && <p className="text-red-500 mt-4 text-center">{errorMessage}</p>}
            </form>
        </>
    );
}