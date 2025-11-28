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
    // FIX: h-[100dvh] asigură înălțimea corectă pe mobil (fără bara de browser)
    <div className="h-[100dvh] w-full overflow-hidden bg-[#05070f] text-zinc-200 font-sans selection:bg-indigo-500/30 fixed inset-0">
      {/* Global Admin Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[100px] opacity-30" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02]" /> 
      </div>

      {session ? (
        // Layout Flexibil: Sidebar Fix + Conținut Scrollabil
        <div className="relative z-10 flex h-full w-full overflow-hidden">
          {/* Sidebar-ul rămâne vizibil pe desktop, ascuns implicit pe mobil de componenta AdminSidebar */}
          <div className="hidden lg:block h-full shrink-0">
             <AdminSidebar />
          </div>
          {/* Pe mobil, AdminSidebar e probabil un overlay sau meniu burger gestionat intern */}
          <div className="lg:hidden absolute top-4 left-4 z-50">
             {/* Aici ar veni butonul de meniu mobil dacă nu e inclus în AdminSidebar */}
             <AdminSidebar />
          </div>

          {/* Zona Principală de Conținut */}
          <main className="flex-1 flex flex-col h-full w-full min-w-0 bg-transparent lg:ml-72 transition-all duration-300">
            {/* Wrapper Scrollabil:
               - overflow-y-auto: permite scroll doar aici
               - h-full: ocupă tot ecranul vertical
               - p-0 pe mobil: pentru ca chat-ul să fie full screen
            */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-0 sm:p-4 lg:p-6 w-full h-full scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              <div className="w-full h-full max-w-[1920px] mx-auto flex flex-col">
                {children}
              </div>
            </div>
          </main>
        </div>
      ) : (
        // Layout Login
        <div className="relative z-10 h-full flex flex-col overflow-y-auto">
          {children}
        </div>
      )}
    </div>
  );
}