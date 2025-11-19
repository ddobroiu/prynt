"use client";

import { useState } from "react";
import { Image as ImageIcon, Upload, FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminGraphicsControl({ orderId, items }: { orderId: string, items: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("orderId", orderId);
    if (itemId) formData.append("orderItemId", itemId);
    formData.append("type", "admin_upload"); // Marcăm că e încărcat de admin

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      alert("Fișier încărcat cu succes!");
      window.location.reload(); // Refresh pentru a vedea fișierul (sau update local state)
    } catch (err) {
      console.error(err);
      alert("Eroare la încărcare.");
    } finally {
      setUploading(false);
    }
  };

  // Numărăm fișierele existente
  const totalFiles = items.reduce((acc, item) => acc + (item.artworkUrl ? 1 : 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 bg-zinc-900/50 border-zinc-700 text-zinc-300 hover:text-white hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all">
          <ImageIcon size={14} className="mr-2" />
          Grafică {totalFiles > 0 && <span className="ml-1 bg-indigo-500 text-white text-[9px] px-1.5 rounded-full">{totalFiles}</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#09090b] border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gestionare Grafică & Fișiere</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-sm text-indigo-300">{item.productName || "Produs Custom"}</h4>
                  <p className="text-xs text-zinc-500">Cantitate: {item.quantity} buc</p>
                </div>
                
                {/* Upload Buton pentru acest item */}
                <div className="relative">
                    <input 
                        type="file" 
                        id={`upload-${idx}`} 
                        className="hidden" 
                        onChange={(e) => handleUpload(e, item.id)}
                        disabled={uploading}
                    />
                    <label htmlFor={`upload-${idx}`} className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium transition-colors">
                        {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                        Încarcă Fișier
                    </label>
                </div>
              </div>

              {/* Lista fișiere existente (Simulare link dacă există artworkUrl) */}
              {item.artworkUrl ? (
                 <div className="flex items-center gap-3 bg-black/20 p-2 rounded-lg">
                    <div className="h-10 w-10 bg-indigo-900/30 rounded flex items-center justify-center">
                        <FileDown size={18} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-zinc-300 truncate">Fișier atașat</p>
                        <a href={item.artworkUrl} target="_blank" className="text-[10px] text-indigo-400 hover:underline">Descarcă / Vizualizează</a>
                    </div>
                 </div>
              ) : (
                  <p className="text-xs text-zinc-600 italic">Niciun fișier încărcat de client.</p>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}