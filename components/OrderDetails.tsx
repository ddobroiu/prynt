"use client";

import { useState } from "react";

type Item = { name: string; qty: number; unit?: number; total?: number };
type Order = {
  id: string;
  orderNo?: number;
  createdAt?: string;
  status?: string;
  canceledAt?: string | null;
  total?: number;
  shippingFee?: number;
  paymentType?: string;
  items?: Item[];
  address?: any;
  billing?: any;
  awbNumber?: string | null;
  awbCarrier?: string | null;
  invoiceLink?: string | null;
};

export default function OrderDetails({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);

  function formatMoney(n?: number) {
    return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(n || 0);
  }

  return (
    <div>
      <button onClick={() => setOpen(true)} className="inline-block rounded-md bg-white/5 hover:bg-white/10 px-3 py-1 text-sm">Detalii</button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 z-50" onClick={() => setOpen(false)} />
          <div className="relative max-w-3xl w-full mx-4 rounded-xl shadow-xl p-6 overflow-auto" style={{ zIndex: 9999, maxHeight: '80vh', background: 'rgba(255,255,255,0.98)', color: '#0b1220' }}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">Comanda #{order.orderNo ?? '—'}</h3>
                <div className="text-sm text-muted">{order.createdAt ? new Date(order.createdAt).toLocaleString('ro-RO') : ''}</div>
                <div className="mt-2 text-sm">Status: <span className={`font-semibold ${order.status === 'canceled' ? 'text-red-500' : order.status === 'fulfilled' ? 'text-green-500' : 'text-yellow-500'}`}>{order.status === 'canceled' ? 'Anulată' : order.status === 'fulfilled' ? 'Finalizată' : 'În lucru'}</span></div>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted">Închide</button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Produse</h4>
                <ul className="mt-2 divide-y divide-white/5">
                  {(order.items || []).map((it, idx) => (
                    <li key={idx} className="py-3 flex items-center gap-3">
                      <div className="flex-1">
                        <div className="font-medium">{it.name}</div>
                        <div className="text-sm text-muted">{it.qty} × {formatMoney(it.unit)}</div>
                      </div>
                      <div className="font-semibold">{formatMoney(it.total)}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">Detalii livrare & facturare</h4>
                <div className="mt-2 text-sm text-muted">
                  {/* Prefer billing data (importată via CUI) when available for juridical companies */}
                  {((order.billing as any)?.tip_factura && (order.billing as any).tip_factura !== 'persoana_fizica' && ((order.billing as any).cui || (order.billing as any).name)) ? (
                    <div>
                      <div><strong>Nume / Firmă:</strong> {(order.billing as any).name || (order.billing as any).cui}</div>
                      <div><strong>Email:</strong> {(order.billing as any).email || order.address?.email}</div>
                      <div><strong>Telefon:</strong> {(order.billing as any).telefon || (order.billing as any).phone || order.address?.telefon}</div>
                      <div className="mt-2"><strong>Adresă:</strong> {(order.billing as any).strada_nr || order.address?.strada_nr}, {(order.billing as any).localitate || order.address?.localitate} ({(order.billing as any).judet || order.address?.judet})</div>
                    </div>
                  ) : (
                    <div>
                      <div><strong>Nume:</strong> {order.address?.nume_prenume || order.address?.name}</div>
                      <div><strong>Email:</strong> {order.address?.email}</div>
                      <div><strong>Telefon:</strong> {order.address?.telefon}</div>
                      <div className="mt-2"><strong>Adresă:</strong> {order.address?.strada_nr}, {order.address?.localitate} ({order.address?.judet})</div>
                      {order.billing ? (
                        <div className="mt-2"><strong>Facturare:</strong> {order.billing.name || order.billing.cui || '—'}</div>
                      ) : null}
                    </div>
                  )}

                  {order.awbNumber ? (
                    <div className="mt-2"><strong>AWB:</strong> {order.awbNumber} {order.awbCarrier ? `(${order.awbCarrier})` : ''}</div>
                  ) : null}
                  {order.invoiceLink ? (
                    <div className="mt-2"><a href={order.invoiceLink} target="_blank" rel="noreferrer" className="text-indigo-400 underline">Descarcă factura</a></div>
                  ) : null}
                </div>

                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between text-sm text-muted"><div>Subtotal</div><div>{formatMoney((order.total || 0) - (order.shippingFee || 0))}</div></div>
                  <div className="flex justify-between text-sm text-muted"><div>Livrare</div><div>{formatMoney(order.shippingFee)}</div></div>
                  <div className="flex justify-between font-bold text-lg mt-2"><div>Total</div><div>{formatMoney(order.total)}</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
