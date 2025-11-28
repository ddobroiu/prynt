import React from 'react';
import { cookies } from 'next/headers';
import { verifyAdminSession } from '@/lib/adminSession';
import AdminSidebar from '@/components/AdminSidebar';

export const metadata = {
  title: 'Prynt Admin Panel',
  robots: 'noindex, nofollow',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth')?.value;
  const session = verifyAdminSession(token);

  return (
    // FIX: h-screen și overflow-hidden aici previn scroll-ul pe body care arunca meniul în sus
    <div className="h-screen overflow-hidden bg-[#05070f] text-zinc-200 font-sans selection:bg-indigo-500/30">
      {/* Global Admin Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[100px] opacity-30" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" /> 
      </div>

      {session ? (
        // Layout pentru admin autentificat
        <div className="relative z-10 flex h-screen overflow-hidden">
          {/* Sidebar-ul rămâne fix (presupunând că AdminSidebar are poziționare fixă sau este în flux) */}
          <AdminSidebar />
          
          {/* FIX: main are h-full și gestionează scroll-ul DOAR pentru conținut */}
          <main className="flex-1 lg:ml-72 transition-all duration-300 flex flex-col h-full overflow-hidden bg-transparent">
            {/* Containerul de scroll pentru pagini */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 w-full scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              <div className="max-w-[1920px] mx-auto w-full h-full flex flex-col">
                {children}
              </div>
            </div>
          </main>
        </div>
      ) : (
        // Layout pentru login / neautentificat
        <div className="relative z-10 min-h-screen flex flex-col overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}