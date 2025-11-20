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
import { RefreshCw, Search, Filter, AlertCircle, CheckCircle2, Clock } from "lucide-react";

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
  active: { label: "În lucru", badge: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: Clock },
  fulfilled: { label: "Finalizată", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: CheckCircle2 },
  canceled: { label: "Anulată", badge: "bg-rose-500/10 text-rose-400 border-rose-500/20", icon: AlertCircle },
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
    const shippingAddress = o.address || o.billing;

    return (
      <tr key={o.id} className="transition hover:bg-white/[0.02] border-b border-white/5 last:border-0 group">
        
        {/* 1. INFO & STATUS (Compact) */}
        <td className="px-4 py-4 align-top w-[150px]">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-sm bg-white/5 px-1.5 py-0.5 rounded">
                      #{o.orderNo ?? '—'}
                    </span>
                </div>
                <div className="flex flex-col gap-0.5 text-[10px] text-zinc-500 font-medium">
                    <span>{new Date(o.createdAt).toLocaleDateString('ro-RO')}</span>
                    <span>{new Date(o.createdAt).toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="mt-1">
                     <AdminOrderStatusControl id={o.id} status={o.status} onChange={refreshData} />
                </div>
            </div>
        </td>

        {/* 2. PRODUSE & GRAFICĂ */}
        <td className="px-4 py-4 align-top min-w-[220px] max-w-[320px]">
           <div className="flex flex-col gap-2 h-full">
             <div className="flex flex-col gap-1.5 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
                {o.items && o.items.length > 0 ? (
                    o.items.map((item: any, idx: number) => (
                    <div key={idx} className="text-xs text-zinc-300 bg-zinc-900/40 p-1.5 rounded border border-white/5 flex justify-between gap-2">
                        <div className="flex-1 truncate" title={item.productName}>
                          <span className="font-bold text-indigo-400 mr-1">{item.quantity}x</span> 
                          {item.productName || "Custom"}
                        </div>
                    </div>
                    ))
                ) : ( <span className="text-zinc-600 italic text-xs">Fără produse</span> )}
             </div>
             <div className="mt-auto pt-1">
                 <AdminGraphicsControl orderId={o.id} items={o.items || []} />
             </div>
           </div>
        </td>

        {/* 3. ADRESĂ LIVRARE (Editabilă) */}
        <td className="px-4 py-4 align-top w-[240px]">
             <AdminAddressEditor 
                orderId={o.id} 
                initialAddress={shippingAddress} 
                onUpdate={refreshData} 
             />
        </td>

        {/* 4. LOGISTICĂ (AWB) */}
        <td className="px-4 py-4 align-top w-[180px]">
             <div className="flex flex-col gap-1 bg-zinc-900/20 p-2 rounded-lg border border-white/5">
                 <span className="text-[9px] font-bold uppercase text-zinc-500 tracking-wider mb-1">Livrare DPD</span>
                 <AdminAwbControl orderId={o.id} currentAwb={o.awb} />
             </div>
        </td>

        {/* 5. FACTURARE (Upload/View) */}
        <td className="px-4 py-4 align-top w-[180px]">
            <div className="flex flex-col gap-1 bg-zinc-900/20 p-2 rounded-lg border border-white/5 h-full justify-between">
                 <div>
                   <span className="text-[9px] font-bold uppercase text-zinc-500 tracking-wider mb-1 block">Factură</span>
                   <AdminInvoiceControl id={o.id} invoiceLink={o.invoiceLink} />
                 </div>
                 <div className="mt-2 text-right">
                    <div className="text-sm font-bold text-white">{fmtRON(Number(o.total))}</div>
                    <div className="text-[9px] text-zinc-500 uppercase">{o.paymentType}</div>
                 </div>
            </div>
        </td>

        {/* 6. DETALII */}
        <td className="px-4 py-4 align-middle text-right w-[60px]">
             <OrderDetails order={o} />
        </td>
      </tr>
    );
  }), [orders]);

  return (
    <section className="flex flex-col h-full overflow-hidden rounded-3xl border border-white/10 bg-[#09090b]/80 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
      {/* Toolbar */}
      <div className="flex-none flex flex-col gap-4 border-b border-white/5 px-6 py-4 md:flex-row md:items-center md:justify-between bg-white/[0.02]">
        <div className="flex items-center gap-4">
            <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    Centru Comenzi
                    <button onClick={refreshData} className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-zinc-500 hover:text-indigo-400" title="Reîncarcă datele">
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    </button>
                </h2>
                <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                   <span className="bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20 font-medium">
                     {pagination.totalOrders}
                   </span>
                   <span>comenzi active</span>
                </div>
            </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-center">
          <div className="relative w-full md:w-64 group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              placeholder="Caută (nume, telefon, ID)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus:border-indigo-500/50 focus:ring-indigo-500/20 w-full h-9 text-sm rounded-xl transition-all"
            />
          </div>
          
          <div className="w-full md:w-[180px]">
            <Select onValueChange={setStatus} value={status}>
              <SelectTrigger className="w-full bg-black/40 border-white/10 text-white h-9 text-sm rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2">
                  <Filter size={12} className="text-zinc-500" />
                  <SelectValue placeholder="Status Comandă" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#09090b] border-white/10 text-zinc-200">
                <SelectItem value="all">Toate</SelectItem>
                <SelectItem value="active">În lucru</SelectItem>
                <SelectItem value="fulfilled">Finalizate</SelectItem>
                <SelectItem value="canceled">Anulate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabel Scrollabil */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-black/20">
        <table className="min-w-full text-sm w-full border-collapse">
          <thead className="bg-[#09090b] text-left text-[10px] uppercase tracking-wider text-zinc-500 font-semibold sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-4 py-3 bg-[#09090b]/95 backdrop-blur border-b border-white/5">Comandă</th>
              <th className="px-4 py-3 bg-[#09090b]/95 backdrop-blur border-b border-white/5">Articole & Fișiere</th>
              <th className="px-4 py-3 bg-[#09090b]/95 backdrop-blur border-b border-white/5">Adresă (Editabil)</th>
              <th className="px-4 py-3 bg-[#09090b]/95 backdrop-blur border-b border-white/5">Curierat</th>
              <th className="px-4 py-3 bg-[#09090b]/95 backdrop-blur border-b border-white/5">Financiar</th>
              <th className="px-4 py-3 bg-[#09090b]/95 backdrop-blur border-b border-white/5 text-right">Opțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-32">
                   <div className="flex flex-col items-center gap-3">
                     <div className="h-8 w-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                     <span className="text-zinc-500 text-xs animate-pulse">Se actualizează datele...</span>
                   </div>
                </td>
              </tr>
            ) : tableRows.length > 0 ? (
              tableRows
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-24 text-zinc-600">
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <Search size={32} />
                    <p className="text-sm font-medium">Nu am găsit comenzi</p>
                    <p className="text-xs">Încearcă să modifici filtrele de căutare.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex-none flex items-center justify-between border-t border-white/5 px-6 py-3 bg-[#09090b]">
        <span className="text-xs text-zinc-500 font-mono">
          Pagina <span className="text-white">{pagination.currentPage}</span> / {pagination.totalPages}
        </span>
        <div className="flex gap-2">
          <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} variant="outline" size="sm" className="h-7 text-xs bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10">Anterioară</Button>
          <Button onClick={() => setPage((p) => p + 1)} disabled={page === pagination.totalPages} variant="outline" size="sm" className="h-7 text-xs bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10">Următoare</Button>
        </div>
      </div>
    </section>
  );
}