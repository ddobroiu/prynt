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

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_auth')?.value;
  const session = verifyAdminSession(token);
  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-ui p-6">
        <div className="rounded-2xl border card-bg p-6 text-ui max-w-md text-center">
          <h1 className="text-xl font-bold mb-2">Acces restricționat</h1>
          <p className="text-muted mb-4">Te rugăm să te autentifici pentru a vedea comenzile.</p>
          <a href="/admin/login" className="inline-block rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 font-semibold">Login</a>
        </div>
      </main>
    );
  }

  const orders = await listOrders(500);
  const defaultSid = encodeURIComponent(String(process.env.DPD_DEFAULT_SERVICE_ID || ''));

  return (
    <main className="min-h-screen bg-ui p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">Comenzi</h1>
          <a href="/" className="rounded-xl border border-white/10 bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur transition-all">Înapoi la site</a>
        </div>

        <div className="rounded-2xl border card-bg overflow-x-auto shadow-xl backdrop-blur-lg">
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr>
                <th className="px-3 py-2">Nr.</th>
                <th className="px-3 py-2">Data</th>
                <th className="px-3 py-2">Client</th>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Plată</th>
                <th className="px-3 py-2">Sursă</th>
                <th className="px-3 py-2">Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const tokenEdit = signAdminAction({ action: 'edit', orderId: o.id, address: o.address, paymentType: o.paymentType, totalAmount: o.total });
                const tokenConfirm = signAdminAction({ action: 'confirm_awb', orderId: o.id, address: o.address, paymentType: o.paymentType, totalAmount: o.total });
                const urlEdit = `/api/dpd/admin-action?token=${encodeURIComponent(tokenEdit)}&sid=${defaultSid}`;
                const urlConfirm = `/api/dpd/admin-action?token=${encodeURIComponent(tokenConfirm)}&sid=${defaultSid}`;
                return (
                  <tr key={o.id} className="border-t border-white/10">
                    <td className="px-3 py-2 align-top whitespace-nowrap font-semibold">#{o.orderNo ?? '—'}</td>
                    <td className="px-3 py-2 align-top whitespace-nowrap">{new Date(o.createdAt).toLocaleString('ro-RO')}</td>
                        {(() => {
                          const billing = (o.billing || {}) as any;
                          const useBilling = billing && billing.tip_factura && billing.tip_factura !== 'persoana_fizica' && (billing.cui || billing.name);
                          const name = useBilling ? (billing.name || billing.cui) : (o.address?.nume_prenume || '—');
                          const place = useBilling ? `${billing.judet || o.address?.judet || ''}, ${billing.localitate || o.address?.localitate || ''}` : `${o.address?.judet || ''}, ${o.address?.localitate || ''}`;
                          const email = useBilling ? (billing.email || o.address?.email) : o.address?.email;
                          const phone = useBilling ? (billing.telefon || billing.phone || o.address?.telefon) : o.address?.telefon;
                          return (
                            <>
                              <td className="px-3 py-2 align-top">
                                <div className="font-semibold">{name}</div>
                                <div className="text-muted">{place}</div>
                              </td>
                              <td className="px-3 py-2 align-top">
                                <div>{email}</div>
                                <div className="text-muted">{phone}</div>
                              </td>
                            </>
                          );
                        })()}
                    <td className="px-3 py-2 align-top whitespace-nowrap">{fmtRON(o.total)}</td>
                    <td className="px-3 py-2 align-top">{o.paymentType}</td>
                    <td className="px-3 py-2 align-top">{sourceLabel(o.marketing)}</td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex flex-wrap gap-2 items-center">
                        <a href={urlConfirm} className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700/80 hover:from-emerald-600 hover:to-emerald-800 text-white px-2.5 py-1.5 text-xs font-bold shadow-md backdrop-blur transition-all">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-square"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><polyline points="9 11 12 14 22 4"/></svg>
                          Validează
                        </a>
                        <a href={urlEdit} className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-sky-500 to-sky-700/80 hover:from-sky-600 hover:to-sky-800 text-white px-2.5 py-1.5 text-xs font-bold shadow-md backdrop-blur transition-all">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
                          AWB
                        </a>
                        {o.invoiceLink ? (
                          <a href={o.invoiceLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700/80 hover:from-indigo-600 hover:to-indigo-800 text-white px-2.5 py-1.5 text-xs font-bold shadow-md backdrop-blur transition-all">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="9" y2="9"/></svg>
                            Factura
                          </a>
                        ) : null}
                        <div className="flex items-center gap-2">
                          <div>
                            {/* @ts-ignore Server->Client import allowed */}
                            <AdminOrderStatusControl id={o.id} status={o.status} />
                          </div>
                          <div>
                            {/* @ts-ignore Server->Client import allowed */}
                            <AdminInvoiceControl id={o.id} invoiceLink={o.invoiceLink} billing={o.billing} />
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
      </div>
    </main>
  );
}
