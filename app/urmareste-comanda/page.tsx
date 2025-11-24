"use client";

import React, { useState } from "react";
import { Search, Package, Truck, CheckCircle, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { formatMoneyDisplay } from "@/lib/pricing";

type OrderResult = {
  orderNo: number;
  status: string;
  total: number;
  date: string;
  awb?: string;
  carrier?: string;
  items: any[];
};

export default function TrackOrderPage() {
  const [orderNo, setOrderNo] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderResult | null>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch("/api/order/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo, email }),
      });
      const data = await res.json();

      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.message || "Nu am găsit comanda.");
      }
    } catch (err) {
      setError("A apărut o eroare de conexiune.");
    } finally {
      setLoading(false);
    }
  }

  // Helper pentru status
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active": return { label: "În Producție", color: "text-blue-600", bg: "bg-blue-50", icon: Clock, step: 1 };
      case "fulfilled": return { label: "Expediată", color: "text-emerald-600", bg: "bg-emerald-50", icon: Truck, step: 3 };
      case "canceled": return { label: "Anulată", color: "text-red-600", bg: "bg-red-50", icon: AlertCircle, step: 0 };
      default: return { label: "În Așteptare", color: "text-slate-600", bg: "bg-slate-50", icon: Package, step: 1 };
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      
      {/* HEADER */}
      <div className="text-center mb-10 max-w-xl">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4 text-indigo-600">
           <Search size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Urmărește Comanda</h1>
        <p className="text-slate-500 text-lg">Verifică statusul comenzii tale rapid, fără să te autentifici. Ai nevoie doar de numărul comenzii și adresa de email.</p>
      </div>

      {/* FORMULAR */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleTrack} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Număr Comandă</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400 font-bold">#</span>
                <input 
                  type="text" 
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value.replace(/\D/g, ""))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                  placeholder="Ex: 1024"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email (folosit la comandă)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                placeholder="nume@email.com"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-pulse">Se verifică...</span>
              ) : (
                <>Verifică Status <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-xl flex items-center gap-3 border border-red-100">
              <AlertCircle size={20} />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* REZULTAT COMANDĂ */}
      {order && (
        <div className="w-full max-w-3xl mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            
            {/* Header Card */}
            <div className="bg-slate-900 p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-slate-400 text-sm font-medium">Comanda #{order.orderNo}</p>
                <p className="text-2xl font-bold mt-1">Total: {formatMoneyDisplay(order.total)}</p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md border border-white/10">
                <Clock size={18} className="text-indigo-300" />
                <span className="text-sm font-medium">{new Date(order.date).toLocaleDateString('ro-RO')}</span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* Status Bar */}
              <div className="mb-10">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Status Livrare</h3>
                
                <div className="relative">
                  {/* Line */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full -z-10"></div>
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full -z-10 transition-all duration-1000"
                    style={{ width: getStatusInfo(order.status).step >= 3 ? '100%' : getStatusInfo(order.status).step >= 2 ? '50%' : '10%' }}
                  ></div>

                  <div className="flex justify-between">
                    {/* Step 1: Confirmat */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <CheckCircle size={16} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Confirmată</span>
                    </div>

                    {/* Step 2: Producție */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors ${getStatusInfo(order.status).step >= 1 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white border-2 border-slate-200 text-slate-300'}`}>
                        <Package size={16} />
                      </div>
                      <span className={`text-xs font-bold ${getStatusInfo(order.status).step >= 1 ? 'text-slate-700' : 'text-slate-400'}`}>Producție</span>
                    </div>

                    {/* Step 3: Expediat */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-colors ${getStatusInfo(order.status).step >= 3 ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-white border-2 border-slate-200 text-slate-300'}`}>
                        <Truck size={16} />
                      </div>
                      <span className={`text-xs font-bold ${getStatusInfo(order.status).step >= 3 ? 'text-emerald-600' : 'text-slate-400'}`}>Expediată</span>
                    </div>
                  </div>
                </div>

                {/* AWB Info */}
                {order.awb && (
                  <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm"><Truck size={20} /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">AWB Generat</p>
                        <p className="text-xs text-slate-500">Curier: {order.carrier || 'Standard'}</p>
                      </div>
                    </div>
                    <div className="text-sm font-mono font-bold text-slate-700 bg-white px-3 py-1 rounded border border-slate-200">
                      {order.awb}
                    </div>
                  </div>
                )}
              </div>

              {/* Lista Produse */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Produse Comandate</h3>
                <ul className="divide-y divide-slate-100">
                  {order.items.map((item: any, i: number) => (
                    <li key={i} className="py-3 flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-700">{item.name}</span>
                      <span className="text-slate-500 font-semibold">x{item.qty}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}

    </main>
  );
}