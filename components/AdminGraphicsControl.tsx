"use client";

import { useState } from "react";
import { 
  Image as ImageIcon, 
  Download, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  Upload, 
  Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminGraphicsControl({ orderId, items }: { orderId: string, items: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  // Funcție de backup: Adminul încarcă doar dacă e nevoie de o corectură
  const handleAdminUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(itemId);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("orderItemId", itemId);
    // Marcăm că e upload de admin (opțional, pentru backend)
    formData.append("uploadedBy", "admin"); 

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/upload-artwork`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Upload failed");
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Eroare la încărcarea fișierului.");
    } finally {
      setUploading(null);
    }
  };

  // Statistici rapide pentru butonul din tabel
  const totalItems = items.length;
  const uploadedItems = items.reduce((acc, item) => acc + (item.artworkUrl ? 1 : 0), 0);
  const isComplete = totalItems === uploadedItems;

  // Badge-ul principal din tabel
  const triggerBadge = (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`h-auto py-1.5 w-full border transition-all justify-between px-2 group ${
        isComplete 
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20" 
          : uploadedItems > 0 
            ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
            : "bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:text-zinc-300"
      }`}
    >
      <div className="flex items-center gap-2">
        {isComplete ? <CheckCircle2 size={14} /> : <ImageIcon size={14} />}
        <span className="text-[11px] font-medium">
          {isComplete ? "Grafică OK" : uploadedItems > 0 ? "Parțial" : "Lipsă Grafică"}
        </span>
      </div>
      {uploadedItems > 0 && (
         <span className={`text-[10px] font-bold px-1.5 rounded-md min-w-[18px] text-center ${
           isComplete ? "bg-emerald-500 text-white" : "bg-amber-500 text-black"
         }`}>
           {uploadedItems}/{totalItems}
         </span>
      )}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerBadge}
      </DialogTrigger>
      <DialogContent className="bg-[#09090b] border-white/10 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="text-indigo-500" />
            Verificare Fișiere Grafice
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                
                {/* Detalii Produs */}
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-white truncate">{item.productName || "Produs Custom"}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                        Cantitate: <span className="text-white font-mono">{item.quantity}</span>
                      </span>
                      {/* Aici poți afișa dimensiuni dacă există în item.details */}
                    </div>
                </div>

                {/* Zona Acțiuni Fișier */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {item.artworkUrl ? (
                        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg w-full sm:w-auto">
                            <div className="hidden sm:flex h-8 w-8 bg-emerald-500/20 rounded items-center justify-center">
                                <CheckCircle2 size={16} className="text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0 mr-2">
                                <p className="text-xs font-medium text-emerald-400">Fișier Client</p>
                                <p className="text-[10px] text-emerald-400/60 truncate max-w-[150px]">
                                  Încărcat
                                </p>
                            </div>
                            <Button asChild size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20">
                                <a href={item.artworkUrl} target="_blank" rel="noopener noreferrer">
                                    <Download size={14} className="mr-1.5" /> Descarcă
                                </a>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg text-rose-400 w-full sm:w-auto justify-center">
                            <AlertCircle size={16} />
                            <span className="text-xs font-medium">Clientul nu a încărcat fișier</span>
                        </div>
                    )}

                    {/* Buton Backup Upload (Doar iconiță mică) */}
                    <div className="relative group" title="Încarcă o corectură (Admin)">
                        <input 
                            type="file" 
                            id={`admin-up-${item.id}`} 
                            className="hidden" 
                            onChange={(e) => handleAdminUpload(e, item.id)}
                            disabled={uploading === item.id}
                        />
                        <label 
                            htmlFor={`admin-up-${item.id}`} 
                            className={`cursor-pointer flex items-center justify-center h-8 w-8 rounded-lg border transition-colors
                                ${uploading === item.id 
                                    ? 'bg-zinc-800 border-zinc-700 cursor-wait' 
                                    : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-500 hover:bg-zinc-800'
                                }`
                            }
                        >
                            {uploading === item.id ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        </label>
                    </div>
                </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}