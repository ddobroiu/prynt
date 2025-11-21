"use client";

import React, { useState } from "react";
import { 
  Search, 
  MapPin, 
  Phone, 
  CreditCard, 
  Banknote, 
  Calendar, 
  Package, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Truck, 
  FileText, 
  MoreVertical,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Loader2,
  RefreshCw,
  Type,
  Palette,
  UploadCloud
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- TIPURI ---
type OrderItem = {
  id: string;
  name: string;
  qty: number;
  unit: any;
  total: any;
  artworkUrl?: string | null;
  // Metadata este cheia pentru text și opțiuni
  metadata?: {
    designOption?: 'upload' | 'text_only' | 'pro';
    textDesign?: string;
    [key: string]: any;
  } | null;
};

type Order = {
  id: string;
  orderNo: number;
  createdAt: string | Date;
  status: string;
  paymentType: string;
  total: any;
  shippingFee: any;
  user?: {
    name: string | null;
    email: string;
    phone: string | null;
  };
  address: any;
  billing: any;
  items: OrderItem[];
  awbNumber?: string | null;
  awbCarrier?: string | null;
  invoiceLink?: string | null;
};

interface OrdersDashboardProps {
  initialOrders: Order[];
}

// --- UTILS ---
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatMoney = (amount: any) => {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
  }).format(Number(amount));
};

// --- COMPONENTĂ STATUS ---
function OrderStatusSelector({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;
    if (newStatus === "canceled" && !confirm("Ești sigur că vrei să anulezi această comandă?")) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/order/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Eroare la actualizare");
      setStatus(newStatus);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Eroare actualizare status.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case "active": return "bg-blue-50 text-blue-700 border-blue-200";
      case "fulfilled": return "bg-green-50 text-green-700 border-green-200";
      case "canceled": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="relative inline-block text-left">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 rounded-lg">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
        </div>
      )}
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        className={`appearance-none cursor-pointer pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${getStatusColor(status)}`}
        disabled={isLoading}
      >
        <option value="active">În Lucru</option>
        <option value="fulfilled">Finalizată</option>
        <option value="canceled">Anulată</option>
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60">
        <RefreshCw className="w-3 h-3" />
      </div>
    </div>
  );
}

// --- COMPONENTĂ AFIȘARE GRAFICĂ (The Main Fix) ---
function ArtworkStatus({ item }: { item: OrderItem }) {
  const meta = item.metadata || {};
  const designOption = meta.designOption;
  const hasArtwork = !!item.artworkUrl;

  // 1. Dacă există link direct (fie upload inițial, fie upload ulterior)
  if (hasArtwork) {
    return (
      <a 
        href={item.artworkUrl!} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 border border-emerald-100 transition-colors"
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        Vezi Grafica
        <ExternalLink className="w-3 h-3 opacity-50" />
      </a>
    );
  }

  // 2. Opțiune: Doar Text
  if (designOption === 'text_only') {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
          <Type className="w-3.5 h-3.5" />
          Grafică Text
        </div>
        {meta.textDesign && (
          <span className="text-[10px] text-gray-500 max-w-[150px] truncate bg-white px-1 rounded border border-gray-100" title={meta.textDesign}>
            "{meta.textDesign}"
          </span>
        )}
      </div>
    );
  }

  // 3. Opțiune: Grafică Pro
  if (designOption === 'pro') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100">
        <Palette className="w-3.5 h-3.5" />
        Solicitat Design Pro
      </div>
    );
  }

  // 4. Opțiune: Upload (explicit)
  if (designOption === 'upload') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-bold border border-yellow-100">
        <UploadCloud className="w-3.5 h-3.5" />
        Așteaptă Upload
      </div>
    );
  }

  // 5. Fallback: Lipsă sau necunoscut
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-100">
      <UploadCloud className="w-3.5 h-3.5" />
      Așteaptă Upload
    </div>
  );
}

// --- DASHBOARD ---
export default function OrdersDashboard({ initialOrders = [] }: OrdersDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const safeOrders = Array.isArray(initialOrders) ? initialOrders : [];

  const filteredOrders = safeOrders.filter((order) => {
    const s = searchTerm.toLowerCase();
    const address = order.address || {};
    const clientName = (address.nume_prenume || address.nume || order.user?.name || "").toLowerCase();
    const clientEmail = (address.email || order.user?.email || "").toLowerCase();
    const clientPhone = (address.telefon || order.user?.phone || "").toLowerCase();

    const matchesSearch =
      order.orderNo.toString().includes(s) ||
      clientEmail.includes(s) ||
      clientName.includes(s) ||
      clientPhone.includes(s);
      
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="space-y-8 p-4 md:p-8 bg-gray-50/50 min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Comenzi</h1>
          <p className="text-gray-500 mt-1">Gestionează fluxul de producție.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Caută comandă, nume..."
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-full sm:w-72 transition-all bg-gray-50 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-gray-50 focus:bg-white cursor-pointer transition-all"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Toate statusurile</option>
            <option value="active">În Lucru</option>
            <option value="fulfilled">Finalizate</option>
            <option value="canceled">Anulate</option>
          </select>
        </div>
      </div>

      {/* LISTA */}
      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 border-dashed">
            <Package className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">Nicio comandă găsită</h3>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const address = order.address || {};
            const isCard = order.paymentType === "Card";
            const isExpanded = expandedOrderId === order.id;
            
            const displayName = address.nume_prenume || address.nume || order.user?.name || "Nume lipsă";
            const displayEmail = address.email || order.user?.email || "Email lipsă";
            const displayPhone = address.telefon || order.user?.phone || "-";

            // Logică pentru "Grafică Completă" (Generală pe card)
            const itemsCount = order.items.length;
            const itemsReady = order.items.filter(i => {
                const meta = i.metadata || {};
                // E gata dacă are link SAU e text_only SAU e pro
                return !!i.artworkUrl || meta.designOption === 'text_only' || meta.designOption === 'pro';
            }).length;
            const isReady = itemsCount > 0 && itemsCount === itemsReady;

            return (
              <div 
                key={order.id} 
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isExpanded ? "shadow-xl border-indigo-200 ring-1 ring-indigo-100" : "shadow-sm border-gray-200 hover:shadow-md hover:border-gray-300"
                }`}
              >
                {/* CARD PRINCIPAL */}
                <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
                  
                  {/* STATUS */}
                  <div className="lg:col-span-3 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-lg font-bold font-mono border border-indigo-100">
                        #{order.orderNo}
                      </div>
                      <OrderStatusSelector orderId={order.id} currentStatus={order.status} />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="mt-3">
                       {isReady ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Grafică OK</span>
                          </div>
                       ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Așteaptă Grafică ({itemsReady}/{itemsCount})</span>
                          </div>
                       )}
                    </div>
                  </div>

                  {/* CLIENT */}
                  <div className="lg:col-span-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 h-full">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 bg-white p-2 rounded-lg shadow-sm text-gray-600 border border-gray-200">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="text-sm">
                          <p className="font-bold text-gray-900">{displayName}</p>
                          <div className="flex items-center gap-2 text-gray-600 mt-0.5">
                            <Mail className="w-3 h-3" /> {displayEmail}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-3 h-3" /> {displayPhone}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200 flex items-start gap-3">
                        <div className="mt-0.5 text-indigo-600">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <p className="text-sm text-gray-700 leading-snug">
                          {address?.localitate || "Localitate lipsă"}, {address?.judet || ""} <br/>
                          <span className="text-gray-500 text-xs">{address?.strada_nr || "Stradă lipsă"}</span>
                          {address?.bloc && <span className="text-gray-500 text-xs">, Bl. {address.bloc}</span>}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="lg:col-span-3">
                    <div className="flex flex-col h-full justify-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${isCard ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                              {isCard ? <CreditCard className="w-5 h-5" /> : <Banknote className="w-5 h-5" />}
                          </div>
                          <div>
                              <p className="text-xs text-gray-500 font-medium uppercase">Metodă Plată</p>
                              <p className={`font-bold text-sm ${isCard ? 'text-emerald-700' : 'text-orange-700'}`}>
                                  {order.paymentType}
                              </p>
                          </div>
                      </div>
                      <div className="flex justify-between items-end border-t border-gray-100 pt-3">
                          <span className="text-sm text-gray-500">Total</span>
                          <span className="text-xl font-black text-gray-900">{formatMoney(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* BUTON EXPAND */}
                  <div className="lg:col-span-2 flex justify-end items-center h-full">
                    <button 
                        onClick={() => toggleExpand(order.id)}
                        className={`flex items-center justify-center gap-2 w-full lg:w-auto px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                          isExpanded 
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                    >
                        {isExpanded ? "Ascunde" : "Detalii"}
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* DETALII EXTINSE */}
                {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50/30 p-6 animate-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            <div className="lg:col-span-2 space-y-4">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                  <Package className="w-4 h-4" />
                                  Produse ({order.items.length})
                                </h4>
                                <div className="grid gap-3">
                                  {order.items.map((item) => (
                                      <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                          <div className="flex items-center gap-4">
                                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 border border-gray-200">
                                                {item.artworkUrl ? <FileText className="w-6 h-6 text-indigo-500" /> : <Package className="w-6 h-6" />}
                                              </div>
                                              <div>
                                                  <p className="font-bold text-gray-900 text-base">{item.name}</p>
                                                  <p className="text-sm text-gray-500">
                                                    <span className="font-semibold text-gray-900">{item.qty} buc</span> × {formatMoney(item.unit)}
                                                  </p>
                                              </div>
                                          </div>
                                          
                                          {/* AICI ESTE FIXUL PENTRU AFIȘARE */}
                                          <div className="flex items-center justify-end w-full sm:w-auto">
                                              <ArtworkStatus item={item} />
                                          </div>
                                      </div>
                                  ))}
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-full sticky top-6">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Acțiuni Rapide</h4>
                                    <div className="space-y-3">
                                        <Link href={`/admin/orders/${order.id}`} className="flex items-center justify-center w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-sm">
                                            <MoreVertical className="w-4 h-4" /> Editează Comanda
                                        </Link>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 p-3 rounded-lg text-xs font-bold transition-colors">
                                                <Truck className="w-5 h-5 text-gray-500" /> Generare AWB
                                            </button>
                                            <button className="flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 p-3 rounded-lg text-xs font-bold transition-colors">
                                                <FileText className="w-5 h-5 text-gray-500" /> Emitere Factură
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}