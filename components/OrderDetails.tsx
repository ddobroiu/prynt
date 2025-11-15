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

function getAwbTrackingUrl(awb: string | null | undefined, carrier: string | null | undefined): string | null {
  if (!awb || !carrier) return null;
  const awbClean = encodeURIComponent(awb);
  const carrierLower = carrier.toLowerCase();
  if (carrierLower.includes('dpd')) return `https://tracking.dpd.ro/awb?awb=${awbClean}`;
  if (carrierLower.includes('fan')) return `https://www.fancourier.ro/awb-tracking/?awb=${awbClean}`;
  if (carrierLower.includes('sameday')) return `https://sameday.ro/awb-tracking/?awb=${awbClean}`;
  return null;
}

function formatMoney(n?: number) {
  return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(n || 0);
}

export default function OrderDetails({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const awbUrl = getAwbTrackingUrl(order.awbNumber, order.awbCarrier);
  const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleString('ro-RO') : '—';
  const items = order.items && order.items.length ? order.items : null;

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-2xl border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
      >
        Detalii
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur" onClick={() => setOpen(false)} />
          <div className="relative z-10 mx-4 flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#070b17]/95 p-6 text-white shadow-2xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">Comanda #{order.orderNo ?? '—'}</p>
                <h3 className="mt-2 text-2xl font-semibold">Detalii comandă</h3>
                <div className="text-sm text-muted">{createdAt}</div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${order.status === 'canceled'
                    ? 'bg-rose-500/20 text-rose-100'
                    : order.status === 'fulfilled'
                    ? 'bg-emerald-500/20 text-emerald-100'
                    : 'bg-amber-500/30 text-amber-100'
                  }`}
                >
                  {order.status === 'canceled' ? 'Anulată' : order.status === 'fulfilled' ? 'Finalizată' : 'În lucru'}
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center rounded-full border border-white/15 px-3 py-1 text-xs text-white/80 transition hover:bg-white/10"
                >
                  Închide
                </button>
              </div>
            </div>

            <div className="mt-6 grid flex-1 grid-cols-1 gap-6 overflow-y-auto pb-2 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h4 className="font-semibold">Produse</h4>
                {items ? (
                  <ul className="mt-3 divide-y divide-white/5 text-sm">
                    {items.map((it, idx) => (
                      <li key={idx} className="flex items-center gap-3 py-3">
                        <div className="flex-1">
                          <div className="font-medium text-white">{it.name}</div>
                          <div className="text-xs text-muted">
                            {it.qty} × {formatMoney(it.unit)}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-white">{formatMoney(it.total)}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 rounded-2xl bg-black/20 p-3 text-xs text-muted">Comanda nu conține linii de produse.</p>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h4 className="font-semibold">Detalii livrare & facturare</h4>
                <div className="mt-3 text-sm text-muted">
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
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <strong>AWB:</strong> {order.awbNumber} {order.awbCarrier ? `(${order.awbCarrier})` : ''}
                      {awbUrl ? (
                        <a
                          href={awbUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 rounded px-2 py-1 text-xs text-indigo-400 underline transition hover:text-indigo-200"
                        >
                          Verifică AWB
                        </a>
                      ) : (
                        <span className="text-xs text-muted">Carrier fără link de tracking</span>
                      )}
                    </div>
                  ) : null}
                  {order.invoiceLink ? (
                    <div className="mt-2"><a href={order.invoiceLink} target="_blank" rel="noreferrer" className="text-indigo-400 underline">Descarcă factura</a></div>
                  ) : null}
                </div>

                <div className="mt-6 border-t border-white/5 pt-4 text-sm">
                  <div className="flex justify-between text-muted">
                    <div>Subtotal</div>
                    <div>{formatMoney((order.total || 0) - (order.shippingFee || 0))}</div>
                  </div>
                  <div className="mt-2 flex justify-between text-muted">
                    <div>Livrare</div>
                    <div>{formatMoney(order.shippingFee)}</div>
                  </div>
                  <div className="mt-4 flex justify-between text-lg font-semibold text-white">
                    <div>Total</div>
                    <div>{formatMoney(order.total)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}