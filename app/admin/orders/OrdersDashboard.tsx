// app/admin/orders/OrdersDashboard.tsx
"use client";

import { useState, useEffect, useMemo } from "react";

// A simple debounce hook to avoid external dependencies
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
import AdminOrderStatusControl from "@/components/AdminOrderStatusControl";
import AdminInvoiceControl from "@/components/AdminInvoiceControl";
import OrderDetails from "@/components/OrderDetails";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Helper to format currency
function fmtRON(n: number) {
  return new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(n);
}

const STATUS_META = {
  active: { label: "În lucru", badge: "bg-amber-500/20 text-amber-200 border-amber-400/30" },
  fulfilled: { label: "Finalizată", badge: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30" },
  canceled: { label: "Anulată", badge: "bg-rose-500/15 text-rose-200 border-rose-400/30" },
};

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalOrders: 0 });
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });
      if (status) params.set("status", status);
      if (debouncedSearchTerm) params.set("query", debouncedSearchTerm);

      try {
        const res = await fetch(`/api/admin/orders?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setOrders(data.orders);
        setPagination(data.pagination);
      } catch (error) {
        console.error(error);
        // Handle error state in UI
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, status, debouncedSearchTerm]);

  const tableRows = useMemo(() => orders.map((o: any) => {
    const statusKey = o.status || 'active';
    return (
      <tr key={o.id} className="transition hover:bg-white/5">
        <td className="px-4 py-3 font-semibold text-white">#{o.orderNo ?? '—'}</td>
        <td className="px-4 py-3 whitespace-nowrap text-muted">{new Date(o.createdAt).toLocaleString('ro-RO')}</td>
        <td className="px-4 py-3">
          <div className="font-semibold text-white">{o.address?.nume_prenume || o.billing?.name || '—'}</div>
          <div className="text-xs text-muted">{o.address?.localitate || o.billing?.localitate || '—'}</div>
        </td>
        <td className="px-4 py-3">
          <div>{o.address?.email}</div>
          <div className="text-xs text-muted">{o.address?.telefon}</div>
        </td>
        <td className="px-4 py-3 whitespace-nowrap font-semibold text-white">{fmtRON(Number(o.total))}</td>
        <td className="px-4 py-3 text-muted">{o.paymentType}</td>
        <td className="px-4 py-3">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STATUS_META[statusKey]?.badge}`}>
            {STATUS_META[statusKey]?.label}
          </span>
        </td>
        <td className="px-4 py-4">
          <div className="flex items-center gap-2">
            <AdminOrderStatusControl id={o.id} status={o.status} />
            <AdminInvoiceControl id={o.id} invoiceLink={o.invoiceLink} />
            <OrderDetails order={o} />
          </div>
        </td>
      </tr>
    );
  }), [orders]);

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-indigo-950/50 backdrop-blur">
      <div className="flex flex-col gap-4 border-b border-white/5 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Comenzi Recente</h2>
          <p className="text-sm text-muted">
            Afișate {orders.length} din {pagination.totalOrders} comenzi.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Caută comandă, client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border-white/10"
          />
          <Select onValueChange={setStatus} value={status}>
            <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/10">
              <SelectValue placeholder="Filtrează status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toate statusurile</SelectItem>
              <SelectItem value="active">În lucru</SelectItem>
              <SelectItem value="fulfilled">Finalizată</SelectItem>
              <SelectItem value="canceled">Anulată</SelectItem>
            </SelectContent>
          </Select>
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
              <th className="px-4 py-3 font-semibold text-white/70">Status</th>
              <th className="px-4 py-3 font-semibold text-white/70">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-16 text-muted">
                  Se încarcă comenzile...
                </td>
              </tr>
            ) : tableRows.length > 0 ? (
              tableRows
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-16 text-muted">
                  Niciun rezultat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-white/5 px-6 py-4">
        <span className="text-sm text-muted">
          Pagina {pagination.currentPage} din {pagination.totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            variant="outline"
          >
            Anterioară
          </Button>
          <Button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === pagination.totalPages || loading}
            variant="outline"
          >
            Următoare
          </Button>
        </div>
      </div>
    </section>
  );
}
