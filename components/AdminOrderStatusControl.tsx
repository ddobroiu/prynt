"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";

type Props = {
  id: string;
  status: string;
  onChange?: () => void; // FIX: Adăugăm onChange în definiția tipurilor
};

export default function AdminOrderStatusControl({ id, status: initialStatus, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(initialStatus);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    // Confirmare simplă pentru statusuri critice
    if (newStatus === "canceled" && !confirm("Sigur vrei să anulezi comanda?")) {
        return;
    }
    
    setLoading(true);
    try {
        // Folosim endpoint-ul public de status (sau cel de admin dacă există separat)
        const res = await fetch(`/api/order/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });

        if (!res.ok) throw new Error("Eroare la actualizare");

        setCurrentStatus(newStatus);
        
        // Apelăm callback-ul pentru a notifica părintele (dashboard-ul)
        if (onChange) onChange(); 
    } catch (err) {
        console.error(err);
        alert("Nu s-a putut actualiza statusul.");
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("ATENȚIE! Ștergerea este permanentă și va șterge comanda și toate itemurile asociate. Continui?")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Eroare la ștergere");
      }

      alert("Comanda a fost ștearsă cu succes!");
      
      // Notificăm părintele să reîncarce lista
      if (onChange) onChange();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Nu s-a putut șterge comanda.");
    } finally {
      setDeleting(false);
    }
  };

  // Stiluri dinamice în funcție de status
  const getStatusColor = (s: string) => {
      switch(s) {
          case 'fulfilled': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
          case 'canceled': return 'bg-red-50 text-red-700 border-red-200';
          case 'active': default: return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      }
  };

  return (
    <div className="flex items-center gap-2 w-full md:w-auto">
      <div className="relative inline-block flex-1 md:flex-initial">
        <select
          value={currentStatus}
          onChange={handleChange}
          disabled={loading || deleting}
          className={`
            w-full appearance-none cursor-pointer text-xs font-medium py-1.5 px-3 pr-8 rounded-md border shadow-sm transition-colors
            ${getStatusColor(currentStatus)}
            focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <option value="active">În lucru</option>
          <option value="fulfilled">Finalizată</option>
          <option value="canceled">Anulată</option>
        </select>
        
        {/* Iconiță de loading sau săgeată custom */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
           {loading ? (
              <Loader2 size={12} className="animate-spin text-gray-500" />
           ) : (
              <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
           )}
        </div>
      </div>

      {/* Buton Delete */}
      <button
        onClick={handleDelete}
        disabled={loading || deleting}
        className="flex items-center justify-center p-1.5 rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        title="Șterge comanda"
      >
        {deleting ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Trash2 size={14} />
        )}
      </button>
    </div>
  );
}