import { cookies } from 'next/headers';
import { verifyAdminSession } from '@/lib/adminSession';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import UsersDashboard from './UsersDashboard';
import { Users, UserPlus, Wallet } from 'lucide-react';
import fs from 'fs';
import path from 'path';

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

  // 3. Procesare și Serializare Date (FIXUL PRINCIPAL)
  // Convertim Decimal -> Number și Date -> String pentru a fi citite corect de React
  const users = usersRaw.map(user => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
    orders: user.orders.map(order => ({
      ...order,
      total: Number(order.total), // Aici transformăm Decimal în Number simplu
      createdAt: order.createdAt.toISOString()
    })),
    addresses: user.addresses
  }));

  // 4. Calcul Statistici Globale
  const totalUsers = users.length;
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  // Pentru a ne asigura că afișăm valoarea reală a comenzilor (chiar dacă ordinele sunt înreg. separat),
  // agregăm sumele din tabela `Order` pentru utilizatorii aflați în listă.
  const userIds = users.map(u => u.id).filter(Boolean) as string[];
  let aggregated: { userId: string; _sum: { total: any } }[] = [];
  try {
    if (userIds.length > 0) {
      aggregated = await prisma.order.groupBy({
        by: ['userId'],
        where: { userId: { in: userIds }, status: { not: 'canceled' } },
        _sum: { total: true },
      }) as any;
    }
  } catch (e) {
    console.warn('[UsersPage] groupBy orders failed:', (e as any)?.message || e);
  }

  const sumsByUser: Record<string, number> = {};
  for (const row of aggregated) {
    sumsByUser[row.userId] = Number(row._sum.total ?? 0);
  }

  // Fallback: dacă proiectul rulează în mod fără DB (sau avem comenzi în .data/orders.jsonl),
  // citim fișierul local și agregăm sumele pe email pentru a le asocia utilizatorilor.
  const emailSums: Record<string, number> = {};
  try {
    const dataPath = path.join(process.cwd(), '.data', 'orders.jsonl');
    if (fs.existsSync(dataPath)) {
      const raw = await fs.promises.readFile(dataPath, 'utf8');
      const lines = raw.split(/\r?\n/).filter(Boolean);
      for (const line of lines) {
        try {
          const obj = JSON.parse(line);
          const email = (obj.address?.email || obj.billing?.email || '')?.toString().toLowerCase();
          if (!email) continue;
          const status = obj.status || 'active';
          if (status === 'canceled') continue;
          const total = Number(obj.total ?? 0) || 0;
          emailSums[email] = (emailSums[email] || 0) + total;
        } catch (_) {}
      }
    }
  } catch (e) {
    console.warn('[UsersPage] reading .data/orders.jsonl failed:', (e as any)?.message || e);
  }

  const stats = users.reduce((acc, user) => {
    // Dacă avem o sumă agregată din baza de date, o folosim; altfel, calculăm din orders incluse
    const spentFromOrders = user.orders
      .filter(o => o.status !== 'canceled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const spent = typeof sumsByUser[user.id] === 'number' ? sumsByUser[user.id] : spentFromOrders;
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
            Suma totală a comenzilor (fără anulate)
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

      {/* Dashboard Component - primește datele curate */}
      <UsersDashboard users={users} />
    </div>
  );
}