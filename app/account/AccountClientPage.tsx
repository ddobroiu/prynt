"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// ... importurile tale existente (componentele UI etc.)
import UserDetailsForm from "@/components/UserDetailsForm";
import AddressesManager from "@/components/AddressesManager";
import UserGraphicsManager from "@/components/UserGraphicsManager";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

export default function AccountClientPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'graphics'>('profile');

  // 1. Redirect dacă nu e logat
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 2. Curățare URL de Facebook hash (#_=_), doar vizual
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#_=_") {
      // Rescrie URL-ul fără hash, fără a reîncărca pagina
      const cleanUrl = window.location.href.split("#")[0];
      window.history.replaceState(null, "", cleanUrl);
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Redirect-ul se ocupă de asta
  }

  const user = session.user as any;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Meniu */}
        <aside className="w-full md:w-64 space-y-2">
          <div className="p-4 bg-white shadow rounded-lg mb-4">
            <p className="text-sm text-gray-500">Bun venit,</p>
            <p className="font-bold text-gray-800 truncate">{user?.name || user?.email}</p>
          </div>
          
          <nav className="flex flex-col space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-left rounded-lg transition ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            >
              Detalii Cont
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`px-4 py-2 text-left rounded-lg transition ${activeTab === 'addresses' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            >
              Adrese Livrare
            </button>
            <button
              onClick={() => setActiveTab('graphics')}
              className={`px-4 py-2 text-left rounded-lg transition ${activeTab === 'graphics' ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            >
              Grafica Mea
            </button>
            <Link 
              href="/account/orders"
              className="px-4 py-2 text-left rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition"
            >
              Istoric Comenzi
            </Link>
            <div className="pt-4">
              <SignOutButton />
            </div>
          </nav>
        </aside>

        {/* Content Principal */}
        <main className="flex-1 bg-white shadow rounded-lg p-6 min-h-[500px]">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-bold mb-6 pb-2 border-b">Detalii Personale</h2>
              <UserDetailsForm user={user} />
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h2 className="text-xl font-bold mb-6 pb-2 border-b">Carnet de Adrese</h2>
              <AddressesManager />
            </div>
          )}

          {activeTab === 'graphics' && (
            <div>
              <h2 className="text-xl font-bold mb-6 pb-2 border-b">Fișiere Grafice Încărcate</h2>
              <p className="text-sm text-gray-500 mb-4">Aici poți vedea fișierele încărcate la comenzile anterioare.</p>
              <UserGraphicsManager />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}