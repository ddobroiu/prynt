import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function OrdersPage() {
  const session = await getAuthSession();
  if (!session?.user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold mb-4">Comenzile mele</h1>
        <p className="text-muted">Trebuie să fii autentificat(ă). <a className="text-indigo-400 underline" href="/login">Loghează-te</a>.</p>
      </div>
    );
  }

  let orders: Array<{ id: string; orderNo: number; createdAt: Date; total: number; paymentType: string; itemsCount: number }> = [];
  if (process.env.DATABASE_URL) {
    const found = await prisma.order.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: 'desc' },
      include: { items: { select: { id: true } } },
    });
    orders = found.map((o) => ({ id: o.id, orderNo: o.orderNo, createdAt: o.createdAt, total: Number(o.total), paymentType: o.paymentType, itemsCount: o.items.length }));
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">Comenzile mele</h1>
      {(!orders || orders.length === 0) ? (
        <div className="rounded-md border border-[--border] p-6 text-muted">Nu ai comenzi încă.</div>
      ) : (
        <ul className="divide-y divide-white/10 rounded-md border border-[--border]">
          {orders.map((o) => (
            <li key={o.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">Comanda #{o.orderNo}</div>
                <div className="text-xs text-muted">{new Date(o.createdAt).toLocaleString('ro-RO')}</div>
                <div className="text-xs text-muted">{o.itemsCount} produse • {o.paymentType}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">{new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(o.total)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
