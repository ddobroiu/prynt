"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import type { Stripe } from '@stripe/stripe-js'; // Importă explicit tipul din pachetul de frontend
import { Address, Billing, CartItem, FormState } from '../../types';
import FormInput from '../../components/FormInput';
import { User, Mail, Phone } from 'lucide-react';

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
}

export default function CheckoutForm({
    address, setAddress, billing, setBilling, cart, paymentMethod, setPaymentMethod, sameAsDelivery, setSameAsDelivery
}: CheckoutFormProps) {
    // Aici era problema: trebuie să specificăm clar că 'stripe' este de tipul 'Stripe' din '@stripe/stripe-js'
    const stripe: Stripe | null = useStripe();
    const [formState, setFormState] = useState<FormState>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (billing.tip_factura === 'persoana_fizica' && sameAsDelivery) {
            setBilling(b => ({ ...b, name: address.nume_prenume, address: `${address.judet}, ${address.localitate}, ${address.strada_nr}` }));
        }
    }, [address, sameAsDelivery, billing.tip_factura, setBilling]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('loading');
        setErrorMessage('');

        const orderData = { address, billing, cart };

        if (paymentMethod === 'card') {
            if (!stripe) {
                setErrorMessage("Stripe nu s-a încărcat. Reîncărcați pagina.");
                setFormState('error');
                return;
            }
            try {
                const response = await fetch('/api/stripe/checkout-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
                const { sessionId } = await response.json();
                if (!sessionId) throw new Error("Nu s-a putut crea sesiunea de plată.");
                
                // Acum, 'stripe.redirectToCheckout' va fi recunoscut corect
                const { error } = await stripe.redirectToCheckout({ sessionId });

                if (error) {
                    setErrorMessage(error.message || "A apărut o eroare la redirecționare.");
                    setFormState('error');
                }
            } catch (error: any) {
                setFormState('error');
                setErrorMessage(error.message);
            }
        }
        // ... logica pentru plata ramburs
        
        if (formState !== 'loading') setFormState('idle');
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-10">
             <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">1. Date Livrare</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                    <FormInput name="nume_prenume" label="Nume și Prenume" icon={<User size={20} />} state={address} setState={setAddress} />
                    <FormInput name="email" label="Adresă de Email" icon={<Mail size={20} />} state={address} setState={setAddress} />
                    <FormInput name="telefon" label="Număr de Telefon" icon={<Phone size={20} />} state={address} setState={setAddress} />
                </div>
            </div>
            
            {/* Restul formularului... */}
            
            <button type="submit" className="w-full bg-green-500 text-white font-bold py-3" disabled={formState === 'loading'}>
                {formState === 'loading' ? 'Se procesează...' : 'Mergi la plată'}
            </button>
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        </form>
    );
}