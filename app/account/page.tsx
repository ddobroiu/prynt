import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AddressesManager from "@/components/AddressesManager";
import OrderDetails from "@/components/OrderDetails";

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
  const orderRecords = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 50,
  });
  const orders = orderRecords.map((o) => {
    const items = (o.items || []).map((it: any) => ({
      name: it.name,
      qty: it.qty,
      unit: Number(it.unit),
      total: Number(it.total),
    }));
    return {
      id: o.id,
      orderNo: o.orderNo,
      createdAt: o.createdAt,
      status: o.status,
      canceledAt: o.canceledAt || null,
      total: Number(o.total),
      paymentType: o.paymentType,
      items,
      itemsCount: items.length,
      awbNumber: o.awbNumber,
      awbCarrier: o.awbCarrier,
      invoiceLink: o.invoiceLink,
      address: o.address,
      billing: o.billing,
      shippingFee: Number(o.shippingFee ?? 0),
    };
  });
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  // Adresele sunt gestionate de componenta client `AddressesManager`

  // Load last billing info from latest order
  const lastBillingOrder = await prisma.order.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { billing: true },
  });
  const billing = (lastBillingOrder?.billing as any) || null;

  const navigation = [
    { label: "Comenzi", href: "#orders" },
    { label: "Adrese", href: "#addresses" },
    { label: "Date facturare", href: "#billing" },
  ];

  const resolveStatusMeta = (status?: string | null) => {
    if (status === "fulfilled") {
      return { label: "Finalizat��", badge: "bg-emerald-500/10 text-emerald-200 border border-emerald-400/40" };
    }
    if (status === "canceled") {
      return { label: "Anulat��", badge: "bg-rose-500/10 text-rose-200 border border-rose-400/40" };
    }
    return { label: "AZn lucru", badge: "bg-amber-500/15 text-amber-100 border border-amber-400/40" };
  };

  const getAwbTrackingUrl = (awb?: string | null, carrier?: string | null) => {
    if (!awb || !carrier) return null;
    const carrierLower = carrier.toLowerCase();
    const awbClean = encodeURIComponent(awb);
    if (carrierLower.includes("dpd")) return `https://tracking.dpd.ro/awb?awb=${awbClean}`;
    if (carrierLower.includes("fan")) return `https://www.fancourier.ro/awb-tracking/?awb=${awbClean}`;
    if (carrierLower.includes("sameday")) return `https://sameday.ro/awb-tracking/?awb=${awbClean}`;
    return null;
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Contul Meu</h1>
          {showWelcome && (
            <div className="mt-4 bg-green-500/10 border border-green-400/40 text-green-200 px-4 py-3 rounded-lg">
              Bun venit! Contul tău a fost creat cu succes.
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <main className="md:col-span-2 space-y-8">
            {/* Sectiunea Comenzi */}
            <section id="orders" className="panel rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold mb-4">Comenzile Mele</h2>
              {totalOrders === 0 ? (
                <p className="text-muted">Nu ai plasat nicio comandă încă.</p>
              ) : (
                <ul className="space-y-6">
                  {orders.map((o) => {
                    const statusMeta = resolveStatusMeta(o.status);
                    const awbUrl = getAwbTrackingUrl(o.awbNumber, o.awbCarrier);
                    const previewItems = o.items.slice(0, 4).map((it: any) => it.name);

                    return (
                      <li key={o.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="font-semibold">Comanda #{o.orderNo}</div>
                            <div className="text-xs text-muted">{new Date(o.createdAt).toLocaleString("ro-RO")}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{(o.total || 0).toFixed(2)} RON</div>
                            <div className="text-xs text-muted">{o.paymentType}</div>
                          </div>
                        </div>
                        <div className="mt-3 space-y-2 text-xs text-muted">
                          {previewItems.length > 0 ? (
                            <div className="text-white/70">
                              {previewItems.join(" | ")}
                              {o.itemsCount > previewItems.length ? ` +${o.itemsCount - previewItems.length} produse` : ""}
                            </div>
                          ) : (
                            <div>Detalii disponibile in sectiunea "Detalii".</div>
                          )}
                          <div>
                            Livrare: {o.address?.localitate || "-"}, {o.address?.judet || "RO"}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${statusMeta.badge}`}>
                              {statusMeta.label}
                            </span>
                            {o.awbNumber && (
                              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/80">
                                <span>AWB: {o.awbNumber}</span>
                                {awbUrl && (
                                  <a href={awbUrl} target="_blank" rel="noreferrer" className="text-indigo-300 underline">
                                    Tracking
                                  </a>
                                )}
                              </span>
                            )}
                            {o.invoiceLink && (
                              <a
                                href={o.invoiceLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[11px] text-indigo-300 underline"
                              >
                                Factura
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="mt-3">
                          {/* @ts-ignore Server->Client import allowed */}
                          <OrderDetails order={o} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </main>

          <aside className="space-y-8">
            {/* Sectiunea Adrese */}
            <section id="addresses" className="panel rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold mb-4">Adresele Mele</h2>
              <AddressesManager />
            </section>

            {/* Sectiunea Date Facturare */}
            <section id="billing" className="panel rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold mb-4">Date Facturare</h2>
              {!billing ? (
                <p className="text-sm text-muted">Nu există date de facturare încă.</p>
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

            {/* Sectiunea Facturi */}
            <section id="invoices" className="panel rounded-3xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold mb-4">Facturi</h2>
              {orders.filter((o) => o.invoiceLink).length === 0 ? (
                <p className="text-sm text-muted">Nu există facturi emise încă.</p>
              ) : (
                <ul className="space-y-2">
                  {orders
                    .filter((o) => o.invoiceLink)
                    .map((o) => (
                      <li key={o.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Comanda #{o.orderNo}</div>
                          <div className="text-xs text-muted">{new Date(o.createdAt).toLocaleString('ro-RO')}</div>
                        </div>
                        <a href={o.invoiceLink} target="_blank" rel="noreferrer" className="text-indigo-400 underline">
                          Descarcă
                        </a>
                      </li>
                    ))}
                </ul>
              )}
            </section>

            {/* Sectiunea Setari Cont */}
            <section id="settings" className="panel rounded-3xl border border-white/10 bg-white/5 p-6 space-y-6">
              <h2 className="text-xl font-semibold">Setări Cont</h2>
              <ChangePasswordForm />
              <RequestPasswordReset email={String(session.user.email || "")} />
              <SignOutButton />
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
