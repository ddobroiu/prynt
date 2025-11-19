"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import AddressesManager from "@/components/AddressesManager";
import ChangePasswordForm from "@/components/ChangePasswordForm";
// CORECTAT: Import default (fără acolade)
import SignOutButton from "@/components/SignOutButton";
import OrderDetails from "@/components/OrderDetails";

// Funcții utilitare pentru afișare
function getAwbTrackingUrl(awb: string | null | undefined, carrier: string | null | undefined): string | null {
  if (!awb || !carrier) return null;
  const awbClean = encodeURIComponent(awb);
  const carrierLower = carrier.toLowerCase();
  if (carrierLower.includes('dpd')) return `https://tracking.dpd.ro/awb?awb=${awbClean}`;
  if (carrierLower.includes('fan')) return `https://www.fancourier.ro/awb-tracking/?awb=${awbClean}`;
  if (carrierLower.includes('sameday')) return `https://sameday.ro/awb-tracking/?awb=${awbClean}`;
  return null;
}

function resolveStatusMeta(status: string | null | undefined) {
  switch (status) {
    case "fulfilled":
      return { label: "Finalizată", badge: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" };
    case "canceled":
      return { label: "Anulată", badge: "bg-red-500/10 text-red-500 border border-red-500/20" };
    case "processing":
      return { label: "În procesare", badge: "bg-blue-500/10 text-blue-500 border border-blue-500/20" };
    default:
      return { label: "În lucru", badge: "bg-amber-500/10 text-amber-500 border border-amber-500/20" };
  }
}

interface AccountClientPageProps {
  orders?: any[];
  billing?: any;
  session?: any;
}

export default function AccountClientPage({ orders = [], billing }: AccountClientPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [tab, setTab] = useState<'orders' | 'addresses' | 'security'>('orders');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'security') setTab('security');
    else if (tabParam === 'addresses') setTab('addresses');
    else if (tabParam === 'orders') setTab('orders');
  }, [searchParams]);

  if (status === "loading") {
    return <div className="p-8 text-center">Se încarcă...</div>;
  }

  if (!session) {
    return null; 
  }

  const handleTabChange = (newTab: 'orders' | 'addresses' | 'security') => {
    setTab(newTab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', newTab);
    window.history.pushState({}, '', url);
  };

  return (
    <div className="min-h-[60vh]">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contul meu</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Salut, {session.user?.name || session.user?.email}!
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar / Navigation Tabs */}
        <aside className="w-full lg:w-64 shrink-0 space-y-2">
          <button
            onClick={() => handleTabChange('orders')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              tab === 'orders'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Comenzile mele
          </button>
          <button
            onClick={() => handleTabChange('addresses')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              tab === 'addresses'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Adrese de livrare
          </button>
          <button
            onClick={() => handleTabChange('security')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              tab === 'security'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Securitate
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          {tab === 'orders' && (
             <div className="animate-fadeIn">
               <div className="flex items-center justify-between mb-6 pb-4 border-b dark:border-gray-700">
                 <h2 className="text-xl font-semibold">Istoric comenzi</h2>
                 <span className="text-sm text-muted-foreground">Total: {orders.length}</span>
               </div>
               
               {orders.length === 0 ? (
                 <div className="text-center py-10 text-gray-500">
                   Nu ai nicio comandă plasată încă.
                 </div>
               ) : (
                 <ul className="space-y-4">
                   {orders.map((o: any) => {
                     const statusMeta = resolveStatusMeta(o.status);
                     const awbUrl = getAwbTrackingUrl(o.awbNumber, o.awbCarrier);
                     const previewItems = (o.items || []).slice(0, 3).map((item: any) => `${item.qty}x ${item.name}`);
                     
                     return (
                       <li key={o.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                         <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                           <div className="flex-1">
                             <div className="flex items-center justify-between flex-wrap gap-2">
                               <div>
                                 <div className="font-medium text-gray-900 dark:text-white">
                                   Comanda #{o.orderNo}
                                 </div>
                                 <div className="text-xs text-gray-500">
                                   {new Date(o.createdAt).toLocaleString("ro-RO")}
                                 </div>
                               </div>
                               <div className="text-right">
                                 <div className="text-sm font-bold text-gray-900 dark:text-white">
                                   {new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(o.total)}
                                 </div>
                                 <div className="text-xs text-gray-500">
                                   {o.itemsCount} produse • {o.paymentType}
                                 </div>
                               </div>
                             </div>

                             <div className="mt-3 space-y-2 text-sm">
                               {previewItems.length > 0 && (
                                 <div className="text-gray-600 dark:text-gray-300 text-xs">
                                   {previewItems.join(" | ")}
                                   {o.itemsCount > previewItems.length ? ` +${o.itemsCount - previewItems.length} altele` : ""}
                                 </div>
                               )}
                               
                               <div className="flex flex-wrap items-center gap-2 mt-2">
                                 <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMeta.badge}`}>
                                   {statusMeta.label}
                                 </span>
                                 
                                 {o.awbNumber && (
                                   <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-600 px-2.5 py-0.5 text-xs text-gray-600 dark:text-gray-300">
                                     <span>AWB: {o.awbNumber}</span>
                                     {awbUrl && (
                                       <a href={awbUrl} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                                         Tracking
                                       </a>
                                     )}
                                   </span>
                                 )}
                                 
                                 {o.invoiceLink && (
                                   <a
                                     href={o.invoiceLink}
                                     target="_blank"
                                     rel="noreferrer"
                                     className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-600 px-2.5 py-0.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                                   >
                                     Factură
                                   </a>
                                 )}
                               </div>
                             </div>
                           </div>
                         </div>
                         <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                            <OrderDetails order={o} />
                         </div>
                       </li>
                     );
                   })}
                 </ul>
               )}
             </div>
          )}
          {tab === 'addresses' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold mb-6 pb-4 border-b dark:border-gray-700">Adresele mele</h2>
              <AddressesManager />
            </div>
          )}
          {tab === 'security' && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold mb-6 pb-4 border-b dark:border-gray-700">Securitate cont</h2>
              <ChangePasswordForm />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}