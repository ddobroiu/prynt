"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import AddressesManager from "@/components/AddressesManager";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import AccountDetailsForm from "@/components/AccountDetailsForm";
import SignOutButton from "@/components/SignOutButton";
import AccountOrdersList from "@/components/AccountOrdersList";
import AccountNavTab from "@/components/AccountNavTab";
import BillingSection from "@/components/BillingSection";
import PaymentMethodsManager from "@/components/PaymentMethodsManager";

interface AccountClientPageProps {
  orders?: any[];
  billing?: any;
  session?: any;
}

export default function AccountClientPage({ orders = [] }: AccountClientPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'profile' | 'orders' | 'billing' | 'addresses' | 'payment-methods' | 'favorites' | 'security'>('profile');

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'security') setTab('security');
    else if (tabParam === 'addresses') setTab('addresses');
    else if (tabParam === 'orders') setTab('orders');
    else if (tabParam === 'billing') setTab('billing');
    else if (tabParam === 'payment-methods') setTab('payment-methods');
    else if (tabParam === 'favorites') setTab('favorites');
    else if (tabParam === 'profile') setTab('profile');
  }, [searchParams]);

  const handleTabChange = (newTab: 'profile' | 'orders' | 'billing' | 'addresses' | 'payment-methods' | 'favorites' | 'security') => {
    setTab(newTab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', newTab);
    window.history.pushState({}, '', url);
  };

  if (status === "loading") return <div className="p-10 text-center text-gray-600 dark:text-gray-400">Se încarcă...</div>;
  if (!session) return null; 

  // Calculăm statistici pentru dashboard
  const stats = {
    totalOrders: orders.length,
    activeOrders: orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length,
    totalSpent: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    lastOrderDate: orders.length > 0 ? new Date(orders[0].createdAt).toLocaleDateString('ro-RO') : null
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-xl">
                  {(session.user?.name?.[0] || session.user?.email?.[0] || "U").toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-800 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-600 bg-clip-text text-transparent">
                  Bun venit înapoi!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  <span className="font-semibold text-gray-800 dark:text-white">{session.user?.name || session.user?.email}</span>
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Comenzi totale</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeOrders}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">În progres</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(stats.totalSpent)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total cheltuit</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{stats.lastOrderDate || 'N/A'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ultima comandă</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <SignOutButton />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR */}
          <aside className="w-full lg:w-72 shrink-0 animate-in fade-in slide-in-from-left-4" style={{ animationDelay: "100ms" }}>
            <div className="sticky top-20">
              <AccountNavTab activeTab={tab} onTabChange={handleTabChange} />
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200/60 dark:border-gray-700/60">
            {tab === 'profile' && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Profilul meu</h2>
                      <p className="text-gray-600 dark:text-gray-400">Gestionează informațiile personale</p>
                    </div>
                  </div>
                  <AccountDetailsForm />
                </div>
              </div>
            )}

            {tab === 'orders' && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Comenzile mele</h2>
                      <p className="text-gray-600 dark:text-gray-400">Vizionează și urmărește toate comenzile tale</p>
                    </div>
                  </div>
                  <AccountOrdersList orders={orders} />
                </div>
              </div>
            )}

            {tab === 'billing' && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Facturi & Plăți</h2>
                      <p className="text-gray-600 dark:text-gray-400">Istoric financiar și facturi descărcabile</p>
                    </div>
                  </div>
                  <BillingSection orders={orders} />
                </div>
              </div>
            )}

            {tab === 'addresses' && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Adrese de livrare</h2>
                      <p className="text-gray-600 dark:text-gray-400">Gestionează adresele tale de livrare</p>
                    </div>
                  </div>
                  <AddressesManager />
                </div>
              </div>
            )}

            {tab === 'payment-methods' && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                <PaymentMethodsManager />
              </div>
            )}

            {tab === 'favorites' && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Produse favorite</h2>
                      <p className="text-gray-600 dark:text-gray-400">Configurații și produse salvate pentru mai târziu</p>
                    </div>
                  </div>
                  <div className="bg-linear-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-rose-200/50 dark:border-rose-700/50">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Niciun produs favorit încă</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Salvează produsele și configurațiile tale preferate pentru a le accesa rapid.
                      </p>
                      <button className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Explorează produsele
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'security' && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Securitate</h2>
                      <p className="text-gray-600 dark:text-gray-400">Gestionează setările de securitate ale contului</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <ChangePasswordForm />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}