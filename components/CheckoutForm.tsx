'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { createOrderSchema, type CreateOrderInput } from '@/lib/validation';
import CityAutocomplete from './CityAutocomplete';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
      <div className="border-b px-5 py-4">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-neutral-700 mb-1">{label}</span>
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        'w-full rounded-xl border px-3 py-2 outline-none transition ' +
        'focus:ring-2 focus:ring-black/10 focus:border-black/20 ' +
        (props.className ?? '')
      }
    />
  );
}

function PayButton({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    setErrorMsg(null);

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
      confirmParams: { return_url: `${window.location.origin}/checkout/success?orderId=${orderId}` },
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
        className="w-full rounded-xl border px-4 py-2 font-medium hover:bg-black hover:text-white transition disabled:opacity-50"
      >
        {loading ? 'Se procesează…' : 'Plătește'}
      </button>
    </div>
  );
}

export default function CheckoutForm({
  initialCart,
  initialTotals,
}: {
  initialCart: CreateOrderInput['items'];
  initialTotals: { shippingCost: number; currency: string };
}) {
  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      currency: initialTotals.currency,
      items: initialCart, // ← trimitem coșul real către backend
      shippingMethod: 'dpd_standard',
      shippingCost: 24,
      discountTotal: 0,
      paymentMethod: 'card',
      customer: {
        isCompany: false,
        email: '',
        fullName: '',
        phone: '',
        billingAddress: { street: '', city: '', state: '', postalCode: '', country: 'RO' },
        shippingDifferent: false,
        shippingAddress: { street: '', city: '', state: '', postalCode: '', country: 'RO' },
      },
    },
  });

  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const subtotal = useMemo(
    () => initialCart.reduce((s, it) => s + it.unitPrice * it.quantity, 0),
    [initialCart]
  );
  const vat = useMemo(
    () => initialCart.reduce((s, it) => s + (it.unitPrice * it.quantity * it.vatRate) / 100, 0),
    [initialCart]
  );
  const total = useMemo(() => subtotal + vat + 24, [subtotal, vat]);

  const handleSubmit = async (values: CreateOrderInput) => {
    values.shippingCost = 24;
    values.shippingMethod = 'dpd_standard';

    const res = await fetch('/api/orders/create', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data?.error ?? 'Eroare creare comandă');
      return;
    }

    if (values.paymentMethod === 'cash_on_delivery') {
      window.location.href = `/checkout/success?orderId=${data.orderId}`;
      return;
    }

    setOrderId(data.orderId);

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* STÂNGA */}
      <form onSubmit={form.handleSubmit(handleSubmit)} className="lg:col-span-2 space-y-6">
        {/* Date client & facturare */}
        <Card title="Date client & facturare">
          <div className="flex items-center justify-between mb-4">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" {...form.register('customer.isCompany')} className="accent-black" />
              Firmă (B2B)
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!form.watch('customer.isCompany') ? (
              <Field label="Nume complet">
                <TextInput placeholder="Ion Popescu" {...form.register('customer.fullName', { required: true })} />
              </Field>
            ) : (
              <>
                <Field label="Denumire firmă">
                  <TextInput placeholder="SC Exemplu SRL" {...form.register('customer.companyName', { required: true })} />
                </Field>
                <Field label="CUI">
                  <TextInput placeholder="RO12345678" {...form.register('customer.cui', { required: true })} />
                </Field>
                <Field label="Nr. Reg. Comerț">
                  <TextInput placeholder="J00/0000/2025" {...form.register('customer.regCom')} />
                </Field>
              </>
            )}
            <Field label="Email">
              <TextInput type="email" placeholder="email@exemplu.ro" {...form.register('customer.email', { required: true })} />
            </Field>
            <Field label="Telefon">
              <TextInput placeholder="07xx xxx xxx" {...form.register('customer.phone')} />
            </Field>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Stradă, număr">
              <TextInput placeholder="Str. Exemplu 10" {...form.register('customer.billingAddress.street', { required: true })} />
            </Field>

            <Field label="Localitate">
              <CityAutocomplete
                value={form.getValues('customer.billingAddress.city')}
                onChange={(sel) => {
                  form.setValue('customer.billingAddress.city', sel.city);
                  if (sel.county) form.setValue('customer.billingAddress.state', sel.county);
                  if (sel.postalCode) form.setValue('customer.billingAddress.postalCode', sel.postalCode);
                }}
              />
            </Field>

            <Field label="Județ">
              <TextInput placeholder="Cluj" {...form.register('customer.billingAddress.state')} />
            </Field>
            <Field label="Cod poștal">
              <TextInput placeholder="400000" {...form.register('customer.billingAddress.postalCode', { required: true })} />
            </Field>
            <Field label="Țara">
              <TextInput defaultValue="RO" {...form.register('customer.billingAddress.country')} />
            </Field>
          </div>
        </Card>

        {/* Livrare */}
        <Card title="Adresă de livrare">
          <label className="flex items-center gap-2 mb-4 text-sm">
            <input type="checkbox" {...form.register('customer.shippingDifferent')} className="accent-black" />
            Adresă de livrare diferită față de facturare
          </label>

          {form.watch('customer.shippingDifferent') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Destinatar">
                <TextInput placeholder="Nume destinatar (opțional)" {...form.register('customer.shippingAddress.name')} />
              </Field>
              <div />
              <Field label="Stradă, număr">
                <TextInput placeholder="Str. Exemplu 5" {...form.register('customer.shippingAddress.street', { required: true })} />
              </Field>

              <Field label="Localitate">
                <CityAutocomplete
                  value={form.getValues('customer.shippingAddress.city')}
                  onChange={(sel) => {
                    form.setValue('customer.shippingAddress.city', sel.city);
                    if (sel.county) form.setValue('customer.shippingAddress.state', sel.county);
                    if (sel.postalCode) form.setValue('customer.shippingAddress.postalCode', sel.postalCode);
                  }}
                />
              </Field>

              <Field label="Județ">
                <TextInput placeholder="Cluj" {...form.register('customer.shippingAddress.state')} />
              </Field>
              <Field label="Cod poștal">
                <TextInput placeholder="400000" {...form.register('customer.shippingAddress.postalCode', { required: true })} />
              </Field>
              <Field label="Țara">
                <TextInput defaultValue="RO" {...form.register('customer.shippingAddress.country')} />
              </Field>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between rounded-xl border px-4 py-3 bg-neutral-50">
            <div>
              <div className="font-medium">Livrare DPD Standard</div>
              <div className="text-sm text-neutral-600">Curier rapid în toată România</div>
            </div>
            <div className="text-right font-semibold">24.00 {form.getValues('currency')}</div>
          </div>
          <input type="hidden" {...form.register('shippingMethod')} value="dpd_standard" />
          <input type="hidden" {...form.register('shippingCost', { value: 24 })} />
        </Card>

        {/* Metodă de plată */}
        <Card title="Metodă de plată">
          <div className="space-y-3">
            <label className="flex items-center gap-3 rounded-xl border px-4 py-3 hover:bg-neutral-50 cursor-pointer">
              <input
                type="radio"
                value="card"
                {...form.register('paymentMethod')}
                defaultChecked
                className="accent-black"
              />
              <div>
                <div className="font-medium">Plată online cu cardul (Stripe)</div>
                <div className="text-sm text-neutral-600">Card de debit/credit, sigur și rapid</div>
              </div>
            </label>

            <label className="flex items-center gap-3 rounded-xl border px-4 py-3 hover:bg-neutral-50 cursor-pointer">
              <input
                type="radio"
                value="cash_on_delivery"
                {...form.register('paymentMethod')}
                className="accent-black"
              />
              <div>
                <div className="font-medium">Plată la livrare (ramburs)</div>
                <div className="text-sm text-neutral-600">Plătești curierului la primirea coletului</div>
              </div>
            </label>
          </div>

          <div className="mt-5">
            <button
              type="submit"
              className="w-full rounded-xl border px-5 py-3 font-medium hover:bg-black hover:text-white transition"
            >
              Continuă
            </button>
          </div>
        </Card>
      </form>

      {/* DREAPTA */}
      <div className="space-y-6">
        <Card title="Produse în coș">
          <div className="space-y-3">
            {initialCart.map((it, idx) => (
              <div key={idx} className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {it.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.imageUrl} alt={it.name} className="w-12 h-12 rounded-lg object-cover border" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg border bg-neutral-100" />
                  )}
                  <div className="text-sm">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-neutral-600">SKU: {it.sku}</div>
                    <div className="text-neutral-600">Cant: {it.quantity}</div>
                  </div>
                </div>
                <div className="text-sm font-medium whitespace-nowrap">
                  {(it.unitPrice * it.quantity).toFixed(2)} {initialTotals.currency}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Rezumat comandă">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Total produse</span><span>{subtotal.toFixed(2)} {initialTotals.currency}</span></div>
            <div className="flex justify-between"><span>TVA</span><span>{vat.toFixed(2)} {initialTotals.currency}</span></div>
            <div className="flex justify-between"><span>Transport (DPD Standard)</span><span>24.00 {initialTotals.currency}</span></div>
            <div className="h-px bg-neutral-200 my-2" />
            <div className="flex justify-between text-base font-semibold"><span>Total de plată</span><span>{total.toFixed(2)} {initialTotals.currency}</span></div>
          </div>
        </Card>

        {orderId && clientSecret && (
          <Card title="Plată cu cardul">
            <Elements options={{ clientSecret }} stripe={stripePromise}>
              <PayButton orderId={orderId} />
            </Elements>
          </Card>
        )}
      </div>
    </div>
  );
}
