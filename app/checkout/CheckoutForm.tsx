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
    const [formState, setFormState] = useState<FormState>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [cuiValue, setCuiValue] = useState('');

    const handleCuiBlur = () => {
        if (cuiValue.length > 2) {
            handleCUI(cuiValue);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('loading');
        setErrorMessage('');

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
                alert(`Comandă plasată cu succes! Factura generată: ${result.invoiceLink}`);
                window.location.href = '/'; // Redirecționare spre pagina de succes
            } catch (error: any) {
                setFormState('error');
                setErrorMessage(error.message);
            }
        } else if (paymentMethod === 'card') {
            if (!stripe) {
                setErrorMessage("Stripe nu s-a putut inițializa.");
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
                setErrorMessage(error.message || 'A apărut o eroare neașteptată.');
                setFormState('error');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            {/* Container unde Stripe va monta formularul DUPĂ ce se apasă pe buton */}
            <div id="checkout"></div>

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
                <div className="flex space-x-4 mb-6">
                    <button type="button" onClick={() => setBilling(b => ({...b, tip_factura: 'persoana_fizica'}))} className={`flex-1 p-4 rounded-lg border ${billing.tip_factura === 'persoana_fizica' ? 'bg-indigo-600 border-indigo-500' : 'bg-gray-800 border-gray-700'}`}>Persoană Fizică</button>
                    <button type="button" onClick={() => setBilling(b => ({...b, tip_factura: 'companie'}))} className={`flex-1 p-4 rounded-lg border ${billing.tip_factura === 'companie' ? 'bg-indigo-600 border-indigo-500' : 'bg-gray-800 border-gray-700'}`}>Companie</button>
                </div>
                {billing.tip_factura === 'companie' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                         <div className="relative">
                            <label htmlFor="cui" className="block text-sm font-medium text-gray-300 mb-2">CUI</label>
                             <input id="cui" value={cuiValue} onChange={(e) => setCuiValue(e.target.value)} onBlur={handleCuiBlur} className="block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md" />
                        </div>
                        <FormInput name="name" label="Nume Companie" icon={<Building size={20} />} state={billing} setState={setBilling as any} />
                    </div>
                )}
            </div>

             <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">3. Metodă de Plată</h2>
                <div className="flex space-x-4">
                    <button type="button" onClick={() => setPaymentMethod('ramburs')} className={`flex-1 p-4 rounded-lg border ${paymentMethod === 'ramburs' ? 'bg-indigo-600 border-indigo-500' : 'bg-gray-800 border-gray-700'}`}>Plată la livrare (Ramburs)</button>
                    <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 p-4 rounded-lg border ${paymentMethod === 'card' ? 'bg-indigo-600 border-indigo-500' : 'bg-gray-800 border-gray-700'}`}>Plată cu Cardul Online</button>
                </div>
            </div>

            <button type="submit" className="w-full bg-green-500 text-white font-bold py-3 rounded-lg" disabled={formState === 'loading'}>
                {formState === 'loading' ? 'Se procesează...' : 'Plasează Comanda'}
            </button>
            {errorMessage && <p className="text-red-500 mt-4 text-center">{errorMessage}</p>}
        </form>
    );
}