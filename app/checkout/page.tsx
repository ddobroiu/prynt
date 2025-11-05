"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '../../components/CartProvider';
import { User, Mail, Phone, Home, Building, FileText, Loader2, MapPin, CheckSquare, Square } from 'lucide-react';

// Tipuri de date
interface Address { nume_prenume: string; email: string; telefon: string; judet: string; localitate: string; dpdSiteId?: number; strada_nr: string; }
interface Billing { tip_factura: 'persoana_fizica' | 'companie'; cui?: string; name?: string; address?: string; }

const judeteRomania = ["Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brașov", "Brăila", "București", "Buzău", "Caraș-Severin", "Călărași", "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Satu Mare", "Sălaj", "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea", "Vrancea"];

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

function OrderSummary() {
    const { items, total } = useCart();
    const costLivrare = 19.99;
    const totalFinal = total + costLivrare;
    return (
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 shadow-2xl shadow-indigo-900/20">
            <h2 className="text-2xl font-bold text-white mb-6">Sumar Comandă</h2>
            <div className="space-y-4 mb-6 border-b border-gray-700 pb-6">{items.map(item => <div key={item.id} className="flex justify-between items-start text-gray-300"><div><p className="font-medium text-white">{item.name}</p><p className="text-sm text-gray-400">{item.quantity} x {item.unitAmount.toFixed(2)} RON</p></div><p className="font-semibold text-white shrink-0 ml-4">{item.totalAmount.toFixed(2)} RON</p></div>)}</div>
            <div className="space-y-3"><div className="flex justify-between text-gray-300"><span>Subtotal Produse:</span><span className="font-medium text-white">{total.toFixed(2)} RON</span></div><div className="flex justify-between text-gray-300"><span>Cost Livrare (DPD):</span><span className="font-medium text-white">{costLivrare.toFixed(2)} RON</span></div><div className="border-t border-gray-700 my-4"></div><div className="flex justify-between items-center text-2xl font-bold text-white"><span>TOTAL PLATĂ:</span><span>{totalFinal.toFixed(2)} RON</span></div></div>
        </div>
    );
}

function CheckoutForm() {
    const { items: cart } = useCart();
    const [address, setAddress] = useState<Address>({ nume_prenume: '', email: '', telefon: '', judet: '', localitate: '', strada_nr: '' });
    const [billing, setBilling] = useState<Billing>({ tip_factura: 'persoana_fizica' });
    const [sameAsDelivery, setSameAsDelivery] = useState(true);
    const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    
    const [localitati, setLocalitati] = useState<{ id: number, name: string }[]>([]);
    const [isLoadingLocalitati, setIsLoadingLocalitati] = useState(false);

    const handleJudetChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const judetSelectat = e.target.value;
        setAddress(prev => ({ ...prev, judet: judetSelectat, localitate: '', dpdSiteId: undefined }));
        if (!judetSelectat) {
            setLocalitati([]);
            return;
        }
        setIsLoadingLocalitati(true);
        try {
            const response = await fetch(`/api/dpd/localitati?judet=${judetSelectat}`);
            if (response.ok) setLocalitati(await response.json());
        } finally {
            setIsLoadingLocalitati(false);
        }
    };

    const handleLocalitateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const siteId = parseInt(e.target.value);
        const localitateSelectata = localitati.find(l => l.id === siteId);
        if (localitateSelectata) {
            setAddress(prev => ({ ...prev, localitate: localitateSelectata.name, dpdSiteId: localitateSelectata.id }));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address.dpdSiteId) { alert("Vă rugăm să selectați județul și localitatea."); return; }
        setFormState('loading');
        // Logica de submit rămâne aceeași
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8"><h2 className="text-2xl font-bold text-white mb-6">1. Date Livrare</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <FormInput name="nume_prenume" label="Nume și Prenume" icon={<User />} state={address} setState={setAddress} />
                <FormInput name="email" label="Adresă de Email" icon={<Mail />} state={address} setState={setAddress} />
                <FormInput name="telefon" label="Număr de Telefon" icon={<Phone />} state={address} setState={setAddress} />
                
                <div className="relative">
                    <label htmlFor="judet" className="block text-sm font-medium text-gray-300 mb-2">Județ</label>
                    <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><select id="judet" value={address.judet} onChange={handleJudetChange} required className="w-full bg-gray-800/70 border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"><option value="">-- Selectează un județ --</option>{judeteRomania.map(j => <option key={j} value={j}>{j}</option>)}</select></div>
                </div>
                <div className="relative">
                    <label htmlFor="localitate" className="block text-sm font-medium text-gray-300 mb-2">Localitate</label>
                    <div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />{isLoadingLocalitati && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />}<select id="localitate" value={address.dpdSiteId || ''} onChange={handleLocalitateChange} required disabled={!address.judet || isLoadingLocalitati} className="w-full bg-gray-800/70 border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-800 disabled:cursor-not-allowed"><option value="">-- Alege localitatea --</option>{localitati.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
                </div>
                
                <FormInput name="strada_nr" label="Stradă, Număr, Bloc, etc." icon={<Home />} state={address} setState={setAddress} colSpan={2} />
            </div></div>
            {/* Restul formularului pentru facturare rămâne la fel */}
        </form>
    );
}

const FormInput = ({ name, label, icon, state, setState, colSpan = 1 }: { name: string; label: string; icon: React.ReactNode; state: any; setState: Function; colSpan?: number; }) => (
    <div className={colSpan === 2 ? "md:col-span-2" : ""}>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <div className="relative"><div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div><input id={name} name={name} type="text" value={state[name] || ''} onChange={(e) => setState((p: any) => ({ ...p, [name]: e.target.value }))} required className="w-full bg-gray-800/70 border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" /></div>
    </div>
);