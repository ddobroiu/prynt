"use client";

import Link from "next/link";
import AccountOrderCard from "@/components/AccountOrderCard";

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

interface AccountOrdersListProps {
  orders: Order[];
}

export default function AccountOrdersList({ orders }: AccountOrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 bg-white dark:bg-slate-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Nu ai nicio comandă</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Încă nu ai plasat o comandă pe site-ul nostru.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Începe cumpărăturile
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Comenzile mele
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {orders.length} comand{orders.length === 1 ? "ă" : "e"} în total
          </p>
        </div>
      </div>

      <ul className="space-y-4">
        {orders.map((order) => (
          <AccountOrderCard key={order.id} order={order} />
        ))}
      </ul>
    </div>
  );
}
