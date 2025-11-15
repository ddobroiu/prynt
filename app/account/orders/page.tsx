import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  // Consolidated into /account — redirect here
  redirect('/account');
}
