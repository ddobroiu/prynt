"use client";

import { useState } from "react";
import Link from "next/link";

interface BillingOrder {
  id: string;
  orderNo: number;
  total: number | string;
  createdAt: string;
  invoiceLink?: string | null;
  status: string;
  billing?: {
    company?: string;
    cui?: string;
    regCom?: string;
  };
  items?: Array<{
    name: string;
    qty: number;
  }>;
}

interface BillingSectionProps {
  orders: BillingOrder[];
}

export default function BillingSection({ orders }: BillingSectionProps) {
  const [filter, setFilter] = useState<"all" | "invoiced" | "pending">("all");

  // Filtrăm comenzile după status facturare
  const filteredOrders = orders.filter(order => {
    if (filter === "invoiced") return order.invoiceLink;
    if (filter === "pending") return !order.invoiceLink && order.status !== "canceled";
    return true;
  });

  // Calculăm statistici
  const stats = {
    totalInvoiced: orders.filter(o => o.invoiceLink).length,
    totalPending: orders.filter(o => !o.invoiceLink && o.status !== "canceled").length,
    totalAmount: orders.reduce((sum, o) => sum + (typeof o.total === 'number' ? o.total : parseFloat(o.total?.toString() || '0')), 0),
  };

  return (
    <div className="space-y-6">
      {/* Statistici */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalInvoiced}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Facturi emise</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-amber-200 dark:border-amber-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPending}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">În așteptare</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-green-200 dark:border-green-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(stats.totalAmount)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total facturat</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtre */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
            filter === "all"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          Toate ({orders.length})
        </button>
        <button
          onClick={() => setFilter("invoiced")}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
            filter === "invoiced"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          Cu factură ({stats.totalInvoiced})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
            filter === "pending"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
          }`}
        >
          Fără factură ({stats.totalPending})
        </button>
      </div>

      {/* Lista de facturi */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">Nu există facturi pentru acest filtru</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      Comandă #{order.orderNo}
                    </span>
                    {order.invoiceLink ? (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                        Facturată
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-xs font-medium">
                        Fără factură
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(order.createdAt).toLocaleDateString('ro-RO')}
                    </div>
                    
                    {order.billing?.company && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {order.billing.company}
                      </div>
                    )}
                    
                    {order.billing?.cui && (
                      <div className="text-xs">
                        CUI: {order.billing.cui}
                      </div>
                    )}
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx}>• {item.name} (x{item.qty})</div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-xs text-gray-500">+{order.items.length - 2} produse</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(
                        typeof order.total === 'number' ? order.total : parseFloat(order.total?.toString() || '0')
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total comandă</div>
                  </div>

                  <div className="flex gap-2">
                    {order.invoiceLink ? (
                      <a
                        href={order.invoiceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Descarcă factură
                      </a>
                    ) : (
                      <div className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 rounded-xl text-sm">
                        Factură indisponibilă
                      </div>
                    )}
                    
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Detalii
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer info */}
      {filteredOrders.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-900 dark:text-blue-300">
              <p className="font-semibold mb-1">Informații despre facturi</p>
              <p>Facturile sunt generate automat pentru comenzile cu date de facturare. Poți descărca facturile în format PDF pentru comenzile procesate.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
