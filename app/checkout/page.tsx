'use client';
import React, { useState, useMemo } from 'react';

// Importuri de iconițe (simulăm lucide-react, folosim doar SVG-uri simple)
const User = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const ShoppingCart = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zM14 17a2 2 0 100 4 2 2 0 000-4z" /></svg>;
const CreditCard = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const MapPin = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243m10.606 0a4 4 0 11-5.656 0 4 4 0 015.656 0z" /></svg>;


// ====================================================================
// SECȚIUNEA 1: TIPURI DE DATE ȘI UTILITIES
// ====================================================================

/** Rotunjeste la doua zecimale pentru moneda. */
const roundMoney = (n: number): number => Math.round(n * 100) / 100;
/** Formatează suma în RON cu spațiu pentru mii. */
const money = (n: number): string => n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

type CartItem = {
  id: string;
  name: string;
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

type Totals = {
  subtotal: number;
  vat: number;
  shippingCost: number;
  total: number;
  currency: string;
};

// Datele mock ale coșului (De înlocuit cu logica reală de preluare a coșului)
const MOCK_CART_ITEMS: CartItem[] = [
    { id: 'b1', name: 'Banner Frontlit 440g', description: '(300x100cm, Tiv+Capse)', sku: 'B440-300x100', quantity: 1, unitPrice: 75.00 },
    { id: 'b2', name: 'Banner Frontlit 510g', description: '(200x50cm, Gauri Vant)', sku: 'B510-200x50', quantity: 2, unitPrice: 150.00 },
    { id: 'f1', name: 'Flayer A5', description: '(Hartie 150g, Mat, 1000 buc)', sku: 'FLA5-150', quantity: 1, unitPrice: 120.00 },
];

const SHIPPING_COST = 24.00;
const VAT_RATE = 0.19;

/** Calculează totalurile pe baza articolelor din coș. */
function calcTotals(items: CartItem[]): Totals {
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const vat = subtotal * VAT_RATE;
  const shippingCost = SHIPPING_COST; // Cost fix
  const total = subtotal + vat + shippingCost;

  return {
    subtotal: roundMoney(subtotal),
    vat: roundMoney(vat),
    shippingCost: roundMoney(shippingCost),
    total: roundMoney(total),
    currency: 'RON',
  };
}

// ====================================================================
// SECȚIUNEA 2: COMPONENTE DE UI AJUTĂTOARE (STYLING)
// ====================================================================

/** Card cu umbre subtile */
function Card({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon?: React.ElementType }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-lg transition duration-300 hover:shadow-xl">
      <div className="border-b border-neutral-100 px-5 py-4 flex items-center">
        {Icon && <Icon className="w-6 h-6 mr-3 text-indigo-600" />}
        <h2 className="text-xl font-semibold tracking-tight text-neutral-800">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/** Eticheta de formular cu mesaje de eroare */
function Field({ label, children, error }: { label: string; children: React.ReactNode; error?: string | null }) {
  return (
    <label className="block space-y-1">
      <span className="block text-sm font-medium text-neutral-700">{label}</span>
      {children}
      {error && <p className="text-sm text-red-600 font-medium mt-1">{error}</p>}
    </label>
  );
}

/** Input text stilizat */
function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-neutral-300 bg-white p-3 text-neutral-800 transition-shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-neutral-100 disabled:text-neutral-500 placeholder:text-neutral-400"
    />
  );
}

/** Textarea stilizată */
function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className="w-full rounded-lg border border-neutral-300 bg-white p-3 text-neutral-800 transition-shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-neutral-100 disabled:text-neutral-500 placeholder:text-neutral-400"
        />
    );
}

// ====================================================================
// SECȚIUNEA 3: CHECKOUT FORM - Logica de Tranzacție/Formular
// ====================================================================

type FormData = {
  nume: string;
  email: string;
  telefon: string;
  tara: string;
  judet: string;
  oras: string;
  adresa: string;
  codPostal: string;
  metodaPlata: 'CARD' | 'OP' | 'RAMBURS';
  note: string;
};

const initialFormData: FormData = {
  nume: '',
  email: '',
  telefon: '',
  tara: 'România',
  judet: '',
  oras: '',
  adresa: '',
  codPostal: '',
  metodaPlata: 'CARD',
  note: '',
};

const validateForm = (data: FormData) => {
    const errors: Partial<Record<keyof FormData, string>> = {};

    // Regex pentru validare email simplă
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Regex pentru validare telefon (minim 8 cifre, opțional + la început)
    const phoneRegex = /^\+?\d{8,15}$/;

    if (!data.nume.trim()) errors.nume = 'Numele complet este obligatoriu.';
    if (!data.email.match(emailRegex)) errors.email = 'Adresă de email invalidă.';
    if (!data.telefon.match(phoneRegex)) errors.telefon = 'Număr de telefon invalid.';
    if (!data.judet.trim()) errors.judet = 'Județul este obligatoriu.';
    if (!data.oras.trim()) errors.oras = 'Orașul este obligatoriu.';
    if (!data.adresa.trim()) errors.adresa = 'Adresa completă este obligatorie.';

    return errors;
};

function CheckoutForm({ initialCart, initialTotals }: { initialCart: CartItem[], initialTotals: Totals }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error on change for the specific field
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({ ...prev, [name as keyof FormData]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('IDLE');
    const errors = validateForm(formData);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to the first error field
      const firstErrorField = document.querySelector(`[name="${Object.keys(errors)[0]}"]`);
      if(firstErrorField) firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});
    
    // === SIMULAREA PROCESULUI DE COMANDĂ ȘI PLATĂ ===
    console.log('Plasare comandă cu datele:', formData, 'și coșul:', initialCart);
    
    setTimeout(() => {
        // Simulăm succesul
        setIsSubmitting(false);
        setSubmissionStatus('SUCCESS');
        
        // Resetarea formularului
        setFormData(initialFormData);

        // Aici ar urma integrarea cu un procesator de plată
    }, 2000);
  };

  const totals = initialTotals;

  if (submissionStatus === 'SUCCESS') {
    return (
        <main className="max-w-xl mx-auto p-8 bg-white rounded-2xl shadow-2xl mt-10 text-center border-t-4 border-emerald-500">
            <svg className="w-16 h-16 text-emerald-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h1 className="text-3xl font-bold mb-3 text-neutral-800">Comandă Plăcută! 🎉</h1>
            <p className="text-neutral-600">
                Comanda dumneavoastră a fost înregistrată cu succes sub numărul de referință **#123456**. Veți primi un email de confirmare în scurt timp.
            </p>
            <a
              href="#"
              className="inline-block mt-6 rounded-xl border border-indigo-500 bg-indigo-500 text-white px-6 py-3 hover:bg-indigo-600 transition font-semibold"
            >
              Continuă cumpărăturile
            </a>
        </main>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Col 1 & 2: Formularul de Date */}
      <div className="lg:col-span-2 space-y-6">
        <Card title="Date de Contact și Livrare" icon={User}>
            <div className="space-y-4">
                <Field label="Nume și Prenume (sau Denumire Companie)" error={formErrors.nume}>
                    <TextInput 
                        type="text" 
                        name="nume" 
                        value={formData.nume} 
                        onChange={handleChange} 
                        placeholder="Ex: Ionescu Andrei sau S.C. PrintX S.R.L."
                        disabled={isSubmitting}
                    />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Email" error={formErrors.email}>
                        <TextInput 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            placeholder="exemplu@domeniu.ro"
                            disabled={isSubmitting}
                        />
                    </Field>
                    <Field label="Telefon" error={formErrors.telefon}>
                        <TextInput 
                            type="tel" 
                            name="telefon" 
                            value={formData.telefon} 
                            onChange={handleChange} 
                            placeholder="Ex: 074X XXX XXX"
                            disabled={isSubmitting}
                        />
                    </Field>
                </div>
                {/* Adresa */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Țară" error={formErrors.tara}>
                        <TextInput 
                            type="text" 
                            name="tara" 
                            value={formData.tara} 
                            onChange={handleChange} 
                            disabled 
                        />
                    </Field>
                    <Field label="Județ" error={formErrors.judet}>
                        <TextInput 
                            type="text" 
                            name="judet" 
                            value={formData.judet} 
                            onChange={handleChange} 
                            placeholder="Ex: Cluj"
                            disabled={isSubmitting}
                        />
                    </Field>
                    <Field label="Oraș" error={formErrors.oras}>
                        <TextInput 
                            type="text" 
                            name="oras" 
                            value={formData.oras} 
                            onChange={handleChange} 
                            placeholder="Ex: București"
                            disabled={isSubmitting}
                        />
                    </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Field label="Adresă Completă (Strada, Nr., Bloc, Ap.)" error={formErrors.adresa}>
                        <TextInput 
                            type="text" 
                            name="adresa" 
                            value={formData.adresa} 
                            onChange={handleChange} 
                            placeholder="Ex: Str. Libertății, Nr. 10, Bl. C3, Ap. 5"
                            disabled={isSubmitting}
                        />
                    </Field>
                    <div className="md:col-span-2">
                        <Field label="Cod Poștal (Opțional)">
                            <TextInput 
                                type="text" 
                                name="codPostal" 
                                value={formData.codPostal} 
                                onChange={handleChange} 
                                disabled={isSubmitting}
                            placeholder="Ex: 400000"
                            />
                        </Field>
                    </div>
                </div>
            </div>
        </Card>

        <Card title="Metodă de Plată" icon={CreditCard}>
            <div className="space-y-3">
                {/* CARD */}
                <label className={`flex items-start rounded-xl border p-4 shadow-sm cursor-pointer transition 
                    ${formData.metodaPlata === 'CARD' ? 'border-indigo-500 bg-indigo-50 shadow-indigo-100' : 'border-neutral-300 bg-white hover:border-indigo-400'}`}>
                    <input
                        type="radio"
                        name="metodaPlata"
                        value="CARD"
                        checked={formData.metodaPlata === 'CARD'}
                        onChange={handleChange}
                        className="mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-neutral-300 flex-shrink-0"
                        disabled={isSubmitting}
                    />
                    <div className="ml-3 text-sm">
                        <span className="font-medium text-neutral-900 block">Plată cu cardul (Online)</span>
                        <p className="text-neutral-500">
                            Cea mai rapidă metodă. Procesare securizată.
                        </p>
                    </div>
                </label>

                {/* OP */}
                <label className={`flex items-start rounded-xl border p-4 shadow-sm cursor-pointer transition 
                    ${formData.metodaPlata === 'OP' ? 'border-indigo-500 bg-indigo-50 shadow-indigo-100' : 'border-neutral-300 bg-white hover:border-indigo-400'}`}>
                    <input
                        type="radio"
                        name="metodaPlata"
                        value="OP"
                        checked={formData.metodaPlata === 'OP'}
                        onChange={handleChange}
                        className="mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-neutral-300 flex-shrink-0"
                        disabled={isSubmitting}
                    />
                    <div className="ml-3 text-sm">
                        <span className="font-medium text-neutral-900 block">Ordin de Plată (Transfer bancar)</span>
                        <p className="text-neutral-500">
                            Veți primi factura proformă. Comanda se procesează după confirmarea plății.
                        </p>
                    </div>
                </label>
                
                {/* RAMBURS */}
                <label className={`flex items-start rounded-xl border p-4 shadow-sm cursor-pointer transition 
                    ${formData.metodaPlata === 'RAMBURS' ? 'border-indigo-500 bg-indigo-50 shadow-indigo-100' : 'border-neutral-300 bg-white hover:border-indigo-400'}`}>
                    <input
                        type="radio"
                        name="metodaPlata"
                        value="RAMBURS"
                        checked={formData.metodaPlata === 'RAMBURS'}
                        onChange={handleChange}
                        className="mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-neutral-300 flex-shrink-0"
                        disabled={isSubmitting}
                    />
                    <div className="ml-3 text-sm">
                        <span className="font-medium text-neutral-900 block">Plată la livrare (Ramburs)</span>
                        <p className="text-neutral-500">
                            Plătiți curierului în momentul livrării (se pot aplica taxe suplimentare de curier).
                        </p>
                    </div>
                </label>
            </div>
        </Card>

        <Card title="Note Comandă (Opțional)" icon={MapPin}>
            <TextArea
                name="note"
                rows={3}
                value={formData.note}
                onChange={handleChange}
                placeholder="Detalii suplimentare pentru curier sau comandă..."
                disabled={isSubmitting}
            />
        </Card>
      </div>

      {/* Col 3: Rezumat Comandă și Plată */}
      <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8 self-start">
        
        {/* Rezumat Produse */}
        <Card title={`Coșul tău (${initialCart.length} articole)`} icon={ShoppingCart}>
          <div className="space-y-4">
            {initialCart.map((it) => (
              <div key={it.id} className="flex justify-between items-start pb-2 border-b border-neutral-100 last:border-b-0 last:pb-0">
                <div className="flex-1 min-w-0 pr-3">
                  <div className="text-sm font-medium text-neutral-800">{it.name}</div>
                  <div className="text-xs text-neutral-500 truncate">{it.description}</div>
                  <div className="text-xs text-neutral-500 mt-1">
                        Cant: <span className="font-semibold">{it.quantity}</span> x {money(it.unitPrice)} RON
                    </div>
                </div>
                <div className="text-sm font-bold text-neutral-900 whitespace-nowrap">
                  {money(it.unitPrice * it.quantity)} {totals.currency}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Totaluri */}
        <Card title="Sumar Plată">
          <div className="space-y-2 text-base text-neutral-700">
            <div className="flex justify-between"><span>Total produse (fără TVA)</span><span className="font-semibold">{money(totals.subtotal)} {totals.currency}</span></div>
            <div className="flex justify-between"><span>TVA (19%)</span><span className="font-semibold">{money(totals.vat)} {totals.currency}</span></div>
            <div className="flex justify-between items-center">
                <span>Transport (DPD Standard)</span>
                <span className="font-semibold text-green-600">
                    {totals.shippingCost > 0 ? `${money(totals.shippingCost)} ${totals.currency}` : 'GRATUIT'}
                </span>
            </div>
            <div className="h-px bg-neutral-200 my-4" />
            <div className="flex justify-between text-2xl font-extrabold text-neutral-900">
                <span>Total de plată</span>
                <span className="text-indigo-600">{money(totals.total)} {totals.currency}</span>
            </div>
          </div>
        </Card>
        
        {/* Butonul de finalizare */}
        <button
          type="submit"
          className="w-full flex items-center justify-center rounded-xl bg-indigo-600 text-white px-6 py-4 text-xl font-bold hover:bg-indigo-700 transition duration-150 shadow-xl shadow-indigo-300/50 disabled:bg-indigo-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
                {/* SVG pentru loading spinner */}
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Se Procesează...
            </>
          ) : (
            `Plasează Comanda Acum`
          )}
        </button>
      </div>
    </form>
  );
}

// ====================================================================
// SECȚIUNEA 4: PAGINA PRINCIPALĂ (APP)
// ====================================================================

export default function CheckoutPage() {
    // !! ATENȚIE: MOCK_CART_ITEMS trebuie înlocuit cu logica reală a coșului
    const items: CartItem[] = MOCK_CART_ITEMS;
    const totals: Totals = useMemo(() => calcTotals(items), [items]);

    // UI pentru coșul gol (dacă ar fi gol)
    if (items.length === 0) {
      return (
        <main className="max-w-5xl mx-auto p-6 min-h-screen flex items-center justify-center bg-gray-50">
          <div className="rounded-2xl border border-neutral-300 bg-white p-12 text-center shadow-xl">
            <h1 className="text-3xl font-bold mb-3 text-neutral-800">Coșul este gol!</h1>
            <p className="text-neutral-600">Pentru a plasa o comandă, adăugați produse în coș.</p>
            <a
              href="#" // Link placeholder
              className="inline-block mt-6 rounded-xl border border-indigo-500 bg-indigo-500 text-white px-6 py-3 hover:bg-indigo-600 transition font-semibold"
            >
              Înapoi la magazin
            </a>
          </div>
        </main>
      );
    }

    // UI pentru coșul plin (afisarea formularului)
    return (
      <main className="min-h-screen bg-gray-50 py-10 font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold mb-8 text-neutral-800 tracking-tight">Finalizare Comandă</h1>
            <CheckoutForm
                initialCart={items}
                initialTotals={totals}
            />
        </div>
      </main>
    );
  }
