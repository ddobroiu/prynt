import { cookies } from 'next/headers';
import { verifyAdminSession } from '@/lib/adminSession'; // Ajustează calea importului dacă e necesar
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import UsersDashboard from './UsersDashboard';
import { Users, UserPlus, Wallet } from 'lucide-react';

export const dynamic = 'force-dynamic';

function fmtRON(n: number) {
  return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 0 }).format(n);
}

export default async function UsersPage() {
  // 1. Verificare Auth
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth')?.value;
  const session = verifyAdminSession(token);

  if (!session) {
    redirect("/admin/login");
  }

  // 2. Preluare Date
  // Luăm userii și includem comenzile pentru a calcula totalurile
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orders: {
        select: {
          total: true,
          createdAt: true,
          status: true
        }
      },
      addresses: {
        where: { isDefault: true },
        take: 1
      }
    }
  });

  // 3. Calcul Statistici
  const totalUsers = users.length;
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  const stats = users.reduce((acc, user) => {
    // Calculăm totalul cheltuit per user (doar comenzi neanulate)
    const spent = user.orders
      .filter(o => o.status !== 'canceled')
      .reduce((sum, o) => sum + Number(o.total || 0), 0);
    
    acc.totalSpentGlobal += spent;

    // Useri noi (ultimele 24h)
    const createdTime = new Date(user.createdAt).getTime();
    if (now - createdTime < oneDay) {
      acc.newToday += 1;
    }

    return acc;
  }, { totalSpentGlobal: 0, newToday: 0 });

  const averageValue = totalUsers > 0 ? stats.totalSpentGlobal / totalUsers : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-2 p-4 md:p-8 bg-gray-50/50 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Clienți</h1>
          <p className="text-gray-500 mt-1">Gestionează baza de date cu clienți.</p>
        </div>
      </div>

      {/* Statistici Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total Clienți */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Clienți</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">{totalUsers}</h3>
            </div>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="flex items-center text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
              +{stats.newToday}
            </span>
            <span className="text-gray-500">înregistrați azi</span>
          </div>
        </div>

        {/* Valoare Totală Clienți */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
           <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Valoare Portofoliu</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">{fmtRON(stats.totalSpentGlobal)}</h3>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Wallet size={20} />
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Suma totală a comenzilor finalizate
          </div>
        </div>

        {/* Medie per Client */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
           <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Valoare Medie / Client</p>
              <h3 className="mt-2 text-2xl font-bold text-gray-900">{fmtRON(averageValue)}</h3>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <UserPlus size={20} />
            </div>
          </div>
           <div className="mt-4 text-xs text-gray-500">
            Venit mediu generat de un client
          </div>
        </div>
      </div>

      {/* Dashboard Component */}
      <UsersDashboard users={users} />
    </div>
  );
}