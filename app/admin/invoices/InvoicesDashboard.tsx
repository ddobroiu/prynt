"use client";

import React, { useState } from "react";
import { 
  Search, 
  Download, 
  FileText, 
  Calendar, 
  User,
  ExternalLink
} from "lucide-react";

interface InvoiceData {
  id: string;
  series: string;
  number: string | number;
  date: string;
  clientName: string;
  clientEmail: string;
  total: number;
  status: string;
  downloadUrl: string;
}

interface InvoicesDashboardProps {
  invoices: InvoiceData[];
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    maximumFractionDigits: 2
  }).format(amount);
};

export default function InvoicesDashboard({ invoices = [] }: InvoicesDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrare
  const filteredInvoices = invoices.filter((inv) => {
    const s = searchTerm.toLowerCase();
    const invoiceRef = `${inv.series}${inv.number}`.toLowerCase();
    return (
      inv.clientName.toLowerCase().includes(s) ||
      inv.clientEmail.toLowerCase().includes(s) ||
      invoiceRef.includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Bara de Căutare */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative group w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Caută după serie, nume client sau email..."
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-full transition-all bg-gray-50 focus:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center text-sm text-gray-500 ml-auto">
            {filteredInvoices.length} rezultate
        </div>
      </div>

      {/* Tabel Facturi */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">Factura</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Data</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Client</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Total</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="w-10 h-10 text-gray-300" />
                        <p>Nu am găsit facturi conform criteriilor.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100">
                          {inv.series}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {inv.series} {inv.number}
                          </div>
                          <div className="text-xs text-gray-500">ID: {inv.id.slice(0,8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(inv.date)}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{inv.clientName}</span>
                        <span className="text-xs text-gray-500">{inv.clientEmail}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      {formatMoney(inv.total)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a 
                        href={inv.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all text-xs font-medium"
                      >
                        <Download className="w-4 h-4" />
                        PDF
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}