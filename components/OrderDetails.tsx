"use client";

import { useState } from "react";
import Link from "next/link";

function formatMoney(n?: number) {
  return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(n || 0);
}

export default function OrderDetails({ order }: { order: any }) {
  const [open, setOpen] = useState(false);
  const items = order.items || [];

  return (
    <div>
      {/* FIX: Am schimbat stilurile butonului pentru a fi vizibil pe fundal alb.
         Acum foloseste un stil "secondary" (alb/gri cu border) in loc de alb pe transparent.
      */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        Detalii
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
            
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Comanda #{order.orderNo}</div>
                <h2 className="text-2xl font-bold text-white mt-1">Detalii Comandă</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
              {/* Lista Produse */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Produse</h3>
                    {/* BUTONUL CĂTRE PAGINA DE UPLOAD */}
                    <Link 
                        href={`/account/orders/${order.id}`}
                        className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                        <span>Gestionare Grafică</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </Link>
                </div>
                
                <div className="space-y-3">
                    {items.map((it: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm border-b border-white/5 pb-2 last:border-0">
                            <div>
                                <div className="text-white font-medium">{it.name}</div>
                                <div className="text-slate-400 text-xs">{it.qty} buc x {formatMoney(Number(it.unit))}</div>
                            </div>
                            <div className="text-white font-semibold">{formatMoney(Number(it.total))}</div>
                        </div>
                    ))}
                </div>
              </div>

              {/* Sumar */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 h-fit">
                 <h3 className="font-semibold text-white mb-4">Sumar</h3>
                 <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatMoney(Number(order.total) - Number(order.shippingFee))}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Livrare:</span>
                        <span>{formatMoney(Number(order.shippingFee))}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-2 mt-2 text-lg font-bold text-white">
                        <span>Total:</span>
                        <span>{formatMoney(Number(order.total))}</span>
                    </div>
                 </div>
                 {order.invoiceLink && (
                    <a href={order.invoiceLink} target="_blank" className="mt-4 block text-center w-full rounded-lg border border-white/10 bg-white/5 py-2 text-sm text-indigo-400 hover:bg-white/10">
                        Descarcă Factura
                    </a>
                 )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}