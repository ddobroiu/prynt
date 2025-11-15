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
                              {o.awbNumber ? (
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/80">
                                  <span>AWB: {o.awbNumber}</span>
                                  {awbUrl ? (
                                    <a href={awbUrl} target="_blank" rel="noreferrer" className="text-indigo-300 underline">
                                      Tracking
                                    </a>
                                  ) : null}
                                </span>
                              ) : null}
                              {o.invoiceLink ? (
                                <a
                                  href={o.invoiceLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[11px] text-indigo-300 underline"
                                >
                                  Factura
                                </a>
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
                  );
                })}
              </ul>
            )}
          </section>
          {/* Invoices (aggregate from orders) */}
          <section id="invoices" className="panel rounded-3xl border border-white/10 bg-white/5">
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
          <section id="addresses" className="panel rounded-3xl border border-white/10 bg-white/5">
            <div className="p-4">
              <div className="font-semibold mb-2">Adrese</div>
              <AddressesManager />
            </div>
          </section>

          {/* Billing (latest) */}
          <section id="billing" className="panel rounded-3xl border border-white/10 bg-white/5 p-4">
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
  </div>
  );
}
