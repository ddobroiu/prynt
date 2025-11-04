// components/CheckoutForm.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { createOrderSchema, type CreateOrderInput } from '@/lib/validation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

type Props = {
  initialCart: CreateOrderInput['items'];
  initialTotals: { shippingCost: number; currency: string };
};

function PayButton({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setErrorMsg(null);

    // ia clientSecret din API
    const res = await fetch('/api/checkout/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setErrorMsg(data?.error ?? 'Eroare creare PaymentIntent');
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // după succes, Stripe redirecționează; noi rămânem pe pagină și UX-ul citește starea din DB (pasul 2)
        return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
      },
      redirect: 'if_required',
    });

    if (error) setErrorMsg(error.message ?? 'Eroare la confirmare');
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <PaymentElement />
      {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
      <button
        onClick={handlePay}
        disabled={loading || !stripe || !elements}
        className="w-full rounded-lg border px-4 py-2 hover:bg-black hover:text-white transition disabled:opacity-50"
      >
        {loading ? 'Se procesează…' : 'Plătește'}
      </button>
    </div>
  );
}

export default function CheckoutForm({ initialCart, initialTotals }: Props) {
  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      currency: initialTotals.currency,
      items: initialCart,
      shippingMethod: 'dpd_standard',
      shippingCost: initialTotals.shippingCost,
      discountTotal: 0,
      customer: {
        isCompany: false,
        email: '',
        fullName: '',
        phone: '',
        billingAddress: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'RO',
        },
        shippingDifferent: false,
        shippingAddress: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'RO',
        },
      },
    },
  });

  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const onSubmit = async (values: CreateOrderInput) => {
    const res = await fetch('/api/orders/create', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) {
      alert('Eroare creare comandă');
      return;
    }
    setOrderId(data.orderId);

    // creează PaymentIntent și pregătește PaymentElement
    const resPI = await fetch('/api/checkout/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify({ orderId: data.orderId }),
      headers: { 'Content-Type': 'application/json' },
    });
    const dataPI = await resPI.json();
    if (!resPI.ok) {
      alert(dataPI?.error ?? 'Eroare creare PaymentIntent');
      return;
    }
    setClientSecret(dataPI.clientSecret);
  };

  const total = useMemo(() => {
    const subtotal = initialCart.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
    const vat = initialCart.reduce((s, it) => s + (it.unitPrice * it.quantity * it.vatRate) / 100, 0);
    return subtotal + vat + initialTotals.shippingCost;
  }, [initialCart, initialTotals.shippingCost]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <form onSubmit={form.handleSubmit(onSubmit)} className="lg:col-span-2 space-y-8">
        {/* Client & Facturare */}
        <div className="rounded-2xl p-6 border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Date client & facturare</h2>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                {...form.register('customer.isCompany')}
                className="accent-black"
              />
              Firmă (B2B)
            </label>
          </div>

          {/* Persoana fizică / firmă */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!form.watch('customer.isCompany') ? (
              <input
                placeholder="Nume complet"
                {...form.register('customer.fullName', { required: true })}
                className="border rounded-lg px-3 py-2"
              />
            ) : (
              <>
                <input placeholder="Denumire firmă" {...form.register('customer.companyName', { required: true })} className="border rounded-lg px-3 py-2" />
                <input placeholder="CUI" {...form.register('customer.cui', { required: true })} className="border rounded-lg px-3 py-2" />
                <input placeholder="Nr. Reg. Comerț" {...form.register('customer.regCom')} className="border rounded-lg px-3 py-2 md:col-span-2" />
              </>
            )}
            <input placeholder="Email" type="email" {...form.register('customer.email', { required: true })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Telefon" {...form.register('customer.phone')} className="border rounded-lg px-3 py-2" />
          </div>

          {/* Adresă facturare */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Stradă, nr." {...form.register('customer.billingAddress.street', { required: true })} className="border rounded-lg px-3 py-2 md:col-span-2" />
            <input placeholder="Localitate" {...form.register('customer.billingAddress.city', { required: true })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Județ" {...form.register('customer.billingAddress.state')} className="border rounded-lg px-3 py-2" />
            <input placeholder="Cod poștal" {...form.register('customer.billingAddress.postalCode', { required: true })} className="border rounded-lg px-3 py-2" />
            <input placeholder="Țara" defaultValue="RO" {...form.register('customer.billingAddress.country')} className="border rounded-lg px-3 py-2" />
          </div>

          {/* Livrare diferită */}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...form.register('customer.shippingDifferent')} className="accent-black" />
            Adresă de livrare diferită
          </label>

          {form.watch('customer.shippingDifferent') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Destinatar" {...form.register('customer.shippingAddress.name')} className="border rounded-lg px-3 py-2 md:col-span-2" />
              <input placeholder="Stradă, nr." {...form.register('customer.shippingAddress.street', { required: true })} className="border rounded-lg px-3 py-2 md:col-span-2" />
              <input placeholder="Localitate" {...form.register('customer.shippingAddress.city', { required: true })} className="border rounded-lg px-3 py-2" />
              <input placeholder="Județ" {...form.register('customer.shippingAddress.state')} className="border rounded-lg px-3 py-2" />
              <input placeholder="Cod poștal" {...form.register('customer.shippingAddress.postalCode', { required: true })} className="border rounded-lg px-3 py-2" />
              <input placeholder="Țara" defaultValue="RO" {...form.register('customer.shippingAddress.country')} className="border rounded-lg px-3 py-2" />
            </div>
          )}
        </div>

        {/* Livrare & cost transport */}
        <div className="rounded-2xl p-6 border space-y-4">
          <h2 className="text-xl font-semibold">Livrare</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select {...form.register('shippingMethod')} className="border rounded-lg px-3 py-2 md:col-span-2">
              <option value="dpd_standard">DPD Standard</option>
              <option value="dpd_express">DPD Express</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Cost transport (RON)"
              {...form.register('shippingCost', { valueAsNumber: true })}
              className="border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-xl border px-5 py-3 hover:bg-black hover:text-white transition"
        >
          Continuă la plată
        </button>
      </form>

      {/* Rezumat + Payment Element */}
      <div className="rounded-2xl p-6 border space-y-4">
        <h2 className="text-xl font-semibold">Rezumat comandă</h2>
        <div className="text-sm space-y-1">
          <div className="flex justify-between"><span>Total produse</span><span>{total.toFixed(2)} {initialTotals.currency}</span></div>
          <div className="flex justify-between"><span>Transport</span><span>{initialTotals.shippingCost.toFixed(2)} {initialTotals.currency}</span></div>
          <div className="flex justify-between font-semibold text-base"><span>Total de plată</span><span>{(total).toFixed(2)} {initialTotals.currency}</span></div>
        </div>

        {orderId && clientSecret ? (
          <Elements options={{ clientSecret }} stripe={stripePromise}>
            <PayButton orderId={orderId} />
          </Elements>
        ) : (
          <p className="text-sm text-neutral-600">Completează datele și apasă „Continuă la plată”.</p>
        )}
      </div>
    </div>
  );
}
