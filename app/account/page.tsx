import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/SignOutButton";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import RequestPasswordReset from "@/components/RequestPasswordReset";
import AddressesManager from "@/components/AddressesManager";
import OrderDetails from "@/components/OrderDetails";
import {
  Building2,
  CreditCard,
  MapPin,
  PackageSearch,
  PhoneCall,
  Receipt,
} from "lucide-react";

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
    {
      label: "Comenzi",
      description: "Status, AWB și produse",
      href: "#orders",
      icon: PackageSearch,
    },
    {
      label: "Facturi",
      description: "Descarcă documentele",
      href: "#invoices",
      icon: Receipt,
    },
    {
      label: "Adrese",
      description: "Gestionare adrese de livrare",
      href: "#addresses",
      icon: MapPin,
    },
    {
      label: "Date facturare",
      description: "Ultima entitate folosită",
      href: "#billing",
      icon: Building2,
    },
  ];

  const quickActions = [
    {
      label: "Reia cumpărăturile",
      href: "/checkout",
      variant:
        "bg-gradient-to-r from-indigo-500/90 to-purple-500 text-white shadow-lg shadow-indigo-500/30",
      icon: CreditCard,
    },
    {
      label: "Contact suport",
      href: "/contact",
      variant: "border border-white/10 hover:border-white/30",
      icon: PhoneCall,
    },
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
    <div className="relative isolate overflow-hidden bg-slate-950 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-indigo-900/70 via-slate-900/80 to-slate-950"
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Mobile quick navigation */}
        <div className="lg:hidden sticky top-2 z-20 mb-6">
          <div className="flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium backdrop-blur supports-[backdrop-filter]:backdrop-blur">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-1 rounded-full border border-transparent px-3 py-1 transition hover:border-indigo-400/70 hover:bg-indigo-500/10"
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Left column: profile & quick actions */}
          <aside className="col-span-1 space-y-4">
            <div className="panel relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/60 to-slate-900/20 p-5 shadow-2xl shadow-indigo-950/40">
            <div aria-hidden className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-500/20 blur-2xl" />
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-200 flex items-center justify-center text-xl font-bold">
                {(session.user.name || session.user.email || "").slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-white/90">{session.user.name || session.user.email}</div>
                <div className="text-xs text-muted">{session.user.email}</div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-white/5 px-2 py-3">
                <div className="text-[11px] uppercase tracking-wide text-muted">Comenzi</div>
                <div className="text-lg font-semibold">{totalOrders}</div>
              </div>
              <div className="rounded-xl bg-white/5 px-2 py-3">
                <div className="text-[11px] uppercase tracking-wide text-muted">Cheltuit</div>
                <div className="text-lg font-semibold">
                  {new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(totalSpent)}
                </div>
              </div>
              <div className="rounded-xl bg-white/5 px-2 py-3">
                <div className="text-[11px] uppercase tracking-wide text-muted">Cont</div>
                <div className="text-lg font-semibold">Activ</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted">Meniul contului</div>
              <nav className="mt-3 space-y-2" aria-label="Navigație cont">
                {navigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="group flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 px-3 py-3 text-sm text-white/80 transition hover:-translate-y-0.5 hover:border-indigo-400/60 hover:bg-indigo-500/10"
                  >
                    <span className="mt-1 rounded-xl bg-white/10 p-2 text-indigo-300">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium text-white">{item.label}</span>
                      <span className="text-xs text-white/60">{item.description}</span>
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          </div>

            <div className="panel rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-muted">Ultima activitate</div>
            <div className="text-sm mt-2 font-medium text-white/90">
              {orders[0] ? new Date(orders[0].createdAt).toLocaleString("ro-RO") : "—"}
            </div>
          </div>

            <div className="panel rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Acțiuni rapide</span>
              <span className="text-[10px] uppercase tracking-widest text-white/50">Customer care</span>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {quickActions.map((action) => (
                <a
                  key={action.href}
                  href={action.href}
                  className={`flex items-center justify-between rounded-2xl px-4 py-2 text-sm transition hover:translate-x-0.5 ${action.variant}`}
                >
                  <span>{action.label}</span>
                  <action.icon className="h-4 w-4 opacity-70" />
                </a>
              ))}
              <SignOutButton
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                label="Deconectare rapidă"
              />
            </div>
            </div>
          </aside>

          {/* Right column: main content */}
          <main className="col-span-3 space-y-6">
          <div className="panel relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
            <div aria-hidden className="absolute -right-6 top-6 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl" />
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-200">Bine ai revenit</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
                Salut, {session.user.name || session.user.email}
              </h1>
              <p className="text-sm text-white/70">
                Panou de control al contului tău — toate datele într-o singură pagină.
              </p>
            </div>
          </div>
          {showWelcome && (
            <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-300 text-sm">
              Cont creat cu succes. Te-ai autentificat automat.
            </div>
          )}
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="panel rounded-3xl border border-white/10 bg-white/5 p-5 flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wide text-muted">Comenzi</div>
              <div className="text-3xl font-bold text-white">{totalOrders}</div>
              <div className="text-[11px] text-muted">Total plasate</div>
            </div>
            <div className="panel rounded-3xl border border-white/10 bg-white/5 p-5 flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wide text-muted">Total cheltuit</div>
              <div className="text-3xl font-bold text-white">
                {new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(totalSpent)}
              </div>
              <div className="text-[11px] text-muted">Include transport</div>
            </div>
            <div className="panel rounded-3xl border border-white/10 bg-white/5 p-5 flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wide text-muted">Email</div>
              <div className="text-sm font-medium truncate text-white" title={String(session.user.email)}>
                {session.user.email}
              </div>
              <div className="text-[11px] text-muted">Autentificat</div>
            </div>
          </div>

          {/* Orders */}
          <section id="orders" className="panel rounded-3xl border border-white/10 bg-white/5">
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
                                  const carrierLower = o.awbCarrier.toLowerCase();
                                  let url = null;
                                  if (carrierLower.includes('dpd')) url = `https://tracking.dpd.ro/awb?awb=${awbClean}`;
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
