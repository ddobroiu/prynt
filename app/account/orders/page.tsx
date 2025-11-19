import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  // Redirecționăm tot traficul de aici către tab-ul de comenzi din cont
  redirect('/account?tab=orders');
}