// app/admin/orders/OrdersDashboard.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import AdminOrderStatusControl from "@/components/AdminOrderStatusControl";
import AdminInvoiceControl from "@/components/AdminInvoiceControl";
import AdminAwbControl from "@/components/AdminAwbControl";
import AdminAddressEditor from "@/components/AdminAddressEditor";
import AdminGraphicsControl from "@/components/AdminGraphicsControl";
import OrderDetails from "@/components/OrderDetails";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

// --- HOOKS ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- HELPERS ---
function fmtRON(n: number) {
  return new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON" }).format(n);
}

const STATUS_META = {
  active: { label: "În lucru", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  fulfilled: { label: "Finalizată", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  canceled: { label: "Anulată", badge: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
};

type StatusKey = keyof typeof STATUS_META;

function normalizeStatus(status?: string | null): StatusKey {
  if (status === 'fulfilled' || status === 'canceled' || status === 'active') return status;
  return 'active';
}

export default function OrdersDashboard() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Pt refresh manual

  const refreshData = () => setRefreshTrigger(prev => prev + 1);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "20" });
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
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page, status, debouncedSearchTerm, refreshTrigger]);

  const tableRows = useMemo(() => orders.map((o: any) => {
    const statusKey = normalizeStatus(o.status);
    // Prioritizăm adresa de livrare (address), fallback pe billing
    const shippingAddress = o.address || o.billing;

    return (
      <tr key={o.id} className="transition hover:bg-white/[0.02] border-b border-white/5 last:border-0 group">
        
        {/* 1. INFO COMANDĂ (ID, Data, Status) */}
        <td className="px-4 py-4 align-top w-[140px]">
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm">#{o.orderNo ?? '—'}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-medium">
                    {new Date(o.createdAt).toLocaleDateString('ro-RO')} <br/>
                    {new Date(o.createdAt).toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'})}
                </span>
                <div className="mt-1">
                     <AdminOrderStatusControl id={o.id} status={o.status} />
                </div>
            </div>
        </td>

        {/* 2. PRODUSE & GRAFICĂ */}
        <td className="px-4 py-4 align-top min-w-[200px] max-w-[300px]">
           <div className="flex flex-col gap-2">
             <div className="flex flex-col gap-1 max-h-[100px] overflow-y-auto custom-scrollbar pr-1">
                {o.items && o.items.length > 0 ? (
                    o.items.map((item: any, idx: number) => (
                    <div key={idx} className="text-xs text-zinc-300 pl-2 border-l border-white/10 leading-tight py-0.5">
                        <span className="font-bold text-indigo-400">{item.quantity}x</span> {item.productName || "Custom"}
                    </div>
                    ))
                ) : ( <span className="text-zinc-600 italic text-xs">Fără produse</span> )}
             </div>
             {/* Buton Grafică */}
             <div className="mt-auto">
                 <AdminGraphicsControl orderId={o.id} items={o.items || []} />
             </div>
           </div>
        </td>

        {/* 3. ADRESĂ LIVRARE (Editabilă) */}
        <td className="px-4 py-4 align-top w-[220px]">
             <AdminAddressEditor 
                orderId={o.id} 
                initialAddress={shippingAddress} 
                onUpdate={refreshData} // Reface fetch după editare
             />
        </td>

        {/* 4. LOGISTICĂ (AWB) */}
        <td className="px-4 py-4 align-top w-[180px]">
             <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Livrare</span>
                 <AdminAwbControl orderId={o.id} currentAwb={o.awb} />
             </div>
        </td>

        {/* 5. FACTURARE (Upload/View) */}
        <td className="px-4 py-4 align-top w-[180px]">
            <div className="flex flex-col gap-1">
                 <span className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider">Factură</span>
                 <AdminInvoiceControl id={o.id} invoiceLink={o.invoiceLink} />
                 <div className="mt-1 text-xs font-bold text-white text-right">
                    {fmtRON(Number(o.total))}
                 </div>
                 <div className="text-[9px] text-zinc-500 text-right uppercase">{o.paymentType}</div>
            </div>
        </td>

        {/* 6. ACȚIUNI EXTRA */}
        <td className="px-4 py-4 align-middle text-right w-[60px]">
             <OrderDetails order={o} />
        </td>
      </tr>
    );
  }), [orders]);

  return (
    <section className="flex flex-col h-full overflow-hidden rounded-3xl border border-white/10 bg-[#09090b]/60 shadow-2xl backdrop-blur-xl">
      {/* Header Dashboard */}
      <div className="flex-none flex flex-col gap-4 border-b border-white/5 px-6 py-5 md:flex-row md:items-center md:justify-between bg-white/[0.02]">
        <div className="flex items-center gap-4">
            <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    Centru Comenzi
                    <button onClick={refreshData} className="p-1 hover:bg-white/10 rounded-full transition-colors text-zinc-500 hover:text-white" title="Reîncarcă">
                        <RefreshCw size={14} />
                    </button>
                </h2>
                <p className="text-sm text-zinc-400">
                    {pagination.totalOrders} comenzi active
                </p>
            </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder="Caută: nume, awb, id..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500 w-full md:w-64 h-9 text-sm"
          />
          
          <Select onValueChange={setStatus} value={status}>
            <SelectTrigger className="w-full md:w-[160px] bg-black/40 border-white/10 text-white h-9 text-sm">
              <SelectValue placeholder="Toate statusurile" />
            </SelectTrigger>
            <SelectContent className="bg-[#09090b] border-white/10 text-zinc-200">
              <SelectItem value="">Toate</SelectItem>
              <SelectItem value="active">În lucru</SelectItem>
              <SelectItem value="fulfilled">Finalizate</SelectItem>
              <SelectItem value="canceled">Anulate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabel (Scrollable Content) */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="min-w-full text-sm w-full">
          <thead className="bg-black/20 text-left text-[10px] uppercase tracking-wider text-zinc-500 font-medium sticky top-0 backdrop-blur-md z-10">
            <tr>
              <th className="px-4 py-3">Info</th>
              <th className="px-4 py-3">Articole & Grafică</th>
              <th className="px-4 py-3">Livrare (Editabil)</th>
              <th className="px-4 py-3">Curier (AWB)</th>
              <th className="px-4 py-3 text-right">Facturare & Total</th>
              <th className="px-4 py-3 text-right">Detalii</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-32">
                   <div className="flex justify-center"><RefreshCw className="animate-spin text-indigo-500" /></div>
                </td>
              </tr>
            ) : tableRows.length > 0 ? (
              tableRows
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-20 text-zinc-600 text-xs uppercase tracking-widest">
                  Nu există comenzi
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Paginare */}
      <div className="flex-none flex items-center justify-between border-t border-white/5 px-6 py-3 bg-white/[0.02]">
        <span className="text-xs text-zinc-500">
          Pagina {pagination.currentPage} / {pagination.totalPages}
        </span>
        <div className="flex gap-2">
          <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} variant="outline" size="sm" className="h-7 text-xs bg-transparent border-white/10 text-zinc-400">Prev</Button>
          <Button onClick={() => setPage((p) => p + 1)} disabled={page === pagination.totalPages} variant="outline" size="sm" className="h-7 text-xs bg-transparent border-white/10 text-zinc-400">Next</Button>
        </div>
      </div>
    </section>
  );
}