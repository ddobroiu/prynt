import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

  const found = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    include: { items: { select: { id: true } } },
  });
  const orders = found.map((o: any) => ({
    id: o.id,
    orderNo: o.orderNo,
    createdAt: o.createdAt,
    total: Number(o.total),
    paymentType: o.paymentType,
    itemsCount: o.items.length,
    awbNumber: o.awbNumber,
    awbCarrier: o.awbCarrier,
    invoiceLink: o.invoiceLink,
  }));

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-2xl font-bold mb-6">Comenzile mele</h1>
      {orders.length === 0 ? (
        <div className="rounded-md border border-[--border] p-6 text-muted">Nu ai comenzi încă.</div>
      ) : (
        <ul className="divide-y divide-white/10 rounded-md border border-[--border]">
          {orders.map((o: any) => (
            <li key={o.id} className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">Comanda #{o.orderNo}</div>
                                <div className="text-xs mt-1">
                                  Status: <span className={`font-semibold ${o.status === 'canceled' ? 'text-red-500' : o.status === 'fulfilled' ? 'text-green-500' : 'text-yellow-500'}`}>{o.status === 'canceled' ? 'Anulată' : o.status === 'fulfilled' ? 'Finalizată' : 'În lucru'}</span>
                                </div>
                <div className="text-xs text-muted">{new Date(o.createdAt).toLocaleString("ro-RO")}</div>
                <div className="text-xs text-muted">{o.itemsCount} produse • {o.paymentType}</div>
                {o.awbNumber ? (
                  <div className="text-xs mt-1">
                    AWB: <span className="font-semibold">{o.awbNumber}</span> {o.awbCarrier ? <span className="text-muted">({o.awbCarrier})</span> : null}
                    <a href={`https://tracking.dpd.ro/`} target="_blank" rel="noopener noreferrer" className="ml-2 text-indigo-400 underline">Urmărește coletul</a>
                  </div>
                ) : null}
                {o.invoiceLink ? (
                  <div className="text-xs mt-1">
                    <a href={o.invoiceLink} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">Descarcă factura</a>
                  </div>
                ) : null}
              </div>
              <div className="text-right">
                <div className="font-bold">{new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(o.total)}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
