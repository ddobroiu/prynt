// app/checkout/page.tsx
import CheckoutForm from '@/components/CheckoutForm';

export default function CheckoutPage() {
  // TODO: înlocuiește cu coșul real din app
  const demoCart = [
    { sku: 'SKU-CHAIR-01', name: 'Scaun din lemn', quantity: 1, unitPrice: 199.9, vatRate: 19, weightGr: 2500 },
    { sku: 'SKU-DESK-01',  name: 'Birou 120cm',    quantity: 1, unitPrice: 549.0, vatRate: 19, weightGr: 12000 },
  ];

  const totals = { shippingCost: 29.99, currency: 'RON' };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <CheckoutForm initialCart={demoCart as any} initialTotals={totals} />
    </main>
  );
}
