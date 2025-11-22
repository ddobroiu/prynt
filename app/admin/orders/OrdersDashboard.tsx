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
  UploadCloud,
  Download,
  Upload,
  Building2,
  Megaphone,
  Globe
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
  billing: any;   // Datele de facturare (JSON)
  marketing?: any; // Datele de marketing (JSON)
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

// --- COMPONENTĂ AFIȘARE GRAFICĂ ---
function ArtworkStatus({ item }: { item: OrderItem }) {
  const meta = item.metadata || {};
  const designOption = meta.designOption;
  const hasArtwork = !!item.artworkUrl;

  if (hasArtwork) {
    return (
      <a 
        href={item.artworkUrl || '#'} 
        target={item.artworkUrl ? '_blank' : undefined} 
        rel={item.artworkUrl ? 'noopener noreferrer' : undefined} 
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100`}
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        Fișier Client
        <ExternalLink className="w-3 h-3 opacity-50" />
      </a>
    );
  }
  if (designOption === 'text_only') {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100">
          <Type className="w-3.5 h-3.5" />
          Grafică Text
        </div>
      </div>
    );
  }
  if (designOption === 'pro') {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100">
          <Palette className="w-3.5 h-3.5" />
          Design Pro
        </div>
        {meta['Cost grafică'] && (
          <span className="text-[10px] text-purple-700 bg-purple-50 px-1 rounded border border-purple-100 font-semibold" title="Cost grafică">
            {meta['Cost grafică']}
          </span>
        )}
      </div>
    );
  }
  if (designOption === 'upload') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-bold border border-yellow-100">
        <UploadCloud className="w-3.5 h-3.5" />
        Așteaptă Upload
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-100">
      <UploadCloud className="w-3.5 h-3.5" />
      Așteaptă Upload
    </div>
  );
}

// --- COMPONENTĂ FACTURĂ ---
function InvoiceControl({ order }: { order: Order }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert("Te rugăm să încarci doar fișiere PDF.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/admin/order/${order.id}/upload-invoice`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message || "Eroare upload");
      
      alert("Factură încărcată cu succes!");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(`Eroare: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (order.invoiceLink) {
    return (
      <div className="flex flex-col gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
        <div className="flex items-center justify-between border-b border-emerald-200/50 pb-2 mb-1">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
            <FileText className="w-4 h-4" />
            Factură emisă
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        
        <a 
          href={order.invoiceLink} 
          target="_blank" 
          rel="noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100 px-3 py-2 rounded text-xs font-bold transition-colors shadow-sm"
        >
          <Download className="w-3 h-3" /> Vizualizează PDF
        </a>

        <div className="pt-2 border-t border-emerald-200/50">
            <p className="text-[10px] text-emerald-600 mb-1.5 font-medium text-center">Ai o variantă corectată?</p>
            <label className="w-full cursor-pointer flex items-center justify-center gap-2 bg-emerald-100/50 border border-emerald-200 text-emerald-700 hover:bg-emerald-200/50 px-3 py-1.5 rounded text-xs font-bold transition-colors">
                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                {uploading ? "Se încarcă..." : "Înlocuiește PDF"}
                <input type="file" className="hidden" accept="application/pdf" onChange={handleUpload} disabled={uploading} />
            </label>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex items-center gap-2 text-gray-700 font-bold text-xs">
        <FileText className="w-4 h-4 text-gray-400" />
        Fără factură
      </div>
      <label className="w-full cursor-pointer flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded text-xs font-bold transition-colors">
        {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
        {uploading ? "Se încarcă..." : "Încarcă PDF"}
        <input type="file" className="hidden" accept="application/pdf" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
}

// --- DASHBOARD ---
export default function OrdersDashboard({ initialOrders = [] }: OrdersDashboardProps) {
  const router = useRouter();
  const [generatingAwbId, setGeneratingAwbId] = useState<string | null>(null);
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

  const handleGenerateAwb = async (orderId: string) => {
    setGeneratingAwbId(orderId);
    try {
      const res = await fetch(`/api/dpd/awb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) throw new Error('Eroare generare AWB');
      const data = await res.json();

      if (data?.awb) {
        // open tracking page in new tab and refresh admin list
        const awb = encodeURIComponent(data.awb);
        window.open(`https://tracking.dpd.ro/?shipmentNumber=${awb}&language=ro`, '_blank');
        router.refresh();
      } else if (data?.url) {
        // fallback if API returned a URL to complete emission
        window.open(data.url, '_blank');
      } else {
        alert('Emitere AWB nereușită — verifică consola.');
        console.error('AWB response:', data);
      }
    } catch (e) {
      console.error(e);
      alert('Eroare la emitere AWB.');
    } finally {
      setGeneratingAwbId(null);
    }
  };

  const ignoredMetadataKeys = [
    'designOption', 
    'textDesign', 
    'artworkUrl', 
    'Cost grafică', 
    'price', 
    'totalAmount',
    'artworkLink',
    'artwork',
  ];

  return (
    <div className="space-y-8 p-4 md:p-8 bg-gray-50/50 min-h-screen font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Comenzi</h1>
            <p className="text-gray-500 mt-1">Gestionează fluxul de producție.</p>
          </div>
          <button 
            onClick={() => router.refresh()} 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors" 
            title="Reîmprospătează lista"
          >
            <RefreshCw size={20} />
          </button>
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
            <option value="canceled">Anulată</option>
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

            const itemsCount = order.items.length;
            const itemsReady = order.items.filter(i => {
                const meta = i.metadata || {};
                return !!i.artworkUrl || meta.designOption === 'text_only' || meta.designOption === 'pro';
            }).length;
            const isReady = itemsCount > 0 && itemsCount === itemsReady;

            const billing = order.billing || {};
            const isCompany = billing.tip_factura === 'companie' || billing.tip_factura === 'persoana_juridica';

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
                        <div className="text-sm text-gray-700 leading-snug w-full">
                          {address?.localitate || "Localitate lipsă"}, {address?.judet || ""} {address?.postCode ? `(${address.postCode})` : ""}
                          <div className="block mt-1 font-medium">{address?.strada_nr || "Stradă lipsă"}</div>
                          
                          {/* ADRESĂ DETALIATĂ */}
                          {(address?.bloc || address?.scara || address?.etaj || address?.ap || address?.interfon) && (
                              <div className="text-gray-500 text-xs mt-1 bg-white/50 p-1 rounded border border-gray-200/50 inline-block">
                                {[
                                    address.bloc && `Bl. ${address.bloc}`,
                                    address.scara && `Sc. ${address.scara}`,
                                    address.etaj && `Et. ${address.etaj}`,
                                    address.ap && `Ap. ${address.ap}`,
                                    address.interfon && `Int. ${address.interfon}`
                                ].filter(Boolean).join(', ')}
                              </div>
                          )}
                        </div>
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
                            
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                  <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                    <Package className="w-4 h-4" />
                                    Produse ({order.items.length})
                                  </h4>
                                  <div className="grid gap-3">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 border border-gray-200">
                                                  {item.artworkUrl ? <FileText className="w-6 h-6 text-indigo-500" /> : <Package className="w-6 h-6" />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-gray-900 text-base">{item.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                      <span className="font-semibold text-gray-900">{item.qty} buc</span> × {formatMoney(item.unit)}
                                                    </p>
                                                    {item.metadata && (
                                                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 bg-gray-50/50 p-2 rounded border border-gray-100">
                                                          {Object.entries(item.metadata).map(([key, value]) => {
                                                            if (ignoredMetadataKeys.includes(key)) return null;
                                                            if (!value) return null;
                                                            return (
                                                              <div key={key} className="flex gap-1 break-words">
                                                                <span className="font-semibold text-gray-500">{key}:</span>
                                                                <span className="text-gray-800">{String(value)}</span>
                                                              </div>
                                                            );
                                                          })}
                                                      </div>
                                                    )}
                                                  </div>
                                            </div>
                                            <div className="flex items-center justify-end w-full sm:w-auto mt-2 sm:mt-0">
                                                <ArtworkStatus item={item} />
                                            </div>
                                        </div>
                                    ))}
                                  </div>
                                </div>

                                {/* SECȚIUNEA NOUĂ: Date Facturare & Marketing */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* DATE FACTURARE */}
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">
                                            <Building2 className="w-4 h-4" /> Date Facturare
                                        </h4>
                                        <div className="text-sm space-y-2">
                                            {isCompany ? (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Companie:</span>
                                                        <span className="font-bold text-gray-900">{billing.name || billing.cui}</span>
                                                    </div>
                                                    {billing.cui && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">CUI:</span>
                                                            <span className="font-mono text-gray-900">{billing.cui}</span>
                                                        </div>
                                                    )}
                                                    {billing.nr_reg_com && (
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Reg. Com:</span>
                                                            <span className="text-gray-900">{billing.nr_reg_com}</span>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Persoană Fizică:</span>
                                                    <span className="font-bold text-gray-900">{billing.name || address.nume_prenume}</span>
                                                </div>
                                            )}
                                            <div className="pt-2 mt-1 border-t border-dashed border-gray-200">
                                                <span className="text-gray-500 text-xs block mb-1">Adresă Facturare:</span>
                                                <span className="text-gray-700 text-xs leading-snug">
                                                    {billing.localitate || address.localitate}, {billing.judet || address.judet}, {billing.strada_nr || address.strada_nr}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DATE MARKETING */}
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b pb-2">
                                            <Megaphone className="w-4 h-4" /> Marketing & Sursă
                                        </h4>
                                        {order.marketing ? (
                                            <div className="text-xs space-y-2">
                                                {order.marketing.utmSource && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Sursă (utm_source):</span>
                                                        <span className="font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">{order.marketing.utmSource}</span>
                                                    </div>
                                                )}
                                                {order.marketing.utmMedium && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Mediu (utm_medium):</span>
                                                        <span className="font-medium text-gray-900">{order.marketing.utmMedium}</span>
                                                    </div>
                                                )}
                                                {order.marketing.utmCampaign && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Campanie:</span>
                                                        <span className="font-medium text-gray-900">{order.marketing.utmCampaign}</span>
                                                    </div>
                                                )}
                                                {order.marketing.referrer && (
                                                    <div className="flex flex-col gap-1 pt-1">
                                                        <span className="text-gray-500">Referrer URL:</span>
                                                        <a href={order.marketing.referrer} target="_blank" className="text-indigo-600 hover:underline truncate block w-full" title={order.marketing.referrer}>
                                                            {order.marketing.referrer}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center h-24 text-gray-400 text-xs">
                                                Fără date de tracking
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-full sticky top-6">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Acțiuni Rapide</h4>
                                    <div className="space-y-4">
                                        <Link href={`/admin/orders/${order.id}`} className="flex items-center justify-center w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-sm">
                                            <MoreVertical className="w-4 h-4" /> Editează Comanda
                                        </Link>
                                        
                                        {/* ZONA AWB */}
                                        {order.awbNumber ? (
                                            <div className="flex flex-col gap-2 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                                                        <Truck className="w-4 h-4" />
                                                        AWB: <span className="font-mono select-all">{order.awbNumber}</span>
                                                    </div>
                                                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                <a 
                                                    href={`https://tracking.dpd.ro/?shipmentNumber=${order.awbNumber}&language=ro`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="w-full flex items-center justify-center gap-2 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded text-xs font-bold transition-colors"
                                                >
                                                    <ExternalLink className="w-3 h-3" /> Urmărește Livrarea
                                                </a>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleGenerateAwb(order.id)}
                                                disabled={generatingAwbId === order.id}
                                                className="flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 p-3 rounded-lg text-xs font-bold transition-colors disabled:opacity-60"
                                            >
                                                {generatingAwbId === order.id ? (
                                                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                                                ) : (
                                                  <Truck className="w-5 h-5 text-gray-500" />
                                                )}
                                                <span className="text-[11px]">{generatingAwbId === order.id ? 'Se emite...' : 'Generează AWB'}</span>
                                            </button>
                                        )}

                                        {/* ZONA FACTURĂ */}
                                        <InvoiceControl order={order} />
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