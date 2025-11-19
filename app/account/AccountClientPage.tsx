"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link"; 
import AddressesManager from "@/components/AddressesManager";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import SignOutButton from "@/components/SignOutButton";
import OrderDetails from "@/components/OrderDetails";

function getAwbTrackingUrl(awb: string | null | undefined, carrier: string | null | undefined): string | null {
  if (!awb || awb === "0") return null;
  const awbClean = encodeURIComponent(awb);
  const carrierLower = (carrier || "").toLowerCase();
  if (carrierLower.includes('dpd')) return `https://tracking.dpd.ro/awb?awb=${awbClean}`;
  if (carrierLower.includes('fan')) return `https://www.fancourier.ro/awb-tracking/?awb=${awbClean}`;
  if (carrierLower.includes('sameday')) return `https://sameday.ro/awb-tracking/?awb=${awbClean}`;
  return null;
}

function resolveStatusMeta(status: string | null | undefined) {
  switch (status) {
    case "fulfilled": return { label: "Finalizată", badge: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" };
    case "canceled": return { label: "Anulată", badge: "bg-red-500/10 text-red-500 border border-red-500/20" };
    case "processing": return { label: "În procesare", badge: "bg-blue-500/10 text-blue-500 border border-blue-500/20" };
    default: return { label: "În lucru", badge: "bg-amber-500/10 text-amber-500 border border-amber-500/20" };
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
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'security') setTab('security');
    else if (tabParam === 'addresses') setTab('addresses');
    else if (tabParam === 'orders') setTab('orders');
  }, [searchParams]);

  const handleTabChange = (newTab: 'orders' | 'addresses' | 'security') => {
    setTab(newTab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', newTab);
    window.history.pushState({}, '', url);
  };

  if (status === "loading") return <div className="p-10 text-center text-white">Se încarcă...</div>;
  if (!session) return null; 

  return (
    <div className="min-h-[60vh]">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contul meu</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Salut, {session.user?.name || session.user?.email}!</p>
        </div>
        <SignOutButton />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0 space-y-2">
          <button onClick={() => handleTabChange('orders')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${tab === 'orders' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Comenzile mele</button>
          <button onClick={() => handleTabChange('addresses')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${tab === 'addresses' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Adrese de livrare</button>
          <button onClick={() => handleTabChange('security')} className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${tab === 'security' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Securitate</button>
        </aside>

        <main className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          {tab === 'orders' && (
             <div className="animate-fadeIn">
               <h2 className="text-xl font-semibold mb-6 pb-4 border-b dark:border-gray-700">Istoric comenzi</h2>
               
               {orders.length === 0 ? (
                 <div className="text-center py-10 text-gray-500">Nu ai nicio comandă plasată încă.</div>
               ) : (
                 <ul className="space-y-4">
                   {orders.map((o: any) => {
                     const statusMeta = resolveStatusMeta(o.status);
                     const awbUrl = getAwbTrackingUrl(o.awbNumber, o.awbCarrier);
                     
                     // Verificare explicită: Dacă awbNumber există (chiar și "0")
                     const hasAwb = o.awbNumber !== null && o.awbNumber !== undefined && o.awbNumber !== "";

                     return (
                       <li key={o.id} className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                         <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                           <div className="flex-1">
                               <div className="font-bold text-lg text-gray-900 dark:text-white">Comanda #{o.orderNo}</div>
                               <div className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleString("ro-RO")}</div>
                               
                               {/* SECȚIUNEA STATUS, AWB ȘI FACTURĂ */}
                               <div className="mt-3 flex flex-wrap items-center gap-3">
                                 {/* Status */}
                                 <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${statusMeta.badge}`}>
                                    {statusMeta.label}
                                 </span>
                                 
                                 {/* AWB */}
                                 {hasAwb && (
                                   <div className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-500/30 px-3 py-1 rounded-full">
                                      <span className="text-xs font-bold text-indigo-700 dark:text-indigo-200 font-mono">
                                        AWB: {o.awbNumber === "0" ? "Generare..." : o.awbNumber}
                                      </span>
                                      {awbUrl && (
                                        <a href={awbUrl} target="_blank" className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded hover:bg-indigo-500 uppercase tracking-wide font-bold no-underline">
                                          Track
                                        </a>
                                      )}
                                   </div>
                                 )}
                                 
                                 {/* Factură */}
                                 {o.invoiceLink && (
                                   <a href={o.invoiceLink} target="_blank" className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-300 font-bold hover:underline bg-indigo-50 dark:bg-transparent px-2 py-1 rounded">
                                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                     Factură
                                   </a>
                                 )}
                               </div>
                           </div>

                           <div className="text-right shrink-0">
                               <div className="text-lg font-bold text-gray-900 dark:text-white">{new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(o.total)}</div>
                               <div className="text-xs text-gray-500">{o.itemsCount} produse</div>
                           </div>
                         </div>

                         <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-3 justify-end">
                            <OrderDetails order={o} />
                            <Link 
                              href={`/account/orders/${o.id}`}
                              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                              Gestionare Grafică
                            </Link>
                         </div>
                       </li>
                     );
                   })}
                 </ul>
               )}
             </div>
          )}
          {tab === 'addresses' && <div className="animate-fadeIn"><AddressesManager /></div>}
          {tab === 'security' && <div className="animate-fadeIn"><ChangePasswordForm /></div>}
        </main>
      </div>
    </div>
  );
}