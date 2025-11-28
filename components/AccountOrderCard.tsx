"use client";

import Link from "next/link";
import OrderDetails from "@/components/OrderDetails";

interface Order {
  id: string;
  orderNo: number;
  createdAt: string;
  status?: string | null;
  awbNumber?: string | null;
  awbCarrier?: string | null;
  invoiceLink?: string | null;
  total: number;
  itemsCount?: number;
}

interface AccountOrderCardProps {
  order: Order;
  onTrackingClick?: (order: Order) => void;
}

function getAwbTrackingUrl(awb: string | null | undefined, carrier: string | null | undefined): string | null {
  if (!awb || awb === "0") return null;
  const awbClean = encodeURIComponent(awb);
  const carrierLower = (carrier || "").toLowerCase();

  if (carrierLower.includes("dpd")) return `https://tracking.dpd.ro/?shipmentNumber=${awbClean}&language=ro`;
  if (carrierLower.includes("fan")) return `https://www.fancourier.ro/awb-tracking/?awb=${awbClean}`;
  if (carrierLower.includes("sameday")) return `https://sameday.ro/awb-tracking/?awb=${awbClean}`;

  return `https://tracking.dpd.ro/?shipmentNumber=${awbClean}&language=ro`;
}

function getStatusMeta(status: string | null | undefined) {
  switch (status) {
    case "fulfilled":
      return {
        label: "Finalizată",
        badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
        icon: "✓",
      };
    case "canceled":
      return {
        label: "Anulată",
        badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800",
        icon: "✕",
      };
    case "processing":
      return {
        label: "În procesare",
        badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
        icon: "⧖",
      };
    default:
      return {
        label: "În lucru",
        badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
        icon: "◐",
      };
  }
}

export default function AccountOrderCard({ order, onTrackingClick }: AccountOrderCardProps) {
  const statusMeta = getStatusMeta(order.status);
  const awbUrl = getAwbTrackingUrl(order.awbNumber, order.awbCarrier);
  const hasAwb = order.awbNumber && order.awbNumber !== "0";

  const formattedDate = new Date(order.createdAt).toLocaleString("ro-RO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedTotal = new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(order.total);

  return (
    <li className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 hover:shadow-md dark:hover:shadow-xl transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-700">
      {/* Header: Order No + Status + Date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Comanda #{order.orderNo}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{formattedDate}</p>
          </div>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${statusMeta.badge}`}>
          {statusMeta.icon} {statusMeta.label}
        </span>
      </div>

      {/* AWB Section */}
      {hasAwb && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 100 2H6a4 4 0 100 8h3a1 1 0 100 2H7a2 2 0 11-4-2v-4a2 2 0 012-2h6a1 1 0 100-2H4z"></path>
            </svg>
            <span className="text-sm font-mono font-semibold text-blue-900 dark:text-blue-200">
              AWB: {order.awbNumber}
            </span>
          </div>
          {awbUrl && (
            <a
              href={awbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              onClick={() => onTrackingClick?.(order)}
            >
              Track →
            </a>
          )}
        </div>
      )}

      {/* Total + Items Count */}
      <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{formattedTotal}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Produse</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{order.itemsCount || "—"}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href={`/account/orders/${order.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors flex-1 sm:flex-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
          <span>Grafică</span>
        </Link>

        <OrderDetails order={order} />

        {order.invoiceLink && (
          <a
            href={order.invoiceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Factură</span>
          </a>
        )}
      </div>
    </li>
  );
}
