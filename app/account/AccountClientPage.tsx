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
          <aside className="w-full lg:w-72 shrink-0">
            <AccountNavTab activeTab={tab} onTabChange={handleTabChange} />
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            {tab === 'orders' && (
              <div className="animate-in fade-in slide-in-from-bottom-2">
                <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white">Istoric comenzi</h2>
                <AccountOrdersList orders={orders} />
              </div>
            )}
            {tab === 'addresses' && (
              <div className="animate-in fade-in">
                <h2 className="text-2xl font-bold mb-6 pb-4 border-b border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white">Adrese de livrare</h2>
                <AddressesManager />
              </div>
            )}
            {tab === 'security' && (
              <div className="animate-in fade-in space-y-6">
                <h2 className="text-2xl font-bold pb-4 border-b border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white">Securitate & Parolă</h2>
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