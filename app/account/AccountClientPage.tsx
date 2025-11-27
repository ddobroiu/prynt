"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link"; 
import AddressesManager from "@/components/AddressesManager";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import AccountDetailsForm from "@/components/AccountDetailsForm";
import SignOutButton from "@/components/SignOutButton";
import OrderDetails from "@/components/OrderDetails";

function getAwbTrackingUrl(awb: string | null | undefined, carrier: string | null | undefined): string | null {
  if (!awb || awb === "0") return null;
  const awbClean = encodeURIComponent(awb);
  const carrierLower = (carrier || "").toLowerCase();
  
  // CORECTIE: Ruta DPD specificată de utilizator
  if (carrierLower.includes('dpd')) return `https://tracking.dpd.ro/?shipmentNumber=${awbClean}&language=ro`;
  
  if (carrierLower.includes('fan')) return `https://www.fancourier.ro/awb-tracking/?awb=${awbClean}`;
  if (carrierLower.includes('sameday')) return `https://sameday.ro/awb-tracking/?awb=${awbClean}`;
  
  // Fallback default (presupunem DPD dacă nu e specificat altceva, sau putem returna null)
  return `https://tracking.dpd.ro/?shipmentNumber=${awbClean}&language=ro`;
}

function resolveStatusMeta(status: string | null | undefined) {
  switch (status) {
    case "fulfilled": return { label: "Finalizată", badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" };
    case "canceled": return { label: "Anulată", badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800" };
    case "processing": return { label: "În procesare", badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800" };
    default: return { label: "În lucru", badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800" };
  }
}

interface AccountClientPageProps {
  orders?: any[];
  billing?: any;
  session?: any;
}

export default function AccountClientPage({ orders = [] }: AccountClientPageProps) {
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

  if (status === "loading") return <div className="p-10 text-center text-gray-600 dark:text-gray-400">Se încarcă...</div>;
  if (!session) return null; 

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Contul meu</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Salut, <span className="font-semibold text-gray-800 dark:text-gray-200">{session.user?.name || session.user?.email}</span>!</p>
          </div>
          <SignOutButton />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR */}
          <aside className="w-full lg:w-72 shrink-0 space-y-2">
            <nav className="flex flex-col gap-1 bg-white dark:bg-slate-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <button 
                onClick={() => handleTabChange('orders')} 
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${tab === 'orders' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
              >
                Comenzile mele
              </button>
              <button 
                onClick={() => handleTabChange('addresses')} 
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${tab === 'addresses' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
              >
                Adrese de livrare
              </button>
              <button 
                onClick={() => handleTabChange('security')} 
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${tab === 'security' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
              >
                Securitate & Parolă
              </button>
            </nav>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            {tab === 'orders' && (
               <div className="animate-in fade-in slide-in-from-bottom-2">
                 <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white">Istoric comenzi</h2>
                 
                 {orders.length === 0 ? (
                   <div className="text-center py-12 bg-gray-50 dark:bg-slate-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                     <p className="text-gray-500 dark:text-gray-400">Nu ai nicio comandă plasată încă.</p>
                     <Link href="/" className="mt-4 inline-block text-indigo-600 font-semibold hover:underline">Începe cumpărăturile</Link>
                   </div>
                 ) : (
                   <ul className="space-y-6">
                     {orders.map((o: any) => {
                       const statusMeta = resolveStatusMeta(o.status);
                       const awbUrl = getAwbTrackingUrl(o.awbNumber, o.awbCarrier);
                       const hasAwb = o.awbNumber && o.awbNumber !== "0";

                       return (
                         <li key={o.id} className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-900/50 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
                           <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                             <div className="space-y-2">
                                 <div className="flex flex-wrap items-center gap-3">
                                    <span className="font-bold text-lg text-gray-900 dark:text-white">Comanda #{o.orderNo}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusMeta.badge}`}>{statusMeta.label}</span>
                                 </div>
                                 <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Plasată pe: {new Date(o.createdAt).toLocaleString("ro-RO")}
                                 </div>
                                 
                                 {/* AWB Badge */}
                                 {hasAwb && (
                                   <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-600 px-3 py-1 rounded-md shadow-sm">
                                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300 font-mono">
                                        AWB: {o.awbNumber}
                                      </span>
                                      {awbUrl && (
                                        <a href={awbUrl} target="_blank" className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded hover:bg-indigo-500 uppercase tracking-wide font-bold no-underline transition-colors">
                                          Track
                                        </a>
                                      )}
                                   </div>
                                 )}
                             </div>
                             
                             <div className="text-left sm:text-right">
                                 <div className="text-xl font-bold text-gray-900 dark:text-white">{new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(o.total)}</div>
                                 <div className="text-xs text-gray-500 dark:text-gray-400">{o.itemsCount} produse</div>
                             </div>
                           </div>

                           <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                              
                              <Link 
                                href={`/account/orders/${o.id}`}
                                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                Gestionare Grafică
                              </Link>

                              <OrderDetails order={o} />
                              
                              {o.invoiceLink && (
                                <a href={o.invoiceLink} target="_blank" className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 font-semibold hover:underline px-3 py-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                  Factură
                                </a>
                              )}
                           </div>
                         </li>
                       );
                     })}
                   </ul>
                 )}
               </div>
            )}
            {tab === 'addresses' && <div className="animate-in fade-in"><AddressesManager /></div>}
            {tab === 'security' && (
              <div className="animate-in fade-in space-y-6">
                <AccountDetailsForm />
                <ChangePasswordForm />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}