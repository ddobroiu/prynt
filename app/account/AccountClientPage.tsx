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
    <div className="min-h-screen bg-linear-to-b from-gray-50 via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {(session.user?.name?.[0] || session.user?.email?.[0] || "U").toUpperCase()}
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-indigo-900 dark:from-indigo-400 dark:to-indigo-600 bg-clip-text text-transparent">Contul meu</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Bun venit, <span className="font-semibold text-gray-800 dark:text-white">{session.user?.name || session.user?.email}</span></p>
              </div>
            </div>
          </div>
          <SignOutButton />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR */}
          <aside className="w-full lg:w-72 shrink-0 animate-in fade-in slide-in-from-left-4" style={{ animationDelay: "100ms" }}>
            <div className="sticky top-20">
              <AccountNavTab activeTab={tab} onTabChange={handleTabChange} />
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-10 shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(249,250,251,0.9) 100%)" }}>
            {tab === 'orders' && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Istoric comenzi</h2>
                    <p className="text-gray-600 dark:text-gray-400">Vizionează și gestionează toate comenzile tale</p>
                  </div>
                  <AccountOrdersList orders={orders} />
                </div>
              </div>
            )}
            {tab === 'addresses' && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Adrese de livrare</h2>
                    <p className="text-gray-600 dark:text-gray-400">Gestionează adresele tale de livrare</p>
                  </div>
                  <AddressesManager />
                </div>
              </div>
            )}
            {tab === 'security' && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Securitate & Parolă</h2>
                    <p className="text-gray-600 dark:text-gray-400">Protejează-ți contul și confidențialitatea datelor</p>
                  </div>
                  <div className="space-y-6">
                    <div className="p-6 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <AccountDetailsForm />
                    </div>
                    <div className="p-6 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <ChangePasswordForm />
                    </div>
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