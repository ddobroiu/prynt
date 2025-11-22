// app/admin/orders/[id]/EditOrderClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Package, Loader2, Save } from "lucide-react";

export default function EditOrderClient({ order }: { order: any }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>(order.status || 'active');
  const [isAdding, setIsAdding] = useState(false);

  const [isStatusLoading, setIsStatusLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;
    if (newStatus === "canceled" && !confirm("Ești sigur că vrei să anulezi această comandă?")) return;

    setIsStatusLoading(true);
    try {
      const res = await fetch(`/api/order/${order.id}/status`, {
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
      setIsStatusLoading(false);
    }
  };

  // State pentru formularul de adăugare
  const [newItem, setNewItem] = useState({
    name: "",
    qty: 1,
    price: 0
  });

  // Ștergere Produs
  const handleDelete = async (itemId: string) => {
    if (!confirm("Sigur vrei să ștergi acest produs?")) return;
    
    setLoadingId(itemId);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/items?itemId=${itemId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Eroare la ștergere");
      router.refresh();
    } catch (e) {
      alert("Nu s-a putut șterge produsul.");
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  // Adăugare Produs
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;

    setIsAdding(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem)
      });
      
      if (!res.ok) throw new Error("Eroare la adăugare");
      
      // Reset form
      setNewItem({ name: "", qty: 1, price: 0 });
      router.refresh(); // Actualizează pagina pentru a vedea noul produs și totalul recalculat
    } catch (e) {
      alert("Eroare la adăugare produs.");
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-600" /> Produse în comandă
        </h3>
        <div className="flex items-center gap-3">
          <label className="text-xs text-gray-500">Status</label>
          <div className="relative inline-block">
            {isStatusLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10 rounded-lg">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              </div>
            )}
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isStatusLoading}
              className="appearance-none cursor-pointer pl-3 pr-8 py-1.5 rounded-lg text-sm font-medium border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all bg-gray-50"
            >
              <option value="active">În Lucru</option>
              <option value="fulfilled">Finalizată</option>
              <option value="canceled">Anulată</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista Produse */}
      <div className="divide-y divide-gray-100">
        {order.items.map((item: any) => (
          <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 font-bold text-xs shrink-0">
                {item.qty}x
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">
                  Preț unitar: {Number(item.unit).toFixed(2)} RON
                </p>
                {/* Afișăm metadate scurte dacă există */}
                {item.metadata?.textDesign && (
                    <p className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded inline-block mt-1">
                        Text: "{item.metadata.textDesign}"
                    </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
              <p className="font-bold text-gray-900">{Number(item.total).toFixed(2)} RON</p>
              
              <button 
                onClick={() => handleDelete(item.id)}
                disabled={loadingId === item.id}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                title="Șterge produs"
              >
                {loadingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Formular Adăugare Produs */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Adaugă Produs Nou
        </h4>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
                <label className="block text-xs text-gray-500 mb-1">Nume Produs</label>
                <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Ex: Banner 200x100cm"
                    value={newItem.name}
                    onChange={e => setNewItem({...newItem, name: e.target.value})}
                    required
                />
            </div>
            <div className="w-full sm:w-24">
                <label className="block text-xs text-gray-500 mb-1">Cantitate</label>
                <input 
                    type="number" 
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newItem.qty}
                    onChange={e => setNewItem({...newItem, qty: parseInt(e.target.value) || 1})}
                    required
                />
            </div>
            <div className="w-full sm:w-32">
                <label className="block text-xs text-gray-500 mb-1">Preț Unitar (RON)</label>
                <input 
                    type="number" 
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newItem.price}
                    onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                    required
                />
            </div>
            <button 
                type="submit" 
                disabled={isAdding}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvează
            </button>
        </form>
      </div>
    </div>
  );
}