import { cookies } from 'next/headers';
import { verifyAdminSession } from '../../../lib/adminSession';
import { listOrders } from '../../../lib/orderStore';
import OrdersDashboard from './OrdersDashboard'; // Import the new client component

function fmtRON(n: number) {
  return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 2 }).format(n);
}

function normalizeStatus(status?: string | null): 'in_progress' | 'fulfilled' | 'canceled' {
  if (status === 'fulfilled') return 'fulfilled';
  if (status === 'canceled') return 'canceled';
  return 'in_progress';
}

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth')?.value;
  const session = verifyAdminSession(token);

  if (!session) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#04060c] text-ui">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.35),_transparent_55%)]" />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-indigo-300">Panou administrare</p>
            <h1 className="mt-4 text-3xl font-bold">Acces restricționat</h1>
            <p className="mt-3 text-muted">
              Te rugăm să te autentifici pentru a vedea comenzile și acțiunile disponibile.
            </p>
            <a
              href="/admin/login"
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-400 to-sky-400 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:scale-[1.01]"
            >
              Intră în panou
            </a>
          </div>
        </div>
      </main>
    );
  }

  // Fetch all orders for stats - This could be slow with many orders.
  // A dedicated stats API endpoint would be a future optimization.
  const allOrders = await listOrders(10000); 

  const now = Date.now();
  const totals = allOrders.reduce(
    (acc, order) => {
      const total = Number(order.total || 0);
      const statusKey = normalizeStatus((order as any).status);
      acc.totalValue += total;
      acc[statusKey] += 1;
      const createdAt = order.createdAt ? new Date(order.createdAt).getTime() : 0;
      if (createdAt && createdAt >= now - 24 * 60 * 60 * 1000) acc.last24h += 1;
      return acc;
    },
    { totalValue: 0, in_progress: 0, fulfilled: 0, canceled: 0, last24h: 0 }
  );
  const totalOrders = allOrders.length;
  const averageValue = totalOrders ? totals.totalValue / totalOrders : 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070f] text-ui">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.35),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 translate-x-1/3 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.25),_transparent_65%)] blur-3xl" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-300">Admin</p>
            <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">Panou Comenzi</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Gestionează comenzile, filtrează, caută și monitorizează statusul în timp real.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <span aria-hidden>↩</span>
              Înapoi la site
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
            <div className="text-sm text-muted">Total comenzi</div>
            <div className="mt-2 text-3xl font-semibold text-white">{totalOrders}</div>
            <div className="mt-1 text-xs text-muted">Ultimele 24h: {totals.last24h}</div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-indigo-500/20" />
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
            <div className="text-sm text-muted">Valoare totală</div>
            <div className="mt-2 text-3xl font-semibold text-white">{fmtRON(totals.totalValue)}</div>
            <div className="mt-1 text-xs text-muted">Medie comandă: {fmtRON(averageValue)}</div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-emerald-500/20" />
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
            <div className="text-sm text-muted">În lucru</div>
            <div className="mt-2 text-3xl font-semibold text-white">{totals.in_progress}</div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-amber-500/20" />
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg">
            <div className="text-sm text-muted">Finalizate & Anulate</div>
            <div className="mt-2 text-3xl font-semibold text-white">{totals.fulfilled}</div>
            <div className="mt-1 text-xs text-muted">Anulate: {totals.canceled}</div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-rose-500/10" />
          </div>
        </div>

        {/* Interactive Orders Dashboard */}
        <div className="mt-10">
          <OrdersDashboard />
        </div>
      </div>
    </main>
  );
}
