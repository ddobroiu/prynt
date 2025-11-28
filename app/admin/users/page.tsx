import { cookies } from 'next/headers';
import { verifyAdminSession } from '@/lib/adminSession';
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

  // 2. Preluare Date Brute din Baza de Date
  const usersRaw = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orders: {
        select: {
          id: true,
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

  // --- BACKUP: preluăm toate comenzile pentru a include acele comenzi care NU
  // au fost legate de un `userId` (de ex. checkout guest). Astfel putem mapa
  // comenzile după adresă/email la utilizatorii existenți și calcula totalul.
  const allOrdersForEmailMatch = await prisma.order.findMany({
    select: { id: true, total: true, createdAt: true, status: true, userId: true, address: true }
  });

  // 3. Procesare și Serializare Date (FIXUL PRINCIPAL)
  // Convertim Decimal -> Number și Date -> String pentru a fi citite corect de React
  const users = (usersRaw as any[]).map((user: any) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
    // Atașăm comenzile incluse, dar transformăm Decimal -> Number.
    orders: (user.orders || []).map((order: any) => ({
      ...order,
      total: Number(order.total), // Aici transformăm Decimal în Number simplu
      createdAt: order.createdAt.toISOString()
    })),
    addresses: user.addresses
  }));

  // Mapăm comenzile fără userId după email din câmpul address (lowercase)
  const ordersByEmail = new Map();
  for (const o of allOrdersForEmailMatch) {
    try {
      const addr = (o.address || {}) as any;
      const email = (addr.email || '').toLowerCase();
      if (!email) continue;
      const arr = ordersByEmail.get(email) || [];
      arr.push({ id: o.id, total: Number(o.total), status: o.status });
      ordersByEmail.set(email, arr);
    } catch (e) {
      // ignore malformed address
    }
  }

  // Dacă un user nu are comenzi legate direct (orders[]), atașăm comenzile găsite
  // prin email pentru a afișa corect 'Total Cheltuit'.
  const usersWithMergedOrders = (users as any[]).map((u: any) => {
    const existing = Array.isArray(u.orders) ? u.orders : [];
    if (existing.length === 0) {
      const fallback = ordersByEmail.get((u.email || '').toLowerCase()) || [];
      return { ...u, orders: fallback };
    }
    return u;
  });

  // 4. Calcul Statistici Globale
  const totalUsers = users.length;
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  const stats = usersWithMergedOrders.reduce((acc, user) => {
    // Calculăm totalul cheltuit per user (doar comenzi valide, neanulate)
    const spent = (user.orders || [])
      .filter((o: any) => o.status !== 'canceled')
      .reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    
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
    <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-2 p-3 sm:p-4 md:p-8 bg-gray-50/50 min-h-screen pb-safe">
      
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Clienți</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Gestionează baza de date cu clienți.</p>
        </div>
      </div>

      {/* Statistici Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        {/* Total Clienți */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-gray-200 touch-manipulation">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Total Clienți</p>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">{totalUsers}</h3>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <Users size={18} className="sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs">
            <span className="flex items-center text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
              +{stats.newToday}
            </span>
            <span className="text-gray-500">înregistrați azi</span>
          </div>
        </div>

        {/* Valoare Totală Clienți */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-gray-200 touch-manipulation">
           <div className="flex items-start justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Valoare Portofoliu</p>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">{fmtRON(stats.totalSpentGlobal)}</h3>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
              <Wallet size={18} className="sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4 text-xs text-gray-500">
            Suma totală a comenzilor (fără anulate)
          </div>
        </div>

        {/* Medie per Client */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 shadow-sm border border-gray-200 touch-manipulation">
           <div className="flex items-start justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Valoare Medie / Client</p>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900">{fmtRON(averageValue)}</h3>
            </div>
            <div className="p-1.5 sm:p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
              <UserPlus size={18} className="sm:w-5 sm:h-5" />
            </div>
          </div>
           <div className="mt-3 sm:mt-4 text-xs text-gray-500">
            Venit mediu generat de un client
          </div>
        </div>
      </div>

      {/* Dashboard Component - primește datele curate */}
      <UsersDashboard users={usersWithMergedOrders} />
    </div>
  );
}