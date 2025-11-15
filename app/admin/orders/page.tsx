import { cookies } from 'next/headers';
import { verifyAdminSession } from '../../../lib/adminSession';
import { listOrders } from '../../../lib/orderStore';
import { signAdminAction } from '../../../lib/adminAction';
import AdminOrderStatusControl from '@/components/AdminOrderStatusControl';
import AdminInvoiceControl from '@/components/AdminInvoiceControl';
import OrderDetails from '@/components/OrderDetails';

function fmtRON(n: number) {
  return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON', maximumFractionDigits: 2 }).format(n);
}

function sourceLabel(m: any) {
  if (!m) return '—';
  if (m.utmSource) return m.utmSource;
  try {
    if (m.referrer) {
      const u = new URL(m.referrer);
      return u.hostname.replace(/^www\./, '');
    }
  } catch {}
  return 'direct';
}

type StatusKey = 'in_progress' | 'fulfilled' | 'canceled';

function normalizeStatus(status?: string | null): StatusKey {
  if (!status) return 'in_progress';
  if (status === 'fulfilled') return 'fulfilled';
  if (status === 'canceled') return 'canceled';
  if (status === 'in_progress') return 'in_progress';
  if (status === 'active') return 'in_progress';
  return 'in_progress';
}

const STATUS_META: Record<StatusKey, { label: string; badge: string; glow: string }> = {
  in_progress: {
    label: 'În lucru',
    badge: 'bg-amber-500/20 text-amber-200 border border-amber-400/30',
    glow: 'from-amber-500/40 to-transparent',
  },
  fulfilled: {
    label: 'Finalizată',
    badge: 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30',
    glow: 'from-emerald-500/40 to-transparent',
  },
  canceled: {
    label: 'Anulată',
    badge: 'bg-rose-500/15 text-rose-200 border border-rose-400/30',
    glow: 'from-rose-500/30 to-transparent',
  },
};

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

  const orders = await listOrders(500);
  const defaultSid = encodeURIComponent(String(process.env.DPD_DEFAULT_SERVICE_ID || ''));

  const now = Date.now();
  const totals = orders.reduce(
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
  const totalOrders = orders.length;
  const averageValue = totalOrders ? totals.totalValue / totalOrders : 0;

  const marketingCounts = new Map<string, number>();
  for (const order of orders) {
    const label = sourceLabel((order as any).marketing);
    marketingCounts.set(label, (marketingCounts.get(label) || 0) + 1);
  }
  const topSources = Array.from(marketingCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070f] text-ui">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.35),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 translate-x-1/3 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.25),_transparent_65%)] blur-3xl" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-indigo-300">Admin · Orders</p>
            <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">Panou comenzi</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Monitorizează statusul comenzilor, gestionează documentele și urmărește performanța campaniilor într-un mod modern și coerent.
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
            <a
              href="mailto:hello@prynt.ro"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-400 to-sky-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:scale-[1.01]"
            >
              Suport rapid
            </a>
          </div>
        </div>

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
            <div className="text-sm text-muted">Finalizate</div>
            <div className="mt-2 text-3xl font-semibold text-white">{totals.fulfilled}</div>
            <div className="mt-1 text-xs text-muted">Anulate: {totals.canceled}</div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-rose-500/10" />
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-indigo-950/50 backdrop-blur">
            <div className="flex flex-col gap-3 border-b border-white/5 px-6 py-5 text-sm text-muted md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Monitorizare</p>
                <h2 className="text-xl font-semibold text-white">Toate comenzile</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-white/80">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> În lucru
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-white/80">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Finalizate
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-white/80">
                  <span className="h-2 w-2 rounded-full bg-rose-400" /> Anulate
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white/3 text-left text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-white/70">Nr.</th>
                    <th className="px-4 py-3 font-semibold text-white/70">Data</th>
                    <th className="px-4 py-3 font-semibold text-white/70">Client</th>
                    <th className="px-4 py-3 font-semibold text-white/70">Contact</th>
                    <th className="px-4 py-3 font-semibold text-white/70">Total</th>
                    <th className="px-4 py-3 font-semibold text-white/70">Plată</th>
                    <th className="px-4 py-3 font-semibold text-white/70">Sursă</th>
                    <th className="px-4 py-3 font-semibold text-white/70">Status</th>
                    <th className="px-4 py-3 font-semibold text-white/70">Acțiuni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((o) => {
                    const tokenEdit = signAdminAction({ action: 'edit', orderId: o.id, address: o.address, paymentType: o.paymentType, totalAmount: o.total });
                    const tokenConfirm = signAdminAction({ action: 'confirm_awb', orderId: o.id, address: o.address, paymentType: o.paymentType, totalAmount: o.total });
                    const urlEdit = `/api/dpd/admin-action?token=${encodeURIComponent(tokenEdit)}&sid=${defaultSid}`;
                    const urlConfirm = `/api/dpd/admin-action?token=${encodeURIComponent(tokenConfirm)}&sid=${defaultSid}`;
                    const statusKey = normalizeStatus((o as any).status);
                    return (
                      <tr key={o.id} className="transition hover:bg-white/3">
                        <td className="px-4 py-3 font-semibold text-white">#{o.orderNo ?? '—'}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-muted">{new Date(o.createdAt).toLocaleString('ro-RO')}</td>
                        {(() => {
                          const billing = (o.billing || {}) as any;
                          const useBilling = billing && billing.tip_factura && billing.tip_factura !== 'persoana_fizica' && (billing.cui || billing.name);
                          const name = useBilling ? (billing.name || billing.cui) : (o.address?.nume_prenume || '—');
                          const place = useBilling
                            ? `${billing.judet || o.address?.judet || ''}, ${billing.localitate || o.address?.localitate || ''}`
                            : `${o.address?.judet || ''}, ${o.address?.localitate || ''}`;
                          const email = useBilling ? (billing.email || o.address?.email) : o.address?.email;
                          const phone = useBilling ? (billing.telefon || billing.phone || o.address?.telefon) : o.address?.telefon;
                          return (
                            <>
                              <td className="px-4 py-3">
                                <div className="font-semibold text-white">{name}</div>
                                <div className="text-xs text-muted">{place}</div>
                              </td>
                              <td className="px-4 py-3">
                                <div>{email}</div>
                                <div className="text-xs text-muted">{phone}</div>
                              </td>
                            </>
                          );
                        })()}
                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-white">{fmtRON(o.total)}</td>
                        <td className="px-4 py-3 text-muted">{o.paymentType}</td>
                        <td className="px-4 py-3 text-muted">{sourceLabel((o as any).marketing)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_META[statusKey].badge}`}>
                            {STATUS_META[statusKey].label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap gap-2">
                              <a
                                href={urlConfirm}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/40 transition hover:scale-[1.01]"
                              >
                                Validează
                              </a>
                              <a
                                href={urlEdit}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-sky-900/40 transition hover:scale-[1.01]"
                              >
                                AWB
                              </a>
                              {o.invoiceLink ? (
                                <a
                                  href={o.invoiceLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-indigo-900/40 transition hover:scale-[1.01]"
                                >
                                  Factura
                                </a>
                              ) : null}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/80">
                                {/* @ts-ignore Server->Client import allowed */}
                                <AdminOrderStatusControl id={o.id} status={(o as any).status} />
                              </div>
                              <div className="min-w-[220px] flex-1">
                                {/* @ts-ignore Server->Client import allowed */}
                                <AdminInvoiceControl id={o.id} invoiceLink={o.invoiceLink} />
                              </div>
                              <div>
                                {/* @ts-ignore Server->Client import allowed */}
                                <OrderDetails order={o} />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm shadow-2xl">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Surse trafic</p>
              <h3 className="mt-2 text-lg font-semibold text-white">Top campanii</h3>
              <ul className="mt-4 space-y-3">
                {topSources.length ? (
                  topSources.map(([label, count]) => (
                    <li key={label} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                      <span className="text-white">{label}</span>
                      <span className="text-sm font-semibold text-muted">{count} comenzi</span>
                    </li>
                  ))
                ) : (
                  <li className="rounded-2xl border border-white/10 bg-black/20 px-3 py-4 text-center text-muted">
                    Nu există date încă.
                  </li>
                )}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-white/60">Status overview</p>
              <div className="mt-3 space-y-3">
                {(Object.keys(STATUS_META) as StatusKey[]).map((key) => (
                  <div key={key} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                    <div>
                      <p className="text-xs text-muted">{STATUS_META[key].label}</p>
                      <p className="text-lg font-semibold text-white">{totals[key]}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${STATUS_META[key].glow}`} />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}