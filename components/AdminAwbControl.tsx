"use client";

import { useState } from "react";
import { Truck, Plus, ExternalLink, Edit2, Check, X, Loader2, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminAwbControl({ orderId, currentAwb }: { orderId: string; currentAwb?: string | null }) {
  const [awb, setAwb] = useState<string | null>(currentAwb || null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [manualInput, setManualInput] = useState(currentAwb || "");

  const generateAwb = async () => {
    setLoading(true);
    try {
      console.log('[AWB GENERATE] orderId trimis:', orderId);
      const res = await fetch(`/api/admin/orders/${orderId}/emit-awb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Err');
      const data = await res.json();
      // emit-awb returns shipmentId
      const shipmentId = data.shipmentId || data.shipmentId === 0 ? String(data.shipmentId) : undefined;
      if (shipmentId) setAwb(shipmentId);
      window.location.reload();
    } catch (error) {
      alert("Eroare generare AWB DPD.");
    } finally {
      setLoading(false);
    }
  };

  const saveManualAwb = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/update-awb`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ awbNumber: manualInput, awbCarrier: "DPD" })
      });
      if (!res.ok) throw new Error("Eroare la salvare AWB");
      setAwb(manualInput);
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      alert("Eroare la salvare AWB.");
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <Input value={manualInput} onChange={(e) => setManualInput(e.target.value)} className="h-7 text-[10px] bg-zinc-800 border-zinc-600 text-white px-1" placeholder="Cod AWB" />
        <button onClick={saveManualAwb} className="p-1 bg-emerald-500/20 text-emerald-400 rounded"><Check size={12} /></button>
        <button onClick={() => setIsEditing(false)} className="p-1 bg-rose-500/20 text-rose-400 rounded"><X size={12} /></button>
      </div>
    );
  }

  if (awb) {
    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
          <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wide">{awb}</span>
          <button onClick={() => setIsEditing(true)} className="text-zinc-500 hover:text-white"><Edit2 size={10} /></button>
        </div>
        <div className="flex items-center gap-2">
          <a href={`https://tracking.dpd.ro/?shipmentNumber=${awb}&language=ro`} target="_blank" className="flex items-center gap-1 text-[9px] text-indigo-300 hover:text-white hover:underline bg-indigo-500/10 py-1 px-2 rounded transition-colors">
            <Truck size={10} /> Urmărește Livrarea
          </a>
          <button
            disabled={downloading}
            onClick={async () => {
              try {
                setDownloading(true);
                const res = await fetch(`/api/admin/orders/${orderId}/download-awb`);
                if (!res.ok) throw new Error('Eroare descărcare');
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `DPD_${awb}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 60000);
              } catch (e) {
                alert('Eroare la descărcare AWB.');
              } finally {
                setDownloading(false);
              }
            }}
            className="flex items-center gap-1 text-[9px] text-zinc-300 hover:text-white bg-zinc-800/20 py-1 px-2 rounded"
          >
            {downloading ? <Loader2 size={12} className="animate-spin" /> : <><DownloadCloud size={12} /> Descarcă</>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
       <Button size="sm" variant="secondary" onClick={generateAwb} disabled={loading} className="h-7 text-[10px] bg-white text-black hover:bg-zinc-200 w-full font-semibold">
         {loading ? <Loader2 size={12} className="animate-spin" /> : <><Plus size={12} className="mr-1" /> Generează AWB</>}
       </Button>
       <button onClick={() => setIsEditing(true)} className="text-[9px] text-zinc-500 hover:text-zinc-300 underline decoration-dashed">
         Introdu manual
       </button>
    </div>
  );
}