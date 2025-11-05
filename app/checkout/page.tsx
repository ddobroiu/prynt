"use client";

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { Address, Billing, CartItem } from '../../types';

// Cheia publică Stripe trebuie să fie în variabile de mediu
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
    const [address, setAddress] = useState<Address>({ nume_prenume: '', email: '', telefon: '', judet: '', localitate: '', strada_nr: '' });
    const [billing, setBilling] = useState<Billing>({ tip_factura: 'persoana_fizica' });
    const [sameAsDelivery, setSameAsDelivery] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('ramburs');
    const [cart, setCart] = useState<CartItem[]>([]);
    
    // Simulare încărcare coș de cumpărături din localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    const subtotal = cart.reduce((acc, item) => acc + item.totalAmount, 0);
    const costLivrare = 19.99;
    const totalPlata = subtotal + costLivrare;

    return (
        <div className="container mx-auto px-4 py-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                     <Elements stripe={stripePromise}>
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
                        />
                    </Elements>
                </div>
                <div className="lg:col-span-1 bg-gray-900 border border-gray-700 rounded-2xl p-8 h-fit">
                    <h2 className="text-2xl font-bold text-white mb-6">Sumar Comandă</h2>
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center">
                                <span>{item.name} x {item.quantity}</span>
                                <span>{item.totalAmount.toFixed(2)} RON</span>
                            </div>
                        ))}
                        <hr className="border-gray-700" />
                        <div className="flex justify-between">
                            <span>Subtotal Produse:</span>
                            <span>{subtotal.toFixed(2)} RON</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Cost Livrare (DPD):</span>
                            <span>{costLivrare.toFixed(2)} RON</span>
                        </div>
                        <hr className="border-gray-700" />
                        <div className="flex justify-between font-bold text-xl">
                            <span>TOTAL PLATĂ:</span>
                            <span>{totalPlata.toFixed(2)} RON</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}