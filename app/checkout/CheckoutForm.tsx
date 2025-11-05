"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { Address, Billing, CartItem, FormState } from '../../types';
import FormInput from '../../components/FormInput'; // Asigură-te că acest component există și este corect
import JudetSelector from '../../components/JudetSelector'; // Asigură-te că acest component există
import { User, Mail, Phone, MapPin, Building, Hash } from 'lucide-react';

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
                // Afișează container-ul Stripe și ascunde formularul
                const formElement = e.target as HTMLFormElement;
                const stripeContainer = document.getElementById('stripe-checkout-container');
                if (formElement) formElement.style.display = 'none';
                if (stripeContainer) stripeContainer.style.display = 'block';

                const res = await fetch('/api/stripe/checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData), // Trimitem toate datele
                });
                const { clientSecret, error } = await res.json();
                if (error) throw new Error(error);
                if (!clientSecret) throw new Error("Client secret invalid de la server.");
                
                await stripe.initEmbeddedCheckout({ clientSecret });

            } catch (error: any) {
                setErrorMessage(error.message || 'Eroare la inițierea plății.');
                setFormState('error');
                 // Ascunde container-ul Stripe și afișează din nou formularul în caz de eroare
                const formElement = e.target as HTMLFormElement;
                const stripeContainer = document.getElementById('stripe-checkout-container');
                if (formElement) formElement.style.display = 'block';
                if (stripeContainer) stripeContainer.style.display = 'none';
            }
        }
    };

    return (
        <>
            {/* 1. Containerul pentru Stripe, inițial ascuns */}
            <div id="stripe-checkout-container" style={{ display: 'none' }}>
                <div id="stripe-checkout"></div>
            </div>

            {/* 2. Formularul tău, complet */}
            <form onSubmit={handleSubmit} className="space-y-12">
                {/* --- Date de livrare --- */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Date de livrare</h2>
                    <FormInput id="nume_prenume" label="Nume și Prenume" value={address.nume_prenume} onChange={e => setAddress({...address, nume_prenume: e.target.value})} icon={<User size={18} />} required />
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormInput id="email" type="email" label="Adresă de email" value={address.email} onChange={e => setAddress({...address, email: e.target.value})} icon={<Mail size={18} />} required />
                        <FormInput id="telefon" label="Număr de telefon" value={address.telefon} onChange={e => setAddress({...address, telefon: e.target.value})} icon={<Phone size={18} />} required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                         <JudetSelector id="judet" label="Județ" value={address.judet} onChange={val => setJudet(val, 'delivery')} options={judete} required />
                        <FormInput id="localitate" label="Localitate" value={address.localitate} onChange={e => setAddress({...address, localitate: e.target.value})} icon={<MapPin size={18} />} required />
                    </div>
                    <FormInput id="strada_nr" label="Stradă și număr" value={address.strada_nr} onChange={e => setAddress({...address, strada_nr: e.target.value})} icon={<MapPin size={18} />} required />
                </div>

                {/* --- Date de facturare --- */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Date de facturare</h2>
                    <div className="flex items-center space-x-4">
                        <input type="radio" id="persoana_fizica" name="tip_factura" value="persoana_fizica" checked={billing.tip_factura === 'persoana_fizica'} onChange={() => setBilling({ ...billing, tip_factura: 'persoana_fizica' })} />
                        <label htmlFor="persoana_fizica">Persoană fizică</label>
                        <input type="radio" id="companie" name="tip_factura" value="companie" checked={billing.tip_factura === 'companie'} onChange={() => setBilling({ ...billing, tip_factura: 'companie' })} />
                        <label htmlFor="companie">Companie</label>
                    </div>

                    {billing.tip_factura === 'companie' && (
                        <div className="space-y-6 p-4 border border-gray-700 rounded-lg">
                           <FormInput id="cui" label="CUI/CIF" value={cuiValue} onChange={e => setCuiValue(e.target.value)} onBlur={() => handleCUI(cuiValue)} icon={<Hash size={18} />} required />
                           <FormInput id="company_name" label="Nume Companie" value={billing.name || ''} onChange={e => setBilling({...billing, name: e.target.value})} icon={<Building size={18} />} required />
                        </div>
                    )}

                    <div className="flex items-center">
                        <input type="checkbox" id="same_as_delivery" checked={sameAsDelivery} onChange={e => setSameAsDelivery(e.target.checked)} className="mr-2" />
                        <label htmlFor="same_as_delivery">Adresa de facturare este aceeași cu adresa de livrare</label>
                    </div>

                    {!sameAsDelivery && (
                         <div className="space-y-6 p-4 border border-gray-700 rounded-lg">
                            {billing.tip_factura === 'persoana_fizica' && <FormInput id="billing_name" label="Nume și Prenume" value={billing.name || ''} onChange={e => setBilling({...billing, name: e.target.value})} icon={<User size={18} />} required />}
                             <JudetSelector id="billing_judet" label="Județ" value={billing.judet || ''} onChange={val => setJudet(val, 'billing')} options={judete} required />
                             <FormInput id="billing_localitate" label="Localitate" value={billing.localitate || ''} onChange={e => setBilling({...billing, localitate: e.target.value})} icon={<MapPin size={18} />} required />
                             <FormInput id="billing_strada_nr" label="Stradă și număr" value={billing.strada_nr || ''} onChange={e => setBilling({...billing, strada_nr: e.target.value})} icon={<MapPin size={18} />} required />
                         </div>
                    )}
                </div>

                {/* --- Metoda de plată --- */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Metodă de plată</h2>
                     <div className="flex items-center space-x-4">
                        <input type="radio" id="ramburs" name="payment_method" value="ramburs" checked={paymentMethod === 'ramburs'} onChange={() => setPaymentMethod('ramburs')} />
                        <label htmlFor="ramburs">Ramburs la livrare</label>
                        <input type="radio" id="card" name="payment_method" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                        <label htmlFor="card">Plată cu cardul</label>
                    </div>
                </div>

                {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
                
                <button type="submit" disabled={formState === 'loading' || cart.length === 0} className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed">
                    {formState === 'loading' ? 'Se procesează...' : `Plasează comanda`}
                </button>
            </form>
        </>
    );
}