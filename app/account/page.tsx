import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/SignOutButton";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import RequestPasswordReset from "@/components/RequestPasswordReset";
import AddressesManager from "@/components/AddressesManager";
import OrderDetails from '@/components/OrderDetails';

// Forțează randare dinamică ca să nu fie folosită o versiune cache care ar pierde sesiunea
export const dynamic = 'force-dynamic';

export default async function AccountPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const session = await getAuthSession();
  // Citește query param welcome=1 pentru banner succes
  const showWelcome =
    (typeof searchParams?.welcome === "string" && searchParams?.welcome === "1") ||
    (Array.isArray(searchParams?.welcome) && searchParams?.welcome?.includes("1"));
  if (!session?.user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold mb-4">Cont</h1>
        <p className="text-muted">Nu ești autentificat(ă). Este posibil ca sesiunea să nu fie încă încărcată sau cookie-ul să fi expirat. <a className="text-indigo-400 underline" href="/login">Mergi la login</a>.</p>
      </div>
    );
  }

  // Stats & orders (consolidated view)
  const userId = (session.user as any).id as string;
  const ordersAll = await prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, include: { items: true } });
  const totalOrders = ordersAll.length;
  const totalSpent = ordersAll.reduce((acc, o) => acc + Number(o.total || 0), 0);
  const orders = ordersAll.slice(0, 50).map((o: any) => ({
    id: o.id,
    orderNo: o.orderNo,
    createdAt: o.createdAt,
    status: o.status,
    canceledAt: o.canceledAt || null,
    total: Number(o.total),
    paymentType: o.paymentType,
    items: (o.items || []).map((it: any) => ({ name: it.name, qty: it.qty, unit: Number(it.unit), total: Number(it.total) })),
    itemsCount: o.items.length,
    awbNumber: o.awbNumber,
    awbCarrier: o.awbCarrier,
    invoiceLink: o.invoiceLink,
    address: o.address,
    billing: o.billing,
    shippingFee: Number(o.shippingFee ?? 0),
  }));

  // Adresele sunt gestionate de componenta client `AddressesManager`

  // Load last billing info from latest order
  const lastBillingOrder = await prisma.order.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { billing: true },
  });
  const billing = (lastBillingOrder?.billing as any) || null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left column: profile & quick actions */}
        <aside className="col-span-1 space-y-4">
          <div className="panel p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">{(session.user.name || session.user.email || '').slice(0,1).toUpperCase()}</div>
              <div>
                <div className="font-semibold">{session.user.name || session.user.email}</div>
                <div className="text-xs text-muted">{session.user.email}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xs text-muted">Comenzi</div>
                <div className="font-semibold">{totalOrders}</div>
              </div>
              <div>
                <div className="text-xs text-muted">Cheltuit</div>
                <div className="font-semibold">{new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(totalSpent)}</div>
              </div>
              <div>
                <div className="text-xs text-muted">Cont</div>
                <div className="font-semibold">Activ</div>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <a href="#orders" className="block text-sm px-3 py-2 rounded hover:bg-gray-100">Comenzi</a>
              <a href="#invoices" className="block text-sm px-3 py-2 rounded hover:bg-gray-100">Facturi</a>
              <a href="#addresses" className="block text-sm px-3 py-2 rounded hover:bg-gray-100">Adrese</a>
              <a href="#billing" className="block text-sm px-3 py-2 rounded hover:bg-gray-100">Date facturare</a>
            </div>
          </div>

          <div className="panel p-4">
            <div className="text-xs text-muted">Ultima activitate</div>
            <div className="text-sm mt-2">{orders[0] ? new Date(orders[0].createdAt).toLocaleString('ro-RO') : '—'}</div>
          </div>

          <div className="panel p-4">
            <div className="text-xs text-muted">Acțiuni rapide</div>
            <div className="mt-2 flex flex-col gap-2">
              <a href="/checkout" className="block text-sm px-3 py-2 rounded bg-indigo-50 text-indigo-700 text-center">Reia cumpărăturile</a>
              <a href="/contact" className="block text-sm px-3 py-2 rounded border text-center">Contact suport</a>
            </div>
          </div>
        </aside>

        {/* Right column: main content */}
        <main className="col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Salut, {session.user.name || session.user.email}</h1>
              <p className="text-sm text-muted">Panou de control al contului tău — toate datele într-o singură pagină.</p>
            </div>
          </div>
      {showWelcome && (
        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-300 text-sm">
          Cont creat cu succes. Te-ai autentificat automat.
        </div>
      )}
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-5 flex flex-col gap-2">
          <div className="text-xs uppercase tracking-wide text-muted">Comenzi</div>
          <div className="text-3xl font-bold">{totalOrders}</div>
          <div className="text-[11px] text-muted">Total plasate</div>
        </div>
        <div className="panel p-5 flex flex-col gap-2">
          <div className="text-xs uppercase tracking-wide text-muted">Total cheltuit</div>
          <div className="text-3xl font-bold">{new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(totalSpent)}</div>
          <div className="text-[11px] text-muted">Include transport</div>
        </div>
        <div className="panel p-5 flex flex-col gap-2">
          <div className="text-xs uppercase tracking-wide text-muted">Email</div>
          <div className="text-sm font-medium truncate" title={String(session.user.email)}>{session.user.email}</div>
          <div className="text-[11px] text-muted">Autentificat</div>
        </div>
      </div>

          {/* Orders */}
          <section id="orders" className="panel">
            <div className="p-4 flex items-center justify-between">
              <div className="font-semibold flex items-center gap-2">Comenzi</div>
              <div className="text-sm text-muted">Total: {totalOrders}</div>
            </div>
            {orders.length === 0 ? (
              <div className="p-4 text-sm text-muted">Nu ai comenzi încă.</div>
            ) : (
              <ul className="divide-y divide-white/10">
                {orders.map((o: any) => (
                  <li key={o.id} className="p-4 hover:bg-surface/40 transition">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Comanda #{o.orderNo}</div>
                            <div className="text-xs text-muted">{new Date(o.createdAt).toLocaleString('ro-RO')}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold">{new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(o.total)}</div>
                            <div className="text-xs mt-1">{o.itemsCount} produse • {o.paymentType}</div>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-muted">Status</div>
                            <div className={`font-semibold ${o.status === 'canceled' ? 'text-red-500' : o.status === 'fulfilled' ? 'text-green-500' : 'text-yellow-500'}`}>{o.status === 'canceled' ? 'Anulată' : o.status === 'fulfilled' ? 'Finalizată' : 'În lucru'}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted">Livrare</div>
                            <div className="font-medium">{o.address?.nume_prenume || o.address?.name}</div>
                            <div className="text-xs text-muted">{o.address?.strada_nr}, {o.address?.localitate}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted">Factură / AWB</div>
                            {o.invoiceLink ? <a href={o.invoiceLink} target="_blank" rel="noreferrer" className="text-indigo-400 underline text-sm block">Descarcă factura</a> : <div className="text-xs text-muted">Factura nu este emisă</div>}
                            {o.awbNumber ? (
                              <div className="text-sm mt-1 flex items-center gap-2">
                                AWB: <span className="font-medium">{o.awbNumber}</span>
                                {o.awbCarrier && o.awbNumber && (() => {
                                  const awbClean = encodeURIComponent(o.awbNumber);
                                  const carrierLower = o.awbCarrier.toLowerCase();
                                  let url = null;
                                  if (carrierLower.includes('dpd')) url = `https://www.dpd.com/ro/ro/awb-tracking/?awb=${awbClean}`;
                                  if (carrierLower.includes('fan')) url = `https://www.fancourier.ro/awb-tracking/?awb=${awbClean}`;
                                  if (carrierLower.includes('sameday')) url = `https://sameday.ro/awb-tracking/?awb=${awbClean}`;
                                  return url ? <a href={url} target="_blank" rel="noreferrer" className="ml-2 text-indigo-500 underline text-xs rounded px-2 py-1 bg-indigo-50 hover:bg-indigo-100 transition">Verifică AWB</a> : null;
                                })()}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-3">
                          {/* @ts-ignore Server->Client import allowed */}
                          <OrderDetails order={o} />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Invoices (aggregate from orders) */}
          <section id="invoices" className="panel">
            <div className="p-4 flex items-center justify-between">
              <div className="font-semibold">Facturi</div>
              <div className="text-sm text-muted">{orders.filter((o: any) => o.invoiceLink).length} emise</div>
            </div>
            <div className="p-4">
              {orders.filter((o: any) => o.invoiceLink).length === 0 ? (
                <div className="text-sm text-muted">Nu există facturi emise încă.</div>
              ) : (
                <ul className="space-y-2">
                  {orders.filter((o: any) => o.invoiceLink).map((o: any) => (
                    <li key={o.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Comanda #{o.orderNo}</div>
                        <div className="text-xs text-muted">{new Date(o.createdAt).toLocaleString('ro-RO')}</div>
                      </div>
                      <div>
                        <a href={o.invoiceLink} target="_blank" rel="noreferrer" className="text-indigo-400 underline">Descarcă</a>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Addresses manager (embedded) */}
          <section id="addresses" className="panel">
            <div className="p-4">
              <div className="font-semibold mb-2">Adrese</div>
              <AddressesManager />
            </div>
          </section>

          {/* Billing (latest) */}
          <section id="billing" className="panel p-4">
            <div className="font-semibold">Date facturare</div>
            {!billing ? (
              <div className="text-sm text-muted">Nu există date de facturare încă.</div>
            ) : (
              <div className="text-sm space-y-1 mt-2">
                {(() => {
                  const tip = billing?.tip_factura || billing?.type || 'persoana_fizica';
                  if (tip === 'firma' || tip === 'juridica' || tip === 'company') {
                    return (
                      <>
                        <div className="text-muted text-xs">Companie</div>
                        <div className="font-medium">{billing?.denumire_companie || billing?.name || '-'}</div>
                        <div>CUI: {billing?.cui || billing?.cif || '-'}</div>
                        <div>{billing?.strada_nr || '-'}, {billing?.localitate || '-'}, {billing?.judet || '-'}{billing?.postCode ? `, ${billing?.postCode}` : ''}</div>
                      </>
                    );
                  }
                  return (
                    <>
                      <div className="text-muted text-xs">Persoană fizică</div>
                      {billing?.name && <div className="font-medium">{billing?.name}</div>}
                      <div>{billing?.strada_nr || '-'}, {billing?.localitate || '-'}, {billing?.judet || '-'}{billing?.postCode ? `, ${billing?.postCode}` : ''}</div>
                    </>
                  );
                })()}
              </div>
            )}
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <ChangePasswordForm />
            <RequestPasswordReset email={String(session.user.email || "")} />
          </div>
          <div>
            <SignOutButton />
          </div>
        </main>
      </div>
    </div>
  );
}
