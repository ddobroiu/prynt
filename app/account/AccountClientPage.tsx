"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import OrdersList from "./orders/page"; 
import AddressesManager from "@/components/AddressesManager";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { SignOutButton } from "@/components/SignOutButton";

export default function AccountClientPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Tab-ul implicit este 'orders', dar verificăm URL-ul pentru '?tab=...'
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
    // Dacă parametrul este 'graphics', îl ignorăm sau îl trimitem la orders, 
    // deoarece funcționalitatea a fost eliminată.
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
               <h2 className="text-xl font-semibold mb-6 pb-4 border-b dark:border-gray-700">Istoric comenzi</h2>
               <OrdersList />
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