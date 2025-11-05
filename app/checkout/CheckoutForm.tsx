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
        
        if (paymentMethod === 'card') {
             const formElement = e.target as HTMLFormElement;
             formElement.style.display = 'none';
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
                if (!response.ok) throw new Error(result.message || 'Eroare la crearea comenzii.');
                alert(`Comandă ramburs plasată! Factura: ${result.invoiceLink}`);
                window.location.href = '/';
            } catch (error: any) {
                setFormState('error');
                setErrorMessage(error.message);
            }
        } else if (paymentMethod === 'card') {
            if (!stripe || cart.length === 0) return;
            try {
                const res = await fetch('/api/stripe/checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData),
                });
                const { clientSecret } = await res.json();
                if (!clientSecret) throw new Error("Client secret invalid.");
                await stripe.initEmbeddedCheckout({ clientSecret });
            } catch (error: any) {
                setErrorMessage(error.message || 'Eroare la plată.');
                setFormState('error');
                 const formElement = e.target as HTMLFormElement;
                 formElement.style.display = 'block';
            }
        }
        if (paymentMethod !== 'card') setFormState('idle');
    };

    return (
        <>
            <div id="checkout"></div>

            <form onSubmit={handleSubmit} className="space-y-10">
                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">1. Date Livrare</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                        <FormInput name="nume_prenume" label="Nume și Prenume" icon={<User size={20} />} state={address} setState={setAddress} />
                        <FormInput name="email" label="Adresă de Email" icon={<Mail size={20} />} state={address} setState={setAddress} />
                        <FormInput name="telefon" label="Număr de Telefon" icon={<Phone size={20} />} state={address} setState={setAddress} />
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Județ</label>
                            <select value={address.judet} onChange={(e) => setJudet(e.target.value, 'delivery')} className="block w-full pl-3 pr-10 py-2 bg-gray-800 border border-gray-600 rounded-md">
                               <option value="">Alege județul</option>
                               {judete.map(j => <option key={`del-${j}`} value={j}>{j}</option>)}
                            </select>
                        </div>
                        <FormInput name="localitate" label="Localitate" icon={<></>} state={address} setState={setAddress} />
                        <FormInput name="strada_nr" label="Stradă și Număr" icon={<></>} state={address} setState={setAddress} />
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">2. Date Facturare</h2>
                    <div className="flex space-x-4 mb-6">
                        <button type="button" onClick={() => setBilling(b => ({...b, tip_factura: 'persoana_fizica'}))} className={`flex-1 p-4 rounded-lg border ${billing.tip_factura === 'persoana_fizica' ? 'bg-indigo-600' : 'bg-gray-800'}`}>Persoană Fizică</button>
                        <button type="button" onClick={() => setBilling(b => ({...b, tip_factura: 'companie'}))} className={`flex-1 p-4 rounded-lg border ${billing.tip_factura === 'companie' ? 'bg-indigo-600' : 'bg-gray-800'}`}>Companie</button>
                    </div>
                    <div className="space-y-4">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" checked={sameAsDelivery} onChange={(e) => setSameAsDelivery(e.target.checked)} className="h-5 w-5 rounded bg-gray-700 border-gray-600"/>
                            <span className="text-gray-300">Adresa de facturare este aceeași cu adresa de livrare</span>
                        </label>
                        {!sameAsDelivery && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 pt-4 border-t border-gray-800">
                                 <FormInput name="name" label={billing.tip_factura === 'companie' ? 'Nume Companie' : 'Nume și Prenume'} icon={billing.tip_factura === 'companie' ? <Building/> : <User/>} state={billing} setState={setBilling as any} />
                                 {billing.tip_factura === 'companie' && <FormInput name="cui" label="CUI" icon={<></>} state={billing} setState={setBilling as any} />}
                                 <div className="relative">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Județ Facturare</label>
                                    <select value={billing.judet || ''} onChange={(e) => setJudet(e.target.value, 'billing')} className="block w-full pl-3 pr-10 py-2 bg-gray-800 border border-gray-600 rounded-md">
                                        <option value="">Alege județul</option>
                                        {judete.map(j => <option key={`bil-${j}`} value={j}>{j}</option>)}
                                    </select>
                                </div>
                                <FormInput name="localitate" label="Localitate Facturare" icon={<></>} state={billing} setState={setBilling as any} />
                                <FormInput name="strada_nr" label="Stradă și Număr Facturare" icon={<></>} state={billing} setState={setBilling as any} />
                            </div>
                        )}
                         {sameAsDelivery && billing.tip_factura === 'companie' && (
                             <div className="pt-4 border-t border-gray-800">
                                 <FormInput name="cui" label="CUI" icon={<></>} state={billing} setState={setBilling as any} />
                             </div>
                         )}
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">3. Metodă de Plată</h2>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <button type="button" onClick={() => setPaymentMethod('ramburs')} className={`flex-1 p-4 rounded-lg border text-center ${paymentMethod === 'ramburs' ? 'bg-indigo-600' : 'bg-gray-800'}`}>Plată la livrare (Ramburs)</button>
                        <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 p-4 rounded-lg border text-center ${paymentMethod === 'card' ? 'bg-indigo-600' : 'bg-gray-800'}`}>Plată cu Cardul Online</button>
                    </div>
                </div>

                <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg" disabled={formState === 'loading' || cart.length === 0}>
                    {formState === 'loading' ? 'Se procesează...' : (paymentMethod === 'card' ? 'Continuă spre plată' : 'Plasează Comanda')}
                </button>
                {errorMessage && <p className="text-red-500 mt-4 text-center">{errorMessage}</p>}
            </form>
        </>
    );
}