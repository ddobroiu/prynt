"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
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
    setJudet: (judet: string) => void;
    handleCUI: (cui: string) => void;
}

export default function CheckoutForm({
    address, setAddress, billing, setBilling, cart, paymentMethod, setPaymentMethod, sameAsDelivery, setSameAsDelivery, judete, setJudet, handleCUI
}: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [formState, setFormState] = useState<FormState>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('loading');
        setErrorMessage('');

        if (paymentMethod !== 'card') {
            // Logica pentru alte metode de plată (ex: ramburs)
            alert('Metoda de plată nu este implementată încă.');
            setFormState('idle');
            return;
        }

        if (!stripe || !elements) {
            setErrorMessage("Stripe nu s-a putut inițializa.");
            setFormState('error');
            return;
        }

        try {
            // 1. Creează o sesiune de checkout pe server-ul tău
            const res = await fetch('/api/stripe/checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart, address, billing }),
            });

            const { clientSecret } = await res.json();
            if (!clientSecret) {
                throw new Error("Client secret invalid de la server.");
            }

            // 2. Inițializează și montează noul Embedded Checkout
            const { error } = await stripe.initEmbeddedCheckout({ clientSecret });
            
            if (error) {
                setErrorMessage(error.message);
                setFormState('error');
            }
            // Checkout-ul va apărea automat pe pagină
        } catch (error: any) {
            setErrorMessage(error.message || 'A apărut o eroare neașteptată.');
            setFormState('error');
        }
    };

    return (
        <>
            {/* Container unde Stripe va monta formularul de plată */}
            <div id="checkout"></div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">1. Date Livrare</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                        <FormInput name="nume_prenume" label="Nume și Prenume" icon={<User size={20} />} state={address} setState={setAddress} />
                        <FormInput name="email" label="Adresă de Email" icon={<Mail size={20} />} state={address} setState={setAddress} />
                        <FormInput name="telefon" label="Număr de Telefon" icon={<Phone size={20} />} state={address} setState={setAddress} />
                        <div className="relative">
                            <label htmlFor="judet" className="block text-sm font-medium text-gray-300 mb-2">Județ</label>
                            <select id="judet" value={address.judet} onChange={(e) => setJudet(e.target.value)} className="block w-full pl-3 pr-10 py-2 bg-gray-800 border border-gray-600 rounded-md text-white">
                                <option value="">Selectează Județul</option>
                                {judete.map(j => <option key={j} value={j}>{j}</option>)}
                            </select>
                        </div>
                        <FormInput name="localitate" label="Localitate" icon={<></>} state={address} setState={setAddress} />
                        <FormInput name="strada_nr" label="Stradă și Număr" icon={<></>} state={address} setState={setAddress} />
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">2. Date Facturare</h2>
                    {/* Aici adaugi logica pentru facturare, inclusiv CUI */}
                </div>

                <button type="submit" className="w-full bg-green-500 text-white font-bold py-3" disabled={formState === 'loading'}>
                    {formState === 'loading' ? 'Se încarcă plata...' : 'Plătește cu cardul'}
                </button>
                {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            </form>
        </>
    );
}
