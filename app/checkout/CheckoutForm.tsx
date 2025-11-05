"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { Address, Billing, CartItem, FormState } from '../../types';
import FormInput from '../../components/FormInput';
import JudetSelector from '../../components/JudetSelector';
import { User, Mail, Phone, MapPin, Building, Hash, Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  address: Address;
  setAddress: Dispatch<SetStateAction<Address>>;
  billing: Billing;
  setBilling: Dispatch<SetStateAction<Billing>>;
  cart: CartItem[];
  paymentMethod: 'ramburs' | 'card';
  setPaymentMethod: Dispatch<SetStateAction<'ramburs' | 'card'>>;
  sameAsDelivery: boolean;
  setSameAsDelivery: Dispatch<SetStateAction<boolean>>;
  judete: string[];
  setJudet: (judet: string, type: 'delivery' | 'billing') => void;
  handleCUI: (cui: string) => void;
}

export default function CheckoutForm({
  address,
  setAddress,
  billing,
  setBilling,
  cart,
  paymentMethod,
  setPaymentMethod,
  sameAsDelivery,
  setSameAsDelivery,
  judete,
  setJudet,
  handleCUI,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [cuiValue, setCuiValue] = useState('');

  // Sincronizează adresa de facturare cu cea de livrare dacă "aceeași"
  useEffect(() => {
    if (sameAsDelivery) {
      setBilling((b) => ({
        ...b,
        name: b.tip_factura === 'companie' ? b.name : address.nume_prenume,
        judet: address.judet,
        localitate: address.localitate,
        strada_nr: address.strada_nr,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          body: JSON.stringify(orderData),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Eroare la crearea comenzii.');
        window.location.href = '/checkout/success'; // Redirect succes ramburs
      } catch (error: any) {
        setFormState('error');
        setErrorMessage(error.message);
      }
      return;
    }

    // Plata cu cardul (Stripe Embedded Checkout)
    if (!stripe || !elements || cart.length === 0) {
      setErrorMessage('Formularul de plată nu este gata. Reîncearcă într-o secundă.');
      setFormState('error');
      return;
    }

    try {
      const res = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const sessionData = await res.json();
      if (!res.ok) throw new Error(sessionData.error || 'A apărut o eroare pe server.');
      const { clientSecret } = sessionData;
      if (!clientSecret) throw new Error('Client secret invalid de la server. Plata nu poate continua.');

      const formElement = document.getElementById('checkout-form');
      const stripeContainer = document.getElementById('stripe-checkout-container');
      if (formElement) formElement.style.display = 'none';
      if (stripeContainer) stripeContainer.style.display = 'block';

      // DIFERENȚA ESENȚIALĂ: montează embedded checkout în container
      const embeddedCheckout = await stripe.initEmbeddedCheckout({ clientSecret });
      embeddedCheckout.mount('#stripe-checkout');
    } catch (error: any) {
      console.error('EROARE LA PROCESUL DE PLATĂ:', error);
      setErrorMessage(error.message || 'O eroare neașteptată a avut loc. Te rugăm să încerci din nou.');
      setFormState('error');

      const formElement = document.getElementById('checkout-form');
      const stripeContainer = document.getElementById('stripe-checkout-container');
      if (formElement) formElement.style.display = 'block';
      if (stripeContainer) stripeContainer.style.display = 'none';
    }
  };

  // Stare UI de încărcare pentru Stripe
  useEffect(() => {
    if (!stripe || !elements) {
      setFormState('loading');
    } else {
      setFormState('idle');
    }
  }, [stripe, elements]);

  return (
    <>
      {/* Container Stripe Embedded */}
      <div id="stripe-checkout-container" style={{ display: 'none' }}>
        <div id="stripe-checkout" />
      </div>

      {/* Formular comanda */}
      <form onSubmit={handleSubmit} id="checkout-form" className="space-y-12">
        {/* Date de livrare */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Date de livrare</h2>
          <FormInput
            id="nume_prenume"
            label="Nume și Prenume"
            value={address.nume_prenume}
            onChange={(e) => setAddress({ ...address, nume_prenume: e.target.value })}
            icon={<User size={18} />}
            required
          />
          <div className="grid md:grid-cols-2 gap-6">
            <FormInput
              id="email"
              type="email"
              label="Adresă de email"
              value={address.email}
              onChange={(e) => setAddress({ ...address, email: e.target.value })}
              icon={<Mail size={18} />}
              required
            />
            <FormInput
              id="telefon"
              label="Număr de telefon"
              value={address.telefon}
              onChange={(e) => setAddress({ ...address, telefon: e.target.value })}
              icon={<Phone size={18} />}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <JudetSelector
              id="judet"
              label="Județ"
              value={address.judet}
              onChange={(val) => setJudet(val, 'delivery')}
              options={judete}
              required
            />
            <FormInput
              id="localitate"
              label="Localitate"
              value={address.localitate}
              onChange={(e) => setAddress({ ...address, localitate: e.target.value })}
              icon={<MapPin size={18} />}
              required
            />
          </div>
          <FormInput
            id="strada_nr"
            label="Stradă și număr"
            value={address.strada_nr}
            onChange={(e) => setAddress({ ...address, strada_nr: e.target.value })}
            icon={<MapPin size={18} />}
            required
          />
        </div>

        {/* Date de facturare */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Date de facturare</h2>
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="persoana_fizica"
              name="tip_factura"
              value="persoana_fizica"
              checked={billing.tip_factura === 'persoana_fizica'}
              onChange={() => setBilling({ ...billing, tip_factura: 'persoana_fizica' })}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <label htmlFor="persoana_fizica">Persoană fizică</label>
            <input
              type="radio"
              id="companie"
              name="tip_factura"
              value="companie"
              checked={billing.tip_factura === 'companie'}
              onChange={() => setBilling({ ...billing, tip_factura: 'companie' })}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <label htmlFor="companie">Companie</label>
          </div>

          {billing.tip_factura === 'companie' && (
            <div className="space-y-6 p-4 border border-gray-700 rounded-lg">
              <FormInput
                id="cui"
                label="CUI/CIF"
                value={cuiValue}
                onChange={(e) => setCuiValue(e.target.value)}
                onBlur={() => handleCUI(cuiValue)}
                icon={<Hash size={18} />}
                required
              />
              <FormInput
                id="company_name"
                label="Nume Companie"
                value={billing.name || ''}
                onChange={(e) => setBilling({ ...billing, name: e.target.value })}
                icon={<Building size={18} />}
                required
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="same_as_delivery"
              checked={sameAsDelivery}
              onChange={(e) => setSameAsDelivery(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
            />
            <label htmlFor="same_as_delivery">Adresa de facturare este aceeași cu adresa de livrare</label>
          </div>

          {!sameAsDelivery && (
            <div className="space-y-6 p-4 border border-gray-700 rounded-lg">
              {billing.tip_factura === 'persoana_fizica' && (
                <FormInput
                  id="billing_name"
                  label="Nume și Prenume"
                  value={billing.name || ''}
                  onChange={(e) => setBilling({ ...billing, name: e.target.value })}
                  icon={<User size={18} />}
                  required
                />
              )}
              <JudetSelector
                id="billing_judet"
                label="Județ"
                value={billing.judet || ''}
                onChange={(val) => setJudet(val, 'billing')}
                options={judete}
                required
              />
              <FormInput
                id="billing_localitate"
                label="Localitate"
                value={billing.localitate || ''}
                onChange={(e) => setBilling({ ...billing, localitate: e.target.value })}
                icon={<MapPin size={18} />}
                required
              />
              <FormInput
                id="billing_strada_nr"
                label="Stradă și număr"
                value={billing.strada_nr || ''}
                onChange={(e) => setBilling({ ...billing, strada_nr: e.target.value })}
                icon={<MapPin size={18} />}
                required
              />
            </div>
          )}
        </div>

        {/* Metoda de plată */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-gray-700 pb-2">Metodă de plată</h2>
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="ramburs"
              name="payment_method"
              value="ramburs"
              checked={paymentMethod === 'ramburs'}
              onChange={() => setPaymentMethod('ramburs')}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <label htmlFor="ramburs">Ramburs la livrare</label>
            <input
              type="radio"
              id="card"
              name="payment_method"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={() => setPaymentMethod('card')}
              className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <label htmlFor="card">Plată cu cardul</label>
          </div>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-center font-bold p-4 bg-red-900/20 rounded-lg">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={formState === 'loading'}
          className="w-full flex justify-center items-center bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-500 disabled:opacity-60"
        >
          {formState === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Se încarcă...
            </>
          ) : (
            'Plasează comanda'
          )}
        </button>
      </form>
    </>
  );
}