"use client";
import React, { useState, useRef } from 'react';
import { useCart } from '../../components/CartProvider';
import { 
  ArrowLeft, Trash2, Loader2, CheckCircle, Copy, Package,
  User, Building2, MapPin, FileText, Truck
} from 'lucide-react';

const money = (num: number) => `${num.toFixed(2)} RON`;

interface OrderResponse {
  success: boolean;
  orderId: string;
  awb?: string;
  invoiceNumber?: string;
  message: string;
}

interface FormData {
  // EXPEDITOR (Prynt.ro)
  expeditor_nume: string;
  expeditor_telefon: string;
  expeditor_email: string;
  expeditor_adresa: string;
  expeditor_oras: string;
  expeditor_judet: string;

  // LIVRARE
  nume_livrare: string;
  telefon: string;
  email: string;
  adresa_livrare: string;
  oras_livrare: string;
  judet_livrare: string;

  // FACTURARE
  tip_factura: 'persoana_fizica' | 'persoana_juridica';
  cui: string;
  nume_companie: string;

  adresa_facturare: string;
  oras_facturare: string;
  judet_facturare: string;

  // OPȚIUNI
  adresa_facturare_identica: boolean;
  mentiuni: string;
}

export default function CheckoutPage() {
  const { items, total, count, removeItem, clear } = useCart();
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<FormData>({
    // EXPEDITOR
    expeditor_nume: '',
    expeditor_telefon: '',
    expeditor_email: '',
    expeditor_adresa: '',
    expeditor_oras: '',
    expeditor_judet: '',

    // LIVRARE
    nume_livrare: '',
    telefon: '',
    email: '',
    adresa_livrare: '',
    oras_livrare: '',
    judet_livrare: '',

    // FACTURARE
    tip_factura: 'persoana_fizica',
    cui: '',
    nume_companie: '',
    adresa_facturare: '',
    oras_facturare: '',
    judet_facturare: '',

    adresa_facturare_identica: true,
    mentiuni: '',
  });

  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [orderData, setOrderData] = useState<OrderResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!items.length) {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center text-white">
        <h1 className="text-3xl font-bold text-indigo-400 mb-4">Coșul tău este gol!</h1>
        <p className="text-lg mb-6 text-white/70">Începe prin a configura un produs.</p>
        <a href="/banner" className="inline-flex items-center px-6 py-3 bg-indigo-600 rounded-full text-white font-semibold hover:bg-indigo-500 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          Configurează un Banner
        </a>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'adresa_facturare_identica' && checked) {
      setFormData(prev => ({
        ...prev,
        adresa_facturare: prev.adresa_livrare,
        oras_facturare: prev.oras_livrare,
        judet_facturare: prev.judet_livrare,
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const newErrors: Record<string, string> = {};

    // VALIDARE EXPEDITOR
    if (!formData.expeditor_nume.trim()) newErrors.expeditor_nume = 'Obligatoriu';
    if (!formData.expeditor_telefon.trim()) newErrors.expeditor_telefon = 'Obligatoriu';
    else if (!/^(\+40|0)?[0-9]{9,10}$/.test(formData.expeditor_telefon.replace(/\s/g, ''))) {
      newErrors.expeditor_telefon = 'Telefon invalid';
    }
    if (!formData.expeditor_email.trim()) newErrors.expeditor_email = 'Obligatoriu';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.expeditor_email)) {
      newErrors.expeditor_email = 'Email invalid';
    }
    if (!formData.expeditor_adresa.trim()) newErrors.expeditor_adresa = 'Obligatoriu';
    if (!formData.expeditor_oras.trim()) newErrors.expeditor_oras = 'Obligatoriu';
    if (!formData.expeditor_judet.trim()) newErrors.expeditor_judet = 'Obligatoriu';

    // VALIDARE LIVRARE
    if (!formData.nume_livrare.trim()) newErrors.nume_livrare = 'Obligatoriu';
    if (!formData.telefon.trim()) newErrors.telefon = 'Obligatoriu';
    else if (!/^(\+40|0)?[0-9]{9,10}$/.test(formData.telefon.replace(/\s/g, ''))) {
      newErrors.telefon = 'Telefon invalid';
    }
    if (!formData.email.trim()) newErrors.email = 'Obligatoriu';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalid';
    }
    if (!formData.adresa_livrare.trim()) newErrors.adresa_livrare = 'Obligatoriu';
    if (!formData.oras_livrare.trim()) newErrors.oras_livrare = 'Obligatoriu';
    if (!formData.judet_livrare.trim()) newErrors.judet_livrare = 'Obligatoriu';

    // VALIDARE FACTURARE
    if (formData.tip_factura === 'persoana_fizica') {
      // PF: NU CERE CNP
    } else {
      if (!formData.cui.trim()) {
        newErrors.cui = 'CUI obligatoriu';
      } else {
        const cui = formData.cui.replace(/\s/g, '').toUpperCase();
        if (!/^RO\d{2,10}$/.test(cui)) {
          newErrors.cui = 'CUI invalid (ex: RO12345678)';
        }
      }
      if (!formData.nume_companie.trim()) {
        newErrors.nume_companie = 'Denumire companie obligatorie';
      }
    }

    if (!formData.adresa_facturare.trim()) newErrors.adresa_facturare = 'Obligatoriu';
    if (!formData.oras_facturare.trim()) newErrors.oras_facturare = 'Obligatoriu';
    if (!formData.judet_facturare.trim()) newErrors.judet_facturare = 'Obligatoriu';

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm();

    if (!validation.isValid) {
      setErrors(validation.errors);

      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      const errorMessages = Object.entries(validation.errors)
        .map(([field, msg]) => `❌ ${field}: ${msg}`)
        .join('\n');
      alert(`Erori în formularul:\n\n${errorMessages}`);
      return;
    }

    setErrors({});
    setLoading(true);
    setOrderStatus('idle');

    const orderPayload = {
      // EXPEDITOR
      expeditor_nume: formData.expeditor_nume,
      expeditor_telefon: formData.expeditor_telefon,
      expeditor_email: formData.expeditor_email,
      expeditor_adresa: formData.expeditor_adresa,
      expeditor_oras: formData.expeditor_oras,
      expeditor_judet: formData.expeditor_judet,

      // LIVRARE
      nume_livrare: formData.nume_livrare,
      telefon: formData.telefon,
      email: formData.email,
      adresa_livrare: formData.adresa_livrare,
      oras_livrare: formData.oras_livrare,
      judet_livrare: formData.judet_livrare,

      // FACTURARE
      tip_factura: formData.tip_factura,
      cui: formData.cui,
      nume_companie: formData.nume_companie,
      adresa_facturare: formData.adresa_facturare,
      oras_facturare: formData.oras_facturare,
      judet_facturare: formData.judet_facturare,

      // PRODUSE
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unitAmount: item.unitAmount,
        totalAmount: item.totalAmount,
      })),

      cartTotal: total,
      paymentMethod: 'Plata la Livrare (Ramburs)',
      mentiuni: formData.mentiuni,
    };

    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data: OrderResponse = await response.json();

      if (response.ok && data.success) {
        setOrderData(data);
        setOrderStatus('success');
        clear();
      } else {
        setOrderStatus('error');
        alert(data.message || 'Eroare la plasarea comenzii');
      }
    } catch (error) {
      console.error('Eroare:', error);
      setOrderStatus('error');
      alert('Eroare de conexiune. Reîncercă!');
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS PAGE
  if (orderStatus === 'success' && orderData) {
    return (
      <div className="mx-auto max-w-2xl py-16 px-4">
        <div className="rounded-2xl border-2 border-green-500/50 bg-gradient-to-br from-green-950/40 to-green-900/20 p-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
              <CheckCircle size={40} className="text-green-400" />
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-white mb-4 text-center">
            Comanda a fost plasată cu succes! ✨
          </h1>
          <p className="text-lg text-white/80 mb-8 text-center">
            Îți mulțumim! Vei primi email de confirmare cu factura și detalii livrare.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-gray-800/50 rounded-lg border border-white/10">
              <p className="text-white/70 text-sm">ID Comandă</p>
              <p className="font-bold text-indigo-300 break-all text-sm">{orderData.orderId}</p>
            </div>

            {orderData.invoiceNumber && (
              <div className="p-4 bg-gray-800/50 rounded-lg border border-white/10">
                <p className="text-white/70 text-sm">Factura</p>
                <p className="font-bold text-indigo-300">{orderData.invoiceNumber}</p>
              </div>
            )}

            <div className="p-4 bg-gray-800/50 rounded-lg border border-white/10">
              <p className="text-white/70 text-sm">Total</p>
              <p className="font-bold text-green-400">{money(total)}</p>
            </div>
          </div>

          {orderData.awb && orderData.awb !== 'PENDING' && (
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 rounded-xl mb-8 shadow-lg">
              <p className="text-indigo-100 text-sm font-semibold mb-2">📦 Numărul AWB (DPD)</p>
              <div className="flex items-center justify-center gap-3">
                <code className="text-3xl font-bold text-white tracking-widest">
                  {orderData.awb}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(orderData.awb || '');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-3 py-2 bg-indigo-500/50 hover:bg-indigo-400/50 rounded-lg transition-colors"
                >
                  <Copy size={20} className={copied ? 'text-green-400' : 'text-white'} />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
              <ArrowLeft size={20} />
              Înapoi la Acasă
            </a>
          </div>
        </div>
      </div>
    );
  }

  // FORM PAGE
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-extrabold text-indigo-400 mb-10">Finalizare Comandă</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* SUMAR COȘ */}
        <div className="lg:col-span-1 p-6 rounded-2xl border border-indigo-700/50 bg-gray-900 h-fit lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold text-white mb-5 border-b border-indigo-700/50 pb-3">
            Sumar ({count})
          </h2>

          <ul className="space-y-4 mb-6 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between items-start border-b border-gray-700/50 pb-3 last:border-b-0">
                <div className="flex-1 pr-4">
                  <p className="font-semibold text-white text-sm">{item.name}</p>
                  <p className="text-xs text-white/70 mt-1">
                    {item.quantity} buc. × {money(item.unitAmount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-sm">{money(item.totalAmount)}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-400 text-xs mt-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-indigo-500/50">
            <div className="flex justify-between items-center text-xl font-extrabold text-white">
              <span>Total:</span>
              <span className="text-indigo-400">{money(total)}</span>
            </div>
            <p className="text-xs text-white/70 mt-2">Plata: Ramburs la primire</p>
          </div>
        </div>

        {/* FORM */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-indigo-700/50 bg-gray-900">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

            {/* SECȚIUNE 0: EXPEDITOR */}
            <div className="space-y-4 p-4 rounded-xl bg-gray-800/50 border border-indigo-500/20">
              <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
                <Truck size={20} /> Date Expeditor (Prynt.ro)
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1">Nume *</label>
                  <input
                    type="text"
                    name="expeditor_nume"
                    value={formData.expeditor_nume}
                    onChange={handleChange}
                    placeholder="Prynt.ro / Ion Popescu"
                    className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                      errors.expeditor_nume ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                    }`}
                  />
                  {errors.expeditor_nume && <p className="text-red-400 text-xs mt-1">⚠️ {errors.expeditor_nume}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1">Telefon *</label>
                  <input
                    type="tel"
                    name="expeditor_telefon"
                    value={formData.expeditor_telefon}
                    onChange={handleChange}
                    placeholder="+40721234567"
                    className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                      errors.expeditor_telefon ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                    }`}
                  />
                  {errors.expeditor_telefon && <p className="text-red-400 text-xs mt-1">⚠️ {errors.expeditor_telefon}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Email *</label>
                <input
                  type="email"
                  name="expeditor_email"
                  value={formData.expeditor_email}
                  onChange={handleChange}
                  placeholder="info@prynt.ro"
                  className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                    errors.expeditor_email ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                  }`}
                />
                {errors.expeditor_email && <p className="text-red-400 text-xs mt-1">⚠️ {errors.expeditor_email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Adresa Completă *</label>
                <input
                  type="text"
                  name="expeditor_adresa"
                  value={formData.expeditor_adresa}
                  onChange={handleChange}
                  placeholder="Bulevardul Principal, nr. 123"
                  className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                    errors.expeditor_adresa ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                  }`}
                />
                {errors.expeditor_adresa && <p className="text-red-400 text-xs mt-1">⚠️ {errors.expeditor_adresa}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1">Oraș *</label>
                  <input
                    type="text"
                    name="expeditor_oras"
                    value={formData.expeditor_oras}
                    onChange={handleChange}
                    placeholder="București"
                    className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                      errors.expeditor_oras ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                    }`}
                  />
                  {errors.expeditor_oras && <p className="text-red-400 text-xs mt-1">⚠️ {errors.expeditor_oras}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1">Județ *</label>
                  <input
                    type="text"
                    name="expeditor_judet"
                    value={formData.expeditor_judet}
                    onChange={handleChange}
                    placeholder="Bucuresti"
                    className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                      errors.expeditor_judet ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                    }`}
                  />
                  {errors.expeditor_judet && <p className="text-red-400 text-xs mt-1">⚠️ {errors.expeditor_judet}</p>}
                </div>
              </div>
            </div>

            {/* SECȚIUNE 1: LIVRARE */}
            <div className="space-y-4 p-4 rounded-xl bg-gray-800/50 border border-indigo-500/20">
              <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
                <MapPin size={20} /> Adresă de Livrare
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1">Nume *</label>
                  <input
                    type="text"
                    name="nume_livrare"
                    value={formData.nume_livrare}
                    onChange={handleChange}
                    placeholder="Ion Popescu"
                    className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                      errors.nume_livrare ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                    }`}
                  />
                  {errors.nume_livrare && <p className="text-red-400 text-xs mt-1">⚠️ {errors.nume_livrare}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1">Telefon *</label>
                  <input
                    type="tel"
                    name="telefon"
                    value={formData.telefon}
                    onChange={handleChange}
                    placeholder="+40721234567"
                    className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                      errors.telefon ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                    }`}
                  />
                  {errors.telefon && <p className="text-red-400 text-xs mt-1">⚠️ {errors.telefon}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ion@example.com"
                  className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                    errors.email ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                  }`}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">⚠️ {errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-1">Adresa Completă *</label>
                <input
                  type="text"
                  name="adresa_livrare"
                  value={formData.adresa_livrare}
                  onChange={handleChange}
                  placeholder="Strada Principale, nr. 123"
                  className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                    errors.adresa_livrare ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                  }`}
                />
                {errors.adresa_livrare && <p className="text-red-400 text-xs mt-1">⚠️ {errors.adresa_livrare}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1">Oraș *</label>
                  <input
                    type="text"
                    name="oras_livrare"
                    value={formData.oras_livrare}
                    onChange={handleChange}
                    placeholder="București"
                    className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                      errors.oras_livrare ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                    }`}
                  />
                  {errors.oras_livrare && <p className="text-red-400 text-xs mt-1">⚠️ {errors.oras_livrare}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-1">Județ *</label>
                  <input
                    type="text"
                    name="judet_livrare"
                    value={formData.judet_livrare}
                    onChange={handleChange}
                    placeholder="Bucuresti"
                    className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                      errors.judet_livrare ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                    }`}
                  />
                  {errors.judet_livrare && <p className="text-red-400 text-xs mt-1">⚠️ {errors.judet_livrare}</p>}
                </div>
              </div>
            </div>

            {/* SECȚIUNE 2: FACTURARE */}
            <div className="space-y-4 p-4 rounded-xl bg-gray-800/50 border border-indigo-500/20">
              <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
                <FileText size={20} /> Detalii Facturare
              </h3>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tip_factura"
                    value="persoana_fizica"
                    checked={formData.tip_factura === 'persoana_fizica'}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-white"><User size={16} className="inline mr-1" /> Persoană Fizică</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tip_factura"
                    value="persoana_juridica"
                    checked={formData.tip_factura === 'persoana_juridica'}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="text-white"><Building2 size={16} className="inline mr-1" /> Persoană Juridică</span>
                </label>
              </div>

              {formData.tip_factura === 'persoana_juridica' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-1">CUI *</label>
                    <input
                      type="text"
                      name="cui"
                      value={formData.cui}
                      onChange={handleChange}
                      placeholder="RO12345678"
                      className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                        errors.cui ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                      }`}
                    />
                    {errors.cui && <p className="text-red-400 text-xs mt-1">⚠️ {errors.cui}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-1">Denumire Companie *</label>
                    <input
                      type="text"
                      name="nume_companie"
                      value={formData.nume_companie}
                      onChange={handleChange}
                      placeholder="Compania SRL"
                      className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                        errors.nume_companie ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                      }`}
                    />
                    {errors.nume_companie && <p className="text-red-400 text-xs mt-1">⚠️ {errors.nume_companie}</p>}
                  </div>
                </>
              )}

              <label className="flex items-center gap-2 cursor-pointer p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition">
                <input
                  type="checkbox"
                  name="adresa_facturare_identica"
                  checked={formData.adresa_facturare_identica}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-white text-sm">
                  ✓ Adresa de facturare = adresa de livrare
                </span>
              </label>

              {!formData.adresa_facturare_identica && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-1">Adresa Facturare *</label>
                    <input
                      type="text"
                      name="adresa_facturare"
                      value={formData.adresa_facturare}
                      onChange={handleChange}
                      className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                        errors.adresa_facturare ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                      }`}
                    />
                    {errors.adresa_facturare && <p className="text-red-400 text-xs mt-1">⚠️ {errors.adresa_facturare}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-1">Oraș *</label>
                      <input
                        type="text"
                        name="oras_facturare"
                        value={formData.oras_facturare}
                        onChange={handleChange}
                        className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                          errors.oras_facturare ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                        }`}
                      />
                      {errors.oras_facturare && <p className="text-red-400 text-xs mt-1">⚠️ {errors.oras_facturare}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-1">Județ *</label>
                      <input
                        type="text"
                        name="judet_facturare"
                        value={formData.judet_facturare}
                        onChange={handleChange}
                        className={`w-full rounded-lg border bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition ${
                          errors.judet_facturare ? 'border-red-500 ring-2 ring-red-500/50' : 'border-indigo-700/50'
                        }`}
                      />
                      {errors.judet_facturare && <p className="text-red-400 text-xs mt-1">⚠️ {errors.judet_facturare}</p>}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* MENȚIUNI */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-1">
                Mențiuni (Opțional)
              </label>
              <textarea
                name="mentiuni"
                rows={2}
                value={formData.mentiuni}
                onChange={handleChange}
                placeholder="Ex: Livrare după 18:00..."
                className="w-full rounded-lg border border-indigo-700/50 bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* METODA PLATĂ */}
            <div className="p-4 rounded-xl border-2 border-indigo-500 bg-indigo-900/50">
              <p className="text-white font-semibold">💳 Plata la Livrare (Ramburs)</p>
              <p className="text-indigo-100 mt-1">Vei plăti {money(total)} curierului la primire</p>
            </div>

            {/* BUTON SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-extrabold text-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Se procesează...
                </>
              ) : (
                <>
                  <Package size={20} />
                  Plasează Comanda - {money(total)}
                </>
              )}
            </button>

            {orderStatus === 'error' && (
              <p className="text-red-500 text-center font-semibold">
                ❌ Eroare! Reîncercă!
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}