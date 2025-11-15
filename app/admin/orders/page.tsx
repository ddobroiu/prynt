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
          <a href="/" className="rounded-md border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-sm">Înapoi la site</a>
        </div>

        <div className="rounded-2xl border card-bg overflow-x-auto">
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
                    <td className="px-3 py-2 align-top">
                      <div className="font-semibold">{o.address.nume_prenume}</div>
                      <div className="text-muted">{o.address.judet}, {o.address.localitate}</div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div>{o.address.email}</div>
                      <div className="text-muted">{o.address.telefon}</div>
                    </td>
                    <td className="px-3 py-2 align-top whitespace-nowrap">{fmtRON(o.total)}</td>
                    <td className="px-3 py-2 align-top">{o.paymentType}</td>
                    <td className="px-3 py-2 align-top">{sourceLabel(o.marketing)}</td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex gap-2">
                        <a href={urlConfirm} className="inline-block rounded-md bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1">Validează & trimite</a>
                        <a href={urlEdit} className="inline-block rounded-md bg-sky-600 hover:bg-sky-500 text-white px-2 py-1">Editează AWB</a>
                        {o.invoiceLink ? (
                          <a href={o.invoiceLink} target="_blank" rel="noreferrer" className="inline-block rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1">Factura</a>
                        ) : null}
                        {/* Inline status control: dropdown to set status without navigation */}
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
