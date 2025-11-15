import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage() {
  // Consolidated into /account — redirect to account overview
  redirect('/account');
}
