"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '../../components/CartProvider';
import { User, Mail, Phone, Home, Building, Loader2, MapPin, CheckSquare, Square, CreditCard, Truck } from 'lucide-react';

// Tipuri de date
interface Address { nume_prenume: string; email: string; telefon: string; judet: string; localitate: string; strada_nr: string; }
interface Billing { tip_factura: 'persoana_fizica' | 'companie'; cui?: string; name?: string; address?: string; }
type PaymentMethod = 'ramburs' | 'card';

// Lista de județe
const judeteRomania = ["Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brașov", "Brăila", "București", "Buzău", "Caraș-Severin", "Călărași", "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Satu Mare", "Sălaj", "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea", "Vrancea"];

// Componenta principală a paginii
export default function CheckoutPage() {
    const cart = useCart();
    if (!cart.isLoaded) return <div className="flex justify-center items-center min-h-screen text-white">Se încarcă...</div>;
    if (cart.count === 0) return <div className="flex flex-col justify-center items-center min-h-screen text-center"><h1 className="text-3xl font-bold text-white mb-4">Coșul este gol</h1><p className="text-gray-400">Nu ai produse în coș.</p></div>;

    return (
        <div className="bg-gray-950 min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-center text-4xl font-extrabold text-white mb-12">Finalizare Comandă</h1>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    <div className="lg:col-span-3"><CheckoutForm /></div>
                    <aside className="lg:col-span-2"><div className="sticky top-8"><OrderSummary /></div></aside>
                </div>
            </div>
        </div>
    );
}

// Componenta pentru sumarul comenzii
function OrderSummary() {
    const { items, total } = useCart();
    const costLivrare = 19.99;
    const totalFinal = total + costLivrare;
    return (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl shadow-indigo-900/20">
            <h2 className="text-2xl font-bold text-white mb-6">Sumar Comandă</h2>
            <div className="space-y-4 mb-6 border-b border-gray-700 pb-6">{items.map(item => <div key={item.id} className="flex justify-between items-start text-gray-300"><div><p className="font-medium text-white">{item.name}</p><p className="text-sm text-gray-400">{item.quantity} x {item.unitAmount.toFixed(2)} RON</p></div><p className="font-semibold text-white shrink-0 ml-4">{item.totalAmount.toFixed(2)} RON</p></div>)}</div>
            <div className="space-y-3">
                <div className="flex justify-between text-gray-300"><span>Subtotal Produse:</span><span className="font-medium text-white">{total.toFixed(2)} RON</span></div>
                <div className="flex justify-between text-gray-300"><span>Cost Livrare (DPD):</span><span className="font-medium text-white">{costLivrare.toFixed(2)} RON</span></div>
                <div className="border-t border-gray-700 my-4"></div>
                <div className="flex justify-between items-center text-2xl font-bold text-white"><span>TOTAL PLATĂ:</span><span>{totalFinal.toFixed(2)} RON</span></div>
            </div>
        </div>
    );
}

// Componenta formularului de checkout
function CheckoutForm() {
    const { items: cart } = useCart();
    const [address, setAddress] = useState<Address>({ nume_prenume: '', email: '', telefon: '', judet: '', localitate: '', strada_nr: '' });
    const [billing, setBilling] = useState<Billing>({ tip_factura: 'persoana_fizica' });
    const [sameAsDelivery, setSameAsDelivery] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ramburs');
    const [formState, setFormState] = useState<'idle' | 'loading' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (billing.tip_factura === 'persoana_fizica' && sameAsDelivery) {
            setBilling(b => ({ ...b, name: address.nume_prenume, address: `${address.judet}, ${address.localitate}, ${address.strada_nr}` }));
        }
    }, [address, sameAsDelivery, billing.tip_factura]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('loading');
        setErrorMessage('');

        let finalBillingPayload: Billing = { tip_factura: billing.tip_factura };
        if (billing.tip_factura === 'companie') finalBillingPayload.cui = billing.cui;
        else { finalBillingPayload.name = address.nume_prenume; finalBillingPayload.address = sameAsDelivery ? `${address.judet}, ${address.localitate}, ${address.strada_nr}` : billing.address; }

        const orderData = { address, billing: finalBillingPayload, cart };

        if (paymentMethod === 'ramburs') {
            try {
                const response = await fetch('/api/order/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'A apărut o eroare.');
                alert(`Comandă plasată cu succes! Factura: ${result.invoiceLink}`);
                window.location.href = '/';
            } catch (error: any) {
                setFormState('error');
                setErrorMessage(error.message);
            }
        } else if (paymentMethod === 'card') {
            try {
                const response = await fetch('/api/stripe/checkout-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
                const { sessionId } = await response.json();
                if (!sessionId) throw new Error("Nu s-a putut crea sesiunea de plată.");
                const stripe = (window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
                await stripe.redirectToCheckout({ sessionId });
            } catch (error: any) {
                setFormState('error');
                setErrorMessage(error.message);
            }
        }
        if (formState !== 'loading') setFormState('idle');
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            {/* --- SECȚIUNEA 1: DATE DE LIVRARE --- */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8"><h2 className="text-2xl font-bold text-white mb-6">1. Date Livrare</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <FormInput name="nume_prenume" label="Nume și Prenume" icon={<User />} state={address} setState={setAddress} />
                <FormInput name="email" label="Adresă de Email" icon={<Mail />} state={address} setState={setAddress} />
                <FormInput name="telefon" label="Număr de Telefon" icon={<Phone />} state={address} setState={setAddress} />
                <div className="relative">
                    <label htmlFor="judet" className="block text-sm font-medium text-gray-300 mb-2">Județ</label>
                    <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><select id="judet" value={address.judet} onChange={e => setAddress(prev => ({...prev, judet: e.target.value}))} required className="w-full bg-gray-800/70 border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"><option value="">-- Selectează un județ --</option>{judeteRomania.map(j => <option key={j} value={j}>{j}</option>)}</select></div>
                </div>
                <FormInput name="localitate" label="Localitate" icon={<MapPin />} state={address} setState={setAddress} />
                <FormInput name="strada_nr" label="Stradă, Număr, Bloc, etc." icon={<Home />} state={address} setState={setAddress} colSpan={2} />
            </div></div>

            {/* --- SECȚIUNEA 2: DATE DE FACTURARE --- */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8"><h2 className="text-2xl font-bold text-white mb-6">2. Date Facturare</h2>
                <div className="flex gap-4 mb-6">{['persoana_fizica', 'companie'].map(tip => <button type="button" key={tip} onClick={() => setBilling({ tip_factura: tip as any })} className={`w-full py-3 rounded-lg transition-colors text-sm font-bold ${billing.tip_factura === tip ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300'}`}>{tip === 'persoana_fizica' ? 'Persoană Fizică' : 'Companie'}</button>)}</div>
                {billing.tip_factura === 'persoana_fizica' && (
                    <div className="space-y-6">
                        <label className="flex items-center gap-3 p-4 rounded-lg bg-gray-800/70 border border-gray-700 cursor-pointer" onClick={() => setSameAsDelivery(!sameAsDelivery)}>
                            {sameAsDelivery ? <CheckSquare className="text-indigo-400" size={24} /> : <Square className="text-gray-500" size={24} />}
                            <span className="font-medium text-white">Adresa de facturare este aceeași cu adresa de livrare</span>
                        </label>
                        {!sameAsDelivery && ( <FormInput name="address" label="Adresă Facturare Diferită" icon={<Home />} state={billing} setState={setBilling} colSpan={2} /> )}
                    </div>
                )}
                {billing.tip_factura === 'companie' && ( <FormInput name="cui" label="CUI Firmă" icon={<Building />} state={billing} setState={setBilling} colSpan={2} /> )}
            </div>

            {/* --- SECȚIUNEA 3: METODA DE PLATĂ --- */}
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8"><h2 className="text-2xl font-bold text-white mb-6">3. Metoda de Plată</h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <PaymentOption icon={<Truck />} title="Plată la livrare (Ramburs)" selected={paymentMethod === 'ramburs'} onClick={() => setPaymentMethod('ramburs')} />
                    <PaymentOption icon={<CreditCard />} title="Plată cu cardul online" selected={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')} />
                </div>
            </div>

            <button type="submit" disabled={formState === 'loading'} className="w-full bg-green-600 text-white font-bold py-4 text-xl rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-[1.02] disabled:bg-gray-500 disabled:cursor-wait flex items-center justify-center">
                {formState === 'loading' ? <><Loader2 className="animate-spin mr-3"/> Se procesează...</> : (paymentMethod === 'card' ? 'Mergi la plată' : 'Plasează Comanda')}
            </button>
            {errorMessage && <p className="text-red-400 text-center mt-4">{errorMessage}</p>}
        </form>
    );
}

// Componenta ajutătoare pentru opțiunile de plată
const PaymentOption = ({ icon, title, selected, onClick }: { icon: React.ReactNode; title: string; selected: boolean; onClick: () => void; }) => (
    <div onClick={onClick} className={`flex-1 p-5 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-4 ${selected ? 'border-indigo-500 bg-indigo-900/30' : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'}`}>
        <div className="text-indigo-400">{icon}</div>
        <span className="font-semibold text-white">{title}</span>
    </div>
);

// Componenta ajutătoare pentru câmpurile de text
const FormInput = ({ name, label, icon, state, setState, colSpan = 1 }: { name: string; label: string; icon: React.ReactNode; state: any; setState: Function; colSpan?: number; }) => (
    <div className={colSpan === 2 ? "md:col-span-2" : ""}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div><input id={name} name={name} type="text" value={state[name] || ''} onChange={(e) => setState((p: any) => ({ ...p, [name]: e.target.value }))} required className="w-full bg-gray-800/70 border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" /></div>
    </div>
);