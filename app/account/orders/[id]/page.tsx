import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function fmtRON(n: number) {
  return new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", maximumFractionDigits: 2 }).format(n);
}

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session?.user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold mb-4">Detalii comandă</h1>
        <p className="text-muted">Trebuie să fii autentificat(ă). <a className="text-indigo-400 underline" href="/login">Mergi la login</a>.</p>
      </div>
    );
  }

  const userId = (session.user as any).id as string;
  const order = await prisma.order.findFirst({
    where: { id: params.id, userId },
    include: { items: true },
  });
  if (!order) return notFound();

  const address = order.address as any;
  const billing = order.billing as any;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Comanda #{order.orderNo}</h1>
        <Link href="/account/orders" className="text-sm text-indigo-400 underline">Înapoi la comenzi</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-md border border-[--border] p-4">
          <div className="text-sm text-muted">Plată</div>
          <div className="font-medium">{order.paymentType}</div>
          <div className="text-sm text-muted mt-2">Data</div>
          <div className="font-medium">{new Date(order.createdAt).toLocaleString("ro-RO")}</div>
          <div className="text-sm text-muted mt-2">Total</div>
          <div className="font-medium">{fmtRON(Number(order.total))}</div>
          {order.invoiceLink ? (
            <a href={order.invoiceLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-indigo-400 underline">Descarcă factura</a>
          ) : null}
        </div>

        <div className="rounded-md border border-[--border] p-4">
          <div className="text-sm text-muted">Livrare</div>
          <div className="font-medium">{address?.nume_prenume}</div>
          <div className="text-sm text-muted">{address?.telefon} · {address?.email}</div>
          <div className="mt-2 text-sm">{address?.strada_nr}, {address?.localitate}, {address?.judet}{address?.postCode ? `, ${address.postCode}` : ''}</div>
        </div>
      </div>

      <div className="rounded-md border border-[--border] p-4">
        <div className="font-semibold mb-3">Produse</div>
        <ul className="divide-y divide-white/10">
          {order.items.map((it: any) => (
            <li key={it.id} className="py-2 flex items-center justify-between">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-xs text-muted">x{it.qty}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted">Preț unitar: {fmtRON(Number(it.unit))}</div>
                <div className="font-medium">{fmtRON(Number(it.total))}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
